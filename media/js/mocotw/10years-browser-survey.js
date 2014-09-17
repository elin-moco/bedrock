"use strict";

$(function(){
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
});
