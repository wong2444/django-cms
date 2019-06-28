from django.shortcuts import render

# Create your views here.
from django.contrib.auth import login, logout, authenticate
from django.views.decorators.http import require_POST
from .forms import LoginForm, RegisterForm
from django.http import JsonResponse
from utils import restful
from django.shortcuts import reverse, redirect, HttpResponse
from utils.captcha.xfzcaptcha import Captcha
from io import BytesIO
from utils.aliyunsdk import aliyunsms
from django.core.cache import cache
from django.contrib.auth import get_user_model

User = get_user_model()


@require_POST
def login_view(request):
    form = LoginForm(request.POST)
    if form.is_valid():

        telephone = form.cleaned_data.get('telephone')
        password = form.cleaned_data.get('password')
        remember = form.cleaned_data.get('remember')
        user = authenticate(request, username=telephone, password=password)
        if user:
            if user.is_active:
                login(request, user)
                if remember:
                    request.session.set_expiry(None)  # 默認的session週期2星期
                else:
                    request.session.set_expiry(0)  # 關閉瀏覽器後session失效
                # 一般的json格式, {"code":400,"message":"","data":{}}
                return restful.ok()
                # return JsonResponse({"code": 200, "message": "", "data": {}})
            else:
                return restful.unauth(message='你的帳號已經被涷結')
                # return JsonResponse({"code": 401, "message": "你的帳號已經被涷結", "data": {}})
        else:
            return restful.params_error(message='手機號碼或密碼錯誤')

    else:
        # {
        #     'telephone':[
        #         '请输入正确格式的手机号码！',
        #         '请输入手机号码！'
        #     ],
        #     'pwd1': [
        #         '密码最大长度不能超过16',
        #         '两次密码不一致！'
        #     ]
        # } 經整理的錯誤信息
        errors = form.get_errors()
        return restful.params_error(message=errors)


def logout_view(request):
    logout(request)
    return redirect(reverse('index'))


@require_POST
def register(request):
    form = RegisterForm(request.POST)
    if form.is_valid():
        telephone = form.cleaned_data.get('telephone')
        print('tel: %s' % (telephone))
        username = form.cleaned_data.get('username')
        print('username: %s' % (username))

        password = form.cleaned_data.get('password1')
        print('password: %s' % (password))
        user = User.objects.create_user(telephone=telephone, username=username, password=password)
        login(request, user)
        return restful.ok()
    else:
        print("hello")
        print(restful.params_error(message=form.get_errors()))
        return restful.params_error(message=form.get_errors())


def img_captcha(request):
    text, image = Captcha.gene_code()
    out = BytesIO()
    # 調用image的save方法,將這個image對象保存到BytesIO中
    image.save(out, 'png')
    # 將BytesIO的文件指針移到最開始的位置
    out.seek(0)
    response = HttpResponse(content_type='image/png')
    # 從BytesIO的管道中,讀取出圖片數據,保存到response對象上
    response.write(out.read())
    response['Content-length'] = out.tell()

    cache.set(text.lower(), text.lower(), 5 * 60)

    return response


def sms_captcha(request):
    # account/sms_captcha/?telephone=xxx
    telephone = request.GET.get('telephone')
    code = Captcha.gene_text()
    cache.set(telephone, code, 5 * 60)
    # print('短信验证码：', code)
    # result = aliyunsms.send_sms(telephone, '驗證碼: %s' % (code))
    # {"MessageId":"580921561546735632","Segments":"1","To":"85261692141","ResponseCode":"OK","NumberDetail":{"Region":"Hong Kong","Carrier":"HKT","Country":"Hongkong,
    # China"},"ResponseDescription":"580921561546735632^0","From":"xfz"}

    print(code)
    return restful.ok()


def cache_test(request):
    cache.set('username', 'wong', 60)
    result = cache.get('username')
    print(result)
    return HttpResponse(result)
