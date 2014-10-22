"use strict";

function gaTrack(eventArray, callback) {
    // submit eventArray to GA and call callback only after tracking has
    // been sent, or if sending fails.
    //
    // callback is optional.
    //
    // Example usage:
    //
    // $(function() {
    //      var handler = function(e) {
    //           var _this = this;
    //           e.preventDefault();
    //           $(_this).off('submit', handler);
    //           gaTrack(
    //              ['_trackEvent', 'Newsletter Registration', 'submit', newsletter],
    //              function() {$(_this).submit();}
    //           );
    //      };
    //      $(thing).on('submit', handler);
    // });
    var timer = null;
    var hasCallback = typeof(callback) === 'function';
    var gaCallback;

    // Only build new function if callback exists.
    if (hasCallback) {
        gaCallback = function() {
            clearTimeout(timer);
            callback();
        };
    }
    // console.info(eventArray);
    if (typeof(window._gaq) === 'object') {
        // send event to GA
        window._gaq.push(eventArray);
        // Only set up timer and hitCallback if a callback exists.
        if (hasCallback) {
            // Failsafe - be sure we do the callback in a half-second
            // even if GA isn't able to send in our trackEvent.
            timer = setTimeout(gaCallback, 500);

            // But ordinarily, we get GA to call us back immediately after
            // it finishes sending our things.
            // https://developers.google.com/analytics/devguides/collection/gajs/#PushingFunctions
            // This is called after GA has sent the current pending data:
            window._gaq.push(gaCallback);
        }
    } else {
        // GA disabled or blocked or something, make sure we still
        // call the caller's callback:
        if (hasCallback) {
            callback();
        }
    }
}

