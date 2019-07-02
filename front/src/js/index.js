function Banner() {
    this.bannerWidth = 798;//一張輪播圖的寬度
    this.bannerGroup = $("#banner-group");
    this.index = 1;//輪播的次數
    this.leftArrow = $(".left-arrow");
    this.rightArrow = $(".right-arrow");
    this.bannerUl = $("#banner-url");
    this.liList = this.bannerUl.children("li");
    this.bannerCount = this.liList.length;
    this.pageControl = $(".page-control");
}


Banner.prototype.initBanner = function () {//定義輪播圖大盒寬度
    var firstBanner = this.liList.eq(0).clone();//複製第一張輪播圖
    var lastBanner = this.liList.eq(this.bannerCount - 1).clone();//複製最後一張輪播圖
    this.bannerUl.append(firstBanner);//將第一張輪播圖加到最後
    this.bannerUl.prepend(lastBanner);//將最後一張輪播圖加到最前

    this.bannerUl.css({"width": (this.bannerCount + 2) * this.bannerWidth, "left": -this.bannerWidth})
}
Banner.prototype.animate = function () {

    var index = this.index;
    if (index === 0) {
        index = this.bannerCount - 1//index是0時,小點跑到最後一張圖上
    } else if (index === this.bannerCount + 1) {
        index = 0;//index是banner的長度,小點跑到第一張圖上
    } else {
        index = this.index - 1;//小點下標是輪播圖下標-1
    }
    this.bannerUl.animate({'left': -798 * this.index}, 500)//js動畫過渡
    this.pageControl.children("li").eq(index).addClass("active").siblings().removeClass("active")
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
            // var index = self.index;
            if (index === 0) {
                self.index = 1//index是0時,小點跑到最後一張圖上
            } else if (index === self.bannerCount - 1) {
                self.index = self.bannerCount;//index是banner的長度,小點跑到第一張圖上
            } else {
                self.index = index + 1;//小點下標是輪播圖下標-1
            }
            self.bannerUl.animate({'left': -798 * self.index}, 500)//js動畫過渡
            self.pageControl.children("li").eq(index).addClass("active").siblings().removeClass("active")
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


Banner.prototype.run = function () {
    this.initPageControl();
    this.initBanner();
    this.loop();
    this.listenArrowClick();
    this.listenBannerHover();
    this.listenPageControl();
}
Banner.prototype.loop = function () {
    var self = this;

    // var index = 0;//輪播的次數
    this.timer = setInterval(function () {

        if (self.index >= self.bannerCount + 1) {//加了2張banner
            self.bannerUl.css({"left": -self.bannerWidth});//到最後一張banner時立即跳到第二張
            self.index = 2;//輪播圖歸位
        } else {
            self.index++;
        }
        self.animate()//js動畫過渡
    }, 2000);
};

Banner.prototype.listenArrowClick = function () {
    var self = this;

    this.leftArrow.click(function () {
        if (self.index === 0) {
            self.bannerUl.css({"left": -self.bannerWidth * self.bannerCount})//index是0時跳到尾二位置
            self.index = self.bannerCount - 1;

        } else {
            self.index--;
        }
        self.animate()
    })
    this.rightArrow.click(function () {
        if (self.index === self.bannerCount + 1) {
            self.bannerUl.css({"left": -self.bannerWidth});//到最後一張輪播圖時,輪播圖位置立即移到第二張
            self.index = 2;

        } else {
            self.index++;
        }

        self.animate()
    })
}


function Index() {
    this.page = 2;
    this.category_id = 0

}

Index.prototype.listenLoadMoreEvent = function () {
    var self = this
    var loadBtn = $("#load-more-btn");
    loadBtn.click(function () {

        xfzajax.get({
            'url': '/news/list/',
            'data': {
                'p': self.page,
                'category_id': self.category_id
            },
            'success': function (result) {
                if (result['code'] === 200) {
                    var newses = result['data'];
                    if (newses.length > 0) {
                        var tpl = template('news-item', {'newses': newses})
                        var ul = $(".list-inner-group")
                        ul.append(tpl)
                        self.page += 1
                    } else {
                        loadBtn.hide()
                    }

                }
            }
        })
    })
}

Index.prototype.listenCategorySwitchEvent = function () {
    var self = this
    var tabGroup = $(".list-tab");
    var loadBtn = $("#load-more-btn");
    tabGroup.children().click(function () {
        //this是當前點擊的li
        var li = $(this);
        var category_id = li.attr("data-category")
        var page = 1
        xfzajax.get({
            'url': '/news/list/',
            'data': {
                'category_id': category_id,
                'p': page
            },
            'success': function (result) {
                if (result['code'] === 200) {
                    var newses = result['data'];
                    var tpl = template("news-item", {"newses": newses})
                    //empty將標籤下的子元素清空
                    var newsListGroup = $(".list-inner-group");
                    newsListGroup.empty()
                    newsListGroup.append(tpl)
                    self.page = 2//下一次點擊加載的頁數
                    self.category_id = category_id
                    li.addClass('active').siblings().removeClass('active')
                    loadBtn.show()
                }
            }
        })
    })
}


Index.prototype.run = function () {
    this.listenLoadMoreEvent()
    this.listenCategorySwitchEvent()
}

$(document).ready(function () {
    var banner = new Banner()
    banner.run()

    var index = new Index()
    index.run()

});
