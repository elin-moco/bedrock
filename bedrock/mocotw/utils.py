# -*- coding: utf-8 -*-
import csv
import logging
import re
import imp
import urllib
import urllib2
from pyga.requests import Tracker
from pyga.entities import Visitor, Session, Page
from bedrock.sandstone.settings import TECH_URL, FFCLUB_URL, MOCO_URL, LOCAL_MOCO_URL, DEBUG, MYFF_URL, LOCAL_FFCLUB_URL
from bedrock.settings import GA_ACCOUNT_CODE, FFCLUB_API_SECRET
from product_details import settings_fallback, product_details
from bedrock.mocotw.models import Newsletter
from django.core.mail import EmailMultiAlternatives
from email.errors import MessageError
from email.header import Header
from django.template.loader import render_to_string
import jingo
import jinja2


log = logging.getLogger('prod_details')
aurora_version_pattern = re.compile('firefox\-([a-z0-9\.]+)\.zh\-TW')
aurora_file = '/firefox_aurora_version.json'
aurora_key = 'LATEST_AURORA_VERSION'
nightly_version_pattern = re.compile('firefox\-([a-z0-9\.]+)\.zh\-TW')
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
    return nightly_version, ['Windows', 'Linux', 'OS X']


def make_nightly_mobile_link(version):
    #return download_urls['nightly-mobile-l10n']
    return 'https://ftp.mozilla.org/pub/mobile/nightly/latest-mozilla-central-android-api-15-l10n/fennec-%s.zh-TW.android-arm.apk' % version


def make_aurora_mobile_link(version):
    #return download_urls['aurora-mobile-l10n']
    return 'https://ftp.mozilla.org/pub/mobile/nightly/latest-mozilla-aurora-android-api-15-l10n/fennec-%s.zh-TW.android-arm.apk' % version


