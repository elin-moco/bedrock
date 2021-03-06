# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

from django.conf.urls import *
from bedrock.firefox import version_re
from bedrock.firefox.views import latest_notes
from bedrock.mozorg.util import page
from bedrock.mozorg.views import contribute, partnerships, contribute_university_ambassadors
from bedrock.mozorg.views import plugincheck
from bedrock.mocotw.views import home, unsubscribe, subscribe, subscribed, campaign_tracker, issue, \
    one_newsletter_subscribe, one_newsletter_unsubscribe, google_form, subscription_count, workshop, \
    year_review_2013, year_review_2014, subscribe_embed, newsletter, community, google_form_2014, firefox_family, \
    system_requirements, latest_sysreq
from bedrock.redirects.util import redirect
from bedrock.sandstone.settings import BLOG_URL
from django.views.generic.simple import direct_to_template, redirect_to


product_re = '(?P<product>firefox|mobile)'
channel_re = '(?P<channel>beta|aurora|nightly|organizations)'
sysreq_re = r'^firefox/(?P<version>(%s|[a-z]+))/system-requirements/$' % version_re

urlpatterns = patterns(
    '',
    # page('firefox/desktop/taiwan', 'mocotw/firefox-desktop.html'),
    page('news', 'mocotw/news.html'),
    page('about/manifesto', 'mocotw/about/manifesto.html'),
    page('about/careers', 'mocotw/about/careers.html'),
    page('about/contact', 'mocotw/about/contact.html'),
    page('community/student', 'mocotw/community/student/index.html'),
    page('community/student/rules', 'mocotw/community/student/rules.html'),
    page('community/student/intro', 'mocotw/community/student/intro.html'),
    page('community/student/mission', 'mocotw/community/student/mission.html'),
    page('community/student/package', 'mocotw/community/student/package.html'),
    page('community/student/welcome-letter', 'mocotw/emails/welcome_fsa.html'),
    page('myfirefox/edm-2014-01', 'mocotw/myfirefox/edm-2014-01.html'),
    page('myfirefox/edm-2014-04', 'mocotw/myfirefox/edm-2014-04.html'),
    page('firefoxflicks', 'firefoxflicks/list.html'),
    # page('firefox/download', 'firefox/download.html'),
    # page('firefox/ueip', 'firefox/ueip.html'),
    redirect('firefox/ueip', '//www.mozilla.org/en-US/privacy/websites/'),
    page('firefox/sync', 'firefox/sync.html'),
    page('firefox/tiles', 'firefox/tiles.html'),
    page('firefox/phishing-protection', 'firefox/phishing-protection.html'),
    page('sumo', 'mocotw/sumo.html'),
    page('products', 'mozorg/products.html'),
    page('about/mozilla-based', 'mozorg/projects/mozilla-based.html'),
    page('shop-with-firefox', 'mocotw/shop-with-firefox.html'),
    page('mozilla-eoy-2013', 'mocotw/eoy2013.html'),
    # page('community', 'mocotw/community/index.html'),
    redirect('firefox/desktop/taiwan', '/firefox/desktop/'),
    redirect(r'^contribute/$', '/community/contribute/'),
    redirect(r'^community/student_rules', '/community/student/rules/'),
    redirect(r'^community/student_details', '/community/student/mission/'),
    redirect(r'^community/student_reps_list', '/community/student/'),
    redirect(r'^press/$', 'http://' + BLOG_URL + '/press'),
    redirect(r'^news/press/$', 'http://' + BLOG_URL + '/press'),
    redirect(r'^firefox/fx/$', '/firefox'),
    redirect(r'^firefox/rc/$', '/firefox'),
    redirect(r'^firefox/RC/$', '/firefox'),
    redirect(r'^firefoxos/$', '/firefox/os'),
    redirect(r'^firefox/mobile/sync/$', '/firefox/sync'),
    redirect(r'^firefox/firefoxos/$', '/firefox/os'),
    redirect(r'^firefox/central/$', '/firefox/features'),
    # redirect(r'^firefox/mobile/home/$', '/firefox/mobile/features'),
    redirect(r'^firefox/tw_beta/$', '/firefox'),
    redirect(r'^firefox/tw_features/$', '/firefox/features'),
    redirect(r'^firefox/beta/features/$', '/firefox/features'),
    redirect(r'^firefox/beta/$', '//www.mozilla.org/en-US/firefox/beta/'),
    redirect(r'^firefox/aurora/$', '//www.mozilla.org/en-US/firefox/aurora/'),
    redirect(r'^firefox/help/$', 'https://support.mozilla.org/zh-TW/products/firefox'),
    redirect(r'^privacy/$', '//www.mozilla.org/en-US/privacy/'),
    redirect(r'^legal/privacy/firefox.html$', '//www.mozilla.org/en-US/privacy/firefox/'),
    redirect(r'^privacy-policy.html$', '//www.mozilla.org/en-US/privacy/websites/'),
    redirect(r'^about/legal.html$', '//www.mozilla.org/en-US/about/legal.html'),
    redirect(r'^thunderbird/$', '//www.mozilla.org/en-US/thunderbird/'),

    redirect(r'^mobile/$', 'firefox.android.index', name='mozorg.mobile'),
    redirect(r'^mobile/home/$', 'firefox.android.index'),
    redirect(r'^firefox/mobile/home/$', 'firefox.android.index'),
    redirect(r'^firefox/mobile/$', 'firefox.android.index'),
    redirect(r'^firefox/mobile/faq/$', 'firefox.android.faq', name='firefox.mobile.faq'),
    redirect(r'^firefox/mobile/features/$', 'firefox.android.index', name='firefox.mobile.features'),
    # page('firefox/mobile', 'firefox/fx.html'),
    redirect(r'^firefox/fx/$', '/firefox/desktop/', name='firefox.fx'),
    redirect(r'^firefox/features/$', '/firefox/desktop/', name='firefox.features'),
    redirect(r'^firefox/customize/$', '/firefox/desktop/customize/', name='firefox.customize'),
    redirect(r'^firefox/security/$', '/firefox/desktop/trust/', name='firefox.security'),
    redirect(r'^firefox/performance/$', '/firefox/desktop/fast/', name='firefox.performance'),
    redirect(r'^products/download/$', '/firefox/channel'),
    redirect(r'^firefox/central/$', '/firefox/mobile/features', name='firefox.central'),
    # redirect(r'^mobile/$', '/firefox/mobile/features', name='mozorg.mobile'),
    # redirect(r'^mobile/home/$', '/firefox/mobile/features'),
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

    redirect(r'^about/space/$', '/about/contact'),
    redirect(r'^about/intern/$', '/about/careers'),
    redirect(r'^about/[A-z]*/[A-z]+$', '/about/'),
    redirect(r'^about/[A-z]+//[A-z]+$', '/about/'),
    redirect(r'^index.php', '/'),
    redirect(r'^click.php', '/'),

    redirect(r'^firefox/system-requirements.html$', '//www.mozilla.org/en-US/firefox/system-requirements.html'),
    # (sysreq_re, redirect_to, {'url': '//www.mozilla.org/en-US/firefox/%(version)s/system-requirements/'}),
    redirect(r'^firefox/download/$', '/firefox/new/?scene=2#download-fx', name='firefox.download'),
    redirect(r'^products/download\.html$', '/firefox/new/?scene=2#download-fx'),
    redirect(r'^zh-TW/products/download\.html$', '/firefox/new/?scene=2#download-fx'),
    ('^zh-TW/(?P<path>.*)$', redirect_to, {'url': '/%(path)s'}),
    ('^eDM/(?P<path>.*)$', redirect_to, {'url': '/media/docs/mocotw/%(path)s'}),
    ('^(?P<locale>en-US|zh-CN)/(?P<path>.*)$', redirect_to, {'url': '//www.mozilla.org/%(locale)s/%(path)s'}),

    url('^(?:%s)/(?:%s/)?notes/$' % (product_re, channel_re), latest_notes, name='firefox.notes'),
    url(r'^firefox/(?:%s/)?system-requirements/$' % channel_re, latest_sysreq, name='firefox.sysreq'),
    url(sysreq_re, system_requirements, name='firefox.system_requirements'),
    url(r'^newsletter/subscribe/embed/$$', subscribe_embed, {'template': 'newsletter/subscribe-embed.html'}, name='newsletter.subscribe_embed'),
    url('^newsletter/subscribe/(?P<target>[-_A-z0-9]*)(/)?$',
        one_newsletter_subscribe,
        name='newsletter.mozilla-and-you',
        kwargs={'template_name': 'newsletter/mozilla-and-you.html'}),
    url('^newsletter/unsubscribe/$',
        one_newsletter_unsubscribe,
        name='newsletter.unsubscribe'),
    url(r'^$', home, {'template': 'mocotw/home.html'}, name='mozorg.home'),
    url(r'^a/$', direct_to_template, {'template': 'mozorg/home-b1.html'}),
    url(r'^b/$', direct_to_template, {'template': 'mozorg/home-b2.html'}),
    url('^about/$', direct_to_template, {'template': 'mocotw/about/index.html'}, name='mozorg.about'),
    url('^about/$', direct_to_template, {'template': 'mocotw/about/index.html'}, name='mozorg.mission'),
    url('^about/manifesto/$', direct_to_template, {'template': 'mocotw/about/manifesto.html'}, name='mozorg.about.manifesto'),
    url('^community/$', community, name='mocotw.community.index',
        kwargs={'template': 'mocotw/community/index.html', 'return_to_form': True}),
    url('^community/contribute/$', contribute, name='mozorg.contribute',
        kwargs={'template': 'mozorg/contribute.html', 'return_to_form': True}),
    url(r'^about/partnerships/contact-bizdev/$', partnerships, name='about.partnerships.contact-bizdev'),
    url(r'^plugincheck/$', plugincheck, name='mozorg.plugincheck'),
    url(r'^2013-review/(?P<spring>[-A-z]+/)?$', year_review_2013, name='mocotw.2013review'),
    url(r'^2014-review/$', year_review_2014, name='mocotw.2014review'),

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
    url('^contribute/universityambassadors/$',
        contribute_university_ambassadors,
        name='mocotw.contribute_university_ambassadors'),
    page('contribute/universityambassadors/thanks',
         'mozorg/contribute_university_ambassadors_thanks.html'),

    redirect(r'^newsletter/page/1$', '/newsletter/'),
    url('^newsletter/$', newsletter, name='newsletter.index'),
    url('^newsletter/page/(?P<page_number>[\d]+)$', newsletter, name='newsletter.index.page'),
    url('^newsletter/(?P<issue_number>[\d\-]+)/(?P<path>.*)$', issue, name='newsletter.issue'),
    url('^edm/(?P<campaign>[-_A-z0-9]+)/email.gif$', campaign_tracker, name='edm.campaign.tracker'),

    url('^api/newsletter/subscriptions/count$', subscription_count),
    url('^api/newsletter/subscribed$', subscribed),
    url('^api/newsletter/subscribe$', subscribe),
    url('^api/newsletter/unsubscribe$', unsubscribe),

    url('^community/student/workshop/$', workshop, name='mocotw.community.student.workshop'),
    page('10years/edm/browser-survey', 'mocotw/10years/edm/browser-survey-web.html'),
    page('10years/edm/fxday', 'mocotw/10years/edm/fxday-web.html'),
    page('10years', 'mocotw/10years/index.html'),
    page('10years/firefox-day', 'mocotw/10years/firefox-day.html'),
    url(r'^10years/firefox-family/((?P<addon>[-A-z0-9]+)/)?$', firefox_family, name='mocotw.10years.firefox-family'),
    # page('10years/firefox-family', 'mocotw/10years/firefox-family.html'),
    page('10years/browser-survey', 'mocotw/10years/browser-survey-result.html'),

    page('edm/2014review', 'mocotw/edm/2014review-web.html'),
    page('edm/2015-maker-faire', 'mocotw/edm/2015-maker-faire-web.html'),

    redirect(r'^firefox/about/$', '/about/'),
    redirect(r'^firefox/all.html$', '/firefox/all/'),
    redirect(r'^about/contact.html$', '/about/contact/'),
    redirect(r'^firefox/community/$', '/community/'),
    redirect(r'^mobile/aurora/$', '/firefox/channel/#aurora'),
    redirect(r'^products/firefox/$', '/firefox/'),
    redirect(r'^products/thunderbird/$', '/thunderbird/'),
    redirect(r'^firefox/organic/$', '/firefox/'),
    redirect(r'^firefox/all-beta.html$', '//www.mozilla.org/en-US/firefox/beta/all/'),
    redirect(r'^firefox/aurora/all/$', '//www.mozilla.org/en-US/firefox/developer/all/'),
    redirect(r'^firefox/developer/all/$', '//www.mozilla.org/en-US/firefox/developer/all/'),
    redirect(r'^firefox/all-aurora.html$', '//www.mozilla.org/en-US/firefox/developer/all/'),
    redirect(r'^firefox/organizations/all.html$', '//www.mozilla.org/en-US/firefox/organizations/all/'),
    redirect(r'^firefox/livebookmarks.html', 'https://support.mozilla.org/zh-TW/kb/Live%20Bookmarks'),
    redirect(r'^firefox/beta/technology/$', '/firefox/desktop/fast/'),
    redirect(r'^newsletter/ios/$', '//www.mozilla.org/en-US/newsletter/ios/', name='newsletter.ios'),
    redirect(r'^mozlando/$', '//www.youtube.com/watch?v=4UfZyFklY4o')
)
