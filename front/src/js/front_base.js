//點擊登錄按鈕,彈出模態對話框
//處理登錄和注冊
function Auth() {
    this.maskWrapper = $(".mask-wrapper");
    this.scrollWrapper = $(".scroll-wrapper");
    this.smsCaptcha = $('.sms-captcha-btn');
}

Auth.prototype.showEvent = function () {
    this.maskWrapper.show();
}

Auth.prototype.hideEvent = function () {
    this.maskWrapper.hide();
}

Auth.prototype.smsSuccessEvent = function () {

    var self = this;
    messageBox.showSuccess('短信驗證碼發送成功')
    self.smsCaptcha.addClass('disabled')
    var count = 60
    self.smsCaptcha.unbind('click')
    var timer = setInterval(function () {
        self.smsCaptcha.text(count + 's')
        count -= 1
        if (count <= 0) {
            clearInterval(timer)
            self.smsCaptcha.removeClass('disabled')
            self.smsCaptcha.text('發送驗證碼')
            self.listenSmsCapthaEvent()
        }
    }, 1000)
}


Auth.prototype.listenShowHideEvent = function () {
    var self = this;
    var signinBtn = $(".signin-btn");
    var signupBtn = $(".signup-btn");
    var closeBtn = $(".close-btn");


    signinBtn.click(function () {
        self.showEvent();
        self.scrollWrapper.css({"left": "0"})
    })
    signupBtn.click(function () {
        self.showEvent();
        self.scrollWrapper.css({"left": "-400px"})
    })
    closeBtn.click(function () {
        $(".mask-wrapper").hide();
    })
}

Auth.prototype.listenImgCaptchaEvent = function () {
    var imgCaptcha = $(".img-captcha");
    imgCaptcha.click(function () {
        //改變圖片的請求地址,瀏覽器會重新發送請求
        imgCaptcha.attr("src", "/account/img_captcha/" + "?random=" + Math.random())
    })
}


Auth.prototype.listenSwitchEvent = function () {
    var self = this;
    var switcher = $(".switch");
    switcher.click(function () {//點擊切換登錄/注冊的頁面

        var currentLeft = self.scrollWrapper.css("left");
        currentLeft = parseInt(currentLeft);
        if (currentLeft < 0) {
            self.scrollWrapper.animate({"left": "0"})
        } else {
            self.scrollWrapper.animate({"left": "-400px"})
        }

    })
}

Auth.prototype.listenSigninEvent = function () {
    var self = this;
    var signinGroup = $('.signin-group');
    var telephoneInput = signinGroup.find("input[name='telephone']");
    var passwordInput = signinGroup.find("input[name='password']");
    var rememberInput = signinGroup.find("input[name='remember']");
    var submitBtn = signinGroup.find(".submit-btn");
    submitBtn.click(function () {
        var telephone = telephoneInput.val()
        var password = passwordInput.val()
        var remember = rememberInput.prop("checked")

        xfzajax.post({
            'url': '/account/login/',
            'data': {
                'telephone': telephone,
                'password': password,
                'remember': remember ? 1 : 0
            },
            'success': function (result) {
                self.hideEvent()
                window.location.reload()

            },

        })
    })
}
Auth.prototype.listenSmsCapthaEvent = function () {
    var self = this

    var telephoneInput = $(".signup-group input[name='telephone']")
    self.smsCaptcha.click(function () {
        var telephone = telephoneInput.val()
        console.log(telephone)
        if (telephone === '') {
            messageBox.showInfo('請輸入手機號碼')
            return
        }
        xfzajax.get({
            'url': 'account/sms_captcha/',
            'data': {'telephone': telephone},
            'success': function (result) {
                self.smsSuccessEvent();
            },

        })

    })
}
Auth.prototype.listenSignupEvent = function () {
    var signupGroup = $('.signup-group');
    var submitBtn = signupGroup.find('.submit-btn');
    submitBtn.click(function (event) {
        event.preventDefault();
        var telephoneInput = signupGroup.find("input[name='telephone']")
        var usernameInput = signupGroup.find("input[name='username']")
        var imgCaptchaInput = signupGroup.find("input[name='img_captcha']")
        var password1Input = signupGroup.find("input[name='password1']")
        var password2Input = signupGroup.find("input[name='password2']")
        var smsCaptchaInput = signupGroup.find("input[name='sms_captcha']")

        var telephone = telephoneInput.val()
        var username = usernameInput.val()
        var img_captcha = imgCaptchaInput.val()
        console.log(img_captcha)
        var password1 = password1Input.val()
        var password2 = password2Input.val()
        var sms_captcha = smsCaptchaInput.val()


        xfzajax.post({
            'url': '/account/register/',
            'data': {
                'telephone': telephone,
                'username': username,
                'img_captcha': img_captcha,
                'password1': password1,
                'password2': password2,
                'sms_captcha': sms_captcha
            },
            'success': function (result) {
                window.location.reload()
            }

        })


    })
}


Auth.prototype.run = function () {
    this.listenShowHideEvent();
    this.listenSwitchEvent();
    this.listenSigninEvent();
    this.listenSignupEvent();
    this.listenImgCaptchaEvent();
    this.listenSmsCapthaEvent();

}

$(document).ready(function () {
    var auth = new Auth();
    auth.run();
})


//處理導航條

function FrontBase() {

}

FrontBase.prototype.run = function () {
    this.listenAuthBoxHover()
}

FrontBase.prototype.listenAuthBoxHover = function () {
    var authBox = $(".auth-box")
    var userMoreBox = $(".user-more-box")
    authBox.hover(function () {
        userMoreBox.show()
    }, function () {
        userMoreBox.hide()
    })
}

$(document).ready(function () {
    var frontBase = new FrontBase()
    frontBase.run()
})