def make_nightly_link(product, version, platform, locale):
    # Download links are different for localized versions
    filenames = {
        'os_windows': 'win32.installer.exe',
        'os_linux': 'linux-i686.tar.bz2',
        'os_osx': 'mac.dmg'
    }
    filename = filenames[platform]

    return ('%s/%s-%s.%s.%s' %
            ('https://ftp.mozilla.org/pub/firefox/nightly/latest-mozilla-central-l10n',
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
    download_version_details('https://ftp.mozilla.org/pub/firefox/nightly/latest-mozilla-aurora-l10n/',
                             aurora_version_pattern,
                             aurora_file,
                             aurora_key)


def download_nightly_details():
    download_version_details('https://ftp.mozilla.org/pub/firefox/nightly/latest-mozilla-central-l10n/',
                             nightly_version_pattern,
                             nightly_file,
                             nightly_key)


def newsletter_subscribe(email):
    data = urllib.urlencode({'secret': FFCLUB_API_SECRET, 'email': email})
    req = urllib2.Request('https://%s/api/newsletter/subscribe' % FFCLUB_URL, data)
    result = urllib2.urlopen(req).read()
    return 'True' == result


def newsletter_unsubscribe(email):
    data = urllib.urlencode({'secret': FFCLUB_API_SECRET, 'email': email})
    req = urllib2.Request('https://%s/api/newsletter/unsubscribe' % FFCLUB_URL, data)
    return bool(urllib2.urlopen(req).read())


def read_newsletter_context(issue_number, is_mail=True):
    if '2013-07' < issue_number <= '2014-04-14':
        config = imp.load_source('bedrock.newsletter.%s' % issue_number.replace('-', ''),
                                 'bedrock/newsletter/templates/newsletter/%s/config.py' % issue_number)
        config.params['issue_number'] = issue_number
        config.params['year'] = issue_number[:4]
        config.params['month'] = issue_number[5:7]
        config.params['yearmonth'] = config.params['year'][2:] + config.params['month']
        if len(issue_number) > 7:
            config.params['day'] = issue_number[8:10]
            config.params['yearmonth'] += config.params['day']
        if is_mail:
            config.params['tracking_code'] = '?utm_source=epaper&utm_medium=email&utm_campaign=epaper' + \
                                             config.params['yearmonth'] + '&utm_content=mozilla'
        else:
            config.params['tracking_code'] = ''
        articles = []
        events = []
        downloads = []
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
                    elif 'download' == article['category']:
                        downloads.append(article)
                    elif 'answer' == article['category']:
                        quiz['answers'].append(article['title'])
                    elif 'deadline' == article['category']:
                        quiz['deadline'] = article['title']
                    elif 'banner' == article['category']:
                        banner = article
                    else:
                        articles.append(article)
        return {'params': config.params, 'banner': banner, 'articles': articles, 'events': events, 'downloads': downloads, 'quiz': quiz}
    else:
        return {}


def newsletter_context_vars(context, issue_number=None):
    context['GA_ACCOUNT_CODE'] = GA_ACCOUNT_CODE
    context['MOCO_URL'] = LOCAL_MOCO_URL if DEBUG else MOCO_URL
    context['TECH_URL'] = TECH_URL
    context['FFCLUB_URL'] = FFCLUB_URL
    context['MYFF_URL'] = MYFF_URL
    if issue_number:
        context['NEWSLETTER_URL'] = 'http://%s/newsletter/%s/' % (context['MOCO_URL'], issue_number)


def send_fsa_form(data):
    formkey = '1Jf-35AIvc_k_HDYCxb7atwpRvN3HgqWNpFM9o1Qj_hc'
    post_data = {
        'entry.678291564': data['first_name'].encode('utf8'),
        'entry.609995622': data['last_name'].encode('utf8'),
        'entry.399849269': data['email'],
        'entry.1721452105': data['school'].encode('utf8'),
        'entry.1558574073': data['city'].encode('utf8'),
        'entry.498340777': data['country'].encode('utf8'),
        'entry.2021193149': data['current_status'].encode('utf8'),
        'entry.1084806558': data['expected_graduation_year'],
        'entry.1130352781': data['area'].encode('utf8'),
        'entry.197281933': data['area_free_text'].encode('utf8'),
        'entry.689416110': 'TEXT' if data['fmt'] == 'T' else 'HTML',
        #'entry.231672082': 'English' if data['lang'] == 'EN' else 'Chinese',
        'entry.910433691': 'OK' if data['share_information'] else '',
        'entry.760711799': 'OK' if data['age_confirmation'] else '',
        'entry.2111690093': 'OK' if data['privacy'] else '',
        'entry.2110423571': 'OK' if data['nl_mozilla_taiwan'] else '',
        'entry.286954631': 'OK' if data['nl_mozilla_and_you'] else '',
        'entry.1313043270': 'OK' if data['nl_mobile'] else '',
        'entry.1079795528': 'OK' if data['nl_firefox_flicks'] else '',
        'entry.1200388266': 'OK' if data['nl_about_mozilla'] else '',
    }
    result = urllib2.urlopen('https://docs.google.com/a/mozilla.com/forms/d/%s/formResponse' % formkey, urllib.urlencode(post_data))
    content = result.read()
    #TODO: check for error.


def track_page(path):
    tracker = Tracker(GA_ACCOUNT_CODE.replace('UA-', 'MO-'), MOCO_URL)
    visitor = Visitor()
    # visitor.ip_address = '194.54.176.12'
    session = Session()
    page = Page(path)
    tracker.track_pageview(page, session, visitor)


def send_fsa_welcome_letter(to_mail, format='H'):
    context = {}
    newsletter_context_vars(context)
    subject = Header(u'歡迎加入 Firefox 校園大使！', 'utf-8')
    from_email = '"Mozilla Taiwan" <no-reply@mozilla.com.tw>'
    text_content = render_to_string('mocotw/emails/welcome_fsa.txt', context)
    html_content = render_to_string('mocotw/emails/welcome_fsa.html', context)
    headers = {}
    send_mail(subject, headers, from_email, (to_mail, ), text_content, html_content, format)


def send_mail(subject, headers, from_email, to_mail, text_content, mail_content, format='H', attachments=()):
    mail = EmailMultiAlternatives(subject=subject, body=text_content, headers=headers,
                                  from_email=from_email, to=to_mail)
    if format == 'H':
        mail.attach_alternative(mail_content, 'text/html')
    for attachment in attachments:
        mail.attach(attachment)
    try:
        mail.send()
        log.error('Sent mail to %s.' % to_mail)
    except MessageError as e:
        log.error('Failed to send to %s.' % to_mail, e)
    except RuntimeError as e:
        log.error('Unexpected error when sending to %s.' % to_mail, e)
