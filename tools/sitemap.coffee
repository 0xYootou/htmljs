xml=require 'js2xmlparser'
require './../lib/modelLoader.coffee'
require './../lib/functionLoader.coffee'
search = require ("./../lib/search.coffee")
func_column = __F 'column'
func_article = __F 'article/article'
func_blog = __F 'blog/article'
queuedo = require 'queuedo'
moment = require 'moment'
data = {
  "@": {
    "xmlns": "http://www.google.com/schemas/sitemap/0.84"
  },
  "url":[
    {
      "loc":"http://www.html-js.com/article",
      "lastmod":moment().format("YYYY-MM-DD"),
      "changefreq":"always",
      "priority":"1"
    },
    {
      "loc":"http://www.html-js.com/qa",
      "lastmod":moment().format("YYYY-MM-DD"),
      "changefreq":"always",
      "priority":"1"
    },
    {
      "loc":"http://www.html-js.com/column",
      "lastmod":moment().format("YYYY-MM-DD"),
      "changefreq":"always",
      "priority":"1"
    },
    {
      "loc":"http://www.html-js.com/topic",
      "lastmod":moment().format("YYYY-MM-DD"),
      "changefreq":"always",
      "priority":"1"
    },
    {
      "loc":"http://www.html-js.com/cards",
      "lastmod":moment().format("YYYY-MM-DD"),
      "changefreq":"always",
      "priority":"1"
    }
  ]
}

func_article.getAll 1,5000,null,(error,articles)->
  queuedo articles,(article,next,context)->
    data.url.push({
      "loc":"http://www.html-js.com/article/"+article.pinyin,
      "lastmod":moment(article.createdAt).format("YYYY-MM-DD"),
      "changefreq":"weekly",
      "priority":"1"
    })
    next.call(context)
  ,()->
    


    (__F 'topic').getAll 1,1000,null,(error,topics)->
      queuedo topics,(topic,next,context)->
        data.url.push({
          "loc":"http://www.html-js.com/topic/"+topic.id,
          "lastmod":moment(topic.createdAt).format("YYYY-MM-DD"),
          "changefreq":"weekly",
          "priority":"1"
        })
        next.call(context)
      ,()->

        (__F 'question').getAll 1,1000,null,(error,qas)->
          queuedo qas,(qa,next,context)->
            data.url.push({
              "loc":"http://www.html-js.com/qa/"+qa.pinyin,
              "lastmod":moment(qa.createdAt).format("YYYY-MM-DD"),
              "changefreq":"weekly",
              "priority":"1"
            })
            next.call(context)
          ,()->

            (__F 'card').getAll 1,10000,null,(error,cards)->
              queuedo cards,(card,next,context)->
                data.url.push({
                  "loc":"http://www.html-js.com/card/"+card.id,
                  "lastmod":moment(card.createdAt).format("YYYY-MM-DD"),
                  "changefreq":"weekly",
                  "priority":"1"
                })
                next.call(context)
              ,()->
                (require 'fs').writeFileSync "sitemap.xml",(xml('urlset',data).replace("\n","").replace("\t","")),'utf-8'
