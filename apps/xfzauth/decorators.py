from utils import restful
from django.shortcuts import redirect


def xfz_login_required(func):
    def wrapper(request, *args, **kwargs):
        if request.user.is_authenticated:
            return func(request, *args, **kwargs)
        else:
            if request.is_ajax():
                return restful.unauth(message="請先登錄")
            else:
                return redirect('/')

    return wrapper
