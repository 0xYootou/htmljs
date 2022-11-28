config = require './../config.coffee'
authorize=require("./../lib/sdk/authorize.js");
md5 = require 'MD5'
fs = require ("fs")
Sina=require("./../lib/sdk/sina.js")
sina=new Sina(config.sdks.sina)
uids =  ["2252437617", "1846033411", "2178801065", "1831341547", "5141278301", "2681090281", "2806931970", "3292220974", "2972790670", "3386378800", "1784310664", "1742204845", "2929980180", "2689385573", "5283165711", "1677535517", "3803546831", "1799944952", "3911319195", "2643806542"]
accesses = [
#  '2.00wVkPsB0TxWcicc5109411a3ZiiaE',
#  '2.00fsus3D0TxWci14bea75806wgrFKE',
#  '2.00hD64tB0TxWci4963829b470VOKJE',
#  '2.00bQrlEC0TxWci8873a0be81Wuh9aC',
  '2.00Zc6zuB0TxWcia6e9294baa291LtD',
  '2.00XEnI3C0TxWci8ad819fc67zLWjqD',
  '2.00WuTR6C0TxWci428aab7cddriUDIC',
  '2.00LwfzbC0TxWci34e2459e3b0QaFEv',
  '2.00vOHeED0TxWcie221532e40rp2OQD',
  '2.00t5SBVD0TxWcid0931f8fc34FicLE',
  '2.00MzSjqB0TxWcie655cae2970cDLqE',
  '2.001omjGC0TxWci98ee730da1u7IZWB',
  '2.006M6mvB0TxWciaf600088aeguTsPD',
  '2.00NzjtED0TxWci3dd12fd6f12H4G4E',
  '2.00LNw1AC0TxWcied3d33bb34U2dGHC',
  '2.00h9IY2C0TxWci2da6dab3e4pjuVgE',
  '2.005uhVWD0TxWcia99064e528w3iafE',
  '2.00fS7egC0TxWci531bbe9060jkrxID',
  '2.000I6BeE0TxWci9c648ddac6pDgoMD',
  '2.00zd96FC0TxWciad616cdfcd0yHptj',
  '2.00VYDhqC0TxWci5c70e1f3e0TLBwfB',
  '2.00fsus3D0TxWci67da164467XENWpD',
  '2.00wVkPsB0TxWcicc5109411a3ZiiaE'
]
queuedo = require("queuedo")

uids = require("./comments.json")
commented = require("./commented.json")

weiboid = "3797563129883982"
index = 0;
queuedo uids,(id,next,context)->
  if commented.indexOf(id) != -1
    next.call(context)
    return
  if(index>=accesses.length)
    process.exit()
  sina.comments.create
    id:id
    comment:"推荐一个ios下面的软件，输入【颜文字】超方便，直接在输入法里输入，表情也非常多，AppStore搜索【颜文字 输入法】第一个就是。"
    access_token:accesses[index]
    rip:"122.224.209.220"
  ,(error,message)->
      if error&&(error.message=="发布内容过于频繁"||error.message=="用户不存在"||error.message=="用户请求特殊接口 (%s) 频次超过上限")
        console.log error
        index++
        console.log("now:"+accesses[index])
        return
      if (!error)
        console.log("success")
        commented.push(id)
        fs.writeFileSync './commented.json',JSON.stringify(commented,null,4),'utf-8'
      else
        console.log error
        commented.push(id)
        fs.writeFileSync './commented.json',JSON.stringify(commented,null,4),'utf-8'
  setTimeout ()->
    next.call(context)
  ,1500
,()->
  console.log("end")