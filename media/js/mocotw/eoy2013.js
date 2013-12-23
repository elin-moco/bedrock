"use strict";

(function () {
    var autoScrolling = false;

    function initAnimations() {
        var controller = $.superscrollorama({playoutAnimations: false});
        var bubblesHook = $('.main-content');
        var $bubble0 = $('#bubble0');
        var $bubble1 = $('#bubble1');
        var $bubble1Txt = $('#bubble1 ul, #bubble1 h2');
        var $bubble2 = $('#bubble2');
        var $bubble2Txt = $('#bubble2 ul, #bubble2 h2');
        var $bubble3 = $('#bubble3');
        var $bubble3Txt = $('#bubble3 ul, #bubble3 h2');
        var $bubble4 = $('#bubble4');
        var $bubble4Back = $('#bubble4-back');
        var $bubble4Txt = $('#bubble4 ul, #bubble4 h2, #bubble4 h3');
        var $bubble5 = $('#bubble5');
        var $bubble5Txt = $('#bubble5 ul, #bubble5 h2');
        var $bubble6 = $('#bubble6');
        var $bubble6Txt = $('#bubble6 ul, #bubble6 h2');
        var $bubble7 = $('#bubble7');
        var $bubble7Txt = $('#bubble7 ul, #bubble7 h2');
        var $bubble8 = $('#bubble8');
        var $bubble8Txt = $('#bubble8 ul, #bubble8 h2');
        var $bubble9 = $('#bubble9');
        var $bubble9Txt = $('#bubble9 ul');
        var $bubble10 = $('#bubble10');
        var $firefox = $('#firefox');
        var $fxos = $('#fxos');
        var $curtain1 = $('.curtain1');
        var $curtain2 = $('.curtain2');

        var bubbleUpPos = 0;
        var bubbleTxtInterval = 240;
        var bubbleUpInterval = 500;
        var bubbleUpDur = 500;

        function currentPos() {
            return bubbleUpPos;
        }

        function adjCurrentPos(interval) {
            return bubbleUpPos + interval;
        }

        function nextPos() {
            bubbleUpPos += bubbleUpInterval;
            return bubbleUpPos;
        }

        function custNextPos(interval) {
            bubbleUpPos += interval;
            return bubbleUpPos;
        }

        var bubble0Out = TweenMax.to($bubble0, 1, {css: {top: '-500px', width: '1000px', height: '500px'}});

        var firefoxIn = TweenMax.to($firefox, 1, {css: {marginTop: '-350px'}});
        var bubble1In = TweenMax.to($bubble1, 1, {css: {marginTop: '-483px'}});
        var bubble1TxtIn = TweenMax.to($bubble1Txt, 1, {css: {opacity: '1.0'}});

        var firefoxUp = TweenMax.to($firefox, 1, {css: {marginTop: '-500px'}});
        var bubble1Up = TweenMax.to($bubble1, 1, {css: {marginTop: '-613px'}});
        var bubble2In = TweenMax.to($bubble2, 1, {css: {top: '50%', marginTop: '-364px', width: '651px'}});
        var bubble1TxtOut = TweenMax.to($bubble1Txt, 1, {css: {opacity: '0.0'}});
        var bubble2TxtIn = TweenMax.to($bubble2Txt, 1, {css: {opacity: '1.0'}});

        var firefoxOut = TweenMax.to($firefox, 1, {css: {marginTop: '-1000px'}});
        var bubble1Up2 = TweenMax.to($bubble1, 1, {css: {marginTop: '-1163px'}});
        var bubble2Up = TweenMax.to($bubble2, 1, {css: {marginTop: '-914px'}});
        var bubble3In = TweenMax.to($bubble3, 1, {css: {top: '50%', marginTop: '-411px', width: '1044px'}});
        var fxosIn = TweenMax.to($fxos, 1, {css: {bottom: '50%', marginBottom: '-276px'}});
        var curtain1Out = TweenMax.to($curtain1, 1, {css: {top: '-2000px'}});
        var curtain2In = TweenMax.to($curtain2, 1, {css: {top: '0'}});
        var bubble3TxtIn = TweenMax.to($bubble3Txt, 1, {css: {opacity: '1.0'}});
        var bubble2TxtOut = TweenMax.to($bubble2Txt, 1, {css: {opacity: '0.0'}});

        var bubble1Out = TweenMax.to($bubble1, 1, {css: {marginTop: '-2000px'}});
        var bubble2Out = TweenMax.to($bubble2, 1, {css: {top: '-100%'}});
        var fxosOut = TweenMax.to($fxos, 1, {css: {marginBottom: '2000px'}});
        var bubble3Up = TweenMax.to($bubble3, 1, {css: {marginTop: '-1100px'}});
        var bubble4In = TweenMax.to($bubble4, 1, {css: {top: '50%', marginTop: '-399px', width: '799px'}});
        var bubble4BackIn = TweenMax.to($bubble4Back, 1, {css: {top: '50%', marginTop: '-416px', marginRight: '270px', width: '358px'}});
        var bubble4TxtIn = TweenMax.to($bubble4Txt, 1, {css: {opacity: '1.0'}});
        var bubble3TxtOut = TweenMax.to($bubble3Txt, 1, {css: {opacity: '0.0'}});

        var bubble3Out = TweenMax.to($bubble3, 1, {css: {top: '-100%'}});
        var bubble4Up = TweenMax.to($bubble4, 1, {css: {marginTop: '-449px'}});
        var bubble4BackUp = TweenMax.to($bubble4Back, 1, {css: {marginTop: '-466px'}});
        var bubble5In = TweenMax.to($bubble5, 1, {css: {top: '50%', marginTop: '-412px', width: '641px'}});
        var bubble5TxtIn = TweenMax.to($bubble5Txt, 1, {css: {opacity: '1.0'}});
        var bubble4TxtOut = TweenMax.to($bubble4Txt, 1, {css: {opacity: '0.0'}});

        var curtain2Out = TweenMax.to($curtain2, 1, {css: {top: '-2000px'}});
        var bubble4Up2 = TweenMax.to($bubble4, 1, {css: {marginTop: '-1020px'}});
        var bubble4BackUp2 = TweenMax.to($bubble4Back, 1, {css: {marginTop: '-966px'}});
        var bubble5Up = TweenMax.to($bubble5, 1, {css: {marginTop: '-1080px'}});
        var bubble6In = TweenMax.to($bubble6, 1, {css: {top: '50%', marginTop: '-537px', width: '720px'}});
        var bubble6TxtIn = TweenMax.to($bubble6Txt, 1, {css: {opacity: '1.0'}});
        var bubble5TxtOut = TweenMax.to($bubble5Txt, 1, {css: {opacity: '0.0'}});

        var bubble7In = TweenMax.to($bubble7, 1, {css: {top: '50%', marginTop: '-439px', width: '831px'}});
        var bubble4Up3 = TweenMax.to($bubble4, 1, {css: {marginTop: '-1080px'}});
        var bubble5Up2= TweenMax.to($bubble5, 1, {css: {marginTop: '-1140px'}});
        var bubble6Up= TweenMax.to($bubble6, 1, {css: {marginTop: '-597px'}});
        var bubble7TxtIn = TweenMax.to($bubble7Txt, 1, {css: {opacity: '1.0'}});
        var bubble6TxtOut = TweenMax.to($bubble6Txt, 1, {css: {opacity: '0.0'}});

        var bubble8In = TweenMax.to($bubble8, 1, {css: {top: '50%', marginTop: '-591px', width: '918px'}});
        var bubble4Out = TweenMax.to($bubble4, 1, {css: {top: '-100%'}});
        var bubble5Out= TweenMax.to($bubble5, 1, {css: {top: '-100%'}});
        var bubble6Up2= TweenMax.to($bubble6, 1, {css: {marginTop: '-1297px'}});
        var bubble7Up= TweenMax.to($bubble7, 1, {css: {marginTop: '-1139px'}});
        var bubble8TxtIn = TweenMax.to($bubble8Txt, 1, {css: {opacity: '1.0'}});
        var bubble7TxtOut = TweenMax.to($bubble7Txt, 1, {css: {opacity: '0.0'}});

        var bubble9In = TweenMax.to($bubble9, 1, {css: {top: '50%', marginTop: '-446px', width: '894px'}});
        var bubble6Out = TweenMax.to($bubble6, 1, {css: {top: '-100%'}});
        var bubble7Out= TweenMax.to($bubble7, 1, {css: {top: '-100%'}});
        var bubble8Up= TweenMax.to($bubble8, 1, {css: {marginTop: '-1261px'}});
        var bubble9TxtIn = TweenMax.to($bubble9Txt, 1, {css: {opacity: '1.0'}});
        var bubble8TxtOut = TweenMax.to($bubble8Txt, 1, {css: {opacity: '0.0'}});

        var bubble8Out= TweenMax.to($bubble8, 1, {css: {top: '-100%'}});
        var bubble9Up= TweenMax.to($bubble9, 1, {css: {marginTop: '-646px'}});
        var bubble10In = TweenMax.to($bubble10, 1, {css: {top: '50%', marginTop: '-430px', width: '657px'}});

        controller.addTween(bubblesHook, bubble0Out, 300, custNextPos(350));
        controller.addTween(bubblesHook, firefoxIn, 300, currentPos());
        controller.addTween(bubblesHook, bubble1In, 300, currentPos());
        controller.addTween(bubblesHook, bubble1TxtIn, bubbleTxtInterval, adjCurrentPos(300-bubbleTxtInterval/2));

        controller.addTween(bubblesHook, firefoxUp, bubbleUpDur, custNextPos(1000));
        controller.addTween(bubblesHook, bubble1Up, bubbleUpDur, currentPos());
        controller.addTween(bubblesHook, bubble2In, bubbleUpDur, currentPos());
        controller.addTween(bubblesHook, bubble2TxtIn, bubbleTxtInterval, adjCurrentPos(bubbleUpDur-bubbleTxtInterval/2));
        controller.addTween(bubblesHook, bubble1TxtOut, bubbleTxtInterval, adjCurrentPos(-bubbleTxtInterval/2));

        controller.addTween(bubblesHook, firefoxOut, bubbleUpDur, custNextPos(1000));
        controller.addTween(bubblesHook, bubble1Up2, bubbleUpDur, currentPos());
        controller.addTween(bubblesHook, bubble2Up, bubbleUpDur, currentPos());
        controller.addTween(bubblesHook, bubble3In, bubbleUpDur, currentPos());
        controller.addTween(bubblesHook, fxosIn, bubbleUpDur, currentPos());
        controller.addTween(bubblesHook, curtain1Out, bubbleUpDur, currentPos());
        controller.addTween(bubblesHook, curtain2In, bubbleUpDur, currentPos());
        controller.addTween(bubblesHook, bubble3TxtIn, bubbleTxtInterval, adjCurrentPos(bubbleUpDur-bubbleTxtInterval/2));
        controller.addTween(bubblesHook, bubble2TxtOut, bubbleTxtInterval, adjCurrentPos(-bubbleTxtInterval/2));

        controller.addTween(bubblesHook, bubble1Out, bubbleUpDur, custNextPos(1000));
        controller.addTween(bubblesHook, bubble2Out, bubbleUpDur, currentPos());
        controller.addTween(bubblesHook, fxosOut, bubbleUpDur, currentPos());
        controller.addTween(bubblesHook, bubble3Up, bubbleUpDur, currentPos());
        controller.addTween(bubblesHook, bubble4In, bubbleUpDur, currentPos());
        controller.addTween(bubblesHook, bubble4BackIn, bubbleUpDur, currentPos());
        controller.addTween(bubblesHook, bubble4TxtIn, bubbleTxtInterval, adjCurrentPos(bubbleUpDur-bubbleTxtInterval/2));
        controller.addTween(bubblesHook, bubble3TxtOut, bubbleTxtInterval, adjCurrentPos(-bubbleTxtInterval/2));

        controller.addTween(bubblesHook, bubble5In, bubbleUpDur, custNextPos(1000));
        controller.addTween(bubblesHook, bubble3Out, bubbleUpDur, currentPos());
        controller.addTween(bubblesHook, bubble4Up, bubbleUpDur, currentPos());
        controller.addTween(bubblesHook, bubble4BackUp, bubbleUpDur, currentPos());
        controller.addTween(bubblesHook, bubble5TxtIn, bubbleTxtInterval, adjCurrentPos(bubbleUpDur-bubbleTxtInterval/2));
        controller.addTween(bubblesHook, bubble4TxtOut, bubbleTxtInterval, adjCurrentPos(-bubbleTxtInterval/2));

        controller.addTween(bubblesHook, curtain2Out, bubbleUpDur, custNextPos(1000));
        controller.addTween(bubblesHook, bubble4Up2, bubbleUpDur, currentPos());
        controller.addTween(bubblesHook, bubble4BackUp2, bubbleUpDur, currentPos());
        controller.addTween(bubblesHook, bubble5Up, bubbleUpDur, currentPos());
        controller.addTween(bubblesHook, bubble6In, bubbleUpDur, currentPos());
        controller.addTween(bubblesHook, bubble6TxtIn, bubbleTxtInterval, adjCurrentPos(bubbleUpDur-bubbleTxtInterval/2));
        controller.addTween(bubblesHook, bubble5TxtOut, bubbleTxtInterval, adjCurrentPos(-bubbleTxtInterval/2));

        controller.addTween(bubblesHook, bubble7In, bubbleUpDur, custNextPos(1000));
        controller.addTween(bubblesHook, bubble4Up3, bubbleUpDur, currentPos());
        controller.addTween(bubblesHook, bubble5Up2, bubbleUpDur, currentPos());
        controller.addTween(bubblesHook, bubble6Up, bubbleUpDur, currentPos());
        controller.addTween(bubblesHook, bubble7TxtIn, bubbleTxtInterval, adjCurrentPos(bubbleUpDur-bubbleTxtInterval/2));
        controller.addTween(bubblesHook, bubble6TxtOut, bubbleTxtInterval, adjCurrentPos(-bubbleTxtInterval/2));

        controller.addTween(bubblesHook, bubble8In, bubbleUpDur, custNextPos(1000));
        controller.addTween(bubblesHook, bubble4Out, bubbleUpDur, currentPos());
        controller.addTween(bubblesHook, bubble5Out, bubbleUpDur, currentPos());
        controller.addTween(bubblesHook, bubble6Up2, bubbleUpDur, currentPos());
        controller.addTween(bubblesHook, bubble7Up, bubbleUpDur, currentPos());
        controller.addTween(bubblesHook, bubble8TxtIn, bubbleTxtInterval, adjCurrentPos(bubbleUpDur-bubbleTxtInterval/2));
        controller.addTween(bubblesHook, bubble7TxtOut, bubbleTxtInterval, adjCurrentPos(-bubbleTxtInterval/2));

        controller.addTween(bubblesHook, bubble9In, bubbleUpDur, custNextPos(1000));
        controller.addTween(bubblesHook, bubble6Out, bubbleUpDur, currentPos());
        controller.addTween(bubblesHook, bubble7Out, bubbleUpDur, currentPos());
        controller.addTween(bubblesHook, bubble8Up, bubbleUpDur, currentPos());
        controller.addTween(bubblesHook, bubble9TxtIn, bubbleTxtInterval, adjCurrentPos(bubbleUpDur-bubbleTxtInterval/2));
        controller.addTween(bubblesHook, bubble8TxtOut, bubbleTxtInterval, adjCurrentPos(-bubbleTxtInterval/2));

        controller.addTween(bubblesHook, bubble8Out, bubbleUpDur, custNextPos(1000));
        controller.addTween(bubblesHook, bubble9Up, bubbleUpDur, currentPos());
        controller.addTween(bubblesHook, bubble10In, bubbleUpDur, currentPos());

        $('body').keyup(function (e) {
            if (13 == e.keyCode) {
                if (!autoScrolling) {
                    $.scrollTo($(document).height(), 2 * ($(document).height() - $(document).scrollTop()),
                        {onAfter: function() {autoScrolling = false;}});
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
            hash: true,
            onBefore: function(anchor, settings) {
                autoScrolling = false;
            },
            onAfter: function (anchor, settings) {
                autoScrolling = false;
            }
        });

        var $side_nav = $('#side-nav');

        var side_nav_targets = [];
        // store possible nav targets in array for easier searching
        $side_nav.find('a').each(function (index, anchor) {
            side_nav_targets.push(anchor.getAttribute('href'));
        });
        $('.nav-anchor').waypoint(function (direction) {
            $side_nav.find('a').removeClass('curr');

            if (direction === 'down') {
                $side_nav.find('a[href="#' + $(this).attr('id') + '"]').addClass('curr');
            } else {
                // find index in nav array of currently scrolled to target
                var cur_target_index = $.inArray('#' + $(this).attr('id'), side_nav_targets);

                // if there's a previous target, update the active navs
                if (cur_target_index > 0) {
                    $side_nav.find('a[href="' + side_nav_targets[cur_target_index - 1] + '"]').addClass('curr');
                }
            }
        });
    }
    /**
     * Handle page load
     */
    $(function () {
        initAnimations();
    });

})();