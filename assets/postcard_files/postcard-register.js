var Postcard = function() {
    function Postcard() {
        this.eventDom = {
            domBox: "#postcard-register",
            postBtn: "#post-btn",
            codeBtn: "#code-btn",
            userName: "#username"
        }, this.dom = {
            tooltipsBox: "#tooltips-box",
            phoneBox: "#phone",
            origin: "#origin"
        }, this.postData = {};
        try {
            this.origin = location.search.match(/origin=(.*)/)[1]
        } catch (e) {
            this.origin = "registered"
        }
    }
    return Postcard.prototype = {
        init: function() {
            citySelectComponent("#province", "#city"), $(this.dom.origin).val(this.origin), this.initEvent();
            var scriptga = document.createElement("script"),
                scripts = document.getElementsByTagName("script")[0];
            scriptga.async = !0, scriptga.onload = function() {
                ga("create", "UA-47356760-1", "auto"), ga("send", "pageview")
            }, scriptga.src = "http://itianpin1.qiniudn.com/analytics.js", scripts.parentNode.insertBefore(scriptga, scripts);
            ! function() {
                var hm = document.createElement("script");
                hm.src = "//hm.baidu.com/hm.js?86e8d0efc9ab5cf039555f5c0ac917d2", hm.async = !0;
                var s = document.getElementsByTagName("script")[0];
                s.parentNode.insertBefore(hm, s)
            }()
        },
        initEvent: function() {
            function open(elem) {
                if (document.createEvent) {
                    var e = document.createEvent("MouseEvents");
                    e.initMouseEvent("mousedown"), elem[0].dispatchEvent(e)
                } else element.fireEvent && elem[0].fireEvent("onmousedown")
            }
            var _this = this;
            $(this.eventDom.domBox).on(CLICK, this.eventDom.postBtn, function() {
                _this.organizationData()
            }), $(this.eventDom.domBox).on(CLICK, this.eventDom.codeBtn, function() {
                return "disabled" == $(this).attr("disabled") ? !1 : void _this.sendSms()
            }), $(this.eventDom.domBox).on("blur", this.eventDom.userName, function() {
                _this.exists()
            }), $(".pc-arrow").click(function() {
                open($(this).prev("select"))
            }), this.registerAction(), this.selectionChange()
        },
        organizationData: function() {
            var _this = this,
                postFlag = !1,
                elLength = $(this.eventDom.domBox).find("input,textarea,select").length;
            $(this.eventDom.domBox).find("input,textarea,select").each(function(i) {
                if ("" == this.value) return $(_this.dom.tooltipsBox).find("span").text("请输入" + $(this).attr("placeholder")), $(_this.dom.tooltipsBox).addClass("itp-show").removeClass("itp-hide"), !1;
                var zip = $("#zip_code").val().trim();
                return /^[0-9]{6}$/.exec(zip) ? ($(_this.dom.tooltipsBox).removeClass("itp-show").addClass("itp-hide"), _this.postData[this.id] = this.value, void(i == elLength - 1 && (postFlag = !0))) : ($(_this.dom.tooltipsBox).find("span").text("邮编格式不正确"), $(_this.dom.tooltipsBox).addClass("itp-show").removeClass("itp-hide"), !1)
            }), postFlag
        },
        exists: function() {
            var _this = this,
                userName = $(this.eventDom.userName).val();
            "" === userName || userName.length < 2 || userName.length > 10 ? ($(_this.dom.tooltipsBox).find("span").text("请填写2-10个字以内的昵称"), $(_this.dom.tooltipsBox).addClass("itp-show").removeClass("itp-hide")) : ($(_this.dom.tooltipsBox).removeClass("itp-show").addClass("itp-hide"), base.doExists(function(data) {
                102 == data.errno ? ($(_this.dom.tooltipsBox).find("span").text("昵称已经存在哦！"), $(_this.dom.tooltipsBox).addClass("itp-show").removeClass("itp-hide")) : $(_this.dom.tooltipsBox).removeClass("itp-show").addClass("itp-hide")
            }, {
                username: userName
            }))
        },
        sendSms: function() {
            function CtoH(obj) {
                for (var str = obj.val(), result = "", i = 0; i < str.length; i++) result += String.fromCharCode(12288 != str.charCodeAt(i) ? str.charCodeAt(i) > 65280 && str.charCodeAt(i) < 65375 ? str.charCodeAt(i) - 65248 : str.charCodeAt(i) : str.charCodeAt(i) - 12256);
                return obj.val(result), obj.val()
            }
            var _this = this,
                setTimer = null,
                phoneNum = CtoH($(this.dom.phoneBox));
            "" === phoneNum || 11 !== phoneNum.length ? ($(_this.dom.tooltipsBox).find("span").text("请输入正确的手机号"), $(_this.dom.tooltipsBox).addClass("itp-show").removeClass("itp-hide")) : ($(_this.dom.tooltipsBox).removeClass("itp-show").addClass("itp-hide"), base.doSendSms(function(data) {
                if (101 == data.errno) $(_this.dom.tooltipsBox).find("span").text("您的手机号码参与过了"), $(_this.dom.tooltipsBox).addClass("itp-show").removeClass("itp-hide");
                else if (701 == data.errno) $(_this.dom.tooltipsBox).find("span").text(data.message), $(_this.dom.tooltipsBox).addClass("itp-show").removeClass("itp-hide");
                else {
                    $(_this.dom.tooltipsBox).removeClass("itp-show").addClass("itp-hide"), $(_this.eventDom.codeBtn).text("重新发送(60)").attr("disabled", "disabled");
                    var second = 59;
                    setTimer = setInterval(function() {
                        return $(_this.eventDom.codeBtn).text("重新发送(" + second + ")"), 1 == second ? ($(_this.eventDom.codeBtn).text("发送验证码").removeAttr("disabled"), clearInterval(setTimer), !1) : void second--
                    }, 1e3)
                }
            }, {
                phone: phoneNum,
                origin: this.origin
            }))
        },
        verifySmsAction: function() {
            var _this = this;
            $(this.eventDom.domBox).bind("doVerifySms", function(event, data) {
                var _data = data;
                $(_this.eventDom.domBox).trigger("doRegister", _data)
            })
        },
        registerAction: function() {
            var _this = this;
            $(this.eventDom.domBox).bind("doRegister", function(event, data) {
                $("#post-btn").attr("disabled", !0), base.doActivityRegister(function(data) {
                    var _data = data.body || {};
                    0 == data.errno ? location.href = "/m/activity/card_user_info?u_name=" + _data.username : 110 == data.errno ? location.href = "/m/activity/card_user_info?u_name_refresh=" + _data.username : ($(_this.dom.tooltipsBox).find("span").text(data.message), $(_this.dom.tooltipsBox).addClass("itp-show").removeClass("itp-hide"), $("#post-btn").removeAttr("disabled"))
                }, data)
            })
        },
        getSelectValue: function(select, id) {
            if (0 == select) return "";
            for (var obj = $(id).find("option"), i = 0, len = obj.length; len > i; i++)
                if (select == $(obj[i]).val()) return $(obj[i]).text()
        },
        selectionChange: function() {
            var _self = this;
            $("#province").on("change", function() {
                var province = _self.getSelectValue($(this).val(), "#province"),
                    city = _self.getSelectValue($("#city").val(), "#city");
                $("#address").val(province + " " + city + " ")
            }), $("#city").on("change", function() {
                var province = _self.getSelectValue($("#province").val(), "#province"),
                    city = _self.getSelectValue($(this).val(), "#city");
                $("#address").val(province + " " + city + " "), $("#address").focus()
            })
        },
        validate: function() {}
    }, Postcard
}();