func_user = __F 'user'
func_card = __F 'card'
func_article = __F 'article/article'
func_info = __F 'info'
func_index = __F 'index'
func_column = __F 'column'
func_rss_email = __F 'rss_email'
config = require './../config.coffee'
func_search = __F 'search'
authorize=require("./../lib/sdk/authorize.js");
#md5 = require 'MD5'
Sina=require("./../lib/sdk/sina.js")
RSS=require 'rss'
sina=new Sina(config.sdks.sina)
moment = require 'moment'
path = require 'path'
fs = require 'fs'
request = require 'request'
UPYun=require("./../lib/upyun.js").UPYun
fs = require 'fs'
searchStatic = {}
md5 = (string)->
    crypto = require('crypto')
    md5sum = crypto.createHash('md5')
    md5sum.update(string, 'utf8')
    return md5sum.digest('hex')
module.exports.controllers = 
  "/":
    get:(req,res,next)->
      page = req.query.page || 1
      count = req.query.count || 30
      if req.query.p 
        res.render '404.jade',{status: 404},(error,page)->
          res.send page,404  
      else
        res.render 'index.jade'

  "/index/:id/update":
    get:(req,res,next)->
      func_index.update req.params.id,req.query,(error)->
        res.redirect '/'
  
  "/rss.xml":
    "get":(req,res,next)->
      feed = new RSS
        title: "前端乱炖，前端人才资源学习资源集散地",
        description: "前端乱炖，前端人才资源学习资源集散地",
        feed_url: 'http://www.html-js.com/rss.xml',
        site_url: 'http://www.html-js.com',
        image_url: 'http://www.html-js.com/icon.png',
        author: "芋头"
      func_article.getAll 1,20,{is_yuanchuang:1},'id desc',(error,articles)->
        if error then next error
        else
          articles.forEach (article)->
            feed.item
              title: article.title,
              description: article.html,
              url: 'http://www.html-js.com/article/'+article.id
              author: article.user_nick
              date: article.publish_time*1000
          res.end feed.xml()

  "/articles":
    "get":(req,res,next)->
  "/article/add":
    "get":(req,res,next)->
        
      res.render 'add-article.jade'
  "/cards":
    "get":(req,res,next)->
      res.locals.md5 = md5
      res.locals.login = authorize.sina
        app_key:config.sdks.sina.app_key,
        redirect_uri:config.sdks.sina.redirect_uri
      condition = null
      if req.query.q
        condition = condition ||{}
        condition = "cards.name like '%"+req.query.q+"%' or cards.nick like '%"+req.query.q+"%'"
        res.locals.q = req.query.q
      if req.query.filter
        condition=condition||{}
        req.query.filter.split(":").forEach (f)->
          kv = f.split '|'
          if kv.length
            condition[kv[0]]=kv[1]
            res.locals["filter_"+kv[0]]=kv[1]
      func_card.count condition,(error,count)->
        if error then next error
        else
          res.locals.total=count
          res.locals.totalPage=Math.ceil(count/40)
          res.locals.page = (req.query.page||1)
          func_card.getAll res.locals.page,40,condition,(error,cards)->
            if error then next error
            else
              res.locals.cards = cards
              res.render 'card/cards.jade'
  "/add-card":
    get:(req,res,next)->
      if res.locals.card
        res.redirect '/edit-card'
        return
      if res.locals.user
        sina.users.show
          access_token:res.locals.user.weibo_token
          uid:res.locals.user.weibo_id
          method:"get"
        ,(error,data)->
          if !error
            res.locals.weibo_info = data
            res.render 'card/add-card.jade'
      else
        res.render 'card/add-card.jade'
    post:(req,res,next)->
      if res.locals.user.card_id
        next new Error '您已经拥有一个名片！'
        return
      func_card.add req.body,(error,card)->
        if error then next error
        else
          func_index.add card.uuid
          (__F 'coin').add 40,res.locals.user.id,"创建了名片"
          func_user.connectCard res.locals.user.id,card.id,(error)->
            if error then next error
            else
              res.redirect '/user'
          func_user.update res.locals.user.id,{email:card.email},()->
          
          func_search.add {type:"card","pid":card.uuid,"title":card.nick+"的花名册","html":card.nick+"的花名册 简介："+card.desc,"udid":card.uuid,"id": card.id},()->
          (__F 'create_thumbnail').create_card card.id,()->
            sina.statuses.upload 
              access_token:res.locals.user.weibo_token
              pic:path.join __dirname,"../uploads/article_thumb/card-"+card.id+".png"
              status:"我在@前端乱炖 的《前端花名册》添加了我的名片，欢迎收藏：http://www.html-js.com/user/"+res.locals.user.id+" "
           
  "/edit-card":
    get:(req,res,next)-> 
      if not res.locals.card
        res.redirect '/add-card'
      else
        res.render 'card/edit-card.jade'
    post:(req,res,next)->
      func_card.update req.body.id,req.body,(error,card)->
        if error then next error
        else
          func_user.update card.user_id,
            nick:card.nick
            sex:card.sex
            desc:card.desc
            email:card.email
          ,(error)->
            if error then console.log error
          res.redirect '/user'
  "/card/:id":
    get:(req,res,next)->
      if req.query&&req.query.is_clear
        res.render 'user/p-clear.jade'
      func_card.getVisitors req.params.id,(error,visitors)->
        if error then next error
        else
          res.locals.visitors = visitors
          func_card.addVisit req.params.id,res.locals.user||null
          if res.locals.card.user_id && res.locals.user && res.locals.card.user_id!=res.locals.user.id
            func_info.add 
              target_user_id:res.locals.card.user_id
              type:1
              source_user_id:res.locals.user.id
              source_user_nick:res.locals.user.nick
              time:new Date()
              target_path:req.originalUrl
              action_name:"【访问】了您的名片"
              target_path_name:res.locals.card.nick+"的名片"
            ,()->
              console.log 'success'
            res.render 'user/p.jade'
          else
            res.render 'user/p.jade'
  
  "/card/:id/zan":
    post:(req,res,next)->
      result = 
        success:1
      func_card.addZan req.params.id,res.locals.user.id,(error,card)->
        if error 
          result.info = error.message
          result.success = 0
        else
          if card.user_id
            func_info.add 
              target_user_id:card.user_id
              type:4
              source_user_id:res.locals.user.id
              source_user_nick:res.locals.user.nick
              time:new Date()
              target_path:"/card/"+req.params.id
              action_name:"【赞】了您的名片"
              target_path_name:card.nick+"的名片"
          result.zan_count = card.zan_count
        res.send result
  "/card/:id/kai":
    post:(req,res,next)->
      result = 
        success:1
      func_card.getById req.params.id,(error,card)->
        if error 
          result.info = error.message
          result.success = 0
        else
          if card.user_id
            func_info.add 
              target_user_id:card.user_id
              type:11
              source_user_id:res.locals.user.id
              source_user_nick:res.locals.user.nick
              time:new Date()
              target_path:"/article/column/add"
              action_name:"【希望】您开通技术专栏分享经验和技术知识"
              target_path_name:"点击这里开通专栏"
        res.send result
  "/upload":
    "post":(req,res,next)->
      result = 
        success:0
        info:""
      pack = req.files['pic']
      if pack 
        sourcePath = pack.path
        pack_name = (new Date()).getTime()+"-"+md5(pack.name)+path.extname(pack.name)
        targetPath = config.upload_path+pack_name
        fs.rename sourcePath, targetPath, (err) ->
          
          upyun = new UPYun(config.upyun_bucketname, config.upyun_username, config.upyun_password)
          fileContent = fs.readFileSync(targetPath)
          md5Str = md5(fileContent)
          upyun.setContentMD5(md5Str)
          upyun.setFileSecret('bac')
          upyun.writeFile '/uploads/'+pack_name, fileContent, false,(error, data)->
            if error
              result.info = error.message
              res.send result
              return
            else
              result.success = 1
              result.data = 
                filename:"http://htmljs.b0.upaiyun.com/uploads/"+pack_name
            res.send result
      else
        result.info = "错误的图片文件"
        res.send result  
  "/upload_resume":
    "post":(req,res,next)->
      result = 
        success:0
        info:""
      pack = req.files['file']
      if pack 
        sourcePath = pack.path
        pack_name = (new Date()).getTime()+"-"+pack.name
        targetPath = config.resume_path+pack_name
        fs.rename sourcePath, targetPath, (err) ->
          
          upyun = new UPYun(config.upyun_bucketname, config.upyun_username, config.upyun_password)
          fileContent = fs.readFileSync(targetPath)
          md5Str = md5(fileContent)
          upyun.setContentMD5(md5Str)
          upyun.setFileSecret('bac')
          upyun.writeFile '/uploads/'+pack_name, fileContent, false,(error, data)->
            if error
              result.info = error.message
              res.send result
              return
            else
              result.success = 1
              result.data = 
                filename:"http://htmljs.b0.upaiyun.com/uploads/"+pack_name
            res.send result
      else
        result.info = "错误的图片文件"
        res.send result  
  "/online_to_local":
    "post":(req,res,next)->
      result = 
        success:0
        info:""
      pack =  req.body.url
      pack_name = (new Date()).getTime()+"-"+md5(req.body.url)
      targetPath = config.upload_path+pack_name
      request req.body.url,(e,r,body)->
        if e 
          result.info = e.message
          res.send result
        else
          setTimeout ()->
            upyun = new UPYun(config.upyun_bucketname, config.upyun_username, config.upyun_password)
            fileContent = fs.readFileSync(targetPath)
            md5Str = md5(fileContent)
            upyun.setContentMD5(md5Str)
            upyun.setFileSecret('bac')
            upyun.writeFile '/uploads/'+pack_name, fileContent, false,(error, data)->
              if error
                result.info = error.message
                res.send result
                return
              else
                result.success = 1
                result.data = 
                  filename:"http://htmljs.b0.upaiyun.com/uploads/"+pack_name
              res.send result
          ,2000
        
      .pipe(fs.createWriteStream(targetPath))
          
  "/ad":
    "get":(req,res,next)->
      res.render 'ad.jade'
  "/search-his":
    "get":(req,res,next)->
      
      func_search.count null,(error,count)->
        res.locals.total=count
        res.locals.totalPage=Math.ceil(count/500)
        res.locals.page = (req.query.page||1)
        func_search.getAll (req.query.page||1),500,null,'updatedAt desc',(error,recent)->
          res.locals.recent_words = recent
          res.render 'search_his.jade'
  "/search":
    "get":(req,res,next)->
      if not req.query.q
        res.render 'search.jade'
        return
      nowtime = new Date().getTime()
      try
        if searchStatic[req.originalUrl] && (nowtime - searchStatic[req.originalUrl] < 1000*60*60*24*10)
          console.log 'read from static'
          res.set('Content-Type', 'text/html');
          res.send fs.readFileSync './static/'+encodeURIComponent(req.originalUrl)+".html"
          return
      catch e
      res.locals.q = req.query.q
      func_search.query {"query":req.query.q,"limit":10,"offset":((req.query.page||1)-1)*10},(error,data)->
        if error 
          next error
        else
          try
            data = JSON.parse data
          res.locals.results = data.data
          res.locals.total=data.total_count
          res.locals.totalPage=Math.ceil(data.total_count/10)
          res.locals.page = (req.query.page||1)
          res.locals.relative_words = data.relative
          func_search.getAll 1,20,null,'count desc',(error,hot)->
            res.locals.hot_words = hot
            func_search.getAll 1,30,null,'updatedAt desc',(error,recent)->
              res.locals.recent_words = recent
              res.render 'search.jade',null,(error,html)->
                try
                  fs.writeFileSync './static/'+encodeURIComponent(req.originalUrl)+".html",html,'utf-8'
                catch e
                searchStatic[req.originalUrl] = nowtime
                res.send html

                
  "/google72b29f4df6c0059b.html":
    get:(req,res,next)->
      res.end 'google-site-verification: google72b29f4df6c0059b.html'
  "/robots.txt":
    "get":(req,res,next)->
      res.end "
