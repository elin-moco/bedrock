# -*- coding: utf-8 -*-
import base64
import json
from time import strptime
import urllib2
from BeautifulSoup import BeautifulSoup
from datetime import datetime
from commonware.response.decorators import xframe_allow
from django.core.cache import cache
from django.core.exceptions import PermissionDenied
from django.http import HttpResponse
from django.template.loader import render_to_string
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import csrf_exempt
from django.views.static import serve
from bedrock.mocotw.forms import NewsletterForm
from bedrock.mocotw.models import Newsletter
from bedrock.mocotw.utils import read_newsletter_context, newsletter_context_vars, newsletter_subscribe, newsletter_unsubscribe, track_page
from bedrock.newsletter.forms import NewsletterFooterForm
from bedrock.sandstone.settings import BLOG_URL, TECH_URL, MYFF_URL
from bedrock.settings import API_SECRET
from lib import l10n_utils


def campaign_tracker(request, campaign=None):
    track_page('/edm/%s/email' % campaign)
    response = HttpResponse('', content_type='image/gif')
    response['Pragma'] = 'no-cache'
    response['Cache-Control'] = 'private, no-cache, no-cache=Set-Cookie, proxy-revalidate'
    response['Expires'] = 'Wed, 17 Sep 1975 21:32:10 GMT'
    response.write('R0lGODlhAQABAID/AP///wAAACwAAAAAAQABAAACAkQBADs='.decode('base64'))
    return response


def issue(request, issue_number=None, path=None):
    if not path or path == 'index.html':
        context = read_newsletter_context(issue_number, False)
        newsletter_context_vars(context, issue_number)
        return l10n_utils.render(request,
                                 'newsletter/%s/index.html' % issue_number,
                                 context)
    elif path == 'mail.txt':
        context = read_newsletter_context(issue_number, False)
        newsletter_context_vars(context, issue_number)
        response = render_to_string('newsletter/%s/mail.txt' % issue_number, context)
        return HttpResponse(response, content_type='text/plain')
    elif path == 'email.gif':
        track_page('/newsletter/%s/email' % issue_number)
        response = HttpResponse('', content_type='image/gif')
        response['Pragma'] = 'no-cache'
        response['Cache-Control'] = 'private, no-cache, no-cache=Set-Cookie, proxy-revalidate'
        response['Expires'] = 'Wed, 17 Sep 1975 21:32:10 GMT'
        response.write('R0lGODlhAQABAID/AP///wAAACwAAAAAAQABAAACAkQBADs='.decode('base64'))
        return response
    else:
        return serve(request, path, 'bedrock/newsletter/templates/newsletter/%s' % issue_number)


def menu_svg(request, issue_number, menu_title):
    context = {'menu_title': menu_title}
    image = render_to_string('newsletter/%s/images/menu.svg' % issue_number, context)
    return HttpResponse(image, content_type='image/svg+xml')


def article_subpic_svg(request, issue_number, article_number, article_tag):
    context = {'article_number': article_number, 'article_tag': article_tag}
    image = render_to_string('newsletter/%s/images/subpic.svg' % issue_number, context)
    return HttpResponse(image, content_type='image/svg+xml')


def one_newsletter_subscribe(request, template_name, target=None):
    success = False

    # not in a footer, but we use the same form
    form = NewsletterFooterForm(request.locale, request.POST or None)

    if form.is_valid():
        data = form.cleaned_data
        request.newsletter_lang = data.get('lang', 'en') or 'en'
        kwargs = {
            'format': data['fmt'],
        }
        # add optional data
        kwargs.update(dict((k, data[k]) for k in ['country',
                                                  'lang',
                                                  'source_url']
                           if data[k]))
        newsletter_subscribe(data['email'])
        success = True

    request.newsletter_form = form
    request.newsletter_success = success

    return l10n_utils.render(request,
                             template_name,
                             {'target': target})


@never_cache
def one_newsletter_unsubscribe(request):

    form = NewsletterForm()
    unsubscribed = False
    if request.method == 'POST':
        form = NewsletterForm(request.POST)
        if form.is_valid():
            newsletter_unsubscribe(form.cleaned_data['email'])
            unsubscribed = True

    context = {
        'form': form,
        'unsubscribed': unsubscribed,
    }
    return l10n_utils.render(request,
                             'newsletter/unsubscribe.html',
                             context)


def google_form(request, template='mocotw/reg/gform.html', formkey=None):
    gform = ''

    if formkey:
        soup = BeautifulSoup(urllib2.urlopen('https://docs.google.com/spreadsheet/viewform?formkey=%s' % formkey).read())
        formResult = soup('div', {'class': 'ss-form-container'})
        for div in formResult:
            gform += div.prettify('utf-8').decode('utf-8')

    context = {
        'gform': gform,
    }
    return l10n_utils.render(request, template, context)


