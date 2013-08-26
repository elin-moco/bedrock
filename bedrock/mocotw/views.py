# -*- coding: utf-8 -*-
from django.http import HttpResponse
from django.template.loader import render_to_string
from django.views.static import serve
from bedrock.mocotw.utils import read_newsletter_context, newsletter_context_vars
from lib import l10n_utils


def issue(request, issue_number=None, path=None):
    if not path or path == 'index.html':
        context = read_newsletter_context(issue_number)
        newsletter_context_vars(context, issue_number)
        return l10n_utils.render(request,
                                 'newsletter/%s/index.html' % issue_number,
                                 context)
    elif path == 'mail.txt':
        context = read_newsletter_context(issue_number)
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