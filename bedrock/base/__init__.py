"""Application base, containing global templates."""
import datetime
from django.contrib.sitemaps import Sitemap
from django.core.urlresolvers import reverse


class PathsSitemap(Sitemap):

    def __init__(self, pages=[], priority=None, changefreq=None):
        self.pages = pages
        self.changefreq = changefreq
        self.priority = priority

    def items(self):
        return self.pages

    def lastmod(self, item):
        # The day sitemap generated
        return datetime.datetime.now()

    def location(self, item):
        return item


class ViewsSitemap(Sitemap):

    def __init__(self, pages=[], priority=None, changefreq=None):
        self.pages = pages
        self.changefreq = changefreq
        self.priority = priority

    def items(self):
        return self.pages

    def lastmod(self, item):
        # The day sitemap generated
        return datetime.datetime.now()

    def location(self, item):
        return reverse(item)
