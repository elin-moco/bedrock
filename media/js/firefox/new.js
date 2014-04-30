/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

;(function($, Modernizr, _gaq, site) {
    'use strict';

    var isIELT9 = (site.platform === 'windows' && $.browser.msie && $.browser.version < 9);
    var path_parts = window.location.pathname.split('/');
    var query_str = window.location.search ? window.location.search + '&' : '?';
    var referrer = path_parts[path_parts.length - 2];
    var locale = path_parts[1];
    var virtual_url = ('/download/' +
                       query_str + 'referrer=' + referrer);

    var $html = $(document.documentElement);

    if (isFirefox()) {
        var latestFirefoxVersion = $html.attr('data-latest-firefox');
        latestFirefoxVersion = parseInt(latestFirefoxVersion.split('.')[0], 10);
        latestFirefoxVersion--; // subtract one since a silent update may be
                                // complete and the user hasn't restarted their
                                // browser. This will be removed once there's
                                // a way to get the current version directly
                                // from the browser

        if (isFirefoxUpToDate(latestFirefoxVersion + '')) {
            $html.addClass('firefox-latest');
        } else {
            $html.addClass('firefox-old');
        }
    }

    // scene2 install images are unique for IE < 9
    if (isIELT9) {
        $html.addClass('winIE8');
    }

    // Add GA custom tracking and external link tracking
    var state = 'Desktop, not Firefox';
    if (site.platform === 'android') {
        if ($html.hasClass('firefox-latest')) {
            state = 'Android, Firefox up-to-date';
        } else if ($html.hasClass('firefox-old')) {
            state = 'Android, Firefox not up-to-date';
        } else {
            state = 'Android, not Firefox';
        }
    } else if (site.platform === 'ios') {
        state = 'iOS, Firefox not supported';
    } else if (site.platform === 'fxos') {
        state = 'FxOS';
    } else {
        if ($html.hasClass('firefox-latest')) {
            state = 'Desktop, Firefox up-to-date';
        } else if ($html.hasClass('firefox-old')) {
            state = 'Desktop, Firefox not up-to-date';
        }
    }
    window._gaq = _gaq || [];
    window._gaq.push(['_setCustomVar', 4, '/new conditional message', state, 3]);

    // conditions in which scene2 should not be shown, even when the
    // #download-fx hash is set
    var no_scene2 = (
           $html.hasClass('firefox-latest')
        || site.platform === 'other'    // no download available
        || site.platform === 'ios'      // unsupported platform
        || site.platform === 'fxos'     // no download available
        || site.platform === 'android'  // download goes to Play Store
    );

    $(document).ready(function() {
        var $scene1 = $('#scene1');
        var $stage = $('#stage-firefox');
        var $thankYou = $('.thankyou');
        var hash_change = ('onhashchange' in window);

        // Add external link tracking
        $(document).on('click', 'a', function(e) {
            // only track off-site links and don't track download.mozilla.org links
            if (this.hostname && this.hostname !== location.hostname && this.hostname !== 'download.mozilla.org') {
                var newTab = (this.target === '_blank' || e.metaKey || e.ctrlKey);
                var href = this.href;
                var callback = function() {
                    window.location = href;
                };

                if (newTab) {
                    gaTrack(['_trackEvent', '/new Interaction', 'click', href]);
                } else {
                    e.preventDefault();
                    gaTrack(['_trackEvent', '/new Interaction', 'click', href], callback);
                }
            }
        });

        if (site.platform === 'android') {
            $('#download-button-android .download-subtitle').html(
                $('.android.download-button-wrapper').data('upgradeSubtitle'));

            // On Android, skip all the scene transitions. We're just linking
            // to the Play Store.
            return;
        }

        function show_scene(scene, animate) {
            if (animate) {
                $stage.removeClass('stage-no-anim');
            } else {
                $stage.addClass('stage-no-anim');
            }

            var CSSbottom = (scene === 2) ? '-400px' : 0;
            $stage.data('scene', scene);
            $('.scene').css('visibility', 'visible');
            if (!Modernizr.csstransitions && animate) {
                $stage.animate({
                    bottom: CSSbottom
                }, 400);
            } else {
                $stage.toggleClass('scene2');
            }
            if (scene === 2) {
                // after animation, hide scene1 so it's not focusable and
                // reset focus
                setTimeout(function() {
                    $scene1.css('visibility', 'hidden');
                    $thankYou.focus();
                }, 500);
            }
        }

        function show_scene_anim(scene) {
            show_scene(scene, true);
        }
        // Pull download link from the download button and add to the
        // 'click here' link.
        // TODO: Remove and generate link in bedrock.
        $('#direct-download-link').attr(
            'href', $('.download-list li:visible .download-link').attr('href')
        );

    });

})(window.jQuery, window.Modernizr, window._gaq, window.site);
