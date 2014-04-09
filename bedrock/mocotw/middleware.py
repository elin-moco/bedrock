import tower
from bedrock.mocotw.utils import newsletter_subscribe
from bedrock.newsletter.forms import NewsletterFooterForm
from django.utils.cache import add_never_cache_headers


class NoCacheMiddleware(object):

    def process_response(self, request, response):
        add_never_cache_headers(response)
        return response

class DefaultLocaleMiddleware(object):
    """
    1. Search for the locale.
    2. Save it in the request.
    3. Strip them from the URL.
    """

    def process_request(self, request):
        request.locale = 'zh-TW'
        tower.activate('zh-TW')


class NewsletterMiddleware(object):
    """Processes newsletter subscriptions"""
    def process_request(self, request):
        success = False
        form = NewsletterFooterForm(request.locale, request.POST or None)

        is_footer_form = (request.method == 'POST' and
                          'newsletter-footer' in request.POST)
        if is_footer_form:
            if form.is_valid():
                data = form.cleaned_data
                kwargs = {
                    'format': data['fmt'],
                }
                # add optional data
                kwargs.update(dict((k, data[k]) for k in ['country',
                                                          'lang',
                                                          'source_url']
                                   if data[k]))
                newsletter_subscribe(data['email'])
                request.newsletter_subscriber = data['email']
                success = True

        request.newsletter_form = form
        request.newsletter_success = success
