
config = require './../config.coffee'
search  = 
  add:(data,callback)->
    childProcess = require('child_process')
    childProcess.execFile "php", [config.xunsearch_bin+"/action/add.php",encodeURIComponent(JSON.stringify(data))],(err, stdout, stderr)->
      console.log stdout
      callback(stderr,stdout)
  query:(data,callback)->
    childProcess = require('child_process')
    childProcess.execFile "php", [config.xunsearch_bin+"/action/query.php",encodeURIComponent(JSON.stringify(data))],(err, stdout, stderr)->
      console.log stdout
      callback(stderr,stdout)


module.exports = search