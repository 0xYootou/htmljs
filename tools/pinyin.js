var pinyin = require ("./../lib/PinYin.js")

console.log()

var toPinyin = function(txt){
 return pinyin(txt,{heteronym: false,style: pinyin.STYLE_NORMAL}).join("")
}

console.log(toPinyin("大四学生参加面试，没有太多经验，如何在面试中体现自己的优势？"))