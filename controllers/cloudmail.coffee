func_mail = __F 'cloudmail'
fs = require("fs")
uuid = require 'node-uuid'
module.exports.controllers = 
  "/post_raw/recieve":
    post:(req,res,next)->
      
      func_mail.add req.body,(error)->
        console.log error
      console.log req.files
      console.log req.body
      
      res.send "ok"
  "/recieve":
    post:(req,res,next)->
      raw_message = req.body.raw_message
      baseExp = /\n\n([A-Za-z0-9+\/\n]*)\n\n/
      fileNameExp = /filename=(.*?)\n/

      result = raw_message.match(baseExp)
      fileNameResult = raw_message.match(fileNameExp)
      filename = ""
      if result&&fileNameResult
        buffer = new Buffer(result[1], "base64")
        filename= __C.resume_path+"/"+uuid.v4()+"-"+req.body.from+"-"+req.body.fromname+"-"+req.body.to+"-"+fileNameResult[1]
        fs.writeFileSync(filename, buffer)
      req.body.filepath = filename
      func_mail.add req.body,(error)->
        console.log error
      console.log req.body
      console.log req.file
      res.send "ok"

