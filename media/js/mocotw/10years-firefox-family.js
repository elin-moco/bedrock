"use strict";

$(function(){
    $('#firefox-family-intro').on('ended', function() {
        $('#coming-soon').addClass('appear');
    });
    $('#all-addons .kwicks').kwicks({
        spacing: 0,
        maxSize: 640,
        behavior: 'menu',
        easing: 'easeInOut'
    });
});
