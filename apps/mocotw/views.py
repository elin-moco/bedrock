from django.shortcuts import render_to_response
import settings


def replace_urls_js(request):
    data = {'URL_MAP': settings.LOCAL_URL_MAP}
    return render_to_response('mocotw/tabzilla/replace_urls.js', data,
                             mimetype='text/javascript')
