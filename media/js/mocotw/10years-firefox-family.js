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

    var $w = $(window);
    var isSmallViewport = $w.width() < 1000;
    var isTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints || navigator.maxTouchPoints || isSmallViewport;

    if (!isSmallViewport && !isTouch) {
        initScrollAnimations();
    }

    function initScrollAnimations() {
        $('html').addClass('desktop');
        $('.room .actor').addClass('stand');
        TweenMax.selector = jQuery;
        var controller = $.superscrollorama({ playoutAnimations: false });
        var fatherIn = 0;
        var motherIn = 4000;
        var grandpaIn = 8000;
        var daughterIn = 12000;
        var sonIn = 16000;
        var boyfriendIn = 20000;
        var addonsIn = 24000;
        var sitDown = function() {
            $(this.target).siblings('.actor').removeClass('stand');
        };
        var standUp = function() {
            $(this.target).siblings('.actor').addClass('stand');
        };
        controller.addTween(fatherIn, TweenMax.to('#intro', 1, {css: {top: '-100%'}}), 1000);
        controller.addTween(fatherIn, TweenMax.from('#fathers-room', 1, {css: {top: '50%'}}), 1000);
        controller.addTween(fatherIn, TweenMax.from('#fathers-room .floor', 1, {css: {height: '0'}}), 500);
        controller.addTween(fatherIn, TweenMax.from('#fathers-room .desk', 1, {css: {paddingRight: '1000px'}}), 500, 500);
        controller.addTween(fatherIn, TweenMax.from('#fathers-room .actor', 1, {css: {paddingLeft: '2000px'}}), 1000, 500);
        controller.addTween(fatherIn, TweenMax.from('#fathers-room .chair', 1, {css: {bottom: '150%'}}), 500, 900);
        controller.addTween(fatherIn, TweenMax.from('#fathers-room .notebook', 1, {css: {bottom: '150%'}, onComplete: sitDown, onReverseComplete: standUp}), 500, 1200);
        controller.addTween(fatherIn, TweenMax.from('#fathers-room .bonsai', 1, {css: {bottom: '150%'}}), 500, 1500);
        controller.addTween(fatherIn, TweenMax.from('#fathers-room .folder', 1, {css: {bottom: '150%'}}), 500, 1700);
        controller.addTween(fatherIn, TweenMax.from('#fathers-room .phone', 1, {css: {bottom: '150%'}}), 500, 1500);
        controller.addTween(fatherIn, TweenMax.from('#fathers-room .cup', 1, {css: {bottom: '150%'}}), 500, 1900);
        controller.addTween(fatherIn, TweenMax.from('#fathers-room .smoke', 1, {css: {bottom: '150%'}}), 500, 1900);
        controller.addTween(fatherIn, TweenMax.to('#fathers-room .logo-outline path', 1, {attr: {'stroke-dashoffset': '0'}}), 800, 800);
        controller.addTween(fatherIn, TweenMax.to('#fathers-room .logo-outline', 1, {css: {opacity: '0'}}), 800, 1600);
        controller.addTween(fatherIn, TweenMax.from('#fathers-room .logo-filled', 1, {css: {opacity: '0'}}), 800, 1600);
        controller.addTween(fatherIn, TweenMax.from('#fathers-room .addon-desc h2', 1, {css: {marginTop: '40px', marginBottom: '-80px', opacity: '0'}}), 400, 1200);
        controller.addTween(fatherIn, TweenMax.from('#fathers-room .addon-desc p', 1, {css: {marginTop: '40px', marginBottom: '-100px', opacity: '0'}}), 400, 2000);


        controller.addTween(motherIn, TweenMax.to('#fathers-room', 1, {css: {top: '-101%'}}), 1000);
        controller.addTween(motherIn, TweenMax.from('#mothers-room', 1, {css: {top: '50%'}}), 1000);
        controller.addTween(motherIn, TweenMax.from('#mothers-room .floor', 1, {css: {height: '0'}}), 500);
        controller.addTween(motherIn, TweenMax.from('#mothers-room .desk', 1, {css: {paddingRight: '1000px'}}), 500, 500);
        controller.addTween(motherIn, TweenMax.from('#mothers-room .actor', 1, {css: {paddingLeft: '2000px'}}), 1000, 500);
        controller.addTween(motherIn, TweenMax.from('#mothers-room .chair', 1, {css: {bottom: '150%'}}), 500, 900);
        controller.addTween(motherIn, TweenMax.from('#mothers-room .notebook', 1, {css: {bottom: '150%'}}), 500, 1200);
        controller.addTween(motherIn, TweenMax.from('#mothers-room .blackboard', 1, {css: {top: '-150%'}, onComplete: sitDown, onReverseComplete: standUp}), 600, 2000);
        controller.addTween(motherIn, TweenMax.from('#mothers-room .book1', 1, {css: {bottom: '150%'}}), 500, 1700);
        controller.addTween(motherIn, TweenMax.from('#mothers-room .book2', 1, {css: {bottom: '150%'}}), 500, 1500);
        controller.addTween(motherIn, TweenMax.to('#mothers-room .logo-outline path', 1, {attr: {'stroke-dashoffset': '0'}}), 800, 800);
        controller.addTween(motherIn, TweenMax.to('#mothers-room .logo-outline', 1, {css: {opacity: '0'}}), 800, 1600);
        controller.addTween(motherIn, TweenMax.from('#mothers-room .logo-filled', 1, {css: {opacity: '0'}}), 800, 1600);
        controller.addTween(motherIn, TweenMax.from('#mothers-room .addon-desc h2', 1, {css: {marginTop: '40px', marginBottom: '-80px', opacity: '0'}}), 400, 1200);
        controller.addTween(motherIn, TweenMax.from('#mothers-room .addon-desc p', 1, {css: {marginTop: '40px', marginBottom: '-100px', opacity: '0'}}), 400, 2000);

        controller.addTween(grandpaIn, TweenMax.to('#mothers-room', 1, {css: {top: '-101%'}}), 1000);
        controller.addTween(grandpaIn, TweenMax.from('#grandpas-room', 1, {css: {top: '50%'}}), 1000);
        controller.addTween(grandpaIn, TweenMax.from('#grandpas-room .desk', 1, {css: {paddingRight: '1000px'}}), 500, 500);
        controller.addTween(grandpaIn, TweenMax.from('#grandpas-room .actor', 1, {css: {paddingLeft: '2000px'}}), 1000, 500);
        controller.addTween(grandpaIn, TweenMax.from('#grandpas-room .chair', 1, {css: {bottom: '150%'}}), 500, 900);
        controller.addTween(grandpaIn, TweenMax.from('#grandpas-room .notebook', 1, {css: {bottom: '150%'}, onComplete: sitDown, onReverseComplete: standUp}), 500, 1200);
        controller.addTween(grandpaIn, TweenMax.from('#grandpas-room .crutch', 1, {css: {bottom: '150%'}}), 500, 1500);
        controller.addTween(grandpaIn, TweenMax.from('#grandpas-room .tea', 1, {css: {bottom: '150%'}}), 500, 1700);
        controller.addTween(grandpaIn, TweenMax.from('#grandpas-room .smoke', 1, {css: {bottom: '150%'}}), 500, 1700);
        controller.addTween(grandpaIn, TweenMax.from('#grandpas-room .teapot', 1, {css: {bottom: '150%'}}), 500, 1500);
        controller.addTween(grandpaIn, TweenMax.from('#grandpas-room .light', 1, {css: {bottom: '150%'}}), 500, 1900);
        controller.addTween(grandpaIn, TweenMax.from('#grandpas-room .frame', 1, {css: {top: '-150%'}}), 500, 1900);
        controller.addTween(grandpaIn, TweenMax.to('#grandpas-room .logo-outline path', 1, {attr: {'stroke-dashoffset': '0'}}), 800, 800);
        controller.addTween(grandpaIn, TweenMax.to('#grandpas-room .logo-outline', 1, {css: {opacity: '0'}}), 800, 1600);
        controller.addTween(grandpaIn, TweenMax.from('#grandpas-room .logo-filled', 1, {css: {opacity: '0'}}), 800, 1600);
        controller.addTween(grandpaIn, TweenMax.from('#grandpas-room .addon-desc h2', 1, {css: {marginTop: '40px', marginBottom: '-80px', opacity: '0'}}), 400, 1200);
        controller.addTween(grandpaIn, TweenMax.from('#grandpas-room .addon-desc p', 1, {css: {marginTop: '40px', marginBottom: '-100px', opacity: '0'}}), 400, 2000);

        controller.addTween(daughterIn, TweenMax.to('#grandpas-room', 1, {css: {top: '-101%'}}), 1000);
        controller.addTween(daughterIn, TweenMax.from('#daughters-room', 1, {css: {top: '50%'}}), 1000);
        controller.addTween(daughterIn, TweenMax.from('#daughters-room .desk', 1, {css: {paddingRight: '1000px'}}), 500, 500);
        controller.addTween(daughterIn, TweenMax.from('#daughters-room .actor', 1, {css: {paddingLeft: '2000px'}}), 1000, 500);
        controller.addTween(daughterIn, TweenMax.from('#daughters-room .chair', 1, {css: {bottom: '150%'}}), 500, 900);
        controller.addTween(daughterIn, TweenMax.from('#daughters-room .notebook', 1, {css: {bottom: '150%'}, onComplete: sitDown, onReverseComplete: standUp}), 500, 1200);
        controller.addTween(daughterIn, TweenMax.from('#daughters-room .book4', 1, {css: {bottom: '150%'}}), 500, 1500);
        controller.addTween(daughterIn, TweenMax.from('#daughters-room .book3', 1, {css: {bottom: '150%'}}), 500, 1600);
        controller.addTween(daughterIn, TweenMax.from('#daughters-room .book2', 1, {css: {bottom: '150%'}}), 500, 1700);
        controller.addTween(daughterIn, TweenMax.from('#daughters-room .book1', 1, {css: {bottom: '150%'}}), 500, 1800);
        controller.addTween(daughterIn, TweenMax.from('#daughters-room .book0', 1, {css: {bottom: '150%'}}), 500, 1900);
        controller.addTween(daughterIn, TweenMax.from('#daughters-room .book5', 1, {css: {bottom: '150%'}}), 500, 2000);
        controller.addTween(daughterIn, TweenMax.from('#daughters-room .bookshelf', 1, {css: {top: '-200%'}}), 800, 2100);
        controller.addTween(daughterIn, TweenMax.to('#daughters-room .logo-outline path', 1, {attr: {'stroke-dashoffset': '0'}}), 800, 800);
        controller.addTween(daughterIn, TweenMax.to('#daughters-room .logo-outline', 1, {css: {opacity: '0'}}), 800, 1600);
        controller.addTween(daughterIn, TweenMax.from('#daughters-room .logo-filled', 1, {css: {opacity: '0'}}), 800, 1600);
        controller.addTween(daughterIn, TweenMax.from('#daughters-room .addon-desc h2', 1, {css: {marginTop: '40px', marginBottom: '-80px', opacity: '0'}}), 400, 1200);
        controller.addTween(daughterIn, TweenMax.from('#daughters-room .addon-desc p', 1, {css: {marginTop: '40px', marginBottom: '-100px', opacity: '0'}}), 400, 2000);

        controller.addTween(sonIn, TweenMax.to('#daughters-room', 1, {css: {top: '-101%'}}), 1000);
        controller.addTween(sonIn, TweenMax.from('#sons-room', 1, {css: {top: '50%'}}), 1000);
        controller.addTween(sonIn, TweenMax.from('#sons-room .desk', 1, {css: {paddingRight: '1000px'}}), 500, 500);
        controller.addTween(sonIn, TweenMax.from('#sons-room .actor', 1, {css: {paddingLeft: '2000px'}}), 1000, 500);
        controller.addTween(sonIn, TweenMax.from('#sons-room .chair', 1, {css: {bottom: '150%'}}), 500, 900);
        controller.addTween(sonIn, TweenMax.from('#sons-room .notebook', 1, {css: {bottom: '150%'}, onComplete: sitDown, onReverseComplete: standUp}), 500, 1200);
        controller.addTween(sonIn, TweenMax.from('#sons-room .plane', 1, {css: {bottom: '150%'}}), 500, 1500);
        controller.addTween(sonIn, TweenMax.from('#sons-room .gundam', 1, {css: {bottom: '150%'}}), 500, 1700);
        controller.addTween(sonIn, TweenMax.from('#sons-room .poster', 1, {css: {top: '-150%'}}), 500, 1900);
        controller.addTween(sonIn, TweenMax.to('#sons-room .logo-outline path', 1, {attr: {'stroke-dashoffset': '0'}}), 800, 800);
        controller.addTween(sonIn, TweenMax.to('#sons-room .logo-outline', 1, {css: {opacity: '0'}}), 800, 1600);
        controller.addTween(sonIn, TweenMax.from('#sons-room .logo-filled', 1, {css: {opacity: '0'}}), 800, 1600);
        controller.addTween(sonIn, TweenMax.from('#sons-room .addon-desc h2', 1, {css: {marginTop: '40px', marginBottom: '-80px', opacity: '0'}}), 400, 1200);
        controller.addTween(sonIn, TweenMax.from('#sons-room .addon-desc p', 1, {css: {marginTop: '40px', marginBottom: '-100px', opacity: '0'}}), 400, 2000);

        controller.addTween(boyfriendIn, TweenMax.to('#sons-room', 1, {css: {top: '-101%'}}), 1000);
        controller.addTween(boyfriendIn, TweenMax.from('#boyfriends-room', 1, {css: {top: '50%'}}), 1000);
        controller.addTween(boyfriendIn, TweenMax.from('#boyfriends-room .desk', 1, {css: {paddingRight: '1000px'}}), 500, 500);
        controller.addTween(boyfriendIn, TweenMax.from('#boyfriends-room .actor', 1, {css: {paddingLeft: '2000px'}}), 1000, 500);
        controller.addTween(boyfriendIn, TweenMax.from('#boyfriends-room .chair', 1, {css: {bottom: '150%'}}), 500, 900);
        controller.addTween(boyfriendIn, TweenMax.from('#boyfriends-room .notebook', 1, {css: {bottom: '150%'}, onComplete: sitDown, onReverseComplete: standUp}), 500, 1200);
        controller.addTween(boyfriendIn, TweenMax.from('#boyfriends-room .coffee-grinder', 1, {css: {bottom: '150%'}}), 500, 1500);
        controller.addTween(boyfriendIn, TweenMax.from('#boyfriends-room .coffee-machine', 1, {css: {bottom: '150%'}}), 500, 1700);
        controller.addTween(boyfriendIn, TweenMax.from('#boyfriends-room .cup', 1, {css: {bottom: '150%'}}), 500, 1900);
        controller.addTween(boyfriendIn, TweenMax.from('#boyfriends-room .smoke', 1, {css: {bottom: '150%'}}), 500, 1900);
        controller.addTween(boyfriendIn, TweenMax.from('#boyfriends-room .map', 1, {css: {top: '-150%'}}), 600, 1900);
        controller.addTween(boyfriendIn, TweenMax.to('#boyfriends-room .logo-outline path', 1, {attr: {'stroke-dashoffset': '0'}}), 800, 800);
        controller.addTween(boyfriendIn, TweenMax.to('#boyfriends-room .logo-outline', 1, {css: {opacity: '0'}}), 800, 1600);
        controller.addTween(boyfriendIn, TweenMax.from('#boyfriends-room .logo-filled', 1, {css: {opacity: '0'}}), 800, 1600);
        controller.addTween(boyfriendIn, TweenMax.from('#boyfriends-room .addon-desc h2', 1, {css: {marginTop: '40px', marginBottom: '-80px', opacity: '0'}}), 400, 1200);
        controller.addTween(boyfriendIn, TweenMax.from('#boyfriends-room .addon-desc p', 1, {css: {marginTop: '40px', marginBottom: '-100px', opacity: '0'}}), 400, 2000);

        controller.addTween(addonsIn, TweenMax.to('#boyfriends-room', 1, {css: {top: '-101%'}}), 1000);
        controller.addTween(addonsIn, TweenMax.from('#all-addons', 1, {css: {top: '50%', height: '1200px'}}), 1000);
    }

});
