import re
from bedrock import settings

lt_ie9_pattern = re.compile(".*MSIE [6-8]\.")
lt_ie10_pattern = re.compile(".*MSIE [6-9]\.")


def constants(request):
    lt_ie9 = False
    lt_ie10 = False
    if lt_ie9_pattern.match(request.META['HTTP_USER_AGENT']):
        lt_ie9 = True
    if lt_ie10_pattern.match(request.META['HTTP_USER_AGENT']):
        lt_ie10 = True

    return {
        'LT_IE10': lt_ie10,
        'LT_IE9': lt_ie9,
        'SITE_URL': settings.SITE_URL,
        'DEBUG': settings.DEBUG,
    }
