/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

(function($) {
    'use strict';
    $.fn.initTab = function(current) {
        var $root = $(this);
        // customize icons section
        var $content_list = $root.find('.feature-list');

        // store current content
        var current_content = current;
        var previous_content = '';

        // handle clicking on themes/add-ons/awesome bar icons
        $root.find('.show-content').on('click', function(e) {
            e.preventDefault();

            var $this = $(this);

            // make sure action should be taken
            if ($this.attr('href').replace('#', '') !== current_content) {
                previous_content = current_content;
                current_content = $this.attr('href').replace('#', '');

                // select correct content icon
                $content_list.find('a').removeClass('selected');
                $content_list.find('a[href="#' + current_content + '"]').addClass('selected');

                // apply correct class to icon list for arrow placement
                $content_list.removeClass(previous_content).addClass(current_content);

                var $curr = $root.find('.content.active');

                var $next = $($this.attr('href'));

                $curr.fadeOut('fast', function() {
                    $curr.removeClass('active');
                });

                // display specified content
                $next.fadeIn('fast').addClass('active');
            }
        });
    }

    $('#myfx-wrapper').initTab('myfx');
    $('#util-wrapper').initTab('newtab');
    $('#tool-wrapper').initTab('feedback');
})(window.jQuery);
