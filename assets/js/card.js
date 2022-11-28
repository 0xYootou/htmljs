var actshow=false;
$(".act_text").click(function(){
  if(!actshow){
    $(".publish-inner").css("display","block").animate({
      height:110
    },300)
    actshow=true;
  }else{
    $(".publish-inner").animate({
      height:0
    },300,null,function(){
      $(".publish-inner").css("display","none")
      })
    actshow=false;
  }
});
$(".bao-action .comment").click(function(){
  $(".bao_comment",this.parentNode).removeClass("hidden").animate({height:110},300)
  var self=this;
  $.ajax({
    url:"/bao/list/"+$(this).attr("data-id"),
    type:"get",
    dataType:"json",
    data:{
    },
    success:function(data){
      if (data.success){
        $(".comment-list",self.parentNode).html(data.data)
        $(".bao_comment",self.parentNode).removeClass("hidden").animate({height:$(".bao_comment .wrapper",self.parentNode).height()},300)
      }else{
        messageTip.show(data.info)
      }
    },
    error:function(){
      
    }
  })
  });
  $(".bao-action .zan").click(function(){
  var self=this;
  $.ajax({
    url:"/bao/zan/"+$(this).attr("data-id"),
    type:"post",
    dataType:"json",
    data:{
    },
    success:function(data){
      if (data.success){
        $("em",self).html(data.data.zan_count)
         messageTip.show("成功")
      }else{
        messageTip.show(data.info)
      }
    },
    error:function(){
      
    }
  })
  });
$(".bao_comment_submit").click(function(){
  var self=this;
  $.ajax({
    url:"/bao/add",
    type:"post",
    dataType:"json",
    data:{
      content:$("#bao_content_"+$(this).attr("data-id")).val(),
      bao_id:$(this).attr("data-id")
    },
    success:function(data){
      if (data.success){
        $(self.parentNode.parentNode).animate(
        {height:0},300,null,
        function(){$(self.parentNode.parentNode).addClass("hidden")})
        messageTip.show("評論成功")
        $("#bao_content_"+$(self).attr("data-id")).val("")
      }else{
        messageTip.show(data.info)
      }
    },
    error:function(){
      
    }
  })
});
$("#publish_pic").change(function(){
  $.ajaxFileUpload({
    url:"/upload", 
    secureuri:false,
    fileElementId:'publish_pic',
    dataType: 'json',
    success: function (data, status)
    {
      if(data.success){
        $(".publish_pic").removeClass("hidden").attr("src","/uploads/"+data.data.filename)
        $(".publish-inner").css("display","block").animate({
          height:110
        },300)
        $("#publishform_pic").val("/uploads/"+data.data.filename)
      }else{
        messageTip.show(data.info)

      }
      loadingTip.hide()
    },
    error:function(){

      loadingTip.hide()
    }
  })
});