require './../lib/modelLoader.coffee'
require './../lib/functionLoader.coffee'

func_card = __F 'card'
func_user = __F 'user'
func_bi = __F 'bi'
queuedo = require 'queuedo'
func_user.getAll 1,2000,null,(error,users)->
  queuedo users,(user,next,context)->
    func_bi.add 
      user_id:user.id
      count:20
      day:(new Date()).getTime()/1000*60*60*24
      reason:"注册成功赠送"
      from_title:null
      from_user_nick:"系统"
    ,()->
      next.call(context)
