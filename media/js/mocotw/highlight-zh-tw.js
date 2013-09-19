"use strict";

(function() {
    $('tr#zh-CN').prependTo('table.build-table > tbody');
    $('tr#zh-TW').prependTo('table.build-table > tbody');
    $('tr#zh-TW, tr#zh-TW th').css('font-weight', 'bold');
})();