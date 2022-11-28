
require './lib/modelLoader.coffee'
User = __M 'User'
config = require './config.coffee'
authorize=require("./lib/sdk/authorize.js")
Sina=require("./lib/sdk/sina.js")
check = ()->
  User.find
    where:
      weibo_id:"1734409185"
  .success (user)->
    if user
      sina=new Sina(config.sdks.sina)
      sina.statuses.mentions 
        access_token:res.locals.user.weibo_token
        status:"我在@前端乱炖 的《前端花名册》认领了我的名片，这里是我的名片，欢迎收藏：http://f2e.html-js.com/user/"+res.locals.user.id
      ,(error,result)->
        console.log result

setInterval check,1000*20


