"use strict";

$.fn.hoverPulse = function(params) {
    if (params == undefined) {
        params = {};
    }
    var canvas = this.get(0);
    if (!canvas) {
        return;
    }
    var context = canvas.getContext('2d');
    context.lineWidth=2;
    context.strokeStyle = '#000000';

    if (params.color) {
        context.strokeStyle = params.color;
    }

    var maxOffsetX = 12;
    var maxOffsetY = 12;
    var initAlter = 1;
    if (params.lineWidth) {
        context.lineWidth=params.lineWidth;
    }
    if (params.maxOffsetX) {
        maxOffsetX = params.maxOffsetX;
    }
    if (params.maxOffsetY) {
        maxOffsetY = params.maxOffsetY;
    }

    var randomOffset = function() {
        return {x: Math.random()*maxOffsetX, y: Math.random()*maxOffsetY};
    };

    var drawPulse = function(alt) {
        context.clearRect(0, 0, canvas.width, canvas.height);

        var currentX = 0;
        context.restore();
        context.beginPath();
        context.moveTo(0, canvas.height/2);
        while(true) {
            if (0 == currentX) {
                context.lineTo(currentX += randomOffset().x, canvas.height/2);
            }
            else if (canvas.width - currentX < maxOffsetX*1.5) {
                context.lineTo(canvas.width - randomOffset().x, canvas.height/2);
                context.lineTo(canvas.width, canvas.height/2);
                break;
            }
            else {
                context.lineTo(currentX += randomOffset().x, canvas.height/2 + alt*randomOffset().y);
                alt *= -1;
            }
        }
        context.lineJoin = 'miter';
        context.stroke();
    };

    var intervalId;

    canvas.addEventListener('mouseover', function() {
        intervalId = setInterval(function() {
            drawPulse(initAlter);
            initAlter *= -1;
        }, 100);
    });
    canvas.addEventListener('mouseout', function() {
        if (intervalId != undefined) {
            clearInterval(intervalId);
            context.clearRect(0, 0, canvas.width, canvas.height);
        }
    });
};

$(function(){
    $('#banners').owlCarousel({
        itemsCustom: [[0, 1]],
        stopOnHover: true,
        autoPlay: true
    });
//	$('#pulse').hoverPulse({maxOffsetX: 20, maxOffsetY: 24, lineWidth: 3});
});
