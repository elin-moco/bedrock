"use strict";

$(function () {
    var $communityBlock = $('#community');
    var showCommunity = function(clazz) {
        $communityBlock.removeClass();
        $communityBlock.addClass(clazz);
    };
    $communityBlock.waypoint(function(direction) {
        if (direction == 'down') {
            showCommunity('intro');
        }
    }, {
        offset: 'bottom-in-view',
        triggerOnce: true
    });
    var mozClassPattern = /moz[a-z]+/;

    enquire.register("screen and (max-width: 1001px)", function() {
        $communityBlock.find('a.cell').off('click');
    }).listen();

    enquire.register("screen and (min-width: 1000px)", function() {
        $communityBlock.find('a.cell').on('click', function(e) {
            e.preventDefault();
            var mozClass = mozClassPattern.exec($(this).attr('class'));
            if (mozClass && mozClass.length==1) {
                showCommunity(mozClass[0]);
            }
        });
    }).listen();

    $communityBlock.find('a.back').on('click', function(e) {
        showCommunity('intro');
    });
    $('#contribute, #love .container').waypoint(function() {
        $(this).find('.button.hide').removeClass('hide');
    }, {
        offset: 'bottom-in-view'
    });
});