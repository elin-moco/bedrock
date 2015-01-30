"use strict";

(function () {

    var initialized = false;
    var playing = false;
    var firstPlay = true;
    var firstTour = true;
    var items = [
        '1-1', '1-2', '1-3', '1-4', '1-5',
        '2-1', '2-2', '2-3', '2-4', '2-5', '2-6', '2-7', '2-8',
        '3-1', '3-2', '3-3', '3-4', '3-5',
        '4-1', '4-2',
        '5-1', '5-2', '5-3', '5-4', '5-5', '5-6', '5-7'
    ];
    var itemSettings = {
        '1-1': {dis: 950},
        '1-2': {dis: 2850},
        '1-3': {dis: 3550},
        '1-4': {dis: 4250},
        '1-5': {dis: 5550},
        '2-1': {dis: 6300},
        '2-2': {dis: 9050},
        '2-3': {dis: 11800},
        '2-4': {dis: 13800},
        '2-5': {dis: 15750},
        '2-6': {dis: 16450},
        '2-7': {dis: 17150},
        '2-8': {dis: 17850},
        '3-1': {dis: 20900},
        '3-2': {dis: 21750},
        '3-3': {dis: 22650},
        '3-4': {dis: 23550},
        '3-5': {dis: 24400},
        '4-1': {dis: 25400},
        '4-2': {dis: 26900},
        '5-1': {dis: 27800},
        '5-2': {dis: 29500},
        '5-3': {dis: 32650},
        '5-4': {dis: 33350},
        '5-5': {dis: 34050},
        '5-6': {dis: 34750},
        '5-7': {dis: 36650}
    };
    var boardDistance = 550;
    var roadSettings;
    var $kart = $('#kart');
    var $items = $('.item');

    function buildSettings(arrangeItems) {
        $kart.attr('class', '');
        $items.removeClass('up down mid');
        roadSettings = {};
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var setting = itemSettings[item];
            var type = Math.round(Math.random() * 5) + 1;
            roadSettings[setting.dis - boardDistance] = {'item': item, 'action': 'boardOn'};
            roadSettings[setting.dis + boardDistance] = {'item': item, 'action': 'boardOff'};

            if (arrangeItems) {
                var pos = Math.round(Math.random() * 2) - 1;
                roadSettings[setting.dis] = {'item': item, 'action': 'itemGet', pos: pos};
                var $item = $('#i'+item);
                $item.addClass('treasure'+type);
                switch (pos) {
                    case 1:
                        $item.addClass('up');
                        break;
                    case -1:
                        $item.addClass('down');
                        break;
                    case 0:
                        $item.addClass('mid');
                        break;
                    default:
                        break;
                }
            }
        }
    }

    function init(callback) {
        $('#main-content').addClass('began');

        $.fn.scrollPath("getPath", {scrollSpeed: 20, rotationSpeed: Math.PI / 10})
            .moveTo(2400, 3075, {name: "start"})
            .lineTo(1750, 3075, {name: "1"})
            .arc(1750, 2500, 575, Math.PI/2, Math.PI*(3/4), false, {rotate: -Math.PI/4 })
            .lineTo(775, 2350, {name: "2"})
            .arc(884, 2204, 180, Math.PI*(3/4), Math.PI, false, {rotate: -Math.PI/2 })
            .lineTo(700, 1400, {name: "3"})
            .arc(908, 1415, 208, Math.PI, -Math.PI/4, false, {rotate: -Math.PI*1.25 })
            .lineTo(1490, 1690, {name: "4"})
            .arc(1450, 1736, 60, -Math.PI/4, Math.PI/4, false, {rotate: -Math.PI*1.75 })
            .lineTo(1425, 1850, {name: "5"})
            .arc(1550, 1980, 180, -Math.PI*3/4, -Math.PI*1.75, true, {rotate: -Math.PI*0.75 })
            .lineTo(1865, 1925, {name: "6"})
            .arc(1945, 1985, 100, -Math.PI*3/4, -Math.PI/4, false, {rotate: -Math.PI*1.25 })
            .lineTo(2375, 2275, {name: "7"})
            .arc(2510, 2140, 190, -Math.PI*1.25, -Math.PI/4, true, {rotate: -Math.PI*0.25 })
            .lineTo(1620, 980, {name: "8"})
            .arc(1765, 825, 210, -Math.PI*1.25, -Math.PI/2, false, {rotate: -Math.PI })
            .lineTo(3980, 615, {name: "9"})
            .arc(3980, 815, 200, -Math.PI/2, -Math.PI/4, false, {rotate: -Math.PI*5/4 })
            .lineTo(4660, 1215, {name: "10"})
            .arc(4620, 1315, 100, -Math.PI/4, Math.PI/4, false, {rotate: -Math.PI*7/4 })
            .lineTo(4375, 1700, {name: "11"})
            .arc(4425, 1775, 90, Math.PI*5/4, Math.PI/4, true, {rotate: -Math.PI*3/4 })
            .lineTo(4560, 1770, {name: "12"})
            .arc(4633, 1825, 90, Math.PI*5/4, Math.PI/4, false, {rotate: -Math.PI*7/4 })
            .lineTo(3685, 2900, {name: "13"})
            .arc(3255, 2480, 600, Math.PI/4, Math.PI/2, false, {rotate: -Math.PI*2 })
            .lineTo(2400, 3075, {name: "14"});

        // We're done with the path, let's initate the plugin on our wrapper element
        $(".track").scrollPath({drawPath: false, wrapAround: true, scrollBar: true, scrollBlocker: '#popup',
            initComplete: callback,
            onMove: function(step, direction) {
            var setting = roadSettings[step];
            if (setting) {
                var $item = $('#b' + setting.item);
                switch (setting.action) {
                    case 'boardOn':
                        if (direction > 0) {
                            $item.addClass('enlarge');
                        }
                        else if (direction < 0) {
                            $item.removeClass('enlarge');
                        }
                        break;
                    case 'boardOff':
                        if (direction > 0) {
                            $item.removeClass('enlarge');
                        }
                        else if (direction < 0) {
                            $item.addClass('enlarge');
                        }
                        break;
                    case 'itemGet':
                        var $treasure = $('#i' + setting.item);
                        var kartPos = $kart.attr('class');
                        if ($treasure.hasClass(kartPos) || (kartPos == '' && $treasure.hasClass('mid'))) {
                            $treasure.css({'opacity': 0});
                        }
                        break;
                    default:
                        break;
                }
            }
        }});
    }

    function countDownAndStart() {
        playing = true;
        $('#count-down .three').animate({opacity: 1}, {duration: 250}).delay(500).animate({opacity: 0}, {duration: 250, complete: function() {
            $('#count-down .two').animate({opacity: 1}, {duration: 250}).delay(500).animate({opacity: 0}, {duration: 250, complete: function() {
                $('#traffic-light .yellow-light').animate({opacity: 1}, {duration: 250, queue: false});
                $('#count-down .one').animate({opacity: 1}, {duration: 250}).delay(500).animate({opacity: 0}, {duration: 250, complete: function() {
                    $('#traffic-light .green-light').animate({opacity: 1}, {duration: 250, queue: false, complete: function() {
                        $.fn.scrollPath("resume", showBillboard);
                    }});
                    $('#count-down .go').animate({opacity: 1}, {duration: 250}).delay(500).animate({opacity: 0}, {duration: 250});
                }});
            }});
        }});
    }

    function gameReady() {
        $items.css('opacity', 1);
        $('#traffic-light .yellow-light').css('opacity', 0);
        $('#traffic-light .green-light').css('opacity', 0);
        $kart.css({'opacity': 1, 'width': '143px'});
        if (!playing) {
            if (firstPlay) {
                firstPlay = false;
                showGameGuide(false, closeGamePopupAndStart);
            }
            else {
                countDownAndStart();
            }
        }
        else {
            $.fn.scrollPath("resume", showBillboard);
        }
    }

    function tourReady() {
        playing = false;
        $items.css('opacity', 0);
        $('#traffic-light .yellow-light').css('opacity', 1);
        $('#traffic-light .green-light').css('opacity', 1);
        $kart.css({'opacity': 1, 'width': '143px'});
        if (firstTour) {
            firstTour = false;
            showTourGuide(false, closePopup);
        }
    }

    function play() {
        buildSettings(true);
        if (!initialized) {
            init(gameReady);
            initialized = true;
        }
        else {
            gameReady();
        }
    }

    function tour() {
        buildSettings(false);
        if (!initialized) {
            init(tourReady);
            initialized = true;
        }
        else {
            tourReady();
        }
    }

    var $popup = $('#popup');
    var $video = $popup.find('iframe');
    var onPopupClose = closePopup;

    function closePopup() {
        $popup.hide();
    }

    function closeVideoPopup() {
        $popup.hide();
        $video.attr('src', 'about:blank');
    }

    function closeGamePopupAndStart() {
        $popup.hide();
        countDownAndStart();
    }

    function closeGamePopupAndResume() {
        $popup.hide();
        $.fn.scrollPath("resume", showBillboard);
    }

    function closeVideoPopupAndResume() {
        $popup.hide();
        $video.attr('src', 'about:blank');
        $.fn.scrollPath("resume", showBillboard);
    }

    function closeBillboardPopupAndContinue() {
        showPrize(true);
    }

    function showPopup(type) {
        $popup.attr('class', type);
        $popup.show();
    }

    function showSubmenu(type) {
        $('#' + type + ' .sub-menu').show();
    }

    function hideSubmenu(type) {
        $('#' + type + ' .sub-menu').hide();
    }

    function showGameGuide(showMenu, onClose) {
        onPopupClose = onClose;
        if (showMenu) {
            showSubmenu('game-guide');
        }
        else {
            hideSubmenu('game-guide');
        }
        showPopup('game');
    }

    function showTourGuide(showMenu, onClose) {
        onPopupClose = onClose;
        if (showMenu) {
            showSubmenu('tour-guide');
        }
        else {
            hideSubmenu('tour-guide');
        }
        showPopup('tour');
    }

    function showReviewVideo(showMenu, onClose) {
        console.info('showReviewVideo');
        onPopupClose = onClose;
        if (showMenu) {
            showSubmenu('review-video-2014');
        }
        else {
            hideSubmenu('review-video-2014');
        }
        showPopup('video');
        $video.attr('src', $video.attr('data-src'));
    }

    function showBillboard() {
        onPopupClose = closeBillboardPopupAndContinue;
        showSubmenu('race-billboard');
        showPopup('billboard');
    }
    function showPrize() {
        onPopupClose = null;
        showSubmenu('get-prize');
        showPopup('prize');
    }

    $('.main-menu > .start-game').click(play);

    $('.main-menu > .review-mode').click(tour);

    $('.main-menu > .review-video').click(function() {
        showReviewVideo(false, closeVideoPopup);
    });

    //Close popup
    $('#review-video-2014 .close').click(function() {
        if (onPopupClose) {
            onPopupClose();
        }
    });
    $popup.click(function(e) {
        if (e.target == this && onPopupClose) {
            onPopupClose();
        }
    });

    //Controlling kart position
    $(document).on('keydown', function(e) {
        var code = (e.keyCode ? e.keyCode : e.which);
        var kartPos = $kart.attr('class');
        switch(code) {
            case 32:
            case 33:
            case 34:
            case 35:
            case 36:
                e.preventDefault();
                break;
            case 38:
            case 39:
                e.preventDefault();
                if (playing) {
                    if (kartPos == '') {
                        $kart.attr('class', 'up');
                    }
                    else if (kartPos == 'down') {
                        $kart.attr('class', '');
                    }
                }
                break;
            case 40:
            case 37:
                e.preventDefault();
                if (playing) {
                    if (kartPos == '') {
                        $kart.attr('class', 'down');
                    }
                    else if (kartPos == 'up') {
                        $kart.attr('class', '');
                    }
                }
                break;
            default :
                break;
        }
    });

})();
