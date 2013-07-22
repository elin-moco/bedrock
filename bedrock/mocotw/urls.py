# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

from django.conf.urls.defaults import *
from bedrock.mozorg.views import contribute
from bedrock.redirects.util import redirect

urlpatterns = patterns(
    '',
    redirect(r'^firefox/mobile/$', '/firefox/mobile/features'),
    url('^community/contribute/$', contribute, name='mozorg.contribute',
        kwargs={'template': 'mozorg/contribute.html',
                'return_to_form': False}),
)
