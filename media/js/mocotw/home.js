"use strict";
$(function () {
    controlButtons();
});

// Add the next and previous control buttons
function controlButtons() {
    var $buttonNext = $('<button type="button" class="btn-next">下一則</button>');
    var $buttonPrev = $('<button type="button" class="btn-prev">上一則</button>');
    var $buttons = $('<span class="news-buttons"></span>');

    $buttonNext.prependTo($buttons);
    $buttonPrev.prependTo($buttons);
    $buttons.prependTo('.extra-news > .control');

    $('.news-buttons .btn-next').bind('click', function() {
        gaTrack(['_trackEvent', 'Mozilla in the News Interactions', 'Next', 'News Navigation Arrows']);
    });
    $('.news-buttons .btn-prev').bind('click', function() {
        gaTrack(['_trackEvent', 'Mozilla in the News Interactions', 'Previous', 'News Navigation Arrows']);
    });
}
