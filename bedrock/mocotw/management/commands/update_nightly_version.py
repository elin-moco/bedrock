import logging
from django.core.management.base import NoArgsCommand
from bedrock.mocotw.utils import download_nightly_details, download_aurora_details
from product_details import settings_fallback

log = logging.getLogger('prod_details')
log.addHandler(logging.StreamHandler())
log.setLevel(settings_fallback('LOG_LEVEL'))


class Command(NoArgsCommand):
    help = 'Update Firefox Nightly Version number from FTP.'
    option_list = NoArgsCommand.option_list

    def handle_noargs(self, **options):
        self.options = options

        # Should we be quiet?
        download_aurora_details()
        download_nightly_details()
        # download_aurora_details()
        log.debug('Nightly Version update run complete.')
