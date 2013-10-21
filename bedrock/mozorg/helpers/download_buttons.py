# -*- coding: utf-8 -*-
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

"""
Download buttons. Let's get some terminology straight. Here is a list
of terms and example values for them:

* product: 'firefox' or 'thunderbird'
* version: 7.0, 8.0b3, 9.0a2
* build: 'beta', 'aurora', or None (for latest)
* platform: 'os_windows', 'os_linux', or 'os_osx'
* locale: a string in the form of 'en-US'
"""

from distutils.version import StrictVersion

from django.conf import settings

import jingo
import jinja2
from product_details import product_details
from bedrock.mocotw.utils import latest_aurora_version, latest_nightly_version, make_nightly_link, make_aurora_mobile_link, make_nightly_mobile_link

from lib.l10n_utils import get_locale


download_urls = {
    'transition': '/{locale}/products/download.html',
    'mocotw': 'https://mozilla.com.tw/firefox/download/',
    'direct': 'https://download.mozilla.org/',
    'aurora': 'https://ftp.mozilla.org/pub/mozilla.org/firefox/'
              'nightly/latest-mozilla-aurora',
    'aurora-l10n': 'https://ftp.mozilla.org/pub/mozilla.org/firefox/'
                   'nightly/latest-mozilla-aurora-l10n',
    'aurora-mobile': 'https://ftp.mozilla.org/pub/mozilla.org/mobile/'
                     'nightly/latest-mozilla-aurora-android/en-US/'
                     'fennec-%s.en-US.android-arm.apk' %
                     product_details.mobile_details['alpha_version'],
    'aurora-mobile-l10n': 'https://ftp.mozilla.org/pub/mozilla.org/mobile/'
                     'nightly/latest-mozilla-aurora-android-l10n/'
                     'fennec-%s.zh-TW.android-arm.apk' %
                     product_details.mobile_details['alpha_version'],
}

direct_download_urls = {
    'win': 'http://download.myfirefox.com.tw/releases/webins3.0/official/zh-TW/Firefox-latest.exe',
    'win_express': 'http://download.myfirefox.com.tw/releases/webins3.0/official/zh-TW/Firefox-latest.exe',
    'win_full': 'http://download.myfirefox.com.tw/releases/full/zh-TW/Firefox-full-latest.exe',
    'osx': 'http://download.myfirefox.com.tw/releases/firefox/zh-TW/Firefox-latest.dmg',
    'linux': 'http://download.myfirefox.com.tw/releases/firefox/zh-TW/Firefox-latest.tar.bz2',
    'linux_32bit': 'http://download.myfirefox.com.tw/releases/firefox/zh-TW/Firefox-latest.tar.bz2',
    'linux_64bit': 'http://download.myfirefox.com.tw/releases/firefox/zh-TW/Firefox-latest-x86_64.tar.bz2',
}


def _latest_pre_version(locale, version):
    builds = product_details.firefox_primary_builds
    vers = product_details.firefox_versions[version]

    if locale in builds and vers in builds[locale]:
        return vers, builds[locale][vers]

def latest_beta_version(locale):
    return _latest_pre_version(locale, 'LATEST_FIREFOX_DEVEL_VERSION')


def latest_version(locale):
    fx_versions = product_details.firefox_versions
    beta_vers = fx_versions['FIREFOX_AURORA']
    aurora_vers = fx_versions['LATEST_FIREFOX_DEVEL_VERSION']
    esr_vers = fx_versions['FIREFOX_ESR']

    def _check_builds(builds):
        if locale in builds and isinstance(builds[locale], dict):
            greatest = None

            for version, info in builds[locale].items():
                match = (version != beta_vers and
                         version != aurora_vers and
                         version != esr_vers and
                         info)
                if match:
                    if not greatest:
                        greatest = version
                    elif StrictVersion(version) > StrictVersion(greatest):
                            greatest = version

            if greatest:
                return greatest, builds[locale][greatest]
            return None

    return (_check_builds(product_details.firefox_primary_builds) or
            _check_builds(product_details.firefox_beta_builds))


def make_aurora_link(product, version, platform, locale,
                     force_full_installer=False):
    # Download links are different for localized versions
    src = 'aurora' if locale.lower() == 'en-us' else 'aurora-l10n'

    filenames = {
        'os_windows': 'win32.installer.exe',
        'os_linux': 'linux-i686.tar.bz2',
        'os_osx': 'mac.dmg'
    }
    if (not force_full_installer and settings.AURORA_STUB_INSTALLER
            and locale.lower() == 'en-us'):
        filenames['os_windows'] = 'win32.installer-stub.exe'
    filename = filenames[platform]

    return ('%s/%s-%s.%s.%s' %
            (download_urls[src], product, version, locale, filename))


def make_download_link(product, build, version, platform, locale,
                       force_direct=False, force_full_installer=False,
                       force_funnelcake=False, funnelcake_id=None, install=None, direct_download=False):
    # Aurora has a special download link format
    if build == 'nightly':
        return make_nightly_link(product, version, platform, locale)
    elif build == 'aurora':
        return make_aurora_link(product, version, platform, locale,
                                force_full_installer=force_full_installer)
    elif build== 'beta':
        # The downloaders expect the platform in a certain format
        platform = {
            'os_windows': 'win',
            'os_linux': 'linux',
            'os_osx': 'osx'
        }[platform]

        # stub installer exceptions
        # TODO: NUKE FROM ORBIT!
        stub_langs = settings.STUB_INSTALLER_LOCALES.get(platform, [])
        if stub_langs and (stub_langs == settings.STUB_INSTALLER_ALL or
                           locale.lower() in stub_langs):
            suffix = 'stub'
            if force_funnelcake or force_full_installer:
                suffix = 'latest'

            version = ('beta-' if build == 'beta' else '') + suffix

        # append funnelcake id to version if we have one
        if funnelcake_id:
            version = '{vers}-f{fc}'.format(vers=version, fc=funnelcake_id)

        # Figure out the base url. certain locales have a transitional
        # thankyou-style page (most do)
        src = 'direct'
        if locale in settings.LOCALES_WITH_TRANSITION and not force_direct:
            src = 'transition'

        tmpl = '?'.join([download_urls[src], 'product={prod}-{vers}&os={plat}'
                                             '&lang={locale}'])

        return tmpl.format(prod=product, vers=version,
                           plat=platform, locale=locale)
    else:
        # The downloaders expect the platform in a certain format
        platform = {
            'os_windows': 'win',
            'os_linux': 'linux',
            'os_osx': 'osx'
        }[platform]
        if direct_download:
            platform_install = platform + ('' if install is None or 0 == len(install) else '_' + install)
            if platform_install in direct_download_urls:
                return direct_download_urls[platform_install]
            else:
                return direct_download_urls[platform]
        else:
            if install is None or 0 == len(install):
                tmpl = '?'.join([download_urls['mocotw'], 'os={plat}'])
            else:
                tmpl = '?'.join([download_urls['mocotw'], 'os={plat}&install={install}'])

            return tmpl.format(plat=platform, locale=locale, install=install)

@jingo.register.function
@jinja2.contextfunction
def download_firefox(ctx, build='release', small=False, icon=True,
                     mobile=None, dom_id=None, locale=None,
                     force_direct=False, force_full_installer=False,
                     force_funnelcake=False, install=None, direct_download=False):
    """ Output a "download firefox" button.

    :param ctx: context from calling template.
    :param build: name of build: 'release', 'beta' or 'aurora'.
    :param small: Display the small button if True.
    :param icon: Display the Fx icon on the button if True.
    :param mobile: Display the android download button if True, the desktop
            button only if False, and by default (None) show whichever
            is appropriate for the user's system.
    :param dom_id: Use this string as the id attr on the element.
    :param locale: The locale of the download. Default to locale of request.
    :param force_direct: Force the download URL to be direct.
    :param force_full_installer: Force the installer download to not be
            the stub installer (for aurora).
    :param force_funnelcake: Force the download version for en-US Windows to be
            'latest', which bouncer will translate to the funnelcake build.
    :return: The button html.
    """
    alt_build = '' if build == 'release' else build
    platform = 'mobile' if mobile else 'desktop'
    locale = locale or get_locale(ctx['request'])
    funnelcake_id = ctx.get('funnelcake_id', False)
    dom_id = dom_id or 'download-button-%s-%s' % (platform, build)
    print locale
    def latest(locale):
        if build == 'nightly':
            return latest_nightly_version(locale)
        elif build == 'aurora':
            return latest_aurora_version(locale)
        elif build == 'beta':
            return latest_beta_version(locale)
        else:
            return latest_version(locale)

    version, platforms = latest(locale) or latest('en-US')

    # Gather data about the build for each platform
    builds = []

    if not mobile:
        for plat_os in ['Windows', 'Linux', 'OS X']:
            # Fallback to en-US if this plat_os/version isn't available
            # for the current locale
            _locale = locale
            if plat_os not in platforms:
                _locale = 'en-US'

            # Normalize the platform os name
            plat_os = 'os_%s' % plat_os.lower().replace(' ', '')
            plat_os_pretty = {
                'os_osx': 'for Mac OS X',
                'os_windows': 'for Windows',
                'os_linux': 'for Linux'
            }[plat_os]

            # And generate all the info
            download_link = make_download_link(
                'firefox', build, version, plat_os, _locale,
                force_direct=force_direct,
                force_full_installer=force_full_installer,
                force_funnelcake=force_funnelcake,
                funnelcake_id=funnelcake_id,
                install=install,
                direct_download=direct_download,
            )

            # If download_link_direct is False the data-direct-link attr
            # will not be output, and the JS won't attempt the IE popup.
            if force_direct:
                # no need to run make_download_link again with the same args
                download_link_direct = False
            else:
                download_link_direct = make_download_link(
                    'firefox', build, version, plat_os, _locale,
                    force_direct=True,
                    force_full_installer=force_full_installer,
                    force_funnelcake=force_funnelcake,
                    funnelcake_id=funnelcake_id,
                    install=install,
                    direct_download=direct_download,
                )
                if download_link_direct == download_link:
                    download_link_direct = False

            builds.append({'os': plat_os,
                           'os_pretty': plat_os_pretty,
                           'download_link': download_link,
                           'download_link_direct': download_link_direct})
    if mobile is not False:
        if build == 'nightly':
            android_link = make_nightly_mobile_link(version)
        elif build == 'aurora':
            android_link = make_aurora_mobile_link(version)
        elif build == 'beta':
            android_link = ('https://play.google.com/store/apps/details?'
                            'id=org.mozilla.firefox_beta')
        else:
            android_link = ('https://play.google.com/store/apps/details?'
                            'id=org.mozilla.firefox')

        builds.append({'os': 'os_android',
                       'os_pretty': 'Android',
                       'download_link': android_link})

    # Get the native name for current locale
    langs = product_details.languages
    locale_name = langs[locale]['native'] if locale in langs else locale

    if build not in ('nightly', 'aurora', 'beta'):
        locale_name = u'台灣版 (繁體中文)'

    data = {
        'locale_name': locale_name,
        'version': version,
        'product': 'firefox-mobile' if mobile else 'firefox',
        'builds': builds,
        'id': dom_id,
        'small': small,
        'build': alt_build,
        'show_mobile': mobile is not False,
        'show_desktop': mobile is not True,
        'icon': icon,
    }

    html = jingo.render_to_string(ctx['request'],
                                  'mozorg/download_firefox_button.html',
                                  data)
    return jinja2.Markup(html)
