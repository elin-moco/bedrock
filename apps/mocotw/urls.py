# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

from django.conf.urls.defaults import *
from mocotw.views import replace_urls_js, tabzilla_js
from mozorg.views import contribute

urlpatterns = patterns(
    '',
    url('^community/contribute/$', contribute, name='mozorg.contribute',
        kwargs={'template': 'mozorg/contribute.html',
                'return_to_form': False}),
    url(r'^tabzilla/replace_urls\.js$', replace_urls_js, name='replace.urls.js'),
    url(r'^tabzilla/tabzilla\.js$', tabzilla_js, name='tabzilla.js'),
)
