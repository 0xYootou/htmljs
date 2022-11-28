/* 2014-09-25 15:38 */


/**
 * loadImg  图片预加载
 * @param   {Array}     预加载图片的对象数组
 * author   jianminlu
 * update   2014-06-20 9:35:13
 */
var loadImg = function(pics, callback){
    var index = 0;
    var len = pics.length;
    var img = new Image();
    var flag = false;

    var progress = function(w){
        $('.loading-progress').animate({width:w}, 100, 'linear', function(){
            $(".loading-num").html(w);
            $("#pic").attr({"src": img.src});
        });
    }
    var load = function(){
        img.src = pics[index];
        img.onload = function() {
            progress(Math.floor(((index + 1) / len) * 100) + "%");
            index ++ ;
            if (index < len) {
                load();
            }else{
                callback()
            }
        }
        return img;
    }
    if(len > 0){
        load();
    }else{
        progress("100%");
    }

    return {
        pics: pics,
        load: load,
        progress: progress
    };
}

var TAP = ("WEB"=="WEB")?"mousedown":"tap";
var AUDIO;
var cardIndex = 0;
var _pick_switch_ = true;
var _play_switch_ = true;
var bingo = 0;

$('.playaudio').on(TAP,function(){
    if(_play_switch_){
        _play_switch_ = false;
        var $this = $(this);
        var $card = $this.parent();
        var key = parseInt($card.attr('audiokey'));

        AUDIO = AUList[key];
        AUDIO.play();
        AUDIO.loop = true;
        $card.find('p.musicname').text('\u6b63\u5728\u8f7d\u5165\u6b4c\u66f2, \u8bf7\u7a0d\u7b49\u7247\u523b...');
        AUDIO.onplaying = function(){
            $this.hide();
            $card.find('img.playingaudio').addClass('rotatingLoader');
            $card.find('p.musicname').text('\u8bf7\u9009\u62e9, \u8fd9\u9996\u6b4c\u7684\u6f14\u5531\u8005\u53eb\u4ec0\u4e48?');
        };
        AUDIO.addEventListener('playing',AUDIO.onplaying, false);
        AUDIO.onpause = function(){
            $card.find('img.playingaudio').removeClass('rotatingLoader');
            $this.show();
            _play_switch_ = true;
        }
        AUDIO.addEventListener('ended', AUDIO.onpause, false);
    }
});

var arrRes = [];
var resList = function(arrRes){
    $res_list = $("#res_list");
    var len = $("#mc_content .mc_card").length;
    var html = "";
    for(var i = 0; i < len; i++){
        if(arrRes[i]){
            html += "<li class=" + arrRes[i] + "></li>";
        }else{
            html += "<li></li>";
        }
    }
    $res_list.html(html);
}
resList(arrRes);

$('ul.topic_list li').on(TAP, function(){
    var $this = this;
    $(this).addClass("active");
    if(_play_switch_){
        alert('\u8bf7\u5148\u70b9\u51fb\u64ad\u653e' + NAME + '\u7684\u5531\u7247, \u518d\u9009\u6f14\u5531\u8005\u54e6~');
        return false;
    }
    if(_pick_switch_){
        _pick_switch_ = false;
        var $this = $(this);
        var $card = $this.parent().parent();
        if($this.text() != $card.attr('bingo')){
            arrRes.push("error");
        }else{
            arrRes.push("right");
            bingo ++;
        }
        setTimeout(function(){
            showCard();
        },600);
        AUDIO.pause();
        AUDIO.onpause();
        resList(arrRes);
    }
});


