# -*- coding: utf-8 -*-
from django.core.management.base import NoArgsCommand, BaseCommand
# import commonware.log

# log = commonware.log.getLogger('bedrock')
from bedrock.mocotw.models import Newsletter


class Command(BaseCommand):
    help = 'Dump subscriptions from Database.'
    option_list = NoArgsCommand.option_list

    def handle(self, *args, **options):
        self.options = options
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
