var request = require('request');
fs = require('fs');

module.exports = function(music_id){
    request.get({
        uri:'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxe2fe1e9869402625&secret=56c2978a72758d0a6f268b798e27bedc',
        json:true
    },function(e,r,body){
        body = JSON.parse(body);
        if(body&&body.access_token){
            request({
                method: 'POST',
                uri:'https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token='+body.access_token,
                body:'{"path": "pages/index/detail/index","scene":"'+music_id+'", "width": 430}'
            }).pipe(fs.createWriteStream('./static/xqr/' + music_id + '.png'));
        }else{
        }
    })
}