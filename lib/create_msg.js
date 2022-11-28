var request = require('request');
fs = require('fs');
var async = require('async')
var moment = require('moment')


function send_msg(story){
    sequelize.query('select user_id,form_id,used from (select * from `music_formid` order by createdAt desc) as t  where used=0 group by user_id ').then(function(forms){
        console.log(forms);
        if(forms&&forms.length){
            request({
                method: 'GET',
                uri: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxe2fe1e9869402625&secret=56c2978a72758d0a6f268b798e27bedc',
                json: true
            }, function (e, r, body) {
                body = JSON.parse(body);
                if(body && body.access_token) {
                    async.eachLimit(forms,2,function(o,callback){
                        create_msg(story,o.user_id,o.form_id,body.access_token);
                        // create_msg(story,'ohg3H5V3Rpqa8458fPUvCz5gji8k','545456f11a127c0f3286eff45c3f68c5',body.access_token);
                        setTimeout(function(){
                            callback();
                        },100);
                    })
                }
            });

        }
    })
}

function create_msg(story,user_id,form_id,access_token) {

    var data = {
        "touser": user_id,
        "template_id": "geZD4qQ1DqdvZIEhRiJDUIMqX-F8kELKH-Qyj2pvHBc",
        "form_id": form_id,
        "page":"pages/index/list/index?toStoryId="+story.id,
        "data": {
            "keyword1": {
                "value": story.title,
                "color": "#D45C57"
            },
            "keyword2": {
                "value": "卓老师",
                "color": "#173177"
            },
            "keyword3": {
                "value": moment().format('LLL'),
                "color": "#173177"
            } ,
            "keyword4": {
                "value": story.desc,
                "color": "#666666"
            }
        },
        // emphasis_keyword:"keyword1.DATA"
    }
    request({
        method: 'POST',
        uri: 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + access_token,
        body: JSON.stringify(data)
    }, function (e, r, body) {
        console.log(body);
        sequelize.query('UPDATE `music_formid` SET `used` = \'1\' WHERE `form_id`=\''+form_id+'\' ')
    })
}
module.exports = send_msg;
