var fs = require ('fs')
dict = fs.readFileSync("./../dict.txt")
function divide(text){  
    if(text.length==0) return true;  
    var word = text.substring(0,1)+"";  
    var regExp = /\w/;  
    //英文  
    if(regExp.test(word)){  
        var tmp = text.replace(/^\s*(\w+)\s*.*$/,"$1");  
        text = text.replace(/^\s*\w+\s*/,"");  
        rs.push(tmp);  
        divide(text);  
        return;  
    }  
      
    var words = [];  
    var end = 0;  
    var start = -1;  
    while((start = dict.indexOf('\r\n'+word,end))!=-1){  
        end = dict.indexOf('\r\n',start+1);  
        if(start==-1||end==-1) return false;  
        if(start>end) return false;  
        words.push(dict.substr(start,end-start).replace(/(\r\n|\s)/g,""));  
    }      
      
    var tmp = "";  
    for(j=0;j<words.length;j++){  
        //找到最长的词，当然也可以将所有词保留  
        if(text.indexOf(words[j])!=-1&&words[j].length>tmp.length){  
            tmp=words[j];  
        }  
    }  
    //词库不存在的词  
    if(tmp == ""){  
        tmp = word;          
    }  
    text=text.replace(tmp,"");  
    if(tmp.replace(/\s/g,'')!="")  
        rs.push(tmp);  
    divide(text);  
}  

    rs = [];  
    divide("找到最长的词，当然也可以将所有词保留  "); 
    console.log(rs) 
