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
from django.http import HttpResponse, HttpResponseRedirect
from django.template.loader import render_to_string
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import csrf_exempt
from django.views.static import serve
import re
from bedrock.firefox.views import get_latest_version
from bedrock.mocotw.forms import NewsletterForm
from bedrock.mocotw.models import Newsletter
from bedrock.mocotw.utils import read_newsletter_context, newsletter_context_vars, newsletter_subscribe, newsletter_unsubscribe, track_page
from bedrock.mozorg import email_contribute
from bedrock.mozorg.decorators import cache_control_expires
from bedrock.mozorg.forms import ContributeForm
from bedrock.newsletter.forms import NewsletterFooterForm
from bedrock.sandstone.settings import BLOG_URL, TECH_URL, MYFF_URL, FFCLUB_URL, LOCAL_FFCLUB_URL
from bedrock.settings import API_SECRET, FFCLUB_API_SECRET
from lib import l10n_utils


@csrf_exempt
def community(request, template, return_to_form):

    has_contribute_form = (request.method == 'POST' and
                           'contribute-form' in request.POST)

    contribute_success = False

    # This is ugly, but we need to handle two forms. I would love if
    # these forms could post to separate pages and get redirected
    # back, but we're forced to keep the error/success workflow on the
    # same page. Please change this.
    if has_contribute_form:
        form = ContributeForm(request.POST)
        contribute_success = email_contribute.handle_form(request, form)
        if contribute_success:
            # If form was submitted successfully, return a new, empty
            # one.
            form = ContributeForm()
    else:
        form = ContributeForm()

    return l10n_utils.render(request,
                             template,
                             {'form': form,
                              'return_to_form': return_to_form,
                              'contribute_success': contribute_success})


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


def google_form(request, template='mocotw/register/gform.html', formkey=None):
    gform = ''

    if formkey:
        soup = BeautifulSoup(urllib2.urlopen('https://docs.google.com/spreadsheet/viewform?formkey=%s&hl=zh-TW' % formkey).read())
        formResult = soup('div', {'class': 'ss-form-container'})
        for div in formResult:
            gform += div.prettify('utf-8').decode('utf-8')

    context = {
        'gform': gform,
    }
    return l10n_utils.render(request, template, context)


def subscription_count(request):
    if 'secret' in request.GET and request.GET['secret'] == API_SECRET:
        count = urllib2.urlopen('https://%s/api/newsletter/subscriptions/count?secret=%s' % (FFCLUB_URL, FFCLUB_API_SECRET)).read()
    else:
        raise PermissionDenied
    return HttpResponse(str(count), content_type='application/json')


def subscribed(request):
    if 'secret' in request.GET and request.GET['secret'] == API_SECRET and 'email' in request.GET:
        exists = urllib2.urlopen('https://%s/api/newsletter/subscribed?secret=%s&email=%s' % (FFCLUB_URL, FFCLUB_API_SECRET, request.GET['email'])).read()
    else:
        raise PermissionDenied
    return HttpResponse(str(exists), content_type='application/json')


def subscribe(request):
    if request.method == 'POST' and 'secret' in request.POST and request.POST['secret'] == API_SECRET and 'email' in request.POST:
        result = newsletter_subscribe(request.POST['email'])
    else:
        raise PermissionDenied
    return HttpResponse(str(result), content_type='application/json')


def unsubscribe(request):
    if request.method == 'POST' and 'secret' in request.POST and request.POST['secret'] == API_SECRET and 'email' in request.POST:
        result = newsletter_unsubscribe(request.POST['email'])
    else:
        raise PermissionDenied
    return HttpResponse(str(result), content_type='application/json')


def newsletter(request, page_number='1'):
    result = cache.get('newsletter-feed-%s' % page_number)
    if result is None:
        try:
            newsletterApiUrl = 'https://%s/api/newsletter/%s?secret=%s' % (FFCLUB_URL, page_number, FFCLUB_API_SECRET)
            result = json.loads(urllib2.urlopen(newsletterApiUrl).read())
            for newsletter in result['newsletters']:
                if 'main-thumb' in newsletter and newsletter['main-thumb']:
                    newsletter['main-thumb'] = '/media/img/mocotw/newsletter/upload/%s' % newsletter['main-thumb']
                else:
                    newsletter['main-thumb'] = '/newsletter/%s/thumbnail.jpg' % newsletter['issue']
            cache.set('newsletter-feed-%s' % page_number, result, 60*60*24)
        except Exception as e:
            print e
    context = {'newsletters': result['newsletters'],
               'total': result['total'], 'count': result['count'], 'page': result['page']}
    return l10n_utils.render(request, 'newsletter/index.html', context)


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


def year_review_2014(request):
    return l10n_utils.render(request, 'mocotw/2014review.html', {'canonical_path': '/2014-review/'})


@xframe_allow
@csrf_exempt
def subscribe_embed(request, template):
    return l10n_utils.render(request, template)