User-agent: *\n
Disallow: /user/login\n
Disallow: /talk/\n
"
  "/rss/email":
    "post":(req,res,next)->
      if req.body.email && /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/.test(req.body.email)
        func_rss_email.add
          email:req.body.email
        ,(e)->
          if not e
            res.send {success:1}
          else
            res.send {success:0,info:e.message}
      else
        res.send {success:0,info:"提交失败，错误的邮箱格式"}

module.exports.filters = 
  "/article/add":
    get:['checkLogin',"checkCard"]
  "/cards":
    get:['freshLogin',"checkCard","card_recent","card/new-comments"]
  "/card/:id":
    get:['freshLogin','card/get-card','card/comments','card/zans','card/his-columns','card/his-articles','card/his-question','card/his-topic','card/his-answer']
  "/add-card":
    get:['checkLogin',"checkCard"]
    post:['checkLogin']
  "/edit-card":
    get:['checkLogin',"checkCard"]
  "/":
    get:['freshLogin',
    "index/actives",
    "index/recent_articles",
    "index/recent_questions"
    "index/recent_topics",
    'index/recent_columns',
    'index/all_tags',
    'index/all_topic_tags',
    'index/recent_users',
    'all_count',
    'index/article_top_users',
    'index/answer_top_users',
    'index/topic_top_users']
  "/card/:id/zan":
    post:['checkLoginJson']
  "/card/:id/kai":
    post:['checkLoginJson']
  "/card/:id/bao":
    post:['checkLogin',"checkCard"]
  "/search":
    get:['freshLogin']
