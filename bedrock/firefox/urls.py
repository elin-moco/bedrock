# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

from django.conf.urls.defaults import *  # noqa
from django.conf import settings

from bedrock.firefox import version_re
from bedrock.mocotw.views import mozorg_zhtw_redirect
from bedrock.redirects.util import redirect
from bedrock.mozorg.util import page
import views


latest_re = r'^firefox(?:/(%s))?/%s/$'
firstrun_re = latest_re % (version_re, 'firstrun')
whatsnew_re = latest_re % (version_re, 'whatsnew')
tour_re = latest_re % (version_re, 'tour')

releasenotes_re = latest_re % (version_re, r'(aurora|release)notes')
mobile_releasenotes_re = releasenotes_re.replace('firefox', 'mobile')
sysreq_re = latest_re % (version_re, 'system-requirements')


urlpatterns = patterns('',
    redirect(r'^firefox/$', 'firefox.new', name='firefox'),
    url(r'^firefox/all/$', views.all_downloads, name='firefox.all'),
    page('firefox/channel', 'firefox/channel.html'),
    redirect('^firefox/channel/android/$', 'firefox.channel'),
    page('firefox/geolocation', 'firefox/geolocation.html',
         gmap_api_key=settings.GMAP_API_KEY),
    url(r'^firefox/hello/$', views.hello, name='firefox.hello'),
    page('firefox/happy', 'firefox/happy.html'),
    url('^(?P<product>(firefox|mobile))/((?P<channel>(aurora|beta))/)?notes/$',
        views.latest_notes, name='firefox.latest.notes'),
    url('^firefox/system-requirements',
        views.latest_sysreq, name='firefox.latest.sysreq'),
    page('firefox/memory', 'firefox/memory.html'),
    # page('firefox/faq', 'firefox/faq.html'),
    redirect('firefox/faq', 'https://support.mozilla.org/products/firefox'),
    redirect('^firefox/mobile/platforms/$', 'https://support.mozilla.org/kb/will-firefox-work-my-mobile-device',
             name='firefox.mobile.platforms'),
    page('firefox/desktop', 'firefox/desktop/index.html'),
    page('firefox/desktop/fast', 'firefox/desktop/fast.html'),
    page('firefox/desktop/customize', 'firefox/desktop/customize.html'),
    page('firefox/desktop/trust', 'firefox/desktop/trust.html'),
    page('firefox/android', 'firefox/android/index.html'),
    page('firefox/android/faq', 'firefox/android/faq.html'),
    page('firefox/os/faq', 'firefox/os/faq.html'),
    url('^firefox/sms/$', views.sms_send, name='firefox.sms'),
    page('firefox/sms/sent', 'firefox/mobile/sms-thankyou.html'),
    page('firefox/new', 'firefox/new.html'),
    page('firefox/organizations/faq', 'firefox/organizations/faq.html'),
    page('firefox/organizations', 'firefox/organizations/organizations.html'),
    redirect('firefox/nightly/firstrun', '//www.mozilla.org/zh-TW/firefox/nightly/firstrun'),

    url('^firefox/releases/$', views.releases_index,
        name='firefox.releases.index'),
    url(r'^firefox/installer-help/$', views.installer_help,
        name='firefox.installer-help'),
    page('firefox/speed', 'firefox/speed.html'),
    page('firefox/technology', 'firefox/technology.html'),
    page('firefox/update', 'firefox/update.html'),
    page('firefox/developer', 'firefox/developer.html'),
    page('firefox/independent', 'firefox/independent.html'),

    page('firefox/unsupported/warning', 'firefox/unsupported/warning.html'),
    page('firefox/unsupported/EOL', 'firefox/unsupported/EOL.html'),
    page('firefox/unsupported/mac', 'firefox/unsupported/mac.html'),
    page('firefox/unsupported/details', 'firefox/unsupported/details.html'),

    url(r'^firefox/unsupported/win/$', views.windows_billboards),
    url('^firefox/dnt/$', views.dnt, name='firefox.dnt'),
    url(firstrun_re, mozorg_zhtw_redirect, name='firefox.firstrun'),
    url(whatsnew_re, mozorg_zhtw_redirect, name='firefox.whatsnew'),
    url(tour_re, mozorg_zhtw_redirect, name='firefox.tour'),

    url(r'^firefox/partners/$', views.firefox_partners,
        name='firefox.partners.index'),

    # This dummy page definition makes it possible to link to /firefox/ (Bug 878068)
    url('^firefox/$', views.fx_home_redirect, name='firefox'),


    page('firefox/os', 'firefox/os/index.html'),
    page('firefox/os/releases', 'firefox/os/releases.html'),

    # firefox/os/notes/ should redirect to the latest version; update this in /redirects/urls.py
    url('^firefox/os/notes/(?P<fx_version>%s)/$' % version_re,
        views.release_notes, {'product': 'Firefox OS'},
        name='firefox.os.releasenotes'),

    page('mwc', 'firefox/os/mwc-2014-preview.html'),
    page('firefox/os/devices', 'firefox/os/devices.html'),
    page('firefox/os/devices/tv', 'firefox/os/tv.html'),

    url(releasenotes_re, views.release_notes, name='firefox.releasenotes'),
    url(mobile_releasenotes_re, views.release_notes, name='mobile.releasenotes'),
    url(sysreq_re, views.system_requirements,
        name='firefox.system_requirements'),
)
