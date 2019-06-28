//點擊登錄按鈕,彈出模態對話框


function Auth() {
    this.maskWrapper = $(".mask-wrapper");
    this.scrollWrapper = $(".scroll-wrapper");
}

Auth.prototype.showEvent = function () {
    this.maskWrapper.show();
}

Auth.prototype.hideEvent = function () {
    this.maskWrapper.hide();
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
            'fail': function (error) {
                console.log(error)
            }
        })
    })
}


Auth.prototype.run = function () {
    this.listenShowHideEvent();
    this.listenSwitchEvent();
    this.listenSigninEvent();
}

$(document).ready(function () {
    var auth = new Auth();
    auth.run();
})