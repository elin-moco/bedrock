"use strict";

(function () {
    $('#review-video img').click(function() {
        $(this).hide();
        $(this).find('~ .play').hide();
        var $video = $(this).find('+ iframe');
        $video.attr('src', '//www.youtube.com/embed/2JC7bS5Nlrs?rel=0&autoplay=1');
        $video.show();
    });
    $('#spring-couplets .spring').click(function(e) {
        if (e.target==this) {
            page('/2013-review/'+this.id+'/');
        }
    });
    $('#spring-content .share-button').click(function(e) {
        e.preventDefault();
        var $spring = $(this).parent();
        if ($spring.attr('id')=='popup') {
            $spring = $('#'+$(this).attr('name'));
        }
        var $download = $spring.find('.download-button');
        if (FB) {
            FB.ui({
              method: 'feed',
              link: window.location.origin+'/2013-review/'+$spring.attr('id')+'/',
              name: $spring.attr('data-name'),
              picture: window.location.origin+$download.attr('href'),
              description: '請加入 Mozilla Taiwan 粉絲團！',
              caption: 'Firefox 春聯 - 祝您馬年行大運'
            }, function(response){
            });
        }
    });
    $('#popup').click(function(e) {
        if (e.target==this) {
            page('/2013-review/');
        }
    });
    var hidePopup = function(ctx, next) {
        $('#popup').hide();
    };
    var showPopup = function(ctx, next) {
        var $download = $('#download-'+ctx.params.spring);
        var file = $download.attr('download');
        var src = $download.attr('href');
        if (src) {
            var $popup = $('#popup');
            var $spring = $popup.find('#spring-full').attr('src', '');
            $spring.attr('src', src);
            var $downloadFull = $popup.find('#download-full');
            $downloadFull.attr('href', src);
            $downloadFull.attr('download', file);
            $popup.find('#share-full').attr('name', ctx.params.spring);
            $popup.show();
        }
        else {
            window.location.href = '/2013-review/';
        }
    };
    page('/2013-review/', hidePopup);
    page('/2013-review/:spring/', showPopup);
    page();
})();
