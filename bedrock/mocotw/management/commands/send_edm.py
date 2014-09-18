# -*- coding: utf-8 -*-
from optparse import make_option
from django.core.mail import EmailMultiAlternatives
from email.errors import MessageError
from email.mime.image import MIMEImage
from email.mime.text import MIMEText
from genericpath import isfile
from os import listdir
from os.path import join
from time import sleep
from django.core.management.base import NoArgsCommand, BaseCommand
from email.header import Header
from django.template.loader import render_to_string
import sys
from bedrock.mocotw.utils import read_newsletter_context, newsletter_context_vars
import premailer
from bedrock.sandstone.settings import MOCO_URL
from bedrock.settings import NEWSLETTER_PRESEND_LIST
import commonware.log
from BeautifulSoup import BeautifulSoup
from jinja2.environment import DEFAULT_FILTERS

log = commonware.log.getLogger('newsletter')


class Unbuffered:

    def __init__(self, stream):
        self.stream = stream

    def write(self, data):
        self.stream.write(data)
        self.stream.flush()

    def __getattr__(self, attr):
        return getattr(self.stream, attr)


class Command(BaseCommand):
    help = 'Send Mail'
    option_list = BaseCommand.option_list + (
        make_option('--attach-images', action='store_true', dest='attach-images', default=False,
                    help='Attach Images in HTML.'),
    )
    image_prefix = ''
    mail_images = []

    def load_image(self, file):
        self.mail_images += [file, ]
        return self.image_prefix + file

    def handle(self, *args, **options):
        self.options = options
        testing = True if 1 < len(args) else False
        sys.stdout = Unbuffered(sys.stdout)

        DEFAULT_FILTERS['load_image'] = self.load_image

        template = args[0]
        image_path = 'media/img/%s/' % template[:template.rfind('/')]

        if options['attach-images']:
            self.image_prefix = 'cid:'
        else:
            self.image_prefix = 'http://%s/%s' % (MOCO_URL, image_path)

        campaign = template.split('/')[-1].replace('-', '')
        from_email = '"Mozilla Taiwan" <no-reply@mozilla.com.tw>'
        context = {'tracking_code': ('?utm_source=edm&utm_medium=email&utm_campaign=%s&utm_content=mozilla' % campaign)}
        newsletter_context_vars(context)
        text_content = render_to_string('%s.txt' % template, context)
        html_content = render_to_string('%s.html' % template, context)
        soup = BeautifulSoup(html_content)
        subject = Header(soup.title.string.encode('utf8'), 'utf-8')
        mail_content = premailer.transform(html_content)
        # headers = {'Reply-To': 'mozilla-tw@mozilla.com'}
        headers = {}
        # charset = 'utf-8'
        if options['attach-images']:
            images = [f for f in self.mail_images if isfile(join(image_path, f))]
        else:
            images = ()

        if not testing:
            with open('subscriptions.txt') as file:
                subscriptions = file.readlines()
                for subscription in subscriptions:
                    self.send_mail(subject, headers, from_email, (subscription.rstrip(), ),
                                   text_content, mail_content, image_path, images)
                    sleep(10)
        elif '@' in args[1]:
            self.send_mail(subject, headers, from_email, (args[1], ), text_content, mail_content, image_path, images)
        else:
            with open(args[1]) as file:
                subscriptions = file.readlines()
                for subscription in subscriptions:
                    self.send_mail(subject, headers, from_email, (subscription.rstrip(), ),
                                   text_content, mail_content, image_path, images)
                    sleep(10)

    def send_mail(self, subject, headers, from_email, to_mail, text_content, mail_content, image_path='', images=(), attachments=()):
        mail = EmailMultiAlternatives(subject=subject, body=text_content, headers=headers,
                                      from_email=from_email, to=to_mail)
        mail.attach_alternative(mail_content, 'text/html')

        for image in images:
            fp = open(join(image_path, image), 'rb')
            msgImage = MIMEImage(fp.read())
            fp.close()
            msgImage.add_header('Content-ID', '<'+image+'>')
            mail.attach(msgImage)

        for attachment in attachments:
            mail.attach(attachment)
        try:
            mail.send()
            print('Sent mail to %s.' % to_mail)
        except MessageError as e:
            print('Failed to send to %s.' % to_mail, e)
        except RuntimeError as e:
            print('Unexpected error when sending to %s.' % to_mail, e)

    @staticmethod
    def named(email, name):
        if name:
            return '%s <%s>' % (name, email)
        return email
