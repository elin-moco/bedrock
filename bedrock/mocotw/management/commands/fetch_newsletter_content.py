from django.core.management.base import NoArgsCommand, BaseCommand
from bedrock.mocotw.tools import ga_fetch
# import commonware.log

# log = commonware.log.getLogger('bedrock')


class Command(BaseCommand):
    help = 'Update Newsletter Content from GoogleDoc.'
    option_list = NoArgsCommand.option_list

    def handle(self, *args, **options):
        self.options = options
        argv = list(args)
        argv.insert(0, '')
        ga_fetch.main(argv)
        print('Update %s Newsletter Content complete.' % argv[1])
