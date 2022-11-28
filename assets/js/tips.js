var Tip = function(){
    this.ele = null;
    this.url = null;
    this.commentForm =null;
    this.lastTip = null;
    this.commentsTpl = null;
    this.commentList = null;
    this.is_hide = true;
}
var getRandomColor = function() {
    return  '#' +
        (function (color) {
            return (color += '0123456789abcdef'[Math.floor(Math.random() * 16)])
                && (color.length == 6) ? color : arguments.callee(color);
        })('');
}
Tip.prototype = {
    init:function(_config){$("<div class='tip-comments'></div>")
        this.ele = $(_config.selector);
        this.url = _config.url;
        this.uuid = _config.uuid
        this.commentsTpl = $("#tip_tpl").html()
        this.container = $("<div class='tip-comments'><ul class='comment-list'></ul></div>")
        this.commentList = $(".comment-list",this.container);
        this.container.appendTo(this.ele)
        this._createView();
        this._bind();
        this._loadTips();
        this._hideComments();

    },
    _load:function(){

    },
    _createView:function(){
        this.commentForm = $('<form class="tip-comment-form">'+
            '<textarea placeholder="添加讨论…" class="tip-comment-textarea" ></textarea>'+
            '<div class="form-control" >'+
            '<button class="tip-submit" type="submit">提交</button>'+
            '</div>'+
            '</form>')
        this.commentForm.appendTo(this.container)
    },
    _bind:function(){
        var self = this;
        this.ele.on("dblclick",function(e){
            if(self.is_hide){
                self._createTip(e.pageX-self.ele.offset().left, e.pageY-self.ele.offset().top);
                e.stopPropagation()
            }else{

            }
        })
        $(".cancel",this.commentForm).on("click",function(){

        })
        this.commentForm.on("click",function(e){
            e.stopPropagation();
        }).on("submit",function(e){
            e.preventDefault();

            var submitData = {
                target_id:self.uuid,
                content:$("textarea",self.commentForm).val(),
                page_x:self.lastTip?self.lastTip.x:0,
                page_y:self.lastTip?self.lastTip.y:0
            }
            if(!submitData.content ){
                messageTip.show("请填写内容~~")
                return;
            }
            if(self.commentForm.tipId){
                submitData.parent_id = self.commentForm.tipId
            }
            HtmlJS.util.ajax(self.url,submitData,"post",function(data){
                if(data.code){
                    alert("在一个页面最多只能添加5枚评注")
                }else{
                    self._loadTip(self.commentForm.tipId?self.commentForm.tipId:data.id)
                    $("textarea",self.commentForm).val("")
                    self.lastTip.uuid = data.id
                }

            },function(){

            },null,function(){
                HtmlJS.util.ajax(self.url,submitData,"post",function(data){
                    if(data.code){
                        alert("在一个页面最多只能添加5枚评注")
                    }else{
                        self._loadTip(self.commentForm.tipId?self.commentForm.tipId:data.id)
                        $("textarea",self.commentForm).val("")
                        self.lastTip.uuid = data.id
                    }
                },function(){

                },null,function(){

                })
            })
        })
        $(document.body).on("click",function(){
            self._hideComments()
        })
        $("#hide_tip").on("click",function(e){
            e.stopPropagation();
            if(this.checked){
                $(".tip-point").hide();
            }else{
                $(".tip-point").show();
            }
        })
    },
    _hideComments:function(){
        this.is_hide = true;
        this.container.hide();
    },
    _showComments:function(){
        this.is_hide = false;
        this.container.show();
    },
    _loadTip:function(tipId){
        var self = this;
        $.ajax({
            url:"/tip/"+tipId,
            success:function(tips){
                if(tips.length){
                    var html = Mustache.render(self.commentsTpl,{
                        tips:tips
                    })
                    self.commentList.html(html);
                    self.commentForm.tipId = tips[0].id
                    self.container.css({
                        left:tips[0].page_x,
                        top:tips[0].page_y
                    })
                    self._showComments();

                }
            }
        })
    },
    _loadTips:function(){
        var self = this;
        $.ajax({
            url:"/tip/p/"+this.uuid,
            success:function(tips){
                if(tips.length){
                    tips.forEach(function(t){
                        var tip = $("<a class='tip-point' data-id='"+ t.id+"'><div class='pulse-inner1'></div><div class='pulse-inner2'></div></a>")
                        tip.css({
                            left: t.page_x-9,
                            top: t.page_y-9,
                            background:getRandomColor()
                        })
                        tip.x = t.page_x;
                        tip.y = t.page_y;
                        tip.id = t.id
                        self.ele.append(tip);
                        tip.on("mouseenter",function(){
                            $(".tip-point").removeClass("active");
                            $(this).addClass("active")
                            self._loadTip(tip.id)
                        }).on("mouseleave",function(){

                        })

                    })

                }
            }
        })
    },
    _createTip:function(x, y){
        if(this.lastTip&&!this.lastTip.uuid){
            this.lastTip.remove();
        }
        var tip = $("<a class='tip-point'><div class='pulse-inner1'></div><div class='pulse-inner2'></div></a>")
        tip.css({
            left:x-9,
            top:y-9,
            background:getRandomColor()
        })
        tip.x = x;
        tip.y = y;
        this.commentList.html("")
        this._showComments();
        this.container.css({
            left:x,
            top:y
        })
        tip.addClass("active");
        this.commentForm.tipId = null;
        this.ele.append(tip);
        this.lastTip = tip;
    }
}
