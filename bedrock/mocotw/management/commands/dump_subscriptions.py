# -*- coding: utf-8 -*-
from optparse import make_option
from django.core.management.base import BaseCommand
# import commonware.log

# log = commonware.log.getLogger('bedrock')
from bedrock.mocotw.models import Newsletter


class Command(BaseCommand):
    help = 'Dump subscriptions from Database.'
    option_list = BaseCommand.option_list + (
        make_option('--all',
                    action='store_true',
                    dest='all',
                    default=False,
                    help='Dump all subscriptions.'),
    )

    def handle(self, *args, **options):
        if options['all']:
            subscriptions = Newsletter.objects.all().exclude(u_email__isnull=True).exclude(u_email__exact='')
        else:
            subscriptions = Newsletter.objects.filter(u_status=1).exclude(u_email__isnull=True).exclude(u_email__exact='')

        filename = 'subscriptions.txt'
        if args and len(args) > 0:
            filename = args[0]

        file = open(filename, 'w')
        for subscription in subscriptions:
            # print subscription.u_email.lower()
            file.write(subscription.u_email + '\n')
        file.close()
        print len(subscriptions)
