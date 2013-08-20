import logging
import re
from product_details import settings_fallback, product_details
from bedrock.mocotw.models import Newsletter


log = logging.getLogger('prod_details')
aurora_version_pattern = re.compile('firefox\-([a-z0-9\.]+)\.zh\-TW')
aurora_file = '/firefox_aurora_version.json'
aurora_key = 'LATEST_AURORA_VERSION'
nightly_version_pattern = re.compile('firefox\-([a-z0-9\.]+)\.en\-US')
nightly_file = '/firefox_nightly_version.json'
nightly_key = 'LATEST_NIGHTLY_VERSION'


def latest_aurora_version(locale):
    try:
        aurora_version = product_details.firefox_aurora_version[aurora_key]
    except KeyError:
        log.error('No version key found.')
        aurora_version = '23.0a2'
    return aurora_version, []


def latest_nightly_version(locale):
    try:
        nightly_version = product_details.firefox_nightly_version[nightly_key]
    except KeyError:
        log.error('No version key found.')
        nightly_version = '24.0a1'
    return nightly_version, []


def make_nightly_mobile_link(version):
    return 'https://ftp.mozilla.org/pub/mozilla.org/mobile/nightly/latest-mozilla-central-android/fennec-%s.multi.android-arm.apk' % version


def make_aurora_mobile_link(version):
    return 'https://ftp.mozilla.org/pub/mozilla.org/mobile/nightly/latest-mozilla-aurora-android/en-US/fennec-%s.en-US.android-arm.apk' % version


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


def download_version_details(source_file, version_pattern, target_file, target_key):
    """
    parse latest nightly version from ftp page
    >>> download_nightly_details(nightly_file)
    """
    import urllib2
    response = urllib2.urlopen(source_file).read()
    versions_match = version_pattern.finditer(response)
    for version_match in versions_match:
        version = version_match.group(1)
    print version
    try:
        PROD_DETAILS_DIR = settings_fallback('PROD_DETAILS_DIR')
        f = open(PROD_DETAILS_DIR + target_file, 'w')
        try:
            f.write('{"%s":"%s"}' % (target_key, version))
        finally:
            f.close()
            log.info('Written newest version in %s%s' % (PROD_DETAILS_DIR, target_file))
    except IOError:
        log.error('Failed to write version file.')


def download_aurora_details():
    download_version_details('https://ftp.mozilla.org/pub/mozilla.org/firefox/nightly/latest-mozilla-aurora-l10n/',
                             aurora_version_pattern,
                             aurora_file,
                             aurora_key)


def download_nightly_details():
    download_version_details('https://ftp.mozilla.org/pub/mozilla.org/firefox/nightly/latest-trunk/',
                             nightly_version_pattern,
                             nightly_file,
                             nightly_key)


def newsletter_subscribe(email):
    if not Newsletter.objects.filter(u_email=email).exists():
        subscription = Newsletter(u_email=email)
        subscription.save()
        log.info(email + ' subscribed!')
        return
    log.warn(email + ' already exists!')

