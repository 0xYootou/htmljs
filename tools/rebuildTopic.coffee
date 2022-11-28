require './../lib/modelLoader.coffee'
require './../lib/functionLoader.coffee'
func_topic = __F 'topic'
func_tag = __F 'topic/tag'
queuedo = require 'queuedo'
func_tag.getAll 1,100,null,(error,tags)->
  queuedo tags,(tag,next,context)->
    func_topic.getAll 1,1000,{tag_id:tag.id},(error,topics)->
      tc = 0
      topics.forEach (t)->
        tc+=t.visit_count
      func_tag.update tag.id,{topic_count:topics.length,visit_count:tc},()->
        next.call context
  ,()->