import json
import logging
import re
from product_details import settings_fallback, product_details


log = logging.getLogger('prod_details')
version_pattern = re.compile('firefox\-([a-z0-9\.]+)\.en\-US')
nightly_file = '/firefox_nightly_version.json'
nightly_key = 'LATEST_NIGHTLY_VERSION'


def latest_nightly_version(locale):
    try:
        nightly_version = product_details.firefox_nightly_version[nightly_key]
    except KeyError:
        log.error('No version key found.')
        nightly_version = '24.0a1'
    return nightly_version, []


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


def download_nightly_details():
    """
    parse latest nightly version from ftp page
    >>> download_nightly_details(nightly_file)
    """
    import urllib2
    response = urllib2.urlopen('https://ftp.mozilla.org/pub/mozilla.org/firefox/nightly/latest-trunk/').read()
    version = version_pattern.search(response).group(1)
    try:
        PROD_DETAILS_DIR = settings_fallback('PROD_DETAILS_DIR')
        f = open(PROD_DETAILS_DIR + nightly_file, 'w')
        try:
            f.write('{"%s":"%s"}' % (nightly_key, version))
        finally:
            f.close()
            log.info('Written newest nightly version in %s%s' % (PROD_DETAILS_DIR, nightly_file))
    except IOError:
        log.error('Failed to write nightly version file.')

