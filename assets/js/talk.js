var Notify = function(){}
//判断是否支持webkitNotifications
Notify.prototype.isSupport = function(){
    return !!window.webkitNotifications;
}
//需要向用户申请权限来确定是否支持webkitNotifications，如果得到权限，就会执行callback，参数为true.
Notify.prototype.getPermission = function(callback){
    try {
        window.webkitNotifications.requestPermission(function () {
            if (callback) {
                callback(this.checkPermission());
            }
        });
        Notification.requestPermission();
    }catch(e){

    }
}
//查看是否得到权限
Notify.prototype.checkPermission = function(){
    return !!(window.webkitNotifications.checkPermission() == 0);
}
//声明一个webkitNotifications实例，并且使用show方法触发桌面提示框
Notify.prototype.show = function(icon, title, body){
    //声明webkitNotifications实例
    try{

        var _notify = window.webkitNotifications.createNotification(icon, title, body);
        _notify.show();

    }catch(e){

    }
    try{
        var no = new Notification("前端乱炖通知", {
            title: title,
            body: body,
            tag:"m1",
            icon:"http://htmljs.b0.upaiyun.com//images/logo.png?123",
        });
        setTimeout(function(){
            no.close()
        },2500)
    }catch(e){

    }

}
    var notify = new Notify();
    if (notify.isSupport()) {
        notify.getPermission();
    }


$("#status").html("正在连接聊天服务器中。。。")
    var uuid = null;
    var talk_tpl = $("#talk-tpl").html()
    var user_tpl = $("#user-tpl").html()
    var socket = io.connect('http://talk.html-js.com',{port:8765});
    socket.on('connected', function (data) {
      console.log("connected");
      socket.emit('get-uuid',{id:"dd"});
    });
    socket.on("new-message",function(data){
        if(data.talk.user_id!=user_id){
            notify.show("", "前端乱炖新消息", data.talk.user_nick+"："+data.talk.html.replace(/<[^>]*?>/g,""))
        }

      var m = $(Mustache.render(talk_tpl,data.talk));
      $("#message-list").prepend(m)
      $(".message").removeClass("shan")
      m.addClass("shan")
      renderUser(data.onlines)
    })
    socket.on("alert",function(data){
      notify.show("", "前端乱炖实时讨论", data.sender+" 刚刚at了你")
    })
    socket.socket.on("error",function(data){
      console.log("error:"+data)
      $("#status").html("连接失败，是否已经登录？<a href='/user/login'>点击登录</a>")
    })
    socket.socket.on("connect",function(data){
      $("#status").html("连接成功")
    })
    $("#submit").on("click",function(){
      if($("#wmd-input").val().replace(/\s/g,"")==""){
          alert("不能发送空消息")
          return;
        }
      socket.emit('new-message', { content:$("#wmd-input").val()});
      $("#wmd-input").val("")
    })
    $(document.body).on("keydown",function(e){

      if (e.ctrlKey && e.keyCode == 13) {
        e.preventDefault();
        if($("#wmd-input").val().replace(/\s/g,"")==""){
          alert("不能发送空消息")
          return;
        }
        socket.emit('new-message', { content:$("#wmd-input").val()});
      $("#wmd-input").val("")

      }
    })


    var renderUser = function(onlines){
      console.log(onlines)
      if (!onlines) return;
      $("#user-list").html("")
      var html = "";
      for(var i in onlines){
        if(onlines[i]){
           html+= Mustache.render(user_tpl,onlines[i]);
        }
      }
      $("#user-list").html(html)
     
    }
    $("#user-list").on("click",function(e){
      e.preventDefault();
      if($(e.target).closest(".user").length){
         $("#wmd-input").val("@"+$(e.target).closest(".user").attr("data-nick")+" ").focus()
      $("#wmd-input")[0].setSelectionRange($("#wmd-input")[0].value.length, $("#wmd-input")[0].value.length)
      }
     
      
    })