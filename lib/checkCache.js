module.exports = function(req){
    var userAgent = req.headers['user-agent'].toLowerCase();
    if(userAgent.indexOf("bot")!=-1||userAgent.indexOf("spider")!=-1){
        return true;
    }
    return false;
}