# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

from django.conf.urls import *
from bedrock.firefox import version_re
from bedrock.mozorg.util import page
from bedrock.mozorg.views import contribute, partnerships
from bedrock.mozorg.views import plugincheck
from bedrock.mocotw.views import issue, one_newsletter_subscribe, one_newsletter_unsubscribe, google_form, subscription_count, workshop
from bedrock.redirects.util import redirect
from bedrock.sandstone.settings import BLOG_URL
from django.views.generic.simple import direct_to_template, redirect_to

sysreq_re = r'^firefox/(?P<version>%s)/system-requirements/$' % version_re

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
    page('products', 'mozorg/products.html'),
    page('about/mozilla-based', 'mozorg/projects/mozilla-based.html'),
    redirect(r'^community$', '/community/'),
    redirect(r'^community/student$', '/community/student/'),
    redirect(r'^press/$', 'http://' + BLOG_URL + '/press'),
    redirect(r'^news/press/$', 'http://' + BLOG_URL + '/press'),
    redirect(r'^firefox/fx/$', '/firefox'),
    redirect(r'^firefox/rc/$', '/firefox'),
    redirect(r'^firefoxos/$', '/firefox/os'),
    redirect(r'^firefox/firefoxos/$', '/firefox/os'),
    redirect(r'^firefox/central/$', '/firefox/features'),
    redirect(r'^firefox/mobile/$', '/firefox/mobile/features'),
    redirect(r'^firefox/mobile/home/$', '/firefox/mobile/features'),
    redirect(r'^firefox/tw_beta/$', '/firefox'),
    redirect(r'^firefox/tw_features/$', '/firefox/features'),
    redirect(r'^firefox/beta/features/$', '/firefox/features'),
    redirect(r'^firefox/beta/$', '//www.mozilla.org/en-US/firefox/beta/'),
    redirect(r'^firefox/aurora/$', '//www.mozilla.org/en-US/firefox/aurora/'),
    redirect(r'^firefox/all-beta.html$', '//www.mozilla.org/en-US/firefox/all-beta.html'),
    redirect(r'^firefox/all-aurora.html$', '//www.mozilla.org/en-US/firefox/all-aurora.html'),

    redirect(r'^products/download/$', '/firefox/channel'),
    redirect(r'^firefox/central/$', '/firefox/mobile/features', name='firefox.central'),
    redirect(r'^mobile/$', '/firefox/mobile/features', name='mozorg.mobile'),
    redirect(r'^mobile/home/$', '/firefox/mobile/features'),
    redirect(r'^mobile/sync/$', '/firefox/mobile/sync'),
    redirect(r'^join_us/$', '/newsletter/subscribe'),
    redirect(r'^join_us/share/$', '/newsletter/subscribe'),
    redirect(r'^join_us/reps_news/$', '/newsletter/subscribe/student'),
    redirect(r'^join_us/un_subscribe/$', '/newsletter/unsubscribe'),
    redirect(r'^reg/$', '/register/student'),
    redirect(r'^reg/repsup/$', '/register/supply'),
    redirect(r'^reg/space/$', '/register/space'),
    redirect(r'^reg/moztour/$', '/register/tour'),

    redirect(r'^MPL/$', '//www.mozilla.org/MPL/'),
    redirect(r'poweredby/$', '//www.mozilla.org/poweredby/'),
    redirect(r'projects/technologies.html$', '//www.mozilla.org/projects/technologies.html'),
    redirect(r'projects/calendar/$', '//www.mozilla.org/projects/calendar/'),

    redirect(r'^about/[A-z]*/[A-z]+$', '/about/'),
    redirect(r'^about/[A-z]+//[A-z]+$', '/about/'),
    redirect(r'^index.php', '/'),
    redirect(r'^click.php', '/'),

    redirect(r'^firefox/system-requirements.html$', '//www.mozilla.org/en-US/firefox/system-requirements.html'),
    (sysreq_re, redirect_to, {'url': '//www.mozilla.org/en-US/firefox/%(version)s/system-requirements/'}),
    ('^products/download\.html$', redirect_to,
     {'url': '//www.mozilla.org/en-US/products/download.html', 'query_string': True}),
    ('^zh-TW/products/download\.html$', redirect_to,
     {'url': '//www.mozilla.org/en-US/products/download.html', 'query_string': True}),
    ('^zh-TW/(?P<path>.*)$', redirect_to, {'url': '/%(path)s'}),
    ('^eDM/(?P<path>.*)$', redirect_to, {'url': '/media/docs/mocotw/%(path)s'}),
    ('^(?P<locale>en-US|zh-CN)/(?P<path>.*)$', redirect_to, {'url': '//www.mozilla.org/%(locale)s/%(path)s'}),

    url('^newsletter/subscribe/(?P<target>[-_A-z0-9]*)(/)?$',
        one_newsletter_subscribe,
        name='newsletter.mozilla-and-you',
        kwargs={'template_name': 'newsletter/mozilla-and-you.html'}),
    url('^newsletter/unsubscribe/$',
        one_newsletter_unsubscribe,
        name='newsletter.unsubscribe'),
    url(r'^$', direct_to_template, {'template': 'mocotw/home.html'}, name='mozorg.home'),
    url(r'^a/$', direct_to_template, {'template': 'mozorg/home-b1.html'}),
    url(r'^b/$', direct_to_template, {'template': 'mozorg/home-b2.html'}),
    url('^about/$', direct_to_template, {'template': 'mocotw/about/index.html'}, name='mozorg.about'),
    url('^about/$', direct_to_template, {'template': 'mocotw/about/index.html'}, name='mozorg.mission'),
    url('^about/manifesto/$', direct_to_template, {'template': 'mocotw/about/manifesto.html'}, name='mozorg.about.manifesto'),
    url('^community/contribute/$', contribute, name='mozorg.contribute',
        kwargs={'template': 'mozorg/contribute.html', 'return_to_form': False}),
    url(r'^about/partnerships/contact-bizdev/$', partnerships, name='about.partnerships.contact-bizdev'),
    url(r'^plugincheck/$', plugincheck, name='mozorg.plugincheck'),

    redirect(r'^register/student/$', '/newsletter/subscribe/student/', permanent=False),
    # url('^register/student/$', google_form,
    #     {
    #         'template': 'mocotw/register/student.html',
    #         'formkey': 'dDlJaHh6OEtoZzlTZ09WZlloNVdRS3c6MA'
    #     },
    #     name='google.form'),
    url('^register/supply/$', google_form,
        {
            'template': 'mocotw/register/supply.html',
            'formkey': 'dG9Hc1ZTOGRfLWpwV3BCcWtydkd1ekE6MQ'
        },
        name='google.form'),
    url('^register/space/$', google_form,
        {
            'template': 'mocotw/register/space.html',
            'formkey': 'dGU1RnliSzFTWFNvdkRlY2pKX3VrLVE6MQ'
        },
        name='google.form'),
    url('^register/tour/$', google_form,
        {
            'template': 'mocotw/register/tour.html',
            'formkey': 'dFZ3Vy1OUjBHSXZJLTRvaF9FYXRWcHc6MQ'
        },
        name='google.form'),

    url('^newsletter/(?P<issue_number>[\d\-]+)/(?P<path>.*)$', issue, name='newsletter.issue'),

    url('^api/newsletter/subscriptions/count$', subscription_count),
    url('^community/student/workshop/$', workshop, name='community.student.workshop'),

)
