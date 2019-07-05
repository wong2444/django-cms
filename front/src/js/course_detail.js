function CourseDetail() {

}

CourseDetail.prototype.initPlayer = function () {
    var videoInfoSpan = $("#video-info")
    var video_url = videoInfoSpan.attr("data-video-url")
    var cover_url = videoInfoSpan.attr('data-cover-url')
    var player = new Aliplayer({
            "id": "player-con",
            "source":video_url,
            "playauth": '',
            "width": "100%",
            "height": "100%",
            "cover": cover_url,
            "autoplay": false,
            "isLive": false,
            "rePlay": false,
            "playsinline": true,
            "preload": false,
            "controlBarVisibility": "hover",
            "useH5Prism": true
        }, function (player) {
            console.log("The player is created");
        }
    );

}


CourseDetail.prototype.run = function () {
    this.initPlayer()
}


$(document).ready(function () {
    var courseDetail = new CourseDetail()
    courseDetail.run()
})