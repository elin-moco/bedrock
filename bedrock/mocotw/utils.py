import csv
import logging
import re
import imp
from pyga.requests import Tracker
from pyga.entities import Visitor, Session, Page
from bedrock.sandstone.settings import TECH_URL, FFCLUB_URL, MOCO_URL, LOCAL_MOCO_URL, DEBUG
from bedrock.settings import GA_ACCOUNT_CODE
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
    return aurora_version, ['Windows', 'Linux', 'OS X']


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
    return 'https://ftp.mozilla.org/pub/mozilla.org/mobile/nightly/latest-mozilla-aurora-android-l10n/fennec-%s.zh-TW.android-arm.apk' % version


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
    if not email:
        return
    existingEmails = Newsletter.objects.filter(u_email=email)
    if not existingEmails.exists():
        subscription = Newsletter(u_email=email.lower())
        subscription.save()
        log.info(email + ' subscribed!')
        return True
    else:
        log.warn(email + ' already exists!')
        for existingEmail in existingEmails:
            if 0 == existingEmail.u_status:
                existingEmail.u_status = 1
                existingEmail.save()


def newsletter_unsubscribe(emailAddress):
    emails = Newsletter.objects.filter(u_email=emailAddress)
    if emails.exists():
        for email in emails:
            email.u_status = 0
            email.save()
            log.info(emailAddress + ' unsubscribed!')
        return
    log.warn(emailAddress + ' does not exists!')


def read_newsletter_context(issue_number, is_mail=True):
    if issue_number > '2013-07':
        config = imp.load_source('bedrock.newsletter.%s' % issue_number.replace('-', ''),
                                 'bedrock/newsletter/templates/newsletter/%s/config.py' % issue_number)
        config.params['issue_number'] = issue_number
        config.params['year'] = issue_number[:4]
        config.params['month'] = issue_number[5:]
        config.params['yearmonth'] = config.params['year'][2:] + config.params['month']
        if is_mail:
            config.params['tracking_code'] = '?utm_source=epaper&utm_medium=email&utm_campaign=epaper' + \
                                             config.params['yearmonth'] + '&utm_content=mozilla'
        else:
            config.params['tracking_code'] = ''
        articles = []
        events = []
        quiz = {'answers': []}
        with open('bedrock/newsletter/templates/newsletter/%s/articles.csv' % issue_number, 'rb') as articles_file:
            reader = csv.reader(articles_file)
            for row in reader:
                if row[0].isdigit():
                    article = {
                        'category': row[1].replace(' ', ''),
                        'title': row[2].decode('utf-8'),
                        'link': row[4],
                        'content': row[5].decode('utf-8'),
                    }
                    if 'event' == article['category']:
                        events.append(article)
                    elif 'quiz' == article['category']:
                        quiz['content'] = article['title']
                    elif 'answer' == article['category']:
                        quiz['answers'].append(article['title'])
                    elif 'deadline' == article['category']:
                        quiz['deadline'] = article['title']
                    elif 'banner' == article['category']:
                        banner = article
                    else:
                        articles.append(article)
        return {'params': config.params, 'banner': banner, 'articles': articles, 'events': events, 'quiz': quiz}
    else:
        return {}


def newsletter_context_vars(context, issue_number):
    context['GA_ACCOUNT_CODE'] = GA_ACCOUNT_CODE
    context['MOCO_URL'] = LOCAL_MOCO_URL if DEBUG else MOCO_URL
    context['TECH_URL'] = TECH_URL
    context['FFCLUB_URL'] = FFCLUB_URL
    context['NEWSLETTER_URL'] = 'http://%s/newsletter/%s/' % (MOCO_URL, issue_number)

def track_page(path):
    tracker = Tracker(GA_ACCOUNT_CODE.replace('UA-', 'MO-'), MOCO_URL)
    visitor = Visitor()
    # visitor.ip_address = '194.54.176.12'
    session = Session()
    page = Page(path)
    tracker.track_pageview(page, session, visitor)