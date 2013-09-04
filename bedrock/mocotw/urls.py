# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

from django.conf.urls import *
from bedrock.mozorg.util import page
from bedrock.mozorg.views import contribute
from bedrock.mozorg.views import contact_bizdev
from bedrock.mozorg.views import plugincheck
from bedrock.mocotw.views import issue, one_newsletter_subscribe, one_newsletter_unsubscribe, google_form
from bedrock.redirects.util import redirect
from bedrock.sandstone.settings import BLOG_URL
from django.views.generic.simple import direct_to_template

urlpatterns = patterns(
    '',
    page('news', 'mocotw/news.html'),
    # page('about', 'mocotw/about/index.html'),
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
    page('newsletter', 'newsletter/index.html'),
    page('sumo', 'mocotw/sumo.html'),
    page('community/student/workshop', 'mocotw/community/student/workshop.html'),
    redirect(r'^community$', '/community/'),
    redirect(r'^community/student$', '/community/student/'),
    redirect(r'^press/$', 'http://' + BLOG_URL + '/press'),
    redirect(r'^news/press/$', 'http://' + BLOG_URL + '/press'),
    redirect(r'^firefox/fx/$', '/firefox'),
    redirect(r'^firefoxos/$', '/firefox/os'),
    redirect(r'^firefox/firefoxos/$', '/firefox/os'),
    redirect(r'^firefox/central/$', '/firefox/features'),
    redirect(r'^firefox/mobile/$', '/firefox/mobile/features'),
    redirect(r'^products/download/$', '/firefox/channel'),
    redirect(r'^mobile/$', '/firefox/mobile'),
    redirect(r'^mobile/sync/$', '/firefox/mobile/sync'),
    redirect(r'^join_us/$', '/newsletter/subscribe'),
    redirect(r'^join_us/share/$', '/newsletter/subscribe'),
    redirect(r'^join_us/reps_news/$', '/newsletter/subscribe/student'),
    redirect(r'^join_us/un_subscribe/$', '/newsletter/unsubscribe'),

    url('^newsletter/subscribe/(?P<target>[-_A-z0-9]*)$',
        one_newsletter_subscribe,
        name='newsletter.mozilla-and-you',
        kwargs={'template_name': 'newsletter/mozilla-and-you.html'}),
    url('^newsletter/unsubscribe/$',
        one_newsletter_unsubscribe,
        name='newsletter.unsubscribe'),
    url(r'^$', direct_to_template, {'template': 'mocotw/home.html'}, name='mozorg.home'),
    url('^about/$', direct_to_template, {'template': 'mocotw/about/index.html'}, name='mozorg.about'),
    url('^community/contribute/$', contribute, name='mozorg.contribute',
        kwargs={'template': 'mozorg/contribute.html', 'return_to_form': False}),
    url(r'^about/partnerships/contact-bizdev/$', contact_bizdev, name='about.partnerships.contact-bizdev'),
    url(r'^plugincheck/$', plugincheck, name='mozorg.plugincheck'),

    url('^reg/$', google_form, name='google.form'),

    url('^newsletter/(?P<issue_number>[\d\-]+)/(?P<path>.*)$', issue, name='newsletter.issue'),


)
