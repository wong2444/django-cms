from django import forms
from apps.forms import FormMixin
from django.core.cache import cache
from .models import User
from utils import restful


class LoginForm(forms.Form, FormMixin):
    telephone = forms.CharField(max_length=11)
    password = forms.CharField(max_length=20, min_length=6,
                               error_messages={"max_length": "密碼最多不超過20個字符", "min_length": "密碼最少需要6個字符"})
    remember = forms.IntegerField(required=False)


class RegisterForm(forms.Form, FormMixin):
    telephone = forms.CharField(max_length=11)
    password1 = forms.CharField(max_length=20, min_length=6,
                                error_messages={"max_length": "密碼最多不超過20個字符", "min_length": "密碼最少需要6個字符"})
    password2 = forms.CharField(max_length=20, min_length=6,
                                error_messages={"max_length": "密碼最多不超過20個字符", "min_length": "密碼最少需要6個字符"})
    img_captcha = forms.CharField(min_length=4, max_length=4, required=True)
    sms_captcha = forms.CharField(min_length=4, max_length=4, required=True)
    username = forms.CharField(max_length=100, required=True)

    def clean(self):  # 上面的東西驗證成功後執行
        cleaned_data = super(RegisterForm, self).clean()
        telephone = cleaned_data.get('telephone')
        password1 = cleaned_data.get('password1')
        password2 = cleaned_data.get('password2')
        if password1 != password2:
            raise forms.ValidationError('兩次密碼輸入不一致')
        img_captcha = cleaned_data.get('img_captcha')
        if img_captcha is None:
            raise forms.ValidationError('圖形驗證碼錯誤')
        cache_img_captcha = cache.get(img_captcha.lower())
        if not cache_img_captcha or cache_img_captcha != img_captcha.lower():
            raise forms.ValidationError('圖形驗證碼錯誤')
        sms_captcha = cleaned_data.get('sms_captcha')
        cache_sms_captcha = cache.get(telephone)
        if not cache_sms_captcha or sms_captcha.lower() != cache_sms_captcha.lower():
            raise forms.ValidationError('短信驗證碼錯誤')
        exists = User.objects.filter(telephone=telephone).exists()
        if exists:
            forms.ValidationError('該手機號碼已經被注冊')
