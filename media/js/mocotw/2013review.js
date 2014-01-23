"use strict";

(function () {
    $('#review-video img').click(function() {
        $(this).hide();
        $(this).find('~ .play').hide();
        var $video = $(this).find('+ iframe');
        $video.attr('src', '//www.youtube.com/embed/2JC7bS5Nlrs?rel=0&autoplay=1');
        $video.show();
    });
})();