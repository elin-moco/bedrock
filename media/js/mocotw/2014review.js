"use strict";

(function () {
    if ($('html').hasClass('lt-ie10')) {
        return;
    }
    function desktopSetup() {
        var BASE_URL = 'http://' + window.location.hostname + '/2014-review/';
        var API_URL = 'https://ffclub.inspire.mozilla.com.tw/campaign/2014review/';
        var initialized = false;
        var playing = false;
        var firstPlay = true;
        var firstTour = true;
        var countingDown = false;
        var navPoints = {
            '#firefox': 700,
            '#firefoxos': 6200,
            '#community': 20700,
            '#openweb': 25200,
            '#blogs': 27500
        };
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
        var driftPoints;
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
        var countdownSound = new Audio('/media/img/mocotw/2014review/mp3/countdown.mp3');
        var scoreSound = new Audio('/media/img/mocotw/2014review/mp3/item-get.ogg');
        var driftSound = new Audio('/media/img/mocotw/2014review/mp3/drift.mp3');
        $(driftSound).on('ended', function() {
            driftSound.src = driftSound.src;
        });
        var celebrateSound = new Audio('/media/img/mocotw/2014review/mp3/celebration.mp3');
        celebrateSound.loop = true;
        celebrateSound.volume = 0.8;
        var raceBgm = new Audio('/media/img/mocotw/2014review/mp3/race-bgm.mp3');
        raceBgm.loop = true;
        raceBgm.volume = 0.5;
    //    var titleBgm = new Audio('/media/img/mocotw/2014review/mp3/title-bgm.mp3');
    //    titleBgm.loop = true;
    //    titleBgm.volume = 0.5;
    //    titleBgm.play();
        var allSounds = [countdownSound, scoreSound, driftSound, celebrateSound, raceBgm];
        var navTrack = $('#nav-track').get(0);
        var minifox = $('#minifox').get(0);
        var navTrackTotal = navTrack.getTotalLength();
        var trackTotal;
        var $navMap = $('#nav-map');
        var $navArea = $('#minimap-nav > area');
        var $giftNote = $('.gift-note');


        function moveFox(step) {
            if (!trackTotal) {
                trackTotal = $.fn.scrollPath("getTotalLength");
            }
            var navStep = navTrackTotal * ((step + 20000) % trackTotal) / trackTotal;
            var p = navTrack.getPointAtLength(navStep);
            minifox.setAttribute('x', p.x-10.5);
            minifox.setAttribute('y', p.y-7.5);
        }

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
            driftPoints = [1600, 4800, 7200, 9800, 10500, 12600, 14200, 19300, 26100, 28500, 30100, 31100, 35400];
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
                .lineTo(1750, 3075, {name: "p1"})
                .arc(1750, 2500, 575, Math.PI/2, Math.PI*(3/4), false, {rotate: -Math.PI/4 })
                .lineTo(775, 2350, {name: "p2"})
                .arc(884, 2204, 180, Math.PI*(3/4), Math.PI, false, {rotate: -Math.PI/2 })
                .lineTo(700, 1400, {name: "p3"})
                .arc(908, 1415, 208, Math.PI, -Math.PI/4, false, {rotate: -Math.PI*1.25 })
                .lineTo(1490, 1690, {name: "p4"})
                .arc(1450, 1736, 60, -Math.PI/4, Math.PI/4, false, {rotate: -Math.PI*1.75 })
                .lineTo(1425, 1850, {name: "p5"})
                .arc(1550, 1980, 180, -Math.PI*3/4, -Math.PI*1.75, true, {rotate: -Math.PI*0.75 })
                .lineTo(1865, 1925, {name: "p6"})
                .arc(1945, 1985, 100, -Math.PI*3/4, -Math.PI/4, false, {rotate: -Math.PI*1.25 })
                .lineTo(2375, 2275, {name: "p7"})
                .arc(2510, 2140, 190, -Math.PI*1.25, -Math.PI/4, true, {rotate: -Math.PI*0.25 })
                .lineTo(1620, 980, {name: "p8"})
                .arc(1765, 825, 210, -Math.PI*1.25, -Math.PI/2, false, {rotate: -Math.PI })
                .lineTo(3980, 615, {name: "p9"})
                .arc(3980, 815, 200, -Math.PI/2, -Math.PI/4, false, {rotate: -Math.PI*5/4 })
                .lineTo(4660, 1215, {name: "p10"})
                .arc(4620, 1315, 100, -Math.PI/4, Math.PI/4, false, {rotate: -Math.PI*7/4 })
                .lineTo(4375, 1700, {name: "p11"})
                .arc(4425, 1775, 90, Math.PI*5/4, Math.PI/4, true, {rotate: -Math.PI*3/4 })
                .lineTo(4560, 1770, {name: "p12"})
                .arc(4633, 1825, 90, Math.PI*5/4, Math.PI/4, false, {rotate: -Math.PI*7/4 })
                .lineTo(3685, 2900, {name: "p13"})
                .arc(3255, 2480, 600, Math.PI/4, Math.PI/2, false, {rotate: -Math.PI*2 })
                .lineTo(2400, 3075, {name: "p14"});

            // We're done with the path, let's initate the plugin on our wrapper element
            $(".track").scrollPath({drawPath: false, wrapAround: true, scrollBar: true, scrollBlocker: '#popup',
                initComplete: callback,
                onMove: function(step, direction) {
                moveFox(step);
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
                            if (-1 == itemsGet.indexOf(setting.item) &&
                                ($treasure.hasClass(kartPos) || (kartPos == '' && $treasure.hasClass('mid')))) {
                                itemsGet.push(setting.item);
                                scoreSound.play();
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
                var stepIndex = driftPoints.indexOf(step);
                if (playing && stepIndex >= 0) {
                    driftPoints.splice(stepIndex, 1);
                    driftSound.play();
                }
            }});
        }

        function countDownAndStart() {
            playing = true;
            countingDown = true;
            countdownSound.play();
            $.fn.scrollPath("lockScroll");
            $('#count-down').show();
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
                            setTimeout(function() {
                                $('#count-down').hide();
                                raceBgm.play();
                            }, 1000);
                        }});
                        $('#count-down .go').animate({opacity: 1}, {duration: 250}).delay(500).animate({opacity: 0}, {duration: 250});
                    }});
                }});
            }});
        }

        function gameReady(replay) {
            score = 0;
            $.fn.scrollPath("reset");
            $wrapper.attr('class', 'game');
            $items.css('opacity', 1);
            $('#traffic-light .red-light').css('opacity', 1);
            $('#traffic-light .yellow-light').css('opacity', 0);
            $('#traffic-light .green-light').css('opacity', 0);
            $kart.css({'opacity': 1, 'width': '143px'});
            $navMap.show();
            if (replay) {
                countDownAndStart();
            }
            else {
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
        }

        function tourReady() {
            $wrapper.attr('class', 'tour');
            playing = false;
            $items.css('opacity', 0);
            $('#traffic-light .red-light').css('opacity', 0);
            $('#traffic-light .yellow-light').css('opacity', 0);
            $('#traffic-light .green-light').css('opacity', 1);
            $kart.css({'opacity': 1, 'width': '143px'});
            $navMap.show();
            if (firstTour) {
                firstTour = false;
                showTourGuide(false, closePopup);
            }
        }

        function play() {
            $giftNote.hide();
            celebrateSound.pause();
            if (onPopupClose) {
                onPopupClose();
            }
            closePopup();
            buildSettings(true);
            if (!initialized) {
                init(gameReady);
                initialized = true;
            }
            else {
                gameReady();
            }
        }

        function replay() {
            celebrateSound.pause();
            if (onPopupClose) {
                onPopupClose();
            }
            closePopup();
            buildSettings(true);
            gameReady(true);
        }

        function tour() {
            $giftNote.hide();
            raceBgm.pause();
            celebrateSound.pause();
            if (onPopupClose) {
                onPopupClose();
            }
            closePopup();
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
                raceBgm.play();
                $.fn.scrollPath("resume", showBillboard);
            }
            else if ($wrapper.attr('class')) {
                onPopupClose = null;
                tour();
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
            celebrateSound.pause();
            showPrize(true);
        }

        function showPopup(type) {
    //        titleBgm.pause();
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
            raceBgm.pause();
            celebrateSound.pause();
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
            raceBgm.pause();
            celebrateSound.play();
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

        $('.main-menu > .start-game, .sub-menu > .start-game').click(play);
        $('.sub-menu > .restart-game').click(replay);

        $('.main-menu > .review-mode, .sub-menu > .review-mode, .sub-menu > .return-review-mode').click(tour);

        $('.sub-menu > .resume-game').click(function() {
            if (onPopupClose) {
                onPopupClose();
            }
            raceBgm.play();
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
        $navArea.click(function() {
            if (!playing) {
                var dest = navPoints[$(this).attr('href')];
                    $.fn.scrollPath("navTo", dest, 'linear', function() {
                });
            }
        });
        $navArea.mouseover(function(e) {
            if (!playing) {
                $navMap.addClass(e.target.id.substring(4));
            }
        });
        $navArea.mouseout(function(e) {
            $navMap.attr('class', '');
        });
        var $soundMode = $('.sound-mode');
        $soundMode.click(function() {
            var i = 0;
            if ($soundMode.hasClass('on')) {
                $soundMode.removeClass('on');
                $soundMode.addClass('off');
                $soundMode.text('音效已關');
                for (i = 0; i < allSounds.length; i++) {
                    allSounds[i].muted = true;
                }
            }
            else if ($soundMode.hasClass('off')) {
                $soundMode.removeClass('off');
                $soundMode.addClass('on');
                $soundMode.text('音效已開');
                for (i = 0; i < allSounds.length; i++) {
                    allSounds[i].muted = false;
                }
            }
        });

        //Close popup
        $popup.find('.ok, .close, #race-billboard h2 .share').click(function() {
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

        function showLoginBox() {
            $('.prize-content').hide();
            $('#login-box').attr('src', API_URL + 'login/').show();
        }

        window.fbAsyncInit = function () {
            FB.Event.subscribe('edge.create', function (response) {
                if ('https://facebook.com/MozillaTaiwan' == response) {
                    showLoginBox();
                    gaTrack(['_trackEvent', 'New Fans', 'like', response]);
                }
            });
        };

        $('#get-prize .share').click(function() {
            FB.ui({method: 'feed', link: BASE_URL},
                function (response) {
                    if (response && response.post_id) {
                        showLoginBox();
                        gaTrack(['_trackEvent', 'Social Interaction', 'share', response.post_id]);
                    }
                }
            );
        });

        var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
        var eventer = window[eventMethod];
        var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

        // Listen to message from child window
        eventer(messageEvent,function(e) {
            //run function//
            if (e.data == 'login=success') {
                $('#login-box').hide();
                $.ajax({
                    url: API_URL + 'award/',
                    data: {score: $('#race-billboard .score').text()},
                    dataType: 'jsonp',
                    success: function(price) {
                        if (price.result == 'success') {
                            if (price.existing) {
                                alert('你已經領過獎囉！');
                            }
                            //show claim link
                            var $claimPopup = $('#claim-message');
                            $claimPopup.find('a').attr('href', API_URL + 'claim/');
                            $claimPopup.show();
                        }
                        else if (price.result == 'ended') {
                            alert('活動已結束。');
                        }
                        else {
                            alert('抱歉，抽獎時發生錯誤。');
                        }
                    }
                });
            }
        },false);

        $.ajax({
            url: API_URL + 'quota/',
            dataType: 'jsonp',
            success: function(price) {
                if (price.result == 'success') {
                    if (price.quota > 0) {
                        var $quotaMessage = $('.gift-note .quota-remain');
                        $quotaMessage.find('span').text(price.quota);
                        $quotaMessage.show();
                    }
                    else {
                        $('.gift-note .out-of-stock').show();
                    }
                }
                else {
                    $('.gift-note').hide();
                }
            }
        });
        if (!Modernizr.pointerevents) {
            //pass through click event
            $('.board > .ad .record').click(function(e) {
                e.preventDefault();
            });
            $('.board > .ad').click(function() {
                window.open($(this).find('.record').attr('href'));
            });
        }
    }

    enquire.register("screen and (max-width: 760px)", {
        deferSetup: true,
        setup: function () {
        },
        match: function () {
        },
        unmatch: function () {
            window.location.reload();
        }
    }, true).register("screen and (min-width: 761px)", {
        deferSetup: true,
        setup: desktopSetup,
        match: function () {
        },
        unmatch: function () {
            window.location.reload();
        }
    }, true).listen();
})();
