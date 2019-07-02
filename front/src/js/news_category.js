function NewsCategory() {

}


NewsCategory.prototype.run = function () {
    this.listenAddCategoryEvent();
    this.listenEditCategoryEvent();
    this.listenDeleteCategoryEvent();
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
                   'success': function (result) {
                        if (result['code'] === 200) {
                            window.location.reload();
                        } else {

                            xfzalert.close();
                        }

                    }
                })
            }
        })
    })
}

NewsCategory.prototype.listenEditCategoryEvent = function () {
    var self = this;
    var editBtn = $(".edit-btn");
    editBtn.click(function () {
        var currentBtn = $(this);
        var tr = currentBtn.parent().parent();
        var pk = tr.attr('data-pk');
        var name = tr.attr('data-name');
        xfzalert.alertOneInput({
            'title': '修改分類名稱',
            'placeholder': '請輸入新的分類名稱',
            'value': name,
            'confirmCallback': function (inputValue) {
                xfzajax.post({
                    'url': '/cms/edit_news_category/',
                    'data': {
                        'pk': pk,
                        'name': inputValue
                    },
                   'success': function (result) {
                        if (result['code'] === 200) {
                            window.location.reload();
                        } else {

                            xfzalert.close();
                        }

                    }
                })
            }
        })
    })
}
NewsCategory.prototype.listenDeleteCategoryEvent = function () {
    var deleteBtn = $(".delete-btn");
    deleteBtn.click(function () {
        var currentBtn = $(this);
        var tr = currentBtn.parent().parent();
        var pk = tr.attr('data-pk');
        xfzalert.alertConfirm({
            'title': '你確定刪除這個分類嗎?',
            'type': "warning",
            'confirmCallback': function (inputValue) {
                xfzajax.post({
                    'url': '/cms/delete_news_category/',
                    'data': {
                        'pk': pk,
                    },
                    'success': function (result) {
                        if (result['code'] === 200) {
                            window.location.reload();
                        } else {

                            xfzalert.close();
                        }

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