$(function(){

    var $w = $(window);
    var isSmallViewport = $w.width() < 1000;
    var isTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints || navigator.maxTouchPoints || isSmallViewport;

    var BASE_URL = 'http://' + window.location.hostname + '/10years/firefox-family/';
    var TICKET_BASE_URL = 'http://' + window.location.hostname + '/media/img/mocotw/10years/fx-day/tickets/';
    var API_URL = 'https://firefox.club.tw/campaign/10years/firefox-family-award/';
    var voted = false;
    var playing = false;
    var level = 0;
    var day;
    var winningPrice;
    var $introVideo = $('#firefox-family-intro');

    if (!isSmallViewport && !isTouch) {
        $('html').addClass('desktop');
        $('.room .actor').addClass('stand');
        initPages();
        initIntroVideo();
        initScrollHandlers();
        initScrollAnimations();
        initAddosHandlers(false);
        initBonusHandlers();
        initTicketHandlers();
        initLotteryHandlers();
    }
    else {
        initPages();
        initAddosHandlers(true);
        initIntroVideo();
    }


    function updatePlate() {
        $('.shareBox').hide();
        $('#wheel').attr('class', 'level'+level);
        if (level == 1) {
            $('#reward .better-chance').hide();
        }
    }

    function remindChance() {
        playing = true;
        $('.shareBox').click(function(e) {
            if (e.target == this) {
                $(this).hide();
            }
        });
        $('.shareBox .optional').hide();
        $('#reward .better-chance').css({'opacity': 1, 'pointer-events': 'all'}).click(function() {
            $('.shareBox').show();
        });
    }

    function showPrice(price) {
        $('#reward .action').hide();
        if (price.slug == 'sorry') {
            $('#reward .try-again').show();
        }
        else {
            $('#reward .bingo .price').text(price.name);
            $('#reward .bingo').show();
        }
    }

    function getPrice() {
        $.ajax({
            url: API_URL + 'lottery/',
            data: {level: level},
            dataType: 'jsonp',
            success: function(price) {
                if (price.result == 'success') {
                    if (price.existing) {
                        alert('你已經抽過獎囉！');
                        showPrice(price);
                    }
                    else {
                        winningPrice = price;
                        $('#wheel-of-fortune .plate').attr('class', 'plate ' + price.slug);
                    }
                }
                else {
                    alert('抱歉，抽獎時發生錯誤。');
                }
            }
        });
    }

    function showLoginBox() {
        $('.loginBox').show();
        $('.loginBox iframe').attr('src', API_URL);
    }

    function getTicket() {
        $.ajax({
            url: API_URL + 'ticket/',
            data: {day: day},
            dataType: 'jsonp',
            success: function(ticket) {
                if (ticket.result == 'success') {
                    if (ticket.existing) {
                        alert('你已經領過票囉！');
                    }
                    $('.show-ticket .code').text('序號：' + ticket.code);
                    $('.show-ticket .session').text(ticket.session);
                    $('.show-ticket .download').attr('href',
                            TICKET_BASE_URL + ticket.session.replace(/[/:\s]/g, '') + '-' + ticket.code + '.png');
                    $('.get-ticket').hide();
                    $('.show-ticket').show();
                }
                else {
                    alert('抱歉，取票時發生錯誤。');
                }
            }
        });
    }

    function goPlayLottery() {
        $('#wrapper').addClass('lottery');
        setTimeout(function() {
            $.scrollTo($(document).height(), 1000);
        }, 200);
    }

    function goGetTicket() {
        $('#wrapper').addClass('ticket');
        $('.shareBox').hide();
        setTimeout(function() {
            $.scrollTo($(document).height(), 1000);
        }, 200);
    }

    function showScrollTip() {
        $('#scroll-tip').css('opacity', 1);
    }

    function initAddosHandlers(vertical) {
        $.fn.loadLikeButtons = function() {
            var $this = $(this);
            if ($this.find('.fb-like').size() == 0) {
                $this.find('.fb-vote').each(function() {
                    var $vote = $(this);
                    var addon = $vote.attr('data-addon');
                    $vote.append('<div class="fb-like" data-href="' + BASE_URL + addon + '/" ' +
                        'data-layout="button_count" data-action="like" data-show-faces="false" data-share="false"></div>');
                }).promise().done(function() {
                    FB.XFBML.parse($this.find('.addons').get(0));
                });
            }
        };

        $('#all-addons').find('.kwicks').kwicks({
            spacing: 0,
            maxSize: vertical ? 480 : 640,
            behavior: 'menu',
            selectOnClick: vertical,
            deselectOnClick: vertical,
            easing: 'easeInOut',
            isVertical: vertical
        }).on('expand.kwicks', function(e, data) {
            $(data.expanded).loadLikeButtons();
        });
    }

    function initBonusHandlers() {
        window.fbAsyncInit = function () {
            FB.Event.subscribe('edge.create', function (response) {
                if ('https://facebook.com/MozillaTaiwan' == response) {
                    level = 1;
                    if (!playing) {
                        goGetTicket();
                    }
                    else {
                        updatePlate();
                    }
                    gaTrack(['_trackEvent', 'New Fans', 'like', response]);
                }
                else if (0 == response.indexOf(BASE_URL)) {
                    if (!voted) {
                        voted = true;
                        $('.shareBox').show();
                    }
                }
            });
        };

        $('.luckyChance .share').click(function() {
            FB.ui({method: 'feed', link: BASE_URL},
                function (response) {
                    if (response && response.post_id) {
                        level = 1;
                        if (!playing) {
                            goGetTicket();
                        }
                        else {
                            updatePlate();
                        }
                        gaTrack(['_trackEvent', 'Social Interaction', 'share', response.post_id]);
                    }
                }
            );
        });
        $('.luckyChance .no-thanks').click(function() {
            if (!playing) {
                goGetTicket();
            }
            else {
                updatePlate();
            }
        });
    }

    function initLotteryHandlers() {
        $('#reward .go').click(function() {
            getPrice();
        });

        $('#wheel-of-fortune .plate').bind('transitionend webkitTransitionEnd MSTransitionEnd oTransitionEnd', function (e) {
            if (winningPrice) {
                showPrice(winningPrice);
            }
        });

        $('.postscript .back-to-ticket').click(function() {
            $.scrollTo(30000, 1000);
        });
    }

    function initTicketHandlers() {
        $('.get-ticket .day1').click(function() {
            day = 1;
            showLoginBox();
        });
        $('.get-ticket .day2').click(function() {
            day = 2;
            showLoginBox();
        });
        $('.get-ticket .skip').click(function() {
            day = undefined;
            showLoginBox();
        });

        $('.show-ticket .go-lottery').click(function() {
            goPlayLottery();
        });

        $('.loginBox').click(function(e) {
            if (e.target == this) {
                $(this).hide();
            }
        });
        var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
        var eventer = window[eventMethod];
        var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

        // Listen to message from child window
        eventer(messageEvent,function(e) {
            //run function//
            if (e.data == 'login=success') {
                $('.loginBox').hide();
                if (day) {
                    getTicket();
                }
                else {
                    goPlayLottery();
                }
            }
        },false);
    }

    function initIntroVideo() {
        $introVideo.on('pause', showScrollTip).on('timeupdate', function() {
            if (this.currentTime > 66) {
                showScrollTip();
            }
        }).waypoint(function(direction) {
            if (direction === 'down') {
                this.pause();
            }
            else {
                this.play();
            }
        }, {offset: -800});

        $('#music-button').click(function () {
            var $this = $(this);
            if ($this.hasClass('on')) {
                $this.removeClass('on');
                $this.addClass('off');
                $introVideo.prop('muted', true);
            }
            else {
                $this.addClass('on');
                $this.removeClass('off');
                $introVideo.prop('muted', false);
            }
        });
    }

    function initScrollHandlers() {
        var autoScrolling = false;
        $('body').keyup(function (e) {
            if (13 == e.keyCode) {
                var total = $(document).height();
                var current = $(document).scrollTop();
                var duration = total > current ? total - current : 1000;
                if (!autoScrolling) {
                    $.scrollTo(total, duration, {easing: 'linear'});
                    autoScrolling = true;
                }
                else {
                    $.scrollTo.window().stop(true);
                    autoScrolling = false;
                }
            }
        });
        $.localScroll({
            target: 'body', // could be a selector or a jQuery object too.
            queue: true,
            duration: 1500,
            hash: true
        });
    }

    function initScrollAnimations() {

        TweenMax.selector = jQuery;
        var controller = $.superscrollorama({ playoutAnimations: false });
        var fatherIn = 0;
        var motherIn = 4000;
        var grandpaIn = 8000;
        var daughterIn = 12000;
        var sonIn = 16000;
        var boyfriendIn = 20000;
        var addonsIn = 24000;
        var lotteryIn = 30000;
        var sitDown = function() {
            $(this.target).siblings('.actor').removeClass('stand');
        };
        var standUp = function() {
            $(this.target).siblings('.actor').addClass('stand');
        };
        var preloadFbLikes = function() {
            $('#all-addons .' + $(this.target).attr('data-actor')).loadLikeButtons();
        };
        controller.addTween(fatherIn, TweenMax.to('#intro', 1, {css: {top: '-100%'}}), 1000);
        controller.addTween(fatherIn, TweenMax.to('#firefox-family-intro', 1, {volume: 0}), 800);
        controller.addTween(fatherIn, TweenMax.to('#music-button', 1, {css: {opacity: 0}}), 500);
        controller.addTween(fatherIn, TweenMax.to('#scene > .clock .hour', 1, {rotation: 90}), 24000);
        controller.addTween(fatherIn, TweenMax.to('#scene > .clock .minute', 1, {rotation: 360*6}), 24000);
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


        controller.addTween(motherIn, TweenMax.to('#fathers-room', 1, {css: {top: '-101%'}, onStart: preloadFbLikes}), 1000);
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

        controller.addTween(grandpaIn, TweenMax.to('#mothers-room', 1, {css: {top: '-101%'}, onStart: preloadFbLikes}), 1000);
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

        controller.addTween(daughterIn, TweenMax.to('#grandpas-room', 1, {css: {top: '-101%'}, onStart: preloadFbLikes}), 1000);
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
        controller.addTween(daughterIn, TweenMax.from('#daughters-room .bookshelf', 1, {css: {bottom: '150%'}}), 800, 2100);
        controller.addTween(daughterIn, TweenMax.to('#daughters-room .logo-outline path', 1, {attr: {'stroke-dashoffset': '0'}}), 800, 800);
        controller.addTween(daughterIn, TweenMax.to('#daughters-room .logo-outline', 1, {css: {opacity: '0'}}), 800, 1600);
        controller.addTween(daughterIn, TweenMax.from('#daughters-room .logo-filled', 1, {css: {opacity: '0'}}), 800, 1600);
        controller.addTween(daughterIn, TweenMax.from('#daughters-room .addon-desc h2', 1, {css: {marginTop: '40px', marginBottom: '-80px', opacity: '0'}}), 400, 1200);
        controller.addTween(daughterIn, TweenMax.from('#daughters-room .addon-desc p', 1, {css: {marginTop: '40px', marginBottom: '-100px', opacity: '0'}}), 400, 2000);

        controller.addTween(sonIn, TweenMax.to('#daughters-room', 1, {css: {top: '-101%'}, onStart: preloadFbLikes}), 1000);
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

        controller.addTween(boyfriendIn, TweenMax.to('#sons-room', 1, {css: {top: '-101%'}, onStart: preloadFbLikes}), 1000);
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
        controller.addTween(addonsIn, TweenMax.to('#scene .clock', 1, {css: {top: '-100%'}}), 1000);
        controller.addTween(addonsIn, TweenMax.from('#all-addons', 1, {css: {top: '50%', height: '1200px'}}), 1000);
        controller.addTween(addonsIn, TweenMax.from('.announcements', 1, {css: {top: '-50%'},
            onComplete: function() {
                $('.announcements').addClass('fall');
            },
            onReverseComplete: function() {
                $('.announcements').removeClass('fall');
            }}), 500);
        controller.addTween(addonsIn, TweenMax.to('.announcements', 1, {css: {top: '-50%'},
            onStart: function() {
                $('#all-addons').removeClass('stand');
            },
            onReverseComplete: function() {
                $('#all-addons').addClass('stand');
            }}), 500, 3000);
        controller.addTween(addonsIn, TweenMax.from('#all-addons > h2', 1, {css: {opacity: 0}}), 500, 2000);
        controller.addTween(addonsIn, TweenMax.to('#scroll-tip', 1, {css: {opacity: 0}}), 500, 2000);

        //go get ticket
        controller.addTween(addonsIn, TweenMax.to('.announcements', 1, {css: {top: '0'},
            onStart: function() {
                $('.announcements .rules').hide();
                $('.announcements .ticket').show();
                $('#all-addons').addClass('letsgo');
            },
            onReverseComplete: function() {
                $('.announcements .rules').show();
                $('.announcements .ticket').hide();
                $('#all-addons').removeClass('letsgo');
            }}), 500, 4000);
        controller.addTween(addonsIn, TweenMax.to('#all-addons > h2', 1, {css: {opacity: 0}}), 500, 4000);


        controller.addTween(lotteryIn, TweenMax.to('.announcements', 1, {css: {top: '-50%'}}), 500);
        controller.addTween(lotteryIn, TweenMax.to('#all-addons', 1, {css: {top: '-100%'}}), 1000);
        controller.addTween(lotteryIn, TweenMax.from('#wheel-of-fortune', 1, {css: {top: '50%'},
            onStart: function() {
                $('#wheel').attr('class', 'level'+level);
                $('#reward .action').css('opacity', 1);
                if (level == 0) {
                    remindChance();
                }
            }}), 1000);
    }

    function initPages() {
        var hidePopup = function(ctx, next) {
            $('.addonBox').hide();
        };

        var showPopup = function(ctx, next) {
            var $addon = $('#addon-'+ctx.params.addon);
            if ($addon.size() > 0) {
                $introVideo.get(0).pause();
                var $addonBox = $('.addonBox');
                var $addons = $addon.closest('.addons');
                var $link = $addon.find('a');
                var actor_name = $addons.siblings('h3').text();
                var actor_img = $addons.siblings('.actor').css('background-image');
                var icon = window.getComputedStyle($link.get(0), ':before').backgroundImage;
                var href = $link.attr('href');
                var title = $addon.find('h4').text();
                var desc = $addon.find('p').text();

                $addonBox.find('.actor').css('background-image', actor_img);
                $addonBox.find('.icon').css('background-image', icon);
                $addonBox.find('.addon').attr('href', href);
                $addonBox.find('h4').text(title);
                $addonBox.find('p').text(desc);
                $addonBox.find('.what').text(title);
                $addonBox.find('.who').text(actor_name);
                $addonBox.show();
            }
        };
        $('.addonBox, .addonBox .more').click(function(e) {
            if (e.target == this) {
                $introVideo.get(0).play();
                page('/10years/firefox-family/');
            }
        });

        page('/10years/firefox-family/', hidePopup);
        page('/10years/firefox-family/:addon/', showPopup);
        page();
    }
});
