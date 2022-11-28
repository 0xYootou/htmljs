//var APPLICATION_NAME = 'htmljs';
//var API_KEY = '824cf53f197167cd94ba0815649d3749';
//require('strong-agent').profile(API_KEY, APPLICATION_NAME);
global.console.log = function(data) {
    var now = new Date()
    console.info(now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate() + " " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds())
    console.info(data);
}
var CoffeeScript = require('coffee-script');
 CoffeeScript.register();
require("./lib/functionLoader.coffee")
require("./lib/modelLoader.coffee")

var server = require("./index.js")

require('http').createServer(server).listen(server.get("port"), function() {
    console.log("Express server listening on port " + server.get("port"));
}).setMaxListeners(0);
(function(){
    var use = process.memoryUsage().rss/1024/1024;
    if(use>240){
        console.log("memory out")
        process.exit();
    }else{
        console.log("memery use:"+use)
    }
},10000)
