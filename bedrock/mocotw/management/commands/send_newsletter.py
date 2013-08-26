# -*- coding: utf-8 -*-
from email.errors import MessageError
from email.mime.image import MIMEImage
from genericpath import isfile
from os import listdir
from os.path import join
from django.core.management.base import NoArgsCommand, BaseCommand
from email.header import Header
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from bedrock.mocotw.utils import read_newsletter_context, newsletter_context_vars
import premailer


class Command(BaseCommand):
    help = 'Send Newsletter'
    option_list = NoArgsCommand.option_list

    def handle(self, *args, **options):
        self.options = options
        testing = True if args[1] else False

        to_mail = (args[1], )
        issue_number = args[0]
        context = read_newsletter_context(issue_number)
        # context['imgpath_prefix'] = 'cid:'
        newsletter_context_vars(context, issue_number)
        subject = Header((u'[試寄] ' if testing else '') + context['params']['title'], 'utf-8')
        from_email = 'no-reply@mozilla.com'
        text_content = render_to_string('newsletter/%s/mail.txt' % issue_number, context)
        html_content = render_to_string('newsletter/%s/index.html' % issue_number, context)
        mail_content = premailer.transform(html_content)
        headers = {'Reply-To': 'tw-mktg@mozilla.com'}
        # charset = 'utf-8'
        # image_path = 'bedrock/newsletter/templates/newsletter/%s/images/' % issue_number
        # images = [f for f in listdir(image_path) if not f.startswith('.') and isfile(join(image_path, f))]

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
            print('Send %s Newsletter to %s.' % (issue_number, to_mail))
        except MessageError as e:
            print('Failed to send verification mail: ', e)
        except RuntimeError as e:
            print('Unexpected error when sending verification mail: ', e)

    def named(self, email, name):
        if name:
            return '%s <%s>' % (name, email)
        return email