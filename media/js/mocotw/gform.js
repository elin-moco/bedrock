"use strict";
$(function(){
    $('#ss-form').attr('target','google_form');
    $('#ss-form br').remove();
    //$('#ss-form input[type=submit]').remove();
    //$('#ss-form').append('<input type="button" value="提交" id="send_form" name="submit"/>');
    $('#ss-form input[type=submit]').attr('id','send_form');
    $('div.ss-form-container').css('visibility','visible');
    
    $('#send_form').click(function(e){
      if(!check_required()){
        alert('請填寫完整資料!!');
        return false;
      }
      $('#hidden_frame iframe').load(function(){
        //alert('send!!!');
        $('.ss-form-container').html('');
        $('.hidden-back').css('display','inline-block');
      });
    });
    
    
});
  	  
function check_required(){
  var radio=true;
  var text=true
  var textarea=true;
  var checkbox=true;
  $('.ss-item-required input[type=text]').map(function(){
    if( $(this).val()=="" ){
      if ($(this).parent().attr('class')!="ss-choice-item"){
        $(this).parent().css('color','red');
        text= false;
        return false;
      }
    }
  });
  
  $('.ss-item-required textarea').map(function(){
    if( $(this).val()=="" ){
      $(this).parent().css('color','red');
      textarea=false;
      return false;
    }
  });
  
  $('.ss-item-required:not(.ss-checkbox) .ss-choices').each(function(i){
    if($(this).find('input[type="radio"]:checked').length==0){
      $(this).css('color','red');
      radio=false;
      return false;
    }
  });
  
   $('.ss-item-required:not(.ss-radio) .ss-choices').each(function(i){
    if($(this).find('input[type="checkbox"]:checked').length==0){
      $(this).css('color','red');
      checkbox=false;
      return false;
    }
  });
  
  return (radio&&text&&textarea&&checkbox);
}