"use strict";

$(function(){

    var API_URL = 'https://firefox.club.tw/campaign/10years/firefox-family-award/';
    var TICKET_BASE_URL = 'http://' + window.location.hostname + '/media/img/mocotw/10years/fx-day/tickets/';
    var mapUpdated = false;

    $('#tab-location').change(function() {
        var $loc = $(this);
        if ($loc.is(':checked') && !mapUpdated) {
            var $map = $('.tabs iframe');
            $map.attr('src', $map.attr('src'));
            mapUpdated = true;
        }
    });

    function showLoginBox() {
        $('.loginBox').show();
        $('.loginBox iframe').attr('src', API_URL);
    }

    function showTicketBox() {
        $('.ticketBox').show();
    }

    function getTicket(day) {
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
                else if (ticket.result == 'ended') {
                    alert('活動已結束。');
                }
                else {
                    alert('抱歉，取票時發生錯誤。');
                }
            }
        });
    }

    $('.event .join:not(.disabled), .event .early-join').click(function() {
        showLoginBox();
    });

    $('.loginBox, .ticketBox').click(function(e) {
        if (e.target == this) {
            $(this).hide();
        }
    });
    $('.ticketBox .close').click(function() {
        $('.ticketBox').hide();
    });
    var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
    var eventer = window[eventMethod];
    var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

    // Listen to message from child window
    eventer(messageEvent,function(e) {
        //run function//
        if (e.data == 'login=success') {
            $('.loginBox').hide();
            showTicketBox();
        }
    },false);
    $('.get-ticket .day1').click(function() {
        getTicket(1);
    });
    $('.get-ticket .day2').click(function() {
        getTicket(2);
    });

});
