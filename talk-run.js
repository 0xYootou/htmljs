
require ("coffee-script");
require ("iced-coffee-script");
require ("./lib/functionLoader.coffee")
require ("./lib/modelLoader.coffee")
var checkUser = require("./utils/checkUserForIO.coffee")
var express        = require("express")
var app = express()
var uuid = require ("node-uuid")
var func_talk = __F ('talk/talk')
var func_user = __F ("user")
var pagedown = require("pagedown-htmljs")
var safeConverter = new pagedown.Converter()
var moment = require ("moment")
moment.lang('zh-cn');
global.xss = require('xss');
server = require('http').createServer(app)
io = require('socket.io').listen(server);
app.use("/assets", express.static(__dirname+"/assets"))
server.listen(__C.socket_port);
//维护所有的客户端连接和用户数据
var clients = {

}
var onlines = {


}
//每个客户端连接时进行根据cookie进行认证，成功后分配一个随机的id给客户端，之后客户端带着id来请求，错误的id不予回应和操作数据。
io.sockets.on('connection', function (socket) {
  socket.on('new-message', function (data) {
    var user = socket.handshake.user
    var html = safeConverter.makeHtml(data.content)
    func_talk.add({
      user_id:user.id,
      user_nick:user.nick,
      user_headpic:user.head_pic,
      md:data.content,
      html:html,
      time:new Date().getTime()
    },function(error,talk){
      if(talk){
        talk.time = moment(talk.time).format("MM-DD hh:mm")
        socket.broadcast.emit('new-message', {talk:talk});
        socket.emit('new-message', {talk:talk});
        if(atnames = data.content.match(/\@([^\s]*)/g)){
          atcount = atnames.length
          html = html
          atnames.forEach(function(atname){
            atname = atname.replace("@","")
            func_user.getByNick(atname,function(error,u){
              atcount--
              if(u){
                html = html.replace("@"+atname,"<a href='/user/"+u.id+"'>@"+atname+"</a>")
                if(atcount==0)
                  func_talk.update(talk.id,{html:html})
                if(onlines[u.id]){
                  var client_id = onlines[u.id].client_id
                if(io.connected[client_id])
                  io.sockets.sockets[client_id].emit('alert',{sender:user.nick});
                }
                
              }
            })
          })
        }
      }
    })
  });
  socket.on("disconnect",function(){
    var user = socket.handshake.user
    var talk = {
      user_id:0,
      user_nick:"系统消息",
      user_headpic:"",
      md:user.nick+" 离开了聊天",
      html:"<a href=/user/"+user.id+">"+user.nick+"</a> 离开了聊天",
      time:moment().format("MM-DD hh:mm"),
      client_id:socket.id
    }
    delete onlines[user.id]
    socket.broadcast.emit('new-message', {talk:talk,onlines:onlines});
  })
  var user = socket.handshake.user
  var talk = {
    user_id:0,
    user_nick:"系统消息",
    user_headpic:"",
    md:user.nick+" 加入了聊天",
    html:"<a href=/user/"+user.id+">"+user.nick+"</a> 加入了聊天",
    time:moment().format("MM-DD hh:mm")
  }
  onlines[user.id] = {
    user_id:user.id,
    user_nick:user.nick,
    user_headpic:user.head_pic,
    client_id:socket.id
  }
  socket.broadcast.emit('new-message', {talk:talk,onlines:onlines});
  socket.emit('new-message', {talk:talk,onlines:onlines});
});
io.configure(function (){
  io.set('authorization', function (handshakeData, callback) {
    checkUser(handshakeData.headers.cookie,function(error,user){
      if(error){
        callback(error.message,false);
      }else{
        handshakeData.user = user
        callback(null,true)
      }
    })
  });
});