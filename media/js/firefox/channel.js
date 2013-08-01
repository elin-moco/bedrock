/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

$(document).ready(function() {
    var $logo = $('#masthead h2 img');
    var logoOriginalSrc = $logo.attr('src');

    var pager = Mozilla.Pager.rootPagers[0];
    var selected_href = false;

    function redirect(a) {
        var href = a.href;
        window.open($(a).attr('url'));
    }
    var gaq_track = function(category, action, label) {
        if (window._gaq) {
          window._gaq.push(['_trackEvent', category, action, label]);
        }
    };
    // delay redirect so GA tracking has time to fire
    var track_and_redirect = function(category, action, label, url) {
        gaq_track(category, action, label);

        setTimeout(function() {
          window.location.href = url;
        }, 500);
    };

    pager.$container.bind('changePage', function(e, tab) {
        if (pager.currentPage.id == 'nightly') {
            $('body').addClass('night');
            $('body').removeClass('space');
            $('body').removeClass('sky');
            $logo.attr('src', $logo.attr('data-inverse-src'));
        } else if (pager.currentPage.id == 'aurora') {
            $('body').addClass('space');
            $('body').removeClass('night');
            $('body').removeClass('sky');
            $logo.attr('src', $logo.attr('data-inverse-src'));
        } else {
            $('body').addClass('sky');
            $('body').removeClass('space');
            $('body').removeClass('night');
            $logo.attr('src', logoOriginalSrc);
        }

        $('.pager-tabs a').unbind('click.outgoing');
        $('.pager-tabs a.selected').bind('click.outgoing', function() {
            redirect(this);
        });
    });

    $('#carousel-left').click(function(e) {
        e.preventDefault();
        pager.prevPageWithAnimation();
    });

    $('#carousel-right').click(function(e) {
        e.preventDefault();
        pager.nextPageWithAnimation();
    });

    // init
    if (pager.currentPage.id == 'nightly') {
        $('body').addClass('night');
        $('body').removeClass('space');
        $('body').removeClass('sky');
        $logo.attr('src', $logo.attr('data-inverse-src'));
    } else if (pager.currentPage.id == 'aurora') {
        $('body').addClass('space');
        $('body').removeClass('night');
        $('body').removeClass('sky');
        $logo.attr('src', $logo.attr('data-inverse-src'));
    } else {
        $('body').addClass('sky');
        $('body').removeClass('space');
        $('body').removeClass('night');
        $logo.attr('src', logoOriginalSrc);
    }

    $('.pager-tabs a.selected').bind('click.outgoing', function() {
        redirect(this);
    });
    $('#beta-desktop .download-link').click(function(){
        track_and_redirect('beta download', 'click', $(this).attr('href'), $(this).attr('href'));
	});
    $('#beta-mobile .download-link').click(function(){
        track_and_redirect('mobile beta download', 'click', $(this).attr('href'), $(this).attr('href'));
	});
    $('#aurora-desktop .download-link').click(function(){
        track_and_redirect('aurora download', 'click', $(this).attr('href'), $(this).attr('href'));
	});
    $('#aurora-mobile .download-link').click(function(){
        track_and_redirect('mobile aurora download', 'click', $(this).attr('href'), $(this).attr('href'));
	});
    $('#nightly-desktop .download-link').click(function(){
        track_and_redirect('nightly download', 'click', $(this).attr('href'), $(this).attr('href'));
	});
    $('#nightly-mobile .download-link').click(function(){
        track_and_redirect('mobile nightly download', 'click', $(this).attr('href'), $(this).attr('href'));
	});

});