function showCard(){
    console.log("showCard："+cardIndex)
    if(cardIndex-1 >= 0){
        $('.mc_card').eq(cardIndex-1).addClass('right_to_left_fadeOut');
            $('.mc_card').eq(cardIndex-1).hide();
            $('.mc_card').eq(cardIndex).show().addClass('right_to_left_fadeIn');
            cardIndex++;
    }else{
        $('.mc_card').eq(cardIndex).show().addClass('right_to_left_fadeIn');
        cardIndex++;
    }
    _pick_switch_ = true;
    _play_switch_ = true;



    var timer = setInterval(function(){
        if( cardIndex > 1){
            $('.playaudio').eq( cardIndex - 1).mousedown();
            clearInterval(timer);
        }
    }, 100);


    var len = $("#mc_content .mc_card").length;

    if(cardIndex > len){
        var mc_title ='';
        var mc_desc = ''; 
        var my_score = bingo / len * 100;

        if(my_score >= 100){
            mc_title = '\u4f60\u7b54\u5bf9\u4e86<span>' + my_score + '% </span>' + reData.lv5.title;
            mc_desc = reData.lv5.desc;
        }else if(my_score >= 80){
            mc_title = '\u4f60\u7b54\u5bf9\u4e86<span>' + my_score + '% </span>' + reData.lv4.title;
            mc_desc = reData.lv4.desc;
        }else if(my_score >= 60){
            mc_title = '\u4f60\u7b54\u5bf9\u4e86<span>' + my_score + '% </span>' + reData.lv3.title;
            mc_desc = reData.lv3.desc;
        }else if(my_score >= 30){
            mc_title = '\u4f60\u7b54\u5bf9\u4e86<span>' + my_score + '% </span>' + reData.lv2.title;
            mc_desc = reData.lv2.desc;
        }else{
            mc_title = '\u4f60\u7b54\u5bf9\u4e86<span>' + my_score + '% </span>' + reData.lv1.title;
            mc_desc = reData.lv1.desc;
        }

        $(".sharebtn").attr({
            "data-title": mc_title.replace("<span>", "").replace("</span>", ""),
            "data-des": mc_desc,
        });

        $('#mine_title').html(mc_title);
        $('#mine_desc').html(mc_desc);

        document.title = mc_title.replace("<span>", "").replace("</span>", "");

        $('#mc_content').remove();
        $('#mc_result').show();
    }
}
$("#mc_result").on("touchstart",function(){
    window.location.href=$(".ssharebtn").attr("href");
})
function creatVideo(did){
    var scale = 16 / 9;
    var ww = $(window).width();
    var dom = $("#" + did);
    var vid = dom.attr("data-vid");
    var pic = dom.attr("data-pic");
    var video = new tvp.VideoInfo();
    video.setVid(vid);
    var player = new tvp.Player();
    player.create({
        width: ww,
        height: ww / scale,
        video: video,
        modId: did,
        pic: pic,
        autoplay: false
    });

}

// rotate 
var rotate = function(){
    var angle = 0;
    var temp = 0;
    var flag = true;
    var $modA = $("#modA");
    var $modB = $("#modB");
    var $mainL = $("#mainLeft");
    var $mainR = $("#mainRight");
    touch.on($modB, 'touchstart', function(ev){
        ev.startRotate();
        ev.preventDefault();
    });
    touch.on($modB, 'rotate', function(ev){
        var totalAngle = angle + ev.rotation;
        if(ev.fingerStatus === 'end'){
            angle = angle + ev.rotation;
        }
        $modA.css({
            "-webkit-transform": 'rotate(' + totalAngle + 'deg)',
                    "transform": 'rotate(' + totalAngle + 'deg)'
        });
        $modB.css({
            "-webkit-transform": 'rotate(' + totalAngle + 'deg)',
                    "transform": 'rotate(' + totalAngle + 'deg)'
        });
        totalAngle = totalAngle < 0 ? -totalAngle : totalAngle;

//        if(totalAngle > 10){
//            $mainL.animate({"left": "0%"}, 800);
//            $mainR.animate({"right": "0%"}, 800);
//            setTimeout(function(){
//                $("#rotateBox").css({top:"-100%"}).hide();
//                if(flag){
//                    $('#mc_content').show();
//                    showCard();
//                }
//                flag = false;
//            }, 1000);
//        }
/*
        temp = (totalAngle / 720) * 100 > 50 ? 50 : (totalAngle / 720) * 100;
        $mainL.css({"left": - (50 - temp) + "%"});
        $mainR.css({"right": - (50 - temp) + "%"});

        if(temp == 50){
            $("#rotateBox").css({top:"-100%"}).hide();
            if(flag){
                $('#mc_content').show();
                showCard();
            }
            flag = false;
        }
*/
    });
}

