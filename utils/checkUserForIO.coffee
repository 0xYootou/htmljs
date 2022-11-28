func_user = __F 'user'
md5 = require 'MD5'
module.exports = (cookie,callback)->
  if not cookie
    callback new Error '没有登录'
  cookiearr = cookie.split(";")
  cookies = {}
  cookiearr.forEach (c)->
    c = c.split("=")
    if c.length >=2
      cookies[c[0].replace(/^\s*|\s*$/,"")] = decodeURIComponent c[1]
  if cookies._p
    p = cookies._p.split ':'
    if p.length==2
      uid = p[0]
      token = p[1]
      func_user.getById uid,(error,user)->
        if user.is_block
          callback new Error '您已经被加入本站黑名单。请联系 xinyu198736@gmail.com 恢复账户'
        else if user
          if md5(user.weibo_token)==token
            callback null,user
          else
            callback new Error '没有登录'
        else
          callback new Error '没有登录'
    else
      callback new Error '没有登录'
  else
    callback new Error '没有登录'