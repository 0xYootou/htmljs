express        = require("express")
http           = require("http")
path           = require("path")
config         = require './config.coffee'
rainbow        = require './lib/rainbow.js'
lessmiddle     = require 'less-middleware'
less           = require 'less'
fs             = require 'fs'
global.xss = require 'xss'
xss.whiteList['iframe'] = ['src', 'width','height','allowfullscreen','frameborder','id','class','style'];
_ = require 'underscore'
module.exports = app = express()
log4js = require('log4js')
log4js.configure({
  appenders: [
    { type: 'console' }
#    {
#      type: 'file'
#      filename: 'logs/access.log'
#      maxLogSize: 1024
#      backups:3
#      category: 'normal'
#    }
  ]
})
logger = log4js.getLogger('normal')
logger.setLevel('INFO')
black = ['Mail.RU_Bot', 'rogerbot', 'PHP', 'opensiteexplorer', 'SV1', 'sv1', 'istellabot', 'webmeup', 'DNSPod', 'monitor', 'snarfware', 'majestic12', 'easou', 'yunyun', 'sougou', 'sogou', 'yunrang', 'ahrefs', "longurl", 'rogerbot', 'YisouSpider', 'Steeler', 'Yahoo', 'ChinasoSpider','robot','qwant','bingbot','bot','spider']
ipblack = ['211.144.76.89']
app.configure ->
  app.set "port", config.run_port
  app.set "views", path.join __dirname, 'views'
  app.set "view engine", "jade"
  app.use express.favicon()
  app.use "/assets",lessmiddle({src:__dirname+"/assets",compress:true})
  app.use "/assets", express.static(__dirname+"/assets")
  app.use "/uploads", express.static(__dirname+"/uploads")
  app.use "/static", express.static(__dirname+"/static")
#  app.use express.logger("dev")
  app.use express.bodyParser()
  app.use express.cookieParser()
  app.use express.cookieSession(secret: config.session_secret)
  app.use(log4js.connectLogger(logger, {level:log4js.levels.INFO}))

  #过滤黑名单
  app.use (req,res,next)->
    res.locals.url = req.url
    agent = req.get("user-agent")
    if !agent
      res.end ' hello robot 1'
      return
    for i in [0...black.length]
      if agent.indexOf(black[i]) != -1
        res.end ' hello robot 2'
        return
    next()
  app.use (req,res,next)->
    ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    for i in [0...ipblack.length]
      if ip.indexOf(ipblack[i]) != -1
        res.end ' 404'
        return
    next()
  app.use app.router
  rainbow.route(app, {
    controllers: '/controllers/',
    filters:'/filters/',
    template:'/views/'
  })
  static_jades = {}
  #直接输出静态jade的route，无需自己配置route
  app.get "/:p",(req,res,next)->
    p = req.params.p
    if static_jades[p]
      res.render p+".jade"
      return
    else
      if fs.existsSync path.join(__dirname,'views',p+".jade")
        res.render p+".jade"
        static_jades[p] = true
        return
    next()
  #404
  app.all "*",(req, res, next)->
    res.render '404.jade',{status: 404},(error,page)->
      res.send page,404
  #错误显示页面
  app.use (err, req, res, next)->
    console.trace err
    res.render 'error.jade',{error:err.message,code:err.code},(error,page)->
      res.send page,404

  app.locals.moment= require 'moment'
  app.locals.moment.lang('zh-cn')

  app.locals.pretty = true
  app.locals.stringUtil = require './lib/string-util.coffee'
  app.locals.arrayUtil = require './lib/array-util.coffee'

  app.locals.assets_head = config.assets_head
  app.locals.assets_tm = "8-23"
app.configure "development", ->
  app.use express.errorHandler()
