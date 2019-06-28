function NewsCategory() {

}


NewsCategory.prototype.run = function () {
    this.listenAddCategoryEvent();
}

NewsCategory.prototype.listenAddCategoryEvent = function () {
    var addBtn = $('#add-btn');
    addBtn.click(function () {
        xfzalert.alertOneInput({
            'title': '添加新聞分類',
            'placeholder': '請輸入新聞分類',
            'confirmCallback': function (inputValue) {
                xfzajax.post({
                    'url': '/cms/add_news_category/',
                    'data': {
                        'name': inputValue
                    },
                    'success': function (rusult) {
                        window.location.reload();
                    }
                })
            }
        })
    })
}

$(document).ready(function () {
    var category = new NewsCategory()
    category.run()
})
