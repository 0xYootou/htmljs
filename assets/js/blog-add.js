var html = "<div class='hihihi-wrapper'><form action='' method='post' id='hihihi-form'>" +
    "<div style='line-height:30px;font-weight:bold;font-size:14px;'>采集标题</div><div class='hihihi-title'></div><div style='line-height:30px;font-weight:bold;font-size:14px;'>采集内容</div><div class='hihihi-content'></div>" +
    "<input id='hihihi-title' name='title' style='display:none;'/><textarea style='display:none;' id='hihihi-content' name='content'></textarea><button style='height:25px;width:90px;font-size:14px;' id='hihihi-submit'>提交</button></form></div>";
alert("首先采集标题，移动鼠标到标题上，然后点击")
$(document.body).append("<style>.hihihi{background:#ddd !important;}" + ".hihihi-wrapper{position:fixed;right:0;top:0;width:300px;padding:10px;background:#ddd;z-index:10000000;}" + ".hihihi-title{}" + ".hihihi-content{max-height:400px;overflow:auto;}" + "</style>").append(html)
$("*").on("mouseover", function(e) {
    if (already) return false;
    $(".hihihi").removeClass("hihihi")
    $(this).addClass("hihihi")
    e.stopPropagation();
}).on("mouseout", function(e) {})

var step = 1;
var data = {
    title: "",
    content: "",
    url: window.location.href,
    time: (new Date()).getTime()
}
var already = false;
$("*").on("click", function(e) {
    e.preventDefault();
    if (already) return false;
    if (step == 1) {
        data.title = $(this).html();
        $(".hihihi-title").html(data.title)
        $("#hihihi-title").val(data.title)

    } else if (step == 2) {
        data.content = $(this).html();
        $(".hihihi-content").html(data.content)
        $("#hihihi-content").val(data.content)
        already = true;
    }
    step++
    e.stopPropagation();
})

$("#hihihi-submit").on("click", function(e) {
    e.preventDefault();
    $.ajax({
        url: "http://www.html-js.com/blog/add-one",
        data: data,
        type: "POST"
    })
    alert("提交成功")
    $(".hihihi-wrapper").hide();
})