var page = require('webpage').create();
page.viewportSize = {
    width: 440,
    height: 600
};
page.open('http://www.html-js.com/static/htmljs-weekly-6-clear.html', function() {
    page.render('example.png');
    phantom.exit();
});