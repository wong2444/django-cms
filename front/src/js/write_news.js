var firebaseConfig = {
    apiKey: "AIzaSyB5wG1zkWlxpaL3Ofs1AWkDvjXehQIp_mI",
    authDomain: "xfz1-32ccc.firebaseapp.com",
    databaseURL: "https://xfz1-32ccc.firebaseio.com",
    projectId: "xfz1-32ccc",
    storageBucket: "xfz1-32ccc.appspot.com",
    messagingSenderId: "501437697604",
    appId: "1:501437697604:web:57e443d3eef2d6d1"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);


function News() {
    this.storage = firebase.storage();
}

News.prototype.initUditor = function () {
    var self = this
    var E = window.wangEditor
    window.editor = new E('#editor')
    // 或者 var editor = new E( document.getElementById('editor') )
    window.editor.customConfig.customUploadImg = function (files, insert) {
        // files 是 input 中选中的文件列表
        // insert 是获取图片 url 后，插入到编辑器的方法
        var arr = []
        // 上传代码返回结果之后，将图片插入到编辑器中
        for (var i = 0; i < files.length; i++) {

            var storageRef = self.storage.ref('news/' + Math.random().toString(36).substr(2))
            var task = storageRef.put(files[i])

            task.on('state_changed', function (snapshot) {

            }, function (error) {
                window.messageBox.showError(error.code);
                // Handle unsuccessful uploads
            }, function () {
                // Handle successful uploads on complete
                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                task.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                    insert(downloadURL)


                });
            });

        }


    }


    window.editor.create()
}


News.prototype.listenUploadFileEvent = function () {
    var uploadBtn = $('#thumbnail-btn');
    uploadBtn.change(function () {
        //label id可拿一組東西,第0個是file input
        //file input可傳入多個文件,本次只拿第一個
        var file = uploadBtn[0].files[0]
        var formData = new FormData();
        formData.append('file', file)//此處名字要和後台一致
        xfzajax.post({
            'url': '/cms/upload_file/',
            'data': formData,
            'processData': false,
            'contentType': false,
            'success': function (result) {
                if (result['code'] === 200) {
                    var url = result['data']['url'];
                    var thumbnailInput = $('#thumbnail-form')
                    thumbnailInput.val(url)
                }
            }
        })
    })
}

News.prototype.listenUploadFileEvent2 = function () {
    var self = this;
    var uploadBtn = $('#thumbnail-btn');
    uploadBtn.change(function () {
        //label id可拿一組東西,第0個是file input
        //file input可傳入多個文件,本次只拿第一個
        var file = uploadBtn[0].files[0]
        var storageRef = self.storage.ref('news/' + file.name)
        var task = storageRef.put(file)
        var progressGroup = self.progressGroup
        progressGroup.show()
        var progressBar = $(".progress-bar")
        progressBar.css({"width": '0%'})
        progressBar.text('0')
        task.on('state_changed', function (snapshot) {
            var percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            // console.log('Upload is ' + percent + '% done');
            var percentText = percent.toFixed(0) + '%'

            progressBar.css({"width": percentText})
            progressBar.text(percentText)
        }, function (error) {
            window.messageBox.showError(error.code);
            // Handle unsuccessful uploads
        }, function () {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            task.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                var progressGroup = $('#progress-group')
                progressGroup.hide()
                var thumbnailInput = $('#thumbnail-form')
                thumbnailInput.val(downloadURL)
                console.log(downloadURL)

            });
        });

    })
}

News.prototype.listenSubmitEvent = function () {
    var submitBtn = $("#submit-btn")
    submitBtn.click(function (event) {
        event.preventDefault();
        var btn = $(this)
        var pk = btn.attr('data-news-id')
        var url = ''
        if (pk) {
            url = '/cms/edit_news/'
        } else {
            url = '/cms/write_news/'
        }

        var title = $("input[name='title']").val()
        var category = $("select[name='category']").val()
        var desc = $("input[name='desc']").val()
        var thumbnail = $("input[name='thumbnail']").val()
        var content = window.editor.txt.html()
        xfzajax.post({
            'url': url,
            'data': {
                'title': title,
                'category': category,
                'desc': desc,
                'thumbnail': thumbnail,
                'content': content,
                'pk': pk
            },
            'success': function (result) {
                if (result['code'] === 200) {
                    xfzalert.alertSuccess('新聞發佈成功', function () {
                        window.location.reload();
                    })
                }
            }
        })
    })
}


News.prototype.run = function () {
    this.listenUploadFileEvent2();
    this.initUditor();
    this.listenSubmitEvent();
}
$(document).ready(function () {

    // Get a reference to the storage service, which is used to create references in your storage bucket
    var news = new News()
    news.progressGroup = $('#progress-group');
    news.run()
})

