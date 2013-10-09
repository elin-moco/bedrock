# -*- coding: utf-8 -*-
import re
from django.core.management.base import NoArgsCommand, BaseCommand
# import commonware.log

# log = commonware.log.getLogger('bedrock')
from bedrock.mocotw.utils import newsletter_subscribe

email_re = re.compile('^[_A-z0-9-]+(\.[_A-z0-9-]+)*@[A-z0-9-]+(\.[A-z0-9-]+)*(\.[A-z]{2,4})$')

class Command(BaseCommand):
    help = 'Import subscriptions to Database.'
    option_list = NoArgsCommand.option_list

    def handle(self, *args, **options):
        self.options = options
        filename = 'offline-subscriptions.txt'
        if args and len(args) > 0:
            filename = args[0]
        with open(filename, 'r') as file:
            subscriptions = file.readlines()
            count = 0
            for subscription in subscriptions:
                email = subscription.strip()
                if email_re.match(email):
                    result = newsletter_subscribe(email)
                    count += 1 if result else 0
                # file.write(subscription.u_email + '\n')
            file.close()
            print '%d new subscriptions.' % count
