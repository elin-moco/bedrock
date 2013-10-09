# -*- coding: utf-8 -*-
import re
from django.core.management.base import NoArgsCommand, BaseCommand
# import commonware.log

# log = commonware.log.getLogger('bedrock')

class Command(BaseCommand):
    help = 'Subtract subscriptions from two files'
    option_list = NoArgsCommand.option_list

    def handle(self, *args, **options):
        self.options = options
        sub_filename = 'subscriptions.old.txt'
        if args and len(args) > 0:
            sub_filename = args[0]
        to_filename = 'subscriptions.txt'
        if args and len(args) > 1:
            to_filename = args[1]
        newSubscriptions = ()
        with open(sub_filename, 'r') as sub_file, open(to_filename, 'r') as to_file:
            oldSubscriptions = sub_file.readlines()
            subscriptions = to_file.readlines()
            count = 0
            for subscription in subscriptions:
                duplicate = False
                for oldSubscription in oldSubscriptions:
                    if subscription.strip() == oldSubscription.strip():
                        duplicate = True
                        break
                if not duplicate:
                    newSubscriptions += (subscription.strip(), )
                    count += 1
            to_file.close()
            sub_file.close()
            print '%d new subscriptions.' % count
        with open(to_filename, 'w') as file:
            for subscription in newSubscriptions:
                file.write(subscription + '\n')
            file.close()
