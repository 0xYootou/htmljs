require './../lib/modelLoader.coffee'
require './../lib/functionLoader.coffee'
func_timeline = __F 'timeline'
moment = require 'moment'
func_article = __F 'article'
func_column = __F 'column'
func_question = __F 'question'
pagedown = require("pagedown-htmljs")
fs = require 'fs'
safeConverter = pagedown.getSanitizingConverter()
tpl = "
###如何给前端乱炖投稿？\n
\n
 - 原创文章请投递到专栏，通过审核后，即可享有多个宣传渠道，提升影响力，而且我们有激励计划，目前通过审核的文章，本站每篇捐助10元人民币，并且文章底部显示捐赠链接，可以接受网友捐赠。\n
 - 非原创文章有多种投递渠道，推荐使用微博投递，在微博，不管是发布，还是转发，还是评论别人微博的时候，带上`@前端乱炖 mark`字样，即可投递微博中的链接到前端乱炖。\n
\n
###今日问答\n
\n
{{questions}}
\n
###今日原创文章\n
\n
{{articles}}
\n
###今日推荐阅读\n
\n
{{reads}}
\n
###其他\n
\n
本类型文章每日自动由系统生成，如果发生错误，请见谅！\n
\n
更多信息请关注本网站的官方微博：[http://weibo.com/htmljs](http://weibo.com/htmljs)\n

  "
jade = require('jade')

check = ()->
  now = new Date()
  try
    ld = fs.readFileSync 'last_read_date.txt'
  catch e
    ld = new Date(now.getFullYear(),now.getMonth(),now.getDate(),0,0,0).getTime()
  minDay = new Date(ld*1)
  console.log minDay
  maxDay = new Date(now.getFullYear(),now.getMonth(),now.getDate()+1,0,0,0)
  minDay = moment(minDay).format("YYYY-MM-DD HH:mm:ss")
  console.log minDay
  maxDay = moment(maxDay).format("YYYY-MM-DD HH:mm:ss")
  func_question.getAll 1,20,['  questions.createdAt > ? and questions.createdAt < ?',minDay,maxDay],null,(error,qs)->
    if error then console.log error
    _questions = ""
    qs.forEach (q)->
      _questions += " - ["+q.title+"](http://www.html-js.com/qa/"+ q.id+")\n"
    func_article.getAll 1,100,['  articles.createdAt > ? and articles.createdAt < ?',minDay,maxDay],(error,articles)->
      if error then console.log error
      _articles = ""
      _reads = ""
      articles.forEach (article)->
        if article.is_yuanchuang
          _articles += " - ["+article.title+"](http://www.html-js.com/article/"+ article.id+")\n"
        else
          _reads += " - ["+article.title+"](http://www.html-js.com/read/"+ article.id+")\n"
      if _reads == "" then _reads = "暂无"
      if _articles == "" then _articles = "暂无"
      if _questions == "" then _questions = "暂无"
      result = tpl.replace("{{articles}}",_articles).replace("{{reads}}",_reads).replace("{{questions}}",_questions)
      console.log result
      html = safeConverter.makeHtml result
      data = 
        md:result
        html:html
        title:"前端乱炖 每日推荐 （"+moment(new Date()).format("YYYY-MM-DD")+"）"
        type:1
        user_id:34
        user_nick:"前端乱炖"
        column_id:3
        user_headpic:"http://tp2.sinaimg.cn/1734409185/50/40022299601/1"
        publish_time:new Date().getTime()/1000
        is_yuanchuang:1
        is_publish:1
        desc:safeConverter.makeHtml result.substr(0,300)
      func_column.addCount 3,"article_count",()->
      func_article.add data,(error,article)->
        if error then console.log error
        else
          (__F 'index').add article.uuid
          fs.writeFileSync 'last_read_date.txt',(new Date().getTime())
check()