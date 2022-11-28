config = require './../config.coffee'
authorize=require("./../lib/sdk/authorize.js");
md5 = require 'MD5'
fs = require ("fs")
Sina=require("./../lib/sdk/sina.js")
sina=new Sina(config.sdks.sina)
queuedo = require("queuedo")

uids = require("./comments.json")
commented = require("./commented.json")

weiboid = "3765323268343698"
index = 0;
ids = []
queuedo [1..10],(id,next,context)->
  sina.statuses['repost_timeline/ids']
    id:weiboid
    page:id
    count:200
    method:'get'
    access_token:"2.00bQrlEC0TxWci8873a0be81Wuh9aC"
    rip:"122.224.209.220"
  ,(error,message)->
    ids = ids.concat(message.statuses)
    fs.writeFileSync("./comments.json",JSON.stringify(ids,null,4),'utf-8')
  setTimeout ()->
    next.call(context)
  ,1500