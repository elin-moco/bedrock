# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

from django.conf import settings
from django.conf.urls.defaults import handler404, include, patterns
from django.http import HttpResponse
from bedrock.base import ViewsSitemap, PathsSitemap
from bedrock.sandstone.settings import MOCO_URL
from bedrock.settings import ENGAGE_ROBOTS
from funfactory.monkeypatches import patch
patch()

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

# The default django 500 handler doesn't run the ContextProcessors, which breaks
# the base template page. So we replace it with one that does!
handler500 = 'lib.bedrock_util.server_error_view'

sitemaps = {
    'base': ViewsSitemap(
        ['mozorg.home'],
        0.9, 'weekly'),
    'firefox': ViewsSitemap(
        ['firefox.fx', 'firefox.features', 'firefox.mobile.features', 'firefox.download', 'firefox.os.index'],
        0.8, 'monthly'),
    'firefox_details': ViewsSitemap(
        ['firefox.customize', 'firefox.performance', 'firefox.technology', 'firefox.security',
         'firefox.faq', 'firefox.ueip',
         'firefox.mobile.platforms', 'firefox.mobile.faq', 'firefox.mobile.sync',
         'firefox.partners.index', 'firefox.os.faq',
         'firefox.all', 'firefox.channel',
         'firefox.dnt', 'firefox.phishing-protection', 'firefoxflicks.list', 'mozorg.plugincheck',
         ],
        0.7, 'monthly'),
    'about': ViewsSitemap(
        ['mozorg.about', 'mozorg.about.manifesto', 'mocotw.about.space',
         'mocotw.about.careers', 'mocotw.about.intern', 'mocotw.about.contact'],
        0.6, 'monthly'),
    'community': ViewsSitemap(
        ['mozorg.contribute', 'mocotw.community.student.workshop'],
        0.5, 'monthly'),
    'community_old': PathsSitemap(
        ['/community/', '/community/contribute/', '/community/student/',
         '/community/student_rules/', '/community/student_details/', '/community/package/'],
        0.5, 'monthly'),
    'newsletter': PathsSitemap(
        ['/newsletter/2013-08/', '/newsletter/2013-07/', '/newsletter/2013-06/', '/newsletter/2013-05/',
         '/newsletter/2013-04/', '/newsletter/2013-03/',
         '/newsletter/2012-11/', '/newsletter/2012-10/', '/newsletter/2012-09/', '/newsletter/2012-08/', ],
        0.4, 'monthly'),
    'misc': ViewsSitemap(
        ['mocotw.news', 'mocotw.sumo', 'newsletter.index', 'lightbeam.lightbeam', 'lightbeam.about'],
        0.4, 'monthly'),
}

urlpatterns = patterns('',
    # Main pages
    (r'', include('bedrock.mocotw.urls')),
    (r'^apps/', include('bedrock.marketplace.urls')),
    (r'^lightbeam/', include('bedrock.lightbeam.urls')),
    (r'^foundation/', include('bedrock.foundation.urls')),
    (r'^grants/', include('bedrock.grants.urls')),
    (r'^legal/', include('bedrock.legal.urls')),
    (r'^persona/', include('bedrock.persona.urls')),
    (r'^privacy', include('bedrock.privacy.urls')),
    (r'^styleguide/', include('bedrock.styleguide.urls')),
    (r'^tabzilla/', include('bedrock.tabzilla.urls')),
    (r'', include('bedrock.firefox.urls')),
    # (r'', include('bedrock.mozorg.urls')),
    # (r'', include('bedrock.newsletter.urls')),
    (r'', include('bedrock.redirects.urls')),
    (r'', include('bedrock.research.urls')),

    # L10n example.
    # (r'^l10n_example/', include('bedrock.l10n_example.urls')),

    # Facebook Apps
    # (r'^facebookapps/', include('bedrock.facebookapps.urls')),

    (r'^sitemap\.xml$', 'django.contrib.sitemaps.views.sitemap', {'sitemaps': sitemaps}),

    # Generate a robots.txt
    (
        r'^robots\.txt$',
        lambda r: HttpResponse(
            "User-agent: *\n%s%s: /\n\n%s" % (
                'Disallow: /index.php\n' +
                'Disallow: /click.php\n',
                'Allow' if ENGAGE_ROBOTS else 'Disallow',
                'Sitemap: http://'+MOCO_URL+'/sitemap.xml\n',
            ),
            mimetype="text/plain"
        )
    ),

    # Uncomment the admin/doc line below to enable admin documentation:
    # (r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # (r'^admin/', include(admin.site.urls)),
)

## In DEBUG mode, serve media files through Django.
if settings.DEBUG:
    # Remove leading and trailing slashes so the regex matches.
    media_url = settings.MEDIA_URL.lstrip('/').rstrip('/')
    urlpatterns += patterns('',
        (r'^%s/(?P<path>.*)$' % media_url, 'django.views.static.serve',
         {'document_root': settings.MEDIA_ROOT}),
        (r'^404/$', handler404),
        (r'^500/$', handler500),
    )
