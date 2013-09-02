# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

from django.conf.urls import *
from django.views.generic import TemplateView
from bedrock.mozorg.util import page
from bedrock.mozorg.views import contribute
from bedrock.mozorg.views import contact_bizdev
from bedrock.mozorg.views import plugincheck
from bedrock.mocotw.views import issue
from bedrock.redirects.util import redirect
from bedrock.sandstone.settings import BLOG_URL

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
    redirect(r'^press/$', 'http://' + BLOG_URL + '/press'),
    redirect(r'^news/press/$', 'http://' + BLOG_URL + '/press'),
    redirect(r'^firefoxos/$', '/firefox/os'),
    redirect(r'^firefox/central/$', '/firefox/features'),
    redirect(r'^firefox/mobile/$', '/firefox/mobile/features'),
    redirect(r'^mobile/sync/$', '/firefox/mobile/sync'),
    url(r'^$', TemplateView.as_view(template_name="mocotw/home.html"), name='mozorg.home'),
    url('^about/$', TemplateView.as_view(template_name="mocotw/about/index.html"), name='mozorg.about'),
    url('^community/contribute/$', contribute, name='mozorg.contribute',
        kwargs={'template': 'mozorg/contribute.html', 'return_to_form': False}),
    url(r'^about/partnerships/contact-bizdev/$', contact_bizdev, name='about.partnerships.contact-bizdev'),
    url(r'^plugincheck/$', plugincheck, name='mozorg.plugincheck'),

    # url('^newsletter/(?P<issue_number>[\d\-]+)/images/menu-(?P<menu_title>.*).svg$',
    #     menu_svg, name='newsletter.subpic'),
    # url('^newsletter/(?P<issue_number>[\d\-]+)/images/subpic-(?P<article_number>\d+)-(?P<article_tag>[a-z]+)\.svg$',
    #     article_subpic_svg, name='newsletter.subpic'),
    url('^newsletter/(?P<issue_number>[\d\-]+)/(?P<path>.*)$', issue, name='newsletter.issue'),

)
