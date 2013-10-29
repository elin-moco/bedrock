"use strict";
$(function () {
    var target='#home-news > ul';
	var rule='tag='+$(target).attr('class');
//	var words=parseInt($(target+' input[name="words"]').val());
    var words = 0;
	if(words<0){
		words=60;
	}
	techjson("get_tag_post",rule,5,words,target);

    getLatestEvents();
});

function techjson (type,rule,count,words,target){
  var techUrl='//tech.mozilla.com.tw/api/get_recent_posts/?count=1';
  $.when(
    $.ajax({
    type: "GET",
    url: techUrl,
    dataType: "jsonp"})

  ).done(function(results){
    var tech_reuslt;
    tech_reuslt = results;
    wpJson("get_tag_post", rule, 5, words, target, tech_reuslt)
  });
  /*
  $.ajax({
    type: "GET",
    url: techUrl,
    dataType: "jsonp",
    success: function(results){
      var tech_reuslt;
      tech_reuslt = results;
      wpJson("get_tag_post", rule, 5, words, target, tech_reuslt)
    }
  });
  */
}
function wpJson(type,rule,count,words,target,tech_reuslt){

	var blogUrl="//blog.mozilla.com.tw/api/get_recent_posts?count=4";
	//var json_url=blogUrl+"api/"+type+"?"+rule+"&count="+count;
	var items = [];
	$.ajax({
    type: "GET",
    url: blogUrl,
    dataType: "jsonp",
    success: function(results){
        var tech_info_date=tech_reuslt.posts[0].date.split(" ");
        tech_reuslt.posts[0].used=0; // init tech used
        var techDate = new Date(tech_info_date[0]);
        var postsINFO=results.posts;  //excerpt
        if(words==0){
        	//items.push('<li><a href="http://www.techbang.com/posts/9783-prior-to-the-gsma-b2g-again-exposed" target="_blank">採訪：	Mozilla 手機再次曝光，免費B2G系統實際玩</a></li>');
					var date_INFO="";
					var ci=0;
        	$.each(postsINFO, function(key, val) {
        	  if(ci<5){
        	    date_INFO=val.date.split(" ");
        	    var blogdate= new Date(date_INFO[0]);
        	    //console.log((blogdate-techDate)+":"+techDate+":"+blogdate);
        	    if((blogdate-techDate)<0&&tech_reuslt.posts[0].used==0){
        	      items.push('<li><p>'+tech_info_date[0].replace(/\-/g, '/')+'</p><h4><a href="'+tech_reuslt.posts[0].url+'">【謀智台客】' + tech_reuslt.posts[0].title+'</a></h4></li>');
        	      tech_reuslt.posts[0].used=1;
        	      if(ci<4){
        	        items.push('<li><p>'+date_INFO[0].replace(/\-/g, '/')+'</p><h4><a href="'+val.url+'">' + val.title+'</a></h4></li>');
        	        ci+=1;
        	      }
        	    }else{
        	      items.push('<li><p>'+date_INFO[0].replace(/\-/g, '/')+'</p><h4><a href="'+val.url+'">' + val.title+'</a></h4></li>');
        	    }
        	  }
        	  ci+=1;
					});
        }else{
					$.each(postsINFO, function(key, val) {
						items.push('<li><h4><a href="'+val.url+'">' + val.title+'</a></h4><p>'+val.excerpt.substring(0,words)+'&nbsp;&nbsp;.....<a href="'+val.url+'">深入閱讀</a></p></li>');
					});
				}
				$('<ul/>', {
					id:'blogul',
					html: items.join('')
				}).appendTo(target);
				//$(target).append('<a id="more-rule" href="'+blogUrl+'main/">查閱所有消息</a>');
    },
    error: function(XMLHttpRequest, textStatus, errorThrown){
        //alert("Error");
    }
	});
}

function wpfn_event(results) {
    var postsINFO = results.post;  //excerpt
    var resulthtml = "";
    if (results.status === "ok") {
        $.each(postsINFO, function (key, val) {
            resulthtml = resulthtml + '<li><p>' + val.date + '</p><h4><a href="' + val.permalink + '">' + val.title + '</a></h4></li>';
        });
    }
    $('#home-promos > ul').html(resulthtml);
}

function getLatestEvents() {
    var blogUrl = "//blog.mozilla.com.tw/";
    var json_url = blogUrl + "comm-json?type=eventmulti&icount=5";
    $.ajax({
        type: "GET",
        url: json_url,
        dataType: "jsonp",
        success: wpfn_event
    });
}
