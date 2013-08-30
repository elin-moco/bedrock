# -*- coding: utf-8 -*-
from django.core.management.base import NoArgsCommand, BaseCommand
# import commonware.log

# log = commonware.log.getLogger('bedrock')
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
