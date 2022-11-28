var page = require('webpage').create();
var system= require ("system")
  page.viewportSize = { width: 440, height: 600 };
article_id = system.args[1];
console.log("dddd>>>>>>>>>>>>>>>>")
page.open('http://www.html-js.com/article/'+article_id+'?is_clear=1', function() {
  page.render("./uploads/article_thumb/"+article_id+'.png');
  phantom.exit();
});
