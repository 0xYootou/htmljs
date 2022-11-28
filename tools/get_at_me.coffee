config = require './../config.coffee'
authorize=require("./../lib/sdk/authorize.js")
Sina=require("./../lib/sdk/sina.js")
fs = require 'fs'
queuedo =require 'queuedo'
csv = '昵称,ID,地区,是否关注我,微博内容\n'
_sina=new Sina(config.sdks.sina)


queuedo [1..50],(page,next,context)->
  _sina.statuses.mentions
    access_token:"2.00oKLBVD0TxWci452c86824b0jpy89"
    count:200
    page:page
    method:"GET"
  ,(error,data)->
    data.statuses.forEach (stat)->
      text = ""
      if stat.retweeted_status
        text = stat.retweeted_status.text
      if text.indexOf("#我的奥迪梦#") !=-1
        csv+=stat.user.screen_name+","+stat.user.id+","+stat.user.location+","+stat.user.follow_me+","+stat.text.replace(/,/g,"")+"\n"
    console.log csv
    setTimeout ()->
      next.call(context)
    ,20000

,()->
  console.log csv
  fs.writeFileSync "at_me.csv",csv,'utf-8'