F_user = __F 'user'
F_book = __F 'book'
module.exports.controllers = 
  "/":
    get:(req,res,next)->
      res.render 'admin/books.jade'
  "/:id/del":
    get:(req,res,next)->
      F_book.delete req.params.id,(error)->
        if error then next error
        else
          res.redirect 'back'
module.exports.filters = 
  "/":
    get:['checkLogin','checkAdmin','book/all-books']
  "/:id/del":
    get:['checkLogin','checkAdmin']