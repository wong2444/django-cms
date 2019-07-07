# encoding: utf-8
from django.shortcuts import render
from .models import Course, CourseOrder

from utils import restful
from apps.xfzauth.decorators import xfz_login_required
from hashlib import md5
from django.shortcuts import reverse
from django.views.decorators.csrf import csrf_exempt


# Create your views here.
def course_index(request):
    context = {
        'courses': Course.objects.all()
    }
    return render(request, 'course/course_index.html', context=context)


def course_detail(request, course_id):
    course = Course.objects.get(pk=course_id)
    courseOrder = False
    buyed = False
    if CourseOrder.objects.filter(course_id=course_id, buyer=request.user, status=2).exists():
        courseOrder = True
        buyed = True

    context = {
        'course': course,
        'courseOrder': courseOrder,
        'buyed': buyed

    }
    return render(request, 'course/course_detail.html', context=context)


@xfz_login_required
def course_order(request, course_id):
    course = Course.objects.get(pk=course_id)
    order = CourseOrder.objects.create(course=course, buyer=request.user, status=1, amount=course.price)
    context = {
        'goods': {
            'thumbnail': course.cover_url,
            'title': course.title,
            'price': course.price
        },
        'order': order,
        # /course/notify_url/
        'notify_url': request.build_absolute_uri(reverse('course:notify_view')),  # 完整的URL 包括域名和端口
        'return_url': request.build_absolute_uri(reverse('course:course_detail', kwargs={"course_id": course.pk}))
    }
    return render(request, 'course/course_order.html', context=context)


@xfz_login_required
def course_order_key(request):
    goodsname = request.POST.get("goodsname")
    istype = request.POST.get("istype")
    notify_url = request.POST.get("notify_url")
    orderid = request.POST.get("orderid")
    price = request.POST.get("price")
    return_url = request.POST.get("return_url")

    token = 'e6110f92abcb11040ba153967847b7a6'
    uid = '49dc532695baa99e16e01bc0'
    orderuid = str(request.user.pk)
    key = md5((goodsname + istype + notify_url + orderid + orderuid + price + return_url + token + uid).encode(
        "utf-8")).hexdigest()
    return restful.result(data={"key": key})


@csrf_exempt
# 關閉了csrf保護
def notify_view(request):
    orderid = request.POST.get('orderid')
    print('=' * 10)
    print(orderid)
    print('=' * 10)
    CourseOrder.objects.filter(pk=orderid).update(status=2)  # 更改訂單為已購買狀態
    return restful.ok()
