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
            window.location.href = $(this).attr('data-href');
        }
    });
    $('#spring-couplets .share-button').click(function(e) {
        e.preventDefault();
        var $spring = $(this).parent();
        if (FB) {
            FB.ui({
              method: 'feed',
              link: $spring.attr('data-href'),
              'name': $spring.attr('data-name'),
              'description': '請加入 Mozilla Taiwan 粉絲團！',
              caption: 'Firefox 春聯 - 祝您馬年行大運'
            }, function(response){
            });
        }
    });
})();