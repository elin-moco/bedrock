"use strict";

var os = getParameterByName('os');
var install = getParameterByName('install');

var PLATFORM_OTHER    = 0;
var PLATFORM_WINDOWS  = 1;
var PLATFORM_LINUX    = 2;
var PLATFORM_MACOSX   = 3;
var PLATFORM_MAC      = 4;
var PLATFORM_ANDROID  = 5;

var currentLabel = '<br>(目前選擇)';
var currentLabelTag = '<span class="currentDownload">(目前選擇版本)</span>'
var gPlatform = PLATFORM_WINDOWS;
if (os == "") {
  currentLabel = '<br>(系統偵測)';
var currentLabelTag = '<span class="currentDownload">(系統偵測版本)</span>'
  if (navigator.platform.indexOf("Win32") != -1 || navigator.platform.indexOf("Win64") != -1)
    gPlatform = PLATFORM_WINDOWS;
  else if (navigator.platform.indexOf("armv7l") != -1)
    gPlatform = PLATFORM_ANDROID;
  else if (navigator.platform.indexOf("x86_64") != -1)
    gPlatform = PLATFORM_LINUX, install = "64bit";
  else if (navigator.platform.indexOf("Linux") != -1)
    gPlatform = PLATFORM_LINUX;
  else if (navigator.userAgent.indexOf("Mac OS X") != -1)
    gPlatform = PLATFORM_MACOSX;
  else if (navigator.userAgent.indexOf("MSIE 5.2") != -1)
    gPlatform = PLATFORM_MACOSX;
  else if (navigator.platform.indexOf("Mac") != -1)
    gPlatform = PLATFORM_MAC;
  else
    gPlatform = PLATFORM_OTHER;
}
else if (os == "win") {
  gPlatform = PLATFORM_WINDOWS;
}
else if (os == "osx") {
  gPlatform = PLATFORM_MACOSX;
}
else if (os == "linux") {
  gPlatform = PLATFORM_LINUX;
}
else if (os == "android") {
  gPlatform = PLATFORM_ANDROID;
}

if (install == "") {
  if (gPlatform == PLATFORM_WINDOWS) {
    install = "express";
  }
  else if (gPlatform == PLATFORM_LINUX) {
    install = "32bit";
  }
}
else if (gPlatform == PLATFORM_WINDOWS && install != "express" && install != "full") {
  install = "express";
}
else if (gPlatform == PLATFORM_LINUX && install != "32bit" && install != "64bit") {
  install = "32bit";
}

$(function(){
  $(window).load(function(){
    var currentDownloadUrl = "";
    var downloadButton = "";
    switch(gPlatform) {
      case PLATFORM_WINDOWS:
        downloadButton = $('.download-button .os_windows');
        $('li.win-'+install).append(currentLabelTag);
        break;
      case PLATFORM_MACOSX:
        downloadButton = $('.download-button .os_osx');
        $('li.osx').append(currentLabelTag);
        break;
      case PLATFORM_LINUX:
        downloadButton = $('.download-button .os_linux');
        $('li.linux-'+install).append(currentLabelTag);
        break;
      case PLATFORM_ANDROID:
        downloadButton = $('.download-button .os_android');
        break;
      case PLATFORM_MAC:
      case PLATFORM_OTHER:
        $('.other .download-list').show();
        break;
    }
    downloadButton.find('span.download-platform').append(currentLabel);
    currentDownloadUrl = downloadButton.show().find('a.download-link').attr('href');
    $('.download').hide();
    if(gPlatform==3){
      $('#mac-steps').show();
      startDownload($('#mac-download').attr('href'));
    }else{
      $('#default-steps').show();
      if (currentDownloadUrl != "") {
        $('#default-download').attr('href', currentDownloadUrl);
      }
      startDownload($('#default-download').attr('href'));
    }
  });
});

function startDownload(download_url){
  // $(window).scrollTop(400);
  setTimeout(function() {
    window.location = download_url;
  }, 1000);
}