func_user = __F 'user'
func_topic_tag = __F 'topic/tag'
module.exports.controllers = 
  "/":
    get:(req,res,next)->
      func_topic_tag.getAll 1,100,null,"",(error,tags)->
        res.locals.tags = tags
        res.render 'admin/topic_tags.jade'
  "/add":
    get:(req,res,next)->
      res.render 'admin/add_topic_tag.jade'
    post:(req,res,next)->
      func_topic_tag.add req.body,(error,tag)->
        res.redirect 'admin/topic_tag'
  "/:id/del":
    get:(req,res,next)->
      func_topic_tag.delete req.params.id,(error)->
        res.redirect 'admin/topic_tag'
module.exports.filters = 
  "/*":
    get:['checkLogin','checkAdmin']