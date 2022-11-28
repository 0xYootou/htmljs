
require './../lib/modelLoader.coffee'
require './../lib/functionLoader.coffee'
User = __M 'users'
config = require './../config.coffee'
authorize=require("./../lib/sdk/authorize.js")
Sina=require("./../lib/sdk/sina.js")
request = require 'request'
func_article = __F 'article'
read = require("readability")
func_timeline = __F 'timeline'
func_coin = __F 'coin'
ReadHistory = __M 'read_wb_history'
ReadHistory.sync()
check = ()->
  User.find
    where:
      weibo_id:"1734409185"
  .success (user)->
    if user
      sina=new Sina(config.sdks.sina)
      sina.statuses.mentions 
        access_token:user.weibo_token
        method:"get"
      ,(error,statuses)->
        if statuses && statuses.statuses &&statuses.statuses.length
          statuses.statuses.forEach (status)->
            ReadHistory.find
              where:
                weibo_id:status.id
            .success (rh)->
              if not rh
                ReadHistory.create({weibo_id:status.id})
                text = status.text
                url = null
                if status.retweeted_status
                  text = status.retweeted_status.text

                if status.text.replace(/\/.*$/,"").indexOf('mark') !=-1
                  console.log text
                  urls = text.match /http:\/\/t\.cn\/[^ $]*/
                  if urls
                    url = urls[0]
                  if not url
                    sina.comments.create
                      access_token:user.weibo_token
                      comment:"对不起，没有可以收藏的内容，请确保原文包含url链接，@前端乱炖"
                      id:status.id

                  else
                    User.find
                      where:
                        weibo_id:status.user.id
                    .success (nowUser)->
                      if not nowUser
                        sina.comments.create
                          access_token:user.weibo_token
                          comment:"对不起，您的微博没有在@前端乱炖 绑定过账号，所以不能使用此功能，请绑定后使用，点击绑定："+config.base_host+"/user/login"
                          id:status.id
                      else
                        #开始抓取
                        #先查找数据中是否已经存在
                        func_article.getByUrl url,(error,art)->
                          if art
                            func_coin.add 5,nowUser.id,"收藏了一篇文章"
                            sina.comments.create
                              access_token:user.weibo_token
                              comment:"恭喜您在@前端乱炖 成功收藏本文，并且获得5个经验值，点击查看："+config.base_host+"/read/"+art.id
                              id:status.id
                          else
                            request.get url,(e,s,entry)->
                              if not e 
                                if entry.indexOf 'unable to parse article content' == -1
                                  read.parse entry,"",(parseResult)->
                                    titlematch = entry.match(/<title>(.*?)<\/title>/)
                                    t = ""
                                    if titlematch then t=titlematch[1] 
                                    data= 
                                      quote_url:url
                                      title:(if parseResult.title then parseResult.title else t).replace(/^\s*|\s*$/,"")
                                      html:parseResult.content
                                      desc:text
                                      is_publish:0
                                      is_yuanchuang:0
                                      user_id:nowUser.id
                                      user_nick:nowUser.nick
                                      user_headpic:nowUser.head_pic
                                    func_article.add data,(error,art)->
                                      if not error
                                        # func_timeline.add 
                                        #   who_id:nowUser.id
                                        #   who_headpic:nowUser.head_pic
                                        #   who_nick:nowUser.nick
                                        #   target_url:"/read/"+art.id
                                        #   target_name:art.title
                                        #   action:"收藏了文章："
                                        #   desc:art.html.replace(/<p>(.*?)<\/p>/g,"$1\n").replace(/<[^>]*?>/g,"").substr(0,300).replace(/([^\n])\n+([^\n])/g,"$1<br/>$2")
                                        func_coin.add 5,nowUser.id,"收藏了一篇文章"
                                        sina.comments.create
                                          access_token:user.weibo_token
                                          comment:"恭喜您在@前端乱炖 成功收藏本文，并且获得5个经验值，点击查看："+config.base_host+"/read/"+art.id
                                          id:status.id
        sina=new Sina(config.sdks.sina)
        sina.comments.mentions 
          access_token:user.weibo_token
          method:"get"
        ,(error,statuses)->
          if statuses && statuses.comments &&statuses.comments.length
            statuses.comments.forEach (comment)->
              ReadHistory.find
                where:
                  weibo_id:comment.id
              .success (rh)->
                if not rh
                  ReadHistory.create({weibo_id:comment.id})
                  text = comment.status.text
                  url = null
                  if comment.status.retweeted_status
                    text = comment.status.retweeted_status.text

                  if comment.text.indexOf('mark') !=-1
                    urls = text.match /http:\/\/t\.cn\/[^ $]*/
                    if urls
                      url = urls[0]
                    if not url
                      sina.comments.reply
                        access_token:user.weibo_token
                        comment:"对不起，没有可以收藏的内容，请确保原文包含url链接，@前端乱炖"
                        id:comment.status.id
                        cid:comment.id

                    else
                      User.find
                        where:
                          weibo_id:comment.user.id
                      .success (nowUser)->
                        if not nowUser
                          sina.comments.reply
                            access_token:user.weibo_token
                            comment:"对不起，您的微博没有在@前端乱炖 绑定过账号，所以不能使用此功能，请绑定后使用，点击绑定："+config.base_host+"/user/login"
                            id:comment.status.id
                            cid:comment.id
                        else
                          #开始抓取
                          #先查找数据中是否已经存在
                          func_article.getByUrl url,(error,art)->
                            if art
                              func_coin.add 5,nowUser.id,"收藏了一篇文章"
                              sina.comments.reply
                                access_token:user.weibo_token
                                comment:"恭喜您在@前端乱炖 成功收藏本文，并且获得5个经验值，点击查看："+config.base_host+"/read/"+art.id
                                id:comment.status.id
                                cid:comment.id
                            else
                              request.get url,(e,s,entry)->
                                if not e 
                                  if entry.indexOf 'unable to parse article content' == -1
                                    read.parse entry,"",(parseResult)->
                                      titlematch = entry.match(/<title>(.*?)<\/title>/)
                                      t = ""
                                      if titlematch then t=titlematch[1] 
                                      data= 
                                        quote_url:url
                                        title:(if parseResult.title then parseResult.title else t).replace(/^\s*|\s*$/,"")
                                        html:parseResult.content
                                        desc:text
                                        is_publish:0
                                        is_yuanchuang:0
                                        user_id:nowUser.id
                                        user_nick:nowUser.nick
                                        user_headpic:nowUser.head_pic
                                      func_article.add data,(error,art)->
                                        if not error
                                          # func_timeline.add 
                                          #   who_id:nowUser.id
                                          #   who_headpic:nowUser.head_pic
                                          #   who_nick:nowUser.nick
                                          #   target_url:"/read/"+art.id
                                          #   target_name:art.title
                                          #   action:"收藏了文章："
                                          #   desc:art.html.replace(/<p>(.*?)<\/p>/g,"$1\n").replace(/<[^>]*?>/g,"").substr(0,300).replace(/([^\n])\n+([^\n])/g,"$1<br/>$2")
                                          func_coin.add 5,nowUser.id,"收藏了一篇文章"
                                          sina.comments.reply
                                            access_token:user.weibo_token
                                            comment:"恭喜您在@前端乱炖 成功收藏本文，并且获得5个经验值，点击查看："+config.base_host+"/read/"+art.id
                                            id:comment.status.id
                                            cid:comment.id


check()
setInterval check,1000*240