// Screen
var Screen = {
    ww: $(window).width(),
    wh: $(window).height(),
    main: $("#main"),
    screen: $("#main .screen"),
    len: $("#main .screen").length,
    idx: 0,
    flag: true,
    page: function (i){
        var _this = this;
        var $modA = $("#modA");
        var $modB = $("#modB");
        var $mainL = $("#mainLeft");
        var $mainR = $("#mainRight");
        var angle = 0;
        var temp = 0;

        _this.main.css({ "-webkit-transform": "translate3d(0px, -" + _this.wh * i +"px, 0px)"});
        _this.screen.find(".inner").removeClass("current");
        _this.screen.find(".inner").eq(i).addClass("current");
        if(i==1){
            $("#screen-2 .tip").addClass("disappear")
            $("#screen-2 .wutai").addClass("appear")
            $("#screen-2 .mu .l").addClass("mu-l")
            $("#screen-2 .mu .r").addClass("mu-r")
            setTimeout(function(){
                $("#screen-2 .light").addClass("flash")
                $(".mc_content").show();

            },3000)
            setTimeout(function(){
                $("#screen-3").show();
                showCard()
                $('.playaudio').trigger(TAP)
            },4000)
        }
//        if(i == 2 && _this.flag){
//            _this.flag = false;
//            setTimeout(function(){
//                $("#rotateBox").css({top:"0"}).show();
//                rotate();
//            }, 600);
//        }else{
//            $("#rotateBox").css({top:"-100%"}).hide();
//            $modA.css({
//                "-webkit-transform": 'rotate(' + angle + 'deg)',
//                        "transform": 'rotate(' + angle + 'deg)'
//            });
//            $modB.css({
//                "-webkit-transform": 'rotate(' + angle + 'deg)',
//                        "transform": 'rotate(' + angle + 'deg)'
//            });
//            $mainL.css({"left": - (50 - temp) + "%"});
//            $mainR.css({"right": - (50 - temp) + "%"});
//        }
    },
    mainSwipe: function(){
        var _this = this,
            _len = _this.len,
            $main = _this.main;
            /*
        touch.on($main, 'swipeup', function(ev){
            _this.idx ++;
            _this.idx = _this.idx > _len - 1 ? _len - 1 : _this.idx;
            _this.page(_this.idx);
        });
        touch.on($main, 'swipedown', function(ev){
            _this.idx --;
            _this.idx = _this.idx < 0 ? 0 : _this.idx;
            _this.page(_this.idx);
        });
        */
        _this.screen.each(function(index, obj){
            $(obj).on("swipeUp", function(){
                _this.idx ++;
                _this.idx = _this.idx > _len - 1 ? _len - 1 : _this.idx;
                _this.page(_this.idx);
            }).on("swipeDown", function(){
                _this.idx --;
                _this.idx = _this.idx < 0 ? 0 : _this.idx;
                _this.page(_this.idx);
            });
        });
    },
    init: function(){
        var _this = this,
        $w = _this.ww,
        $h = _this.wh,
        $main = _this.main,
        $screen = _this.screen,
        len = _this.len;
        $("#screen-2 .mu").on("touchstart",function(){

            
        })
        var ua = UA();
        if(ua.iphone && ua.qqnews){
            $h = $h - 44;
            _this.wh = _this.wh - 44;
        }

        // 初始化元素高度
        $main.css({"width": $w + "px", "height": $h * _this.len + "px"}).addClass("ease");
        $screen.css({"width": $w + "px", "height": $h + "px"});
        $("#screen-3").css({"width": $w + "px", "height": $h + "px"});
        // 初始化 page(0)
        _this.page(_this.idx);

        // 初始化 swipe
        _this.mainSwipe();

        // 列表边距
        $('ul.topic_list li').css({"margin-bottom": ($h - 180) / 20 + "px"});

        // 视频初始化
        creatVideo("mod_player");
/*
        setTimeout(function(){
            $("#mod_player>div").height( $w * 9 / 16);
        }, 100);
*/

        // 视频播放相关
        var scale = 16 / 9;
        $(".playBtn").each(function(i, o){
            if($(o) && $(o).attr("data-vid")){
                $(o).on("click", function(){
                    $("#mainvideo").css({"padding-top": ($h - $w / scale) / 2 + "px", height: $w / scale + "px"}).show();
                    var video = new tvp.VideoInfo();
                    video.setVid($(this).attr("data-vid"));
                    var player = new tvp.Player();
                    player.create({
                        width: $w,
                        height: $w / scale,
                        video:video,
                        modId:"mod_player", //mod_player是刚刚在页面添加的div容器
                        pic: $(this).attr("data-pic"),
                        autoplay:true,
                    });
                    setTimeout(function(){
                        $("#mod_player>div").height( $w / scale);
                    }, 100);
                });
                $("#close").on("click", function(){
                    $("#mainvideo").hide();
                    $("#mod_player div").remove();
                });
            }
        });
    }
}

