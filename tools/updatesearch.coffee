require './../lib/modelLoader.coffee'
require './../lib/functionLoader.coffee'
search = require ("./../lib/search.coffee")
func_column = __F 'column'
func_article = __F 'article'
func_blog = __F 'blog/article'
queuedo = require 'queuedo'
func_article.getAll 1,5000,null,(error,articles)->
  queuedo articles,(article,next,context)->
    search.add {type:"article","pid":article.uuid,"title":article.title,"html":article.html.replace(/<[^>]*>/g,""),"uuid":article.uuid,"id": article.id},()->
      next.call(context)
  ,()->
    


    (__F 'topic').getAll 1,1000,null,(error,topics)->
      queuedo topics,(topic,next,context)->
        search.add {type:"topic","pid":topic.uuid,"title":topic.title,"html":topic.html.replace(/<[^>]*>/g,""),"uuid":topic.uuid,"id": topic.id},()->
          next.call(context)
      ,()->

        (__F 'question').getAll 1,1000,null,(error,qas)->
          queuedo qas,(qa,next,context)->
            search.add {type:"qa","pid":qa.uuid,"title":qa.title,"html":qa.html.replace(/<[^>]*>/g,""),"uuid":qa.uuid,"id": qa.id},()->
              next.call(context)
          ,()->

            (__F 'card').getAll 1,10000,null,(error,cards)->
              queuedo cards,(card,next,context)->
                search.add {type:"card","pid":card.uuid,"title":card.nick+"的花名册","html":card.nick+"的花名册 简介："+card.desc,"udid":card.uuid,"id": card.id},()->
                  next.call(context)
              ,()->


                (__F 'answer').getAll 1,10000,null,(error,answers)->
                  queuedo answers,(answer,next,context)->
                    (__F 'question').getById answer.question_id,(error,question)->
                      if question
                        search.add {parent_id:answer.question_id,type:"answer","pid":'answer_'+answer.id,"title":question.title+"的回答","html":answer.html.replace(/<[^>]*>/g,""),"udid":'',"id": answer.id},()->
                          next.call(context)
                  ,()->
