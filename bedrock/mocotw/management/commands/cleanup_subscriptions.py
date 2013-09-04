# -*- coding: utf-8 -*-
from django.core.management.base import NoArgsCommand, BaseCommand
# import commonware.log

# log = commonware.log.getLogger('bedrock')
from django.db.models import Count
from bedrock.mocotw.models import Newsletter


class Command(BaseCommand):
    help = 'Cleanup subscriptions from Database.'
    option_list = NoArgsCommand.option_list

    def handle(self, *args, **options):
        self.options = options
        subscriptions = Newsletter.objects.exclude(
            u_email__regex='^[_A-z0-9-]+(\.[_A-z0-9-]+)*@[A-z0-9-]+(\.[A-z0-9-]+)*(\.[A-z]{2,4})$')
        print 'Found %d invalid subscriptions.' % len(subscriptions)
        for subscription in subscriptions:
            print subscription.u_email
            subscription.delete()

        duplicates = Newsletter.objects.values('u_email').annotate(count=Count('id')).order_by().filter(count__gt=1)
        print duplicates
        duplicateEmails = Newsletter.objects.filter(u_email__in=[item['u_email'] for item in duplicates]).order_by('u_email')
        print 'Found %d duplicate subscriptions.' % len(duplicateEmails)

        previousEmail = None
        for duplicateEmail in duplicateEmails:
            currentEmail = duplicateEmail.u_email.lower()
            if previousEmail == currentEmail:
                print 'duplicate: %s' % currentEmail
                duplicateEmail.delete()
            previousEmail = currentEmail