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


function PubCourse() {
    this.storage = firebase.storage();
}


PubCourse.prototype.initUditor = function () {
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


PubCourse.prototype.listenSubmitEvent = function () {
    var submitBtn = $("#submit-btn");
    submitBtn.click(function () {
        var title = $("#title-input").val();
        var category_id = $("#category-input").val();
        var teacher_id = $("#teacher-input").val();
        var video_url = $("#video-input").val();
        var cover_url = $("#cover-input").val();
        var price = $("#price-input").val();
        var duration = $("#duration-input").val();
        var profile = window.editor.txt.html()

        xfzajax.post({
            'url': '/cms/pub_course/',
            'data': {
                'title': title,
                'video_url': video_url,
                'cover_url': cover_url,
                'price': price,
                'duration': duration,
                'profile': profile,
                'category_id': category_id,
                'teacher_id': teacher_id
            },
            'success': function (result) {
                if (result['code'] === 200) {
                    console.log("hello")
                    window.location = window.location.href;
                }
            }
        });
    });
};


PubCourse.prototype.run = function () {
    this.initUditor()
    this.listenSubmitEvent();
}

$(document).ready(function () {
    var course = new PubCourse()
    course.run()
})