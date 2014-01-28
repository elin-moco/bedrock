# -*- coding: utf-8 -*-
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
from bedrock.settings import NEWSLETTER_PRESEND_LIST
import commonware.log
from BeautifulSoup import BeautifulSoup

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
    option_list = NoArgsCommand.option_list

    def handle(self, *args, **options):
        self.options = options
        sys.stdout = Unbuffered(sys.stdout)
        template = args[0]
        to_mail = args[1]
        from_email = '"Mozilla Taiwan" <no-reply@mozilla.com.tw>'
        context = {}
        newsletter_context_vars(context)
        text_content = render_to_string('%s.txt' % template, context)
        html_content = render_to_string('%s.html' % template, context)
        soup = BeautifulSoup(html_content)
        subject = Header(soup.title.string.encode('utf8'), 'utf-8')
        mail_content = premailer.transform(html_content)
        # headers = {'Reply-To': 'tw-mktg@mozilla.com'}
        headers = {}
        # charset = 'utf-8'
        self.send_mail(subject, headers, from_email, (to_mail, ), text_content, mail_content)

    def send_mail(self, subject, headers, from_email, to_mail, text_content, mail_content, attachments=()):
        mail = EmailMultiAlternatives(subject=subject, body=text_content, headers=headers,
                                      from_email=from_email, to=to_mail)
        mail.attach_alternative(mail_content, 'text/html')
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