def subscription_count(request):
    if 'secret' in request.GET and request.GET['secret'] == API_SECRET:
        count = Newsletter.objects.filter(u_status=1).exclude(u_email__isnull=True).exclude(u_email__exact='').count()
    else:
        raise PermissionDenied
    return HttpResponse(str(count), content_type='application/json')

def subscribed(request):
    if 'secret' in request.GET and request.GET['secret'] == API_SECRET and 'email' in request.GET:
        exists = Newsletter.objects.filter(u_status=1, u_email=request.GET['email']).exists()
    else:
        raise PermissionDenied
    return HttpResponse(str(exists), content_type='application/json')

def subscribe(request):
    if request.method == 'POST' and 'secret' in request.POST and request.POST['secret'] == API_SECRET and 'email' in request.POST:
        result = newsletter_subscribe(request.POST['email'])
    else:
        raise PermissionDenied
    return HttpResponse(str(result), content_type='application/json')

def workshop(request):
    posts = cache.get('fsa-workshop-posts')
    dates = cache.get('fsa-workshop-dates')
    if posts is None or dates is None:
        blogsApiUrl = 'https://blog.mozilla.com.tw/api/get_tag_posts?tag=%E7%8B%90%E7%8B%90%E5%B7%A5%E4%BD%9C%E5%9D%8A&nopaging=true'
        eventsApiUrl = 'https://blog.mozilla.com.tw/api/get_posts?post_type=event&scope=all&s=%E7%8B%90%E7%8B%90%E5%B7%A5%E4%BD%9C%E5%9D%8A&nopaging=true'
        eventsApi2Url = 'https://blog.mozilla.com.tw/api/get_recent_events?search=%E7%8B%90%E7%8B%90%E5%B7%A5%E4%BD%9C%E5%9D%8A'
        blogs = json.loads(urllib2.urlopen(blogsApiUrl).read())['posts']
        events = json.loads(urllib2.urlopen(eventsApiUrl).read())['posts']
        events2 = json.loads(urllib2.urlopen(eventsApi2Url).read())['posts']
        for event2 in events2:
            for event in events:
                if event2['post_id'] == event['id']:
                    event['content'] = event2['post_content']
        posts = sorted(blogs + events, key=lambda k: k['date'], reverse=True)
        dates = []
        prevMonth = ''
        for post in posts:
            post['date'] = datetime.strptime(post['date'], '%Y-%m-%d %H:%M:%S')
            month = datetime.strftime(post['date'], '%B')
            if prevMonth != month:
                post['month'] = month
            if post['type'] == 'event':
                dates += [post['date'].date().__str__()]
        cache.set('fsa-workshop-posts', posts, 60*60*24)
        cache.set('fsa-workshop-dates', dates, 60*60*24)
    context = {'posts': posts, 'dates': dates}
    return l10n_utils.render(request, 'mocotw/community/student/workshop.html', context)


def year_review_2013(request, spring):
    return l10n_utils.render(request, 'mocotw/2013review.html', {'canonical_path': '/2013-review/'})


@xframe_allow
@csrf_exempt
def subscribe_embed(request, template):
    return l10n_utils.render(request, template)


def home(request, template):
    posts = cache.get('home-posts')
    if posts is None:
        try:
            blogApiUrl = 'https://%s/api/get_recent_posts?count=4' % BLOG_URL
            blogData = json.loads(urllib2.urlopen(blogApiUrl).read())['posts'][:4]
            techApiUrl = 'https://%s/api/get_recent_posts/?count=1' % TECH_URL
            techData = json.loads(urllib2.urlopen(techApiUrl).read())['posts']
            posts = sorted(blogData+techData, key=lambda k: k['date'], reverse=True)
            for post in posts:
                post['date'] = datetime.strptime(post['date'], '%Y-%m-%d %H:%M:%S').strftime('%Y/%m/%d')
            cache.set('home-posts', posts, 60*60*24)
        except Exception as e:
            print e

    events = cache.get('home-events')
    if events is None:
        try:
            eventApiUrl = 'https://%s/api/get_recent_events?count=5' % BLOG_URL
            events = json.loads(urllib2.urlopen(eventApiUrl).read())['posts'][:5]
            for event in events:
                event['title'] = event['post_title']
                event['date'] = datetime.strptime(event['post_date'], '%Y-%m-%d %H:%M:%S').strftime('%Y/%m/%d')
                event['url'] = 'http://%s/events/%s' % (BLOG_URL, event['event_slug'])
            cache.set('home-events', events, 60*60*24)
        except Exception as e:
            print e

    videos = cache.get('home-videos')
    if videos is None:
        try:
            videoApiUrl = 'https://%s/api/videos/cover' % MYFF_URL
            videos = json.loads(urllib2.urlopen(videoApiUrl).read())['videos']
            cache.set('home-videos', videos, 60*60*24)
        except Exception as e:
            print e

    data = {'posts': posts, 'events': events, 'videos': videos}
    return l10n_utils.render(request, template, data)
