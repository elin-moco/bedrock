# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

from django.conf.urls.defaults import *
from bedrock.mozorg.util import page
from bedrock.mozorg.views import contribute
from bedrock.redirects.util import redirect

urlpatterns = patterns(
    '',
    page("", "mozorg/home.html"),
    page('news', 'mocotw/news.html'),
    page('about', 'mocotw/about/index.html'),
    page('about/manifesto', 'mocotw/about/manifesto.html'),
    page('about/space', 'mocotw/about/space.html'),
    page('about/careers', 'mocotw/about/careers.html'),
    page('about/intern', 'mocotw/about/intern.html'),
    page('about/contact', 'mocotw/about/contact.html'),
    page('firefoxflicks', 'firefoxflicks/list.html'),
    page('firefox/download', 'firefox/download.html'),
    page('firefox/ueip', 'firefox/ueip.html'),
    page('firefox/mobile/sync', 'firefox/mobile/sync.html'),
    page('firefox/phishing-protection', 'firefox/phishing-protection.html'),
    redirect(r'^firefoxos/$', '/firefox/os'),
    redirect(r'^firefox/central/$', '/firefox/features'),
    redirect(r'^firefox/mobile/$', '/firefox/mobile/features'),
    redirect(r'^mobile/sync/$', '/firefox/mobile/sync'),
    url('^community/contribute/$', contribute, name='mozorg.contribute',
        kwargs={'template': 'mozorg/contribute.html',
                'return_to_form': False}),
)
