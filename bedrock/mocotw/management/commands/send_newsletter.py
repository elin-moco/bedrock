# -*- coding: utf-8 -*-
from email.errors import MessageError
from email.mime.image import MIMEImage
from genericpath import isfile
from os import listdir
from os.path import join
from time import sleep
from django.core.management.base import NoArgsCommand, BaseCommand
from email.header import Header
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
import sys
from bedrock.mocotw.utils import read_newsletter_context, newsletter_context_vars
import premailer
from bedrock.settings import NEWSLETTER_PRESEND_LIST
import commonware.log

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
    help = 'Send Newsletter'
    option_list = NoArgsCommand.option_list

    def handle(self, *args, **options):
        self.options = options
        testing = True if 1 < len(args) else False
        sys.stdout = Unbuffered(sys.stdout)
        issue_number = args[0]
        context = read_newsletter_context(issue_number)
        # context['imgpath_prefix'] = 'cid:'
        newsletter_context_vars(context, issue_number)
        subject = Header((u'[試寄] ' if testing else '') + context['params']['title'], 'utf-8')
        from_email = '"Mozilla Taiwan" <no-reply@mozilla.com.tw>'
        text_content = render_to_string('newsletter/%s/mail.txt' % issue_number, context)
        html_content = render_to_string('newsletter/%s/index.html' % issue_number, context)
        mail_content = premailer.transform(html_content)
        # headers = {'Reply-To': 'tw-mktg@mozilla.com'}
        headers = {}
        # charset = 'utf-8'
        # image_path = 'bedrock/newsletter/templates/newsletter/%s/images/' % issue_number
        # images = [f for f in listdir(image_path) if not f.startswith('.') and isfile(join(image_path, f))]
        if not testing:
            with open('subscriptions.txt') as file:
                subscriptions = file.readlines()
                for subscription in subscriptions:
                    self.send_mail(subject, headers, from_email, (subscription.rstrip(), ),
                                   text_content, mail_content, issue_number)
                    sleep(10)
        elif args[1] == 'presend':
            for mail_address in NEWSLETTER_PRESEND_LIST:
                self.send_mail(subject, headers, from_email, (mail_address, ), text_content, mail_content, issue_number)
                sleep(10)
        else:
            self.send_mail(subject, headers, from_email, (args[1], ), text_content, mail_content, issue_number)

    def send_mail(self, subject, headers, from_email, to_mail, text_content, mail_content, issue_number):
        mail = EmailMultiAlternatives(subject=subject, body=text_content, headers=headers,
                                      from_email=from_email, to=to_mail)
        mail.attach_alternative(mail_content, 'text/html')

        # for image in images:
        #     fp = open(join(image_path, image), 'rb')
        #     msgImage = MIMEImage(fp.read())
        #     fp.close()
        #     msgImage.add_header('Content-ID', '<images/'+image+'>')
        #     mail.attach(msgImage)

        try:
            mail.send()
            print('Sent newsletter to %s.' % to_mail)
        except MessageError as e:
            print('Failed to send to %s.' % to_mail, e)
        except RuntimeError as e:
            print('Unexpected error when sending to %s.' % to_mail, e)

    @staticmethod
    def named(email, name):
        if name:
            return '%s <%s>' % (name, email)
        return email
