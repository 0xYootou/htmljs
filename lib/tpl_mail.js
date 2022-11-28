var https = require('https');
var qs =require('querystring');
var url = require('url');
var config = require ("./../config.coffee");
var request = require ("request");
var _ = require("underscore")
var SendCloud = function(_config,cb){
  var params = {
    api_key  : config.mail.api_key,
    api_user : config.mail.api_user, 
    from     : config.mail.from, 
    fromname : config.mail.fromname,
    template_invoke_name :"",
    substitution_vars:"",
    to       : 'xinyu198736@gmail.com',
    subject  : 'SendCloud Node.js 测试主题', 
    html     : '欢迎使用<a href="http://sendcloud.sohu.com">SendCloud<a>'
  }; 
  
  // if(params.to.indexOf(",") != -1){
  //   params.api_user = config.mail.api_user_list
  //   params.api_key= config.mail.api_key_list
  //   params.use_maillist= "false"
  // }
    for(var i in _config){
    params[i]=_config[i]
  }
  request.post({url:"https://sendcloud.sohu.com/webapi/mail.send_template.json",form:params},function(e,r,content){
    console.log(content)
    if(cb) cb();
  })
}
module.exports = SendCloud;

// var content= qs.stringify(params);

// var options={
//    host : 'sendcloud.sohu.com',
//    port : 443,
//    path : '/webapi/mail.send.json',
//    method:'POST',
//    headers:{
//       'Content-Type':'application/x-www-form-urlencoded',
//       'Content-Length':content.length
//   }
// };


// var req = https.request(options,function(res){
//   var _data = '';
//   res.on('data', function(chunk){
//    _data += chunk;
//   });
  
//   res.on('end', function(){
//      // 处理返回
//      process.stdout.write(_data);
//    });
// });

// req.write(content);

// req.end();

