;(function($) {
  'use strict';

  var $video = $('#firstrun-video');

  var gaq_track = function(category, action, label) {
    if (window._gaq) {
      window._gaq.push(['_trackEvent', category, action, label]);
    }
  };

  // delay redirect so GA tracking has time to fire
  var track_and_redirect = function(category, action, label, url) {
    gaq_track(category, action, label);

    setTimeout(function() {
      window.location.href = url;
    }, 500);
  };

  // GA tracking
  $('a.featurelink').on('click', function(e) {
    e.preventDefault();
    track_and_redirect('first run interaction', 'click', $(this).attr('href'), $(this).attr('href'));
  });

  $('.social a').on('click', function(e) {
    e.preventDefault();
    track_and_redirect('social interaction', 'click', $(this).attr('class'), $(this).attr('href'));
  });

  $video.on('play', function() {
    gaTrack(['_trackEvent', 'first run interaction', 'play', 'First Run Video']);
  }).on('pause', function() {
    // is video over?
    // 'pause' event fires just before 'ended', so
    // using 'ended' results in extra pause tracking.
    var action = ($video[0].currentTime === $video[0].duration) ? 'finish' : 'pause';

    gaTrack(['_trackEvent', 'first run interaction', action, 'First Run Video']);
  });
})(window.jQuery);