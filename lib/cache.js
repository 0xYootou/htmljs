var cache = {

}
module.exports = {
    get:function(key){
        if(cache[key]){
            if(new Date().getTime()>cache[key].time){
                return '';
            }else{
                console.log(">>>>>>>>>>>>>get from cache:"+key)
                return cache[key].value;
            }
        }else{
            return '';
        }
    },
    set:function(key,value,time){
        cache[key] = {
            value:value,
            time:new Date().getTime()+time
        }
    }
}