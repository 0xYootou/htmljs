require './../lib/modelLoader.coffee'
require './../lib/functionLoader.coffee'
<<<<<<< HEAD
func_card = __F 'card'
func_user = __F 'user'

func_card.getAll 1,10000,null,(error,cards)->
  cards.forEach (card)->
    if card.user_id
<<<<<<< HEAD
      func_user.update card.user_id,{email:card.email},()->
=======
      func_user.update card.user_id,{email:card.email},()->
>>>>>>> 5ad533973f57821a11afb6b3241414ba7d855923
=======
s = "abcdefghijklmnopqrstuvwxyz0123456789"
func_url = __F 'url'
neighbours =
  1: s.split ""
getPINs = (observed, prefix)->
  prefix = prefix or ""
  if observed.length is 0
    prefix
  else
    neighbours[observed[0]].reduce ((acc, d)->
      acc.concat getPINs(observed.substring(1), prefix + d)
    ), []
arr = getPINs "111"
arr.forEach ((p)->
  console.log p
)
>>>>>>> dccb436d9ec3f0e2586dda9a49f32513271957d3