/**
 * mSahre 移动端分享功能 新闻客户端
 */
/* ua */
var UA = function(){
    var userAgent = navigator.userAgent.toLowerCase();
    return {
        ipad: /ipad/.test(userAgent),
        iphone: /iphone/.test(userAgent),
        android: /android/.test(userAgent),
        qqnews: /qqnews/.test(userAgent),
        weixin: /micromessenger/.test(userAgent)
    };
}
var mShare = {
    main: function(o){
        var _this = this;
        var d = {
            title: o.title || document.title,
            pic: o.pic || "",
            des: o.des || "",
            url: o.url || document.location.href
        };
        var ua = UA();
        switch(true){
            case ua.qqnews:
                window.TencentNews.shareFromWebView(d.title, d.des, d.pic);
                break;
            case ua.weixin:
                $(".wx_tips").show();
                $('.wx_tips').off('click').on('click',function(){
                   $('.wx_tips').hide();
                });
                //执行
                document.addEventListener('WeixinJSBridgeReady', function() {
                    onBridgeReady();
                });
                break;
            default:
                window.location = "http://share.v.t.qq.com/index.php?c=share&a=index&appkey=801378464&url="
                                + d.url + "&title="
                                + d.title + "&pic="
                                + d.pic;
                break;
        };
    },
    init: function(o){
        var _this = this;
        $(o.btn).bind("click", function(){
            var _o = $(this);
            $("#mc_result").addClass("mc_result_click");
            _this.main({
                title: _o.attr("data-title"),
                pic: _o.attr("data-pic"),
                des: _o.attr("data-des"),
                url: _o.attr("data-url")
            });
        });
    }
};
mShare.init({btn: ".sharebtn"});

//微信分享
function onBridgeReady() {
    var o = $(".sharebtn");
    var mainTitle = document.title,
        mainDesc = document.title,
        mainURL = o.attr("data-url") || window.location.href,
        mainImgUrl = o.attr("data-pic");
    //转发朋友圈
    WeixinJSBridge.on("menu:share:timeline", function(e) {
        var data = {
            img_url: mainImgUrl,
            img_width: "120",
            img_height: "120",
            link: mainURL,
            //desc这个属性要加上，虽然不会显示，但是不加暂时会导致无法转发至朋友圈，
            desc: mainDesc,
            title: mainTitle
        };
        WeixinJSBridge.invoke("shareTimeline", data, function(res) {
            WeixinJSBridge.log(res.err_msg)
        });
    });
    //同步到微博
    WeixinJSBridge.on("menu:share:weibo", function() {
        WeixinJSBridge.invoke("shareWeibo", {
            "content": mainDesc,
            "url": mainURL
        }, function(res) {
            WeixinJSBridge.log(res.err_msg);
        });
    });
    //分享给朋友
    WeixinJSBridge.on('menu:share:appmessage', function(argv) {
        WeixinJSBridge.invoke("sendAppMessage", {
            img_url: mainImgUrl,
            img_width: "120",
            img_height: "120",
            link: mainURL,
            desc: mainDesc,
            title: mainTitle
        }, function(res) {
            WeixinJSBridge.log(res.err_msg)
        });
    });
};/*  |xGv00|c5153ca3059f241bffc905ea9a2ccb44 */
