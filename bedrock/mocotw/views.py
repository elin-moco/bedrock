# -*- coding: utf-8 -*-
from django.forms.formsets import formset_factory
from django.http import HttpResponse
from django.template.loader import render_to_string
from django.views.decorators.cache import never_cache
from django.views.static import serve
from bedrock.mocotw.forms import NewsletterForm
from bedrock.mocotw.utils import read_newsletter_context, newsletter_context_vars, newsletter_subscribe, newsletter_unsubscribe
from bedrock.newsletter.forms import NewsletterFooterForm
from lib import l10n_utils


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


def google_form(request):
    gform = ''
    context = {
        'gform': gform,
    }
    return l10n_utils.render(request,
                             'mocotw/reg/gform.html',
                             context)
