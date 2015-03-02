# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

from .base import *  # noqa
try:
    from .local import *  # noqa
except ImportError as exc:
    exc.args = tuple(['%s (did you rename bedrock/settings/local.py-dist?)' %
                      exc.args[0]])
    raise exc

if DEV:
    ALLOWED_HOSTS = ['*']

# waffle flags, switches, and samples should default to True in DEV mode
WAFFLE_FLAG_DEFAULT = WAFFLE_SWITCH_DEFAULT = WAFFLE_SAMPLE_DEFAULT = DEV

# cache for lang files
CACHES['l10n'] = {
    'BACKEND': 'lib.l10n_utils.cache.L10nCache',
    'LOCATION': 'l10n',
    'TIMEOUT': DOTLANG_CACHE,
    'OPTIONS': {
        'MAX_ENTRIES': 5000,
        'CULL_FREQUENCY': 4,  # 1/4 entries deleted if max reached
    }
}

MEDIA_URL = CDN_BASE_URL + MEDIA_URL