def google_form_2014(request, template='mocotw/register/gform.html', formkey=None):
    gform = ''

    if formkey:
        soup = BeautifulSoup(urllib2.urlopen('https://docs.google.com/forms/d/%s/viewform?hl=zh-TW' % formkey).read())
        formResult = soup('div', {'class': 'ss-form-container'})
        for div in formResult:
            gform += div.prettify('utf-8').decode('utf-8')

    context = {
        'gform': gform,
    }
    return l10n_utils.render(request, template, context)


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
                if post['url'].startswith('https'):
                    post['url'] = 'http%s' % post['url'][5:]
                post['date'] = datetime.strptime(post['date'], '%Y-%m-%d %H:%M:%S').strftime('%Y/%m/%d')
            cache.set('home-posts', posts, 60*60*24)
        except Exception as e:
            print e

    events = cache.get('home-events')
    if events is None:
        try:
            blogEventApiUrl = 'https://%s/api/get_recent_events?count=5' % BLOG_URL
            blogEvents = json.loads(urllib2.urlopen(blogEventApiUrl).read())['posts'][:5]
            for event in blogEvents:
                event['title'] = event['post_title']
                event['date'] = datetime.strptime(event['post_date'], '%Y-%m-%d %H:%M:%S').strftime('%Y/%m/%d')
                event['url'] = 'http://%s/events/%s' % (BLOG_URL, event['event_slug'])
            ffclubEventApiUrl = 'https://%s/api/recent_events/?secret=%s' % (FFCLUB_URL, FFCLUB_API_SECRET)
            ffclubEvents = json.loads(urllib2.urlopen(ffclubEventApiUrl).read())['events']
            for event in ffclubEvents:
                event['date'] = datetime.strptime(event['date'], '%Y-%m-%d %H:%M:%S').strftime('%Y/%m/%d')
            events = sorted(blogEvents + ffclubEvents, key=lambda k: k['date'], reverse=True)[:5]
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

    data = {
        'posts': posts if posts else (),
        'events': events if events else (),
        'videos': videos if videos else ()
    }
    return l10n_utils.render(request, template, data)


ADDON_NAMES = {
    'quick-translator': 'Quick Translator',
    'adblock-plus': 'ADBlocker',
    'measureit': 'MeasureIt',
    'lastpass-password-manager': 'LastPass Password Manager',
    'foxclocks': 'FoxClocks',
    'evernote-web-clipper': 'Evernote Web Clipper',
    'clearly': 'Evernote Clearly',
    'savebar': 'SaveBar',
    'turn-off-the-lights': '關燈看影片',
    'scrapbook': 'ScrapBook',
    'nosquint': 'NoSquint',
    'stock-market-quotes': 'Stock Market Quotes',
    'auto-reload': 'Auto Reload',
    'reminderfox': 'ReminderFox',
    'healthpage': '健康頁 Health Page App',
    'media-downloader': 'Youtube Downloader',
    'bbsfox': 'BBSFox',
    'personas-rotator': 'Personas Rotator',
    'ie-tab': 'IE Tab',
    'easyscreenshot': '網頁截圖',
    'greasemonkey': 'GreaseMonkey',
    'firegestures': 'FireGestures',
    'snaplinksplus': 'Snap Links Plus',
    'tile-tabs': 'Tile Tabs',
    'panorama-tab-group-name': 'Panorama Tab Group Name',
    'firebug': 'Firebug',
    'jsonview': 'JSONView',
    'sqlite-manager': 'SQLite Manager',
    'copy-plain-text-2': 'Copy Plain Text 2',
    'font-finder': 'Font Finder',
}


def firefox_family(request, addon):
    data = {
        'addon': addon,
        'addon_name': None if addon not in ADDON_NAMES else ADDON_NAMES[addon],
    }
    return l10n_utils.render(request, 'mocotw/10years/firefox-family.html', data)


def latest_sysreq(request, channel='release'):
    version = get_latest_version('firefox', channel)
    if channel == 'beta':
        version = re.sub(r'b\d+$', 'beta', version)
    if channel == 'organizations':
        version = re.sub(r'^(\d+).+', r'\1.0', version)
    path = ['firefox', version, 'system-requirements']
    locale = getattr(request, 'locale', None)
    if locale:
        path.insert(0, locale)
    return HttpResponseRedirect('/' + '/'.join(path) + '/')


@cache_control_expires(1)
def system_requirements(request, version, product='Firefox'):
    return HttpResponseRedirect('//www.mozilla.org/en-US/firefox/%s/system-requirements/' % version)


def mozorg_redirect(request, *args):
    return HttpResponseRedirect('//www.mozilla.org/en-US%s' % request.get_full_path())


def mozorg_zhtw_redirect(request, *args):
    return HttpResponseRedirect('//www.mozilla.org/zh-TW%s' % request.get_full_path())


def page_not_found(request):
    qs = request.META['QUERY_STRING']
    path = request.path_info + ('?' + qs if qs else '')
    if path.startswith('/firefox/'):
        return HttpResponseRedirect('//www.mozilla.org/en-US' + path)
    return l10n_utils.render(request, '404.html')
