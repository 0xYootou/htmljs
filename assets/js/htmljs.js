var HtmlJS =HtmlJS||{};
HtmlJS.util = function(){
  return {
    loginback:null,
    logincallback:function(){
      $("#login_iframe").css({display:"none"});
      $("#login_layer").css({display:"none"});
      HtmlJS.util.loginback&&HtmlJS.util.loginback();
    },
    ajax:function(url,data,type,success,error,btn,loginback){
      if(btn){
        btn.prop("disabled",true);
        btn.attr("data-text",btn.html()).html("提交中...")
      }
      $.ajax({
        url:url,
        data:data,
        dataType:"json",
        type:type,
        success:function(data){
          if(btn){
            btn.prop("disabled",false);
            btn.html(btn.attr("data-text"))
          }
          if(data.isnotlogin){
              document.domain="html-js.com"
              alert("此操作需要登录，登录后会继续提交")
                ///window.location.href='/user/login?redirect='+encodeURIComponent(window.location.href)
                HtmlJS.util.loginback = loginback
                if($("#login_iframe").length){
                  $("#login_iframe").css({
                    left:$(window).width()/2-300,
                    display:"block"
                  })
                  $("#login_layer").css({
                    width:$("body").width(),
                    height:$("body").height(),
                    display:"block"
                  })
                }else{
                  var loginIframe = document.createElement("iframe");
                  $(loginIframe).css({
                    left:$(window).width()/2-300
                  })
                  loginIframe.src="/user/login?mini=1"
                  loginIframe.className = "login_iframe"
                  loginIframe.id = "login_iframe"
                  var loginLayer = document.createElement("div");
                  $(loginLayer).css({
                    width:$("body").width(),
                    height:$("body").height()
                  })
                  loginLayer.className = "login_layer"
                  loginLayer.id = "login_layer"
                  loginLayer.onclick=function(){
                    loginIframe.style.display="none"
                    loginLayer.style.display="none"
                  }
                  document.body.appendChild(loginLayer)
                  document.body.appendChild(loginIframe)
                }
            }else {
              success(data)
            }
        },
        error:function(e){
          if(btn){
            btn.prop("disabled",false);
            btn.html(btn.attr("data-text"))
          }
          error(e);
        }
      })
    }
  }
}();

// $(document).ready(function(){
//   $(".new-function").each(function(i,div){
//     $(div).append($("<span class='label label-danger new-function-label' data-original-title='"+$(div).attr("data-t")+"'>New!<i></i></span>").tooltip({placement:"bottom"}))
//   });
// // 获取一个元素的所有css属性的patch, $(el).css()
//         jQuery.fn.css2 = jQuery.fn.css;
//         jQuery.fn.css = function() {
//             if (arguments.length) return jQuery.fn.css2.apply(this, arguments);
//             var attr = ['font-family','font-size','font-weight','font-style','color',
//                 'text-transform','text-decoration','letter-spacing', 'box-shadow',
//                 'line-height','text-align','vertical-align','direction','background-color',
//                 'background-image','background-repeat','background-position',
//                 'background-attachment','opacity','width','height','top','right','bottom',
//                 'left','margin-top','margin-right','margin-bottom','margin-left',
//                 'padding-top','padding-right','padding-bottom','padding-left',
//                 'border-top-width','border-right-width','border-bottom-width',
//                 'border-left-width','border-top-color','border-right-color',
//                 'border-bottom-color','border-left-color','border-top-style',
//                 'border-right-style','border-bottom-style','border-left-style','position',
//                 'display','visibility','z-index','overflow-x','overflow-y','white-space',
//                 'clip','float','clear','cursor','list-style-image','list-style-position',
//                 'list-style-type','marker-offset'];
//             var len = attr.length, obj = {};
//             for (var i = 0; i < len; i++) 
//                 obj[attr[i]] = jQuery.fn.css2.call(this, attr[i]);
//             return obj;
//         };
// $('textarea.expand').keyup(function () {
//           var t = $(this);
//           if($(this).hasClass("fullscreen-textarea")) return;
//           if (!this.justifyDoc) {
//               this.justifyDoc = $(document.createElement('div'));

//               // copy css
//               this.justifyDoc.css(t.css()).css({
//                   'display'   :   'none',        // you can change to none
//                   'word-wrap' :   'break-word',
//                   'min-height':   t.height(),
//                   'height'    :   'auto'
//               }).insertAfter(t.css('overflow-y', 'hidden'));
//           }

//           var html = t.val().replace(/&/g, '&amp;')
//               .replace(/</g, '&lt;')
//               .replace(/>/g, '&gt;')
//               .replace(/'/g, '&#039;')
//               .replace(/"/g, '&quot;')
//               .replace(/ /g, '&nbsp;')
//               .replace(/((&nbsp;)*)&nbsp;/g, '$1 ')
//               .replace(/\n/g, '<br />')
//               .replace(/<br \/>[ ]*$/, '<br />-')
//               .replace(/<br \/> /g, '<br />&nbsp;')+"<br/><br/><br/><br/><br/>";

//           this.justifyDoc.html(html);
//           t.height(this.justifyDoc.height());
//       });
// });
$(document).ready(function(){
  if($(window).width()>700&&$('#fixed-modules').length){
     var offset = $('#fixed-modules').offset();
          $(window).scroll(function(){
            var scrollTop = $(window).scrollTop();
            if (offset.top < scrollTop+40) 
              $('#fixed-modules').addClass('fixed').css({
              position:"fixed",top:0
              });
            else $('#fixed-modules').removeClass('fixed').css({
              position:"relative",top:0
            });
            if($('#fixed-modules').height()+$('#fixed-modules').offset().top>$("#footer").offset().top+60){
              $('#fixed-modules').css({position:"absolute",top:$("#content").height()-$('#fixed-modules').height()+60})
            }
          });
  }
 $("#gotop").click(function(){
    $("html,body").animate({scrollTop:0})
    })
 $(".history-trigger").click(function(){
  if($(".history-list").hasClass("hidden")){
    $.ajax({
      url:"/user/bihis",
      dataType:"json",
      type:"get",
      success:function(hises){
        $(".history-list").html("")
        hises.data.forEach(function(his){
          $(".history-list").append("<li>"+(his.from_title?("<div class=title>"+his.from_title+"</div>"):"")
            +"<div class=desc>"+his.from_user_nick+" "+his.reason+" "+his.count+"炖币</div></li>")
        })
        $(".history-list").removeClass("hidden")
      }
    })
  }
 })
});

