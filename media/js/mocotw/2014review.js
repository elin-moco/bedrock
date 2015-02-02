"use strict";

(function () {

    var initialized = false;
    var playing = false;
    var firstPlay = true;
    var firstTour = true;
    var countingDown = false;
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
    var tresureSettings = [6, 5, 5, 5, 4, 4, 4, 4, 4, 4, 4, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 1, 1, 1, 1, 1];
    var itemsGet = [];
    var boardDistance = 550;
    var roadSettings;
    var $wrapper = $('#wrapper');
    var $mainContent = $('#main-content');
    var $kart = $('#kart');
    var $items = $('.item');
    var $gameMenu = $('.game-menu');
    var $scorePop = $('#score-pop');
    var score = 0;

    function shuffle(o){
        for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    }

    function popScore(score) {
        $scorePop.text('+' + score);
        $scorePop.animate({top: '48%', 'font-size': '60px'}, {duration: 600, queue: false});
        $scorePop.animate({opacity: 1}, {duration: 100}).delay(400)
            .animate({opacity: 0}, {duration: 100, complete: function() {
                $scorePop.css({'top': '64%', 'font-size': '24px'});
            }});
    }

    function buildSettings(arrangeItems) {
        $kart.attr('class', '');
        $('.record').removeClass('get');
        $items.removeClass('up down mid');
        roadSettings = {};
        itemsGet = [];
        tresureSettings = shuffle(tresureSettings);
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var setting = itemSettings[item];
            var type = tresureSettings[i];
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
        $mainContent.addClass('began');

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
                        if (-1 == $.inArray(setting.item, itemsGet) &&
                            ($treasure.hasClass(kartPos) || (kartPos == '' && $treasure.hasClass('mid')))) {
                            itemsGet.push(setting.item);
                            $treasure.css({'opacity': 0});
                            if ($treasure.hasClass('treasure6')) {
                                score += 5;
                                popScore(5);
                            }
                            else if ($treasure.hasClass('treasure3') || $treasure.hasClass('treasure4') || $treasure.hasClass('treasure5')) {
                                score += 4;
                                popScore(4);
                            }
                            else {
                                score += 3;
                                popScore(3);
                            }
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
        countingDown = true;
        $.fn.scrollPath("lockScroll");
        $('#count-down .three').animate({opacity: 1}, {duration: 250}).delay(500).animate({opacity: 0}, {duration: 250, complete: function() {
            $('#count-down .two').animate({opacity: 1}, {duration: 250}).delay(500).animate({opacity: 0}, {duration: 250, complete: function() {
                $('#traffic-light .red-light').animate({opacity: 0}, {duration: 250, queue: false});
                $('#traffic-light .yellow-light').animate({opacity: 1}, {duration: 250, queue: false});
                $('#count-down .one').animate({opacity: 1}, {duration: 250}).delay(500).animate({opacity: 0}, {duration: 250, complete: function() {
                    $('#traffic-light .yellow-light').animate({opacity: 0}, {duration: 250, queue: false});
                    $('#traffic-light .green-light').animate({opacity: 1}, {duration: 250, queue: false, complete: function() {
                        $.fn.scrollPath("unlockScroll");
                        $.fn.scrollPath("resume", showBillboard);
                        countingDown = false;
                    }});
                    $('#count-down .go').animate({opacity: 1}, {duration: 250}).delay(500).animate({opacity: 0}, {duration: 250});
                }});
            }});
        }});
    }

    function gameReady() {
        score = 0;
        $.fn.scrollPath("reset");
        $wrapper.attr('class', 'game');
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
        $wrapper.attr('class', 'tour');
        playing = false;
        $items.css('opacity', 0);
        $('#traffic-light .red-light').css('opacity', 0);
        $('#traffic-light .yellow-light').css('opacity', 0);
        $('#traffic-light .green-light').css('opacity', 1);
        $kart.css({'opacity': 1, 'width': '143px'});
        if (firstTour) {
            firstTour = false;
            showTourGuide(false, closePopup);
        }
    }

    function play() {
        if (onPopupClose) {
            onPopupClose();
        }
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
        if (onPopupClose) {
            onPopupClose();
        }
        $.fn.scrollPath("pause", showBillboard);
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
        $gameMenu.show();
    }

    function closeVideoPopup() {
        $popup.hide();
        $gameMenu.show();
        $video.attr('src', 'about:blank');
        if ($wrapper.hasClass('game')) {
            $.fn.scrollPath("resume", showBillboard);
        }
    }

    function closeGamePopupAndStart() {
        $popup.hide();
        $gameMenu.show();
        countDownAndStart();
    }

    function closeGamePopupAndResume() {
        $popup.hide();
        $gameMenu.show();
        $.fn.scrollPath("resume", showBillboard);
    }

    function closeBillboardPopupAndContinue() {
        showPrize(true);
    }

    function showPopup(type) {
        $gameMenu.hide();
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
        for (var i = 0; i < itemsGet.length; i++) {
            $('#r' + itemsGet[i]).addClass('get');
        }
        $('#race-billboard .score').text(score);
        $wrapper.attr('class', 'over');
        onPopupClose = closeBillboardPopupAndContinue;
        showSubmenu('race-billboard');
        showPopup('billboard');
    }
    function showPrize() {
        onPopupClose = null;
        showSubmenu('get-prize');
        showPopup('prize');
    }

    $('.main-menu > .start-game, .sub-menu > .start-game, .sub-menu > .restart-game').click(play);

    $('.main-menu > .review-mode, .sub-menu > .review-mode, .sub-menu > .return-review-mode').click(tour);

    $('.sub-menu > .resume-game').click(function() {
        if (onPopupClose) {
            onPopupClose();
        }
    });

    $('.main-menu > .review-video').click(function() {
        showReviewVideo(false, closeVideoPopup);
    });

    $('.sub-menu > .review-video').click(function() {
        showReviewVideo(true, closeVideoPopup);
    });

    $('.game-menu > .pause-game').click(function() {
        if (!countingDown) {
            if ($wrapper.hasClass('game')) {
                $.fn.scrollPath("pause");
                showGameGuide(true, closeGamePopupAndResume);
            }
            if ($wrapper.hasClass('tour')) {
                showTourGuide(true, closePopup);
            }
        }
    });

    //Close popup
    $popup.find('.ok, .close').click(function() {
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
