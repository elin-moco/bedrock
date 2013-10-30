# -*- coding: utf-8 -*-
import csv
from PIL import Image
from PIL import ImageDraw
from PIL import ImageFont
from django.core.management.base import NoArgsCommand, BaseCommand


class Command(BaseCommand):
    help = 'Send Newsletter'
    option_list = NoArgsCommand.option_list

    def handle(self, *args, **options):
        self.options = options
        issue_number = args[0]
        image_path = 'bedrock/newsletter/templates/newsletter/%s/images/' % issue_number
        self.add_text(image_path, 'button-mainmore.png', 'button-mainmore-withtext.png', 'more', 10, (7, 1))
        self.add_text(image_path, 'button-submore.png', 'button-submore-withtext.png', 'more', 8, (4, 1))
        self.add_text(image_path, 'button-downloadnewsletter.png', 'button-downloadnewsletter-withtext.png',
                      u'訂閱電子報', 16, (27, 9))
        self.add_text(image_path, 'menu.png', 'menu-news.png', u'最新消息', 16, (12, 3))
        self.add_text(image_path, 'menu.png', 'menu-events.png', u'近期活動', 16, (12, 3))
        self.add_text(image_path, 'menu.png', 'menu-links.png', u'與我同行', 16, (12, 3))
        self.add_text(image_path, 'menu.png', 'menu-quiz.png', u'有獎徵答', 16, (12, 3))
        with open('bedrock/newsletter/templates/newsletter/%s/articles.csv' % issue_number, 'rb') as articles_file:
            reader = csv.reader(articles_file)
            article_number = 0
            for row in reader:
                if row[0].isdigit():
                    category = row[1].replace(' ', '')
                    if category in ('firefox', 'firefoxos', 'firefoxforandroid', 'identity', 'privacy',
                                               'news', 'mozilla', 'webapp', 'studentambassador'):
                        article_number += 1
                        self.add_category_flag(image_path, article_number, category)

    def add_text(self, path, image, new_image, text, size, position):
        image = Image.open(path + image)
        draw = ImageDraw.Draw(image)
        if isinstance(text, unicode):
            font = ImageFont.truetype('media/fonts/wt014.ttf', size)
        else:
            font = ImageFont.truetype('bedrock/sandstone/media/fonts/OpenSans-Bold-webfont.ttf', size)
        draw.text(position, text, (255, 255, 255), font=font)
        image.save(path + new_image)

    def add_category_flag(self, path, article_number, category):
        background = Image.open(path + 'subpic%s.png' % article_number)
        foreground = Image.open(path + 'tag-%s.png' % category)
        background.paste(foreground, (0, 0), foreground)
        background.save(path + 'subpic%s-tagged.png' % article_number)
