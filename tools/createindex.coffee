require './../lib/modelLoader.coffee'
require './../lib/functionLoader.coffee'
func_user = __F 'user'
func_count = __F 'user/count'
func_answer = __F 'answer'
func_topic  = __F 'topic_comment'
queuedo = require 'queuedo'

func_answer.getAll 1,10000,null,"id desc",(error,articles)->
  queuedo articles,(a,next,context)->
    console.log a.user_id
    if a.user_id
      func_count.addCount a.user_id,"answer_count",(e,uu)->
        next.call(context)
    else
      next.call(context)
  ,()->
    console.log 'end'
