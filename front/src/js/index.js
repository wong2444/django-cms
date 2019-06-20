function Banner() {
    this.bannerWidth = 798;//一張輪播圖的寬度
    this.bannerGroup = $("#banner-group");
    this.index = 0;//輪播的次數
    this.leftArrow = $(".left-arrow");
    this.rightArrow = $(".right-arrow");
    this.bannerUl = $("#banner-url");
    this.liList = this.bannerUl.children("li");
    this.bannerCount = this.liList.length;
    this.pageControl = $(".page-control");
}


Banner.prototype.initBanner = function () {//定義輪播圖大盒寬度
    this.bannerUl.css({"width": this.bannerCount * this.bannerWidth})
}


Banner.prototype.initPageControl = function () {//動態生成輪播圖小點
    var self = this;

    for (var i = 0; i < self.bannerCount; i++) {
        var circle = $("<li></li>");//創建li標籤
        self.pageControl.append(circle);
        if (i === 0) {
            circle.addClass("active");
        }
    }
    //控制輪播圖小點條的寬度
    self.pageControl.css({"width": self.bannerCount * 12 + 8 * 2 + 16 * (self.bannerCount - 1)})
}

Banner.prototype.listenPageControl = function () {//點擊小點轉輪播圖
    var self = this;
    self.pageControl.children("li").each(function (index, obj) {
        $(obj).click(function () {
            self.index = index;
            self.animate();
        })
    })
}


Banner.prototype.toggleArrow = function (isShow) {
    //控制輪播圖左右箭頭是否顯示
    if (isShow) {
        this.leftArrow.show();
        this.rightArrow.show();
    } else {
        this.leftArrow.hide();
        this.rightArrow.hide();
    }

}

Banner.prototype.listenBannerHover = function () {
    var self = this;//其他函數中的this代表其函數本身
    this.bannerGroup.hover(function () {
        clearInterval(self.timer);
        self.toggleArrow(true);
    }, function () {
        self.loop();
        self.toggleArrow(false);
    })//第一個參數是鼠標移動到banner上要執行的函數//第二個是鼠標移走時執行的函數
}

Banner.prototype.animate = function () {
    this.bannerUl.animate({'left': -798 * this.index}, 500)//js動畫過渡
    this.pageControl.children("li").eq(this.index).addClass("active").siblings().removeClass("active")
}

Banner.prototype.run = function () {
    this.initPageControl();
    this.initBanner();
    this.loop();
    this.listenArrowClick();
    this.listenBannerHover();
}
Banner.prototype.loop = function () {
    var self = this;

    // var index = 0;//輪播的次數
    this.timer = setInterval(function () {
        self.index++;
        if (self.index > self.bannerCount - 1) {
            self.index = 0;//輪播圖歸位
        }
        self.animate()//js動畫過渡
    }, 2000);
};

Banner.prototype.listenArrowClick = function () {
    var self = this;

    this.leftArrow.click(function () {
        if (self.index === 0) {
            self.index = self.bannerCount - 1;

        } else {
            self.index--;
        }
        self.animate()
    })
    this.rightArrow.click(function () {
        if (self.index === self.bannerCount - 1) {
            self.index = 0;

        } else {
            self.index++;
        }

        self.animate()
    })
}

$(document).ready(function () {
    var banner = new Banner()
    banner.run()

});
