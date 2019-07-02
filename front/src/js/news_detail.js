function NewsList() {

}


NewsList.prototype.listenSubmitEvent = function () {
    var submitBtn = $(".submit-btn")
    var textarea = $("textarea[name='comment']")
    submitBtn.click(function () {
        var content = textarea.val()
        var news_id = submitBtn.attr('data-news-id')
        xfzajax.post({
            'url': '/news/public_comment/',
            'data': {
                'content': content,
                'news_id': news_id
            },
            'success': function (result) {
                if (result['code'] === 200) {
                    var comment = result['data']
                    var tpl = template('comment-item', {'comment': comment})
                    var commentListGroup = $(".comment-list")
                    commentListGroup.prepend(tpl)
                    window.messageBox.showSuccess('評論發表成功')
                    textarea.val("")
                }
            }
        })
    })
}

NewsList.prototype.run = function () {
    this.listenSubmitEvent()
}


$(document).ready(function () {
    var newsList = new NewsList()
    newsList.run()
})