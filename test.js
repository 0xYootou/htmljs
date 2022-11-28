var request = require('request');

request.get({rejectUnauthorized:false,uri:'https://api.dribbble.com/v1/shots?list=&page=1&per_page=30&sort=&timeframe=week'},function(e,r,body){
console.log(r.headers);
})
