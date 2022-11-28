require './../lib/modelLoader.coffee'
require './../lib/functionLoader.coffee'
global.xss = require 'xss'
xss.whiteList['iframe'] = ['src', 'width','height','allowfullscreen','frameborder','id','class','style'];

func_topic = __F 'topic'
func_topic_comment = __F 'topic_comment'
queuedo = require 'queuedo'
func_question = __F 'question'
func_answer = __F 'answer'
func_user = __F 'user'
func_topic_comment.getAll 1,10000,null,(error,cs)->
    queuedo cs,(c,next,context)->
        if not c.user_headpic
            func_user.getById c.user_id,(error,u)->
                if u
                    func_topic_comment.update c.id,{user_headpic:u.head_pic},(error)->
                        next.call(context)
                else
                    next.call(context)
        else
            next.call(context)
                                