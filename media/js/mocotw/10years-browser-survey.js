"use strict";

$.fn.countInt = function(duration, from) {
    var $list = $(this);
    var $elems = [];
    from = typeof from !== 'undefined' ? from : 0;
    duration = typeof duration !== 'undefined' ? duration : 1000;

    $list.each(function() {
        var $this = $(this);
        $elems.push($this);
        var to = $this.text();
        $this.text(from);
        $this.start = function() {
            var stime = new Date().getTime();
            function step() {
                var now = new Date().getTime();
                var progress = now - stime;
                var oldValue = $this.text();
                var value = (to - from) * progress / duration;
                if (Math.abs(value - oldValue) >= 1) {
                    $this.text(Math.floor(value));
                }
                if (progress <= duration) {
                    requestAnimationFrame(step);
                }
                else {
                    requestAnimationFrame(function() {
                        $this.text(to);
                    });
                }
            }
            requestAnimationFrame(step);
            return $this;
        };
        return $this;
    });
    $list.start = function() {
        for (var i = 0; i < $elems.length; i++) {
            $elems[i].start();
        }
    };
    return $list;
};

$.fn.fillCircle = function(duration) {
    var $list = $(this);
    var $elems = [];
    duration = typeof duration !== 'undefined' ? duration : 1000;

    $list.each(function() {
        var $this = $(this);
        $elems.push($this);
        var data_from = $this.attr('data-from');
        var data_to = $this.attr('data-to');
        var from = typeof data_from !== 'undefined' ? data_from : 0;
        var to = typeof data_to !== 'undefined' ? data_to : 100;
        $this.text(from);
        $this.start = function() {
            var i = 0;
            var startAngle = -100;
            var fullAngle = 360;
            var fromAngle = startAngle + from * fullAngle / 100;
            var toAngle = startAngle + to * fullAngle / 100;
            var radius = 100;
            var stime = new Date().getTime();
            function step() {
                var now = new Date().getTime();
                var progress = now - stime;
                var angle = Math.floor(fromAngle + (toAngle - fromAngle) * progress / duration);
                var radians= (angle/180) * Math.PI;
                var x = 200 + Math.cos(radians) * radius;
                var y = 200 + Math.sin(radians) * radius;
                var e = $this.attr("d");
                var d;
                if (i==0) {
                    d = e+ " M "+x + " " + y;
                }
                else {
                    d = e+ " L "+x + " " + y;
                }
                if (e != d) {
                    $this.attr("d", d);
                    i++;
                }
                if (progress <= duration) {
                    requestAnimationFrame(step);
                }
                else {
                    requestAnimationFrame(function() {
                        radians= (toAngle/180) * Math.PI;
                        x = 200 + Math.cos(radians) * radius;
                        y = 200 + Math.sin(radians) * radius;
                        d = e+ " L "+x + " " + y;
                        $this.attr("d", d);
                    });
                }
            }
            requestAnimationFrame(step);
            return $this;
        };
        return $this;
    });
    $list.start = function() {
        for (var i = 0; i < $elems.length; i++) {
            $elems[i].start();
        }
    };
    return $list;
};

$.fn.takeTurns = function(interval, clazz) {
    var $list = $(this);
    var i = 0;
    function turn() {
        $($list.get(i)).addClass(clazz);
        i++;
        if (i < $list.size()) {
            setTimeout(turn, interval);
        }
    }
    setTimeout(turn, interval);
    return $list;
};

$(function() {
    initResult();
    function initResult() {
        var $html = $('html');
        if (document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#AnimationEventsAttribute", "1.0") && Modernizr.cssanimations) {
            var pplCounter = $('.people .number').countInt();
            $('.people .number').waypoint(function() {
                pplCounter.start();
            }, {triggerOnce: true, offset: 'bottom-in-view'});

            $('.mass').waypoint(function() {
                $('.ppl').takeTurns(50, 'grown');
            }, {triggerOnce: true, offset: 'bottom-in-view'});

            var behaviorsCounter = $('.behaviors .number').countInt();
            $('.behaviors').waypoint(function(direction) {
                behaviorsCounter.start();
            }, {triggerOnce: true, offset: 'bottom-in-view'});

            var avgRatingCounter = $('.avg-rating .number').countInt();
            var avgRatingCircle = $('.avg-rating .arc').fillCircle();
            $('.avg-rating').waypoint(function(direction) {
                avgRatingCounter.start();
                avgRatingCircle.start();
            }, {triggerOnce: true, offset: 'bottom-in-view'});

            var avgUserRatingCounter = $('.avg-user-rating .number').countInt();
            var avgUserRatingCircle = $('.avg-user-rating .arc').fillCircle();
            $('.avg-user-rating').waypoint(function(direction) {
                avgUserRatingCounter.start();
                avgUserRatingCircle.start();
            }, {triggerOnce: true, offset: 'bottom-in-view'});

            $('.characteristics').waypoint(function(direction) {
                $(this).addClass('analyze');
            }, {triggerOnce: true, offset: 'bottom-in-view'});

            var readingRatingCounter = $('.reading-rating .number').countInt(500);
            $('.reading-rating').waypoint(function(direction) {
                readingRatingCounter.start();
            }, {triggerOnce: true, offset: 'bottom-in-view'});

            var debugWireCounter = $('.debug-wire .number').countInt();
            $('.debug-wire').waypoint(function(direction) {
                debugWireCounter.start();
            }, {triggerOnce: true, offset: 'bottom-in-view'});
        }
        else {
            $html.addClass('no-animations');
        }
    }
    function initSurvey() {
        var q_fx_user = $('.ss-question-list > .errorbox-good').slice(27, 38);
        var q_non_fx_user = $('.ss-question-list > .errorbox-good').slice(38, 40);
        var q_email = $('.ss-question-list > .ss-form-question').slice(29, 30);
        var email_field = q_email.find('input');
        var subscribe = $('#group_444006501_1');
        var send_button = $('#send_form');
        q_fx_user.hide();
        q_email.css('border-bottom', 'none');
        email_field.attr('required', true);
        email_field.attr('pattern', '^[_A-z0-9-]+(\\.[_A-z0-9-]+)*@[A-z0-9-]+(\\.[A-z0-9-]+)*(\\.[A-z]{2,4})$');
        subscribe.attr('checked', true);
        send_button.addClass('button');
        send_button.val('送出');

        $('.ss-image').each(function(index, element) {
            var image = $(element);
            var new_parent = image.closest('.errorbox-good').find('+ .ss-form-question .ss-q-item-label');
            image.prependTo(new_parent);
        });
        $('.ss-q-item-label').each(function(index, element) {
            var $elem = $(element);
            if ($.trim($elem.text()) == '') {
                $elem.remove();
            }
        });
        $('#entry_73997712 input').change(function() {
            if ($(this).val() > 1) {
                q_fx_user.show();
                q_non_fx_user.hide();
            }
            else {
                q_fx_user.hide();
                q_non_fx_user.show();
            }
        });

        $('[role=radiogroup]').each(function(index, elem) {
            $(elem).find('input:eq(0):visible').attr('required', true);
        });
        $('#ss-form').submit(function(e) {
            var checkboxes = $('[role=group]:eq(0) input:eq(0)');
            if ($('[role=group]:eq(0) input:checked').length == 0) {
                e.preventDefault();
                checkboxes.focus();
                alert('請至少選擇一項');
            }
        });
    }
});
