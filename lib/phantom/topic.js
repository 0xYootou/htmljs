var page = require('webpage').create();
var system= require ("system")
  page.viewportSize = { width: 440,height:127};
article_id = system.args[1];
page.open('http://www.html-js.com/topic/'+article_id+'?is_clear=1', function() {
  page.render("./uploads/article_thumb/topic-"+article_id+'.png');
  phantom.exit();
});