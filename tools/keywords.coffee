require './../lib/modelLoader.coffee'
require './../lib/functionLoader.coffee'

func_search = __F 'search'
csv = require 'csv'
csv()
.from.path("./keywords.csv")
.to.array (data)->
  console.log(data)
  data.forEach (d)->
    func_search.addHis({word:d[0]}) 
#    
Segment = require('segment').Segment
segment = new Segment()
segment.useDefault()
csv()
.from.path("./phrases.csv")
.to.array (data)->
  data.forEach (d)->
    w = d[0]
    ws = segment.doSegment(w)
    ws.forEach (o)->
      if o.w.length>1
        func_search.addHis({word:o.w}) 