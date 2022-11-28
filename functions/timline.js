var Timeline_Model = _M ("timelines")

var timeline_function = {
  addFromArticle:function(article){
    match = article.html.match(/<img[^>]+?src="([^"]+?)"/);
    Timeline_Model.add({
      user_id: article.user_id,
      user_headpic: article.user_headpic,
      user_nick: article.user_nick,

      target_url: "/article/"+article.id,
      target_desc: article.html.replace(/<[^>]*?>/g,'').replace(/\s/g,'').substr(0,200),
      target_pic:match?match[1]:'',
      target_title:article.title,
      target_id:article.id, //目标id，文章或者评论的id
      action: 3, // 1分享了 2评论了 3发表了
      desc: "发表了文章《"+article.title+"》",
      is_publish:1
    },function(err){

    })
  },
  addFromArticleCommit:function(user,article,comment_content){
    match = article.html.match(/<img[^>]+?src="([^"]+?)"/);
    Timeline_Model.add({
      user_id: user.user_id,
      user_headpic: user.user_headpic,
      user_nick: user.user_nick,

      target_url: "/article/"+article.id,
      target_title:article.title,
      target_desc: article.html.replace(/<[^>]*?>/g,'').replace(/\s/g,'').substr(0,200),
      target_pic:match?match[1]:'',
      target_id:article.id, //目标id，文章或者评论的id
      action: 2, // 1分享了 2评论了 3发表了
      desc: comment_content,
      is_publish:0
    },function(err){

    })
  },
  addFromBlogCommit:function(user,blog,comment_content){
    match = blog.content.match(/<img[^>]+?src="([^"]+?)"/);
    Timeline_Model.add({
      user_id: user.user_id,
      user_headpic: user.user_headpic,
      user_nick: user.user_nick,

      target_url: "/blog/"+blog.id,
      target_title:blog.title,
      target_desc: blog.content.replace(/<[^>]*?>/g,'').replace(/\s/g,'').substr(0,200),
      target_pic:match?match[1]:'',
      target_id:blog.id, //目标id，文章或者评论的id
      action: 2, // 1分享了 2评论了 3发表了
      desc: comment_content,
      is_publish:0
    },function(err){

    })
  },
  addBlogShare:function(user,blog,comment_content){
    match = blog.content.match(/<img[^>]+?src="([^"]+?)"/);
    Timeline_Model.add({
      user_id: user.user_id,
      user_headpic: user.user_headpic,
      user_nick: user.user_nick,

      target_url: "/blog/"+blog.id,
      target_title:blog.title,
      target_desc: blog.content.replace(/<[^>]*?>/g,'').replace(/\s/g,'').substr(0,200),
      target_pic:match?match[1]:'',
      target_id:blog.id, //目标id，文章或者评论的id
      action: 1, // 1分享了 2评论了 3发表了
      desc: comment_content,
      is_publish:1
    },function(err){

    })
  }
}

module.exports = timeline_function;