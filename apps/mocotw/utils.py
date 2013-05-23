def latest_nightly_version(locale):
    return '24.0a1', []


def make_nightly_mobile_link(version):
    return 'https://ftp.mozilla.org/pub/mozilla.org/mobile/nightly/latest-mozilla-central-android/fennec-%s.multi.android-arm.apk' % version


def make_nightly_link(product, version, platform, locale):
    # Download links are different for localized versions
    filenames = {
        'os_windows': 'win32.installer.exe',
        'os_linux': 'linux-i686.tar.bz2',
        'os_osx': 'mac.dmg'
    }
    filename = filenames[platform]

    return ('%s/%s-%s.%s.%s' %
            ('https://ftp.mozilla.org/pub/mozilla.org/firefox/nightly/latest-trunk',
             product, version, locale, filename))

