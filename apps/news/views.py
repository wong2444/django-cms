from django.shortcuts import render
from .models import News, NewsCategory, Comment
from django.conf import settings
from .serializers import NewsSerializer, CommentSerizlizer
from utils import restful
from django.http import Http404
from .forms import PublicCommentForm
from apps.xfzauth.decorators import xfz_login_required


# Create your views here.
def index(request):
    count = settings.ONE_PAGE_NEWS_COUNT
    newses = News.objects.select_related('category', 'author').all()[0:count]
    categories = NewsCategory.objects.all()
    context = {
        'newes': newses,
        'categories': categories
    }
    return render(request, 'news/index.html', context=context)


def news_list(request):
    # p參數是指要取得的頁數 /news/list/?p=2
    page = int(request.GET.get('p', 1))  # 默認是取第一頁
    # category_id= 0 代表不進行任何分類
    category_id = int(request.GET.get('category_id', 0))
    start = (page - 1) * settings.ONE_PAGE_NEWS_COUNT
    end = start + settings.ONE_PAGE_NEWS_COUNT  # 切片[0:2]只取 0和1的數據,2不取
    if category_id == 0:
        newses = News.objects.select_related('category', 'author').all()[start:end]
    else:
        newses = News.objects.select_related('category', 'author').filter(category__id=category_id)[start:end]

    serializer = NewsSerializer(newses, many=True)
    data = serializer.data
    return restful.result(data=data)


def news_detail(request, news_id):
    try:
        news = News.objects.select_related('category', 'author').prefetch_related("comments__author").get(pk=news_id)
    except News.DoesNotExist:
        raise Http404
    context = {
        'news': news
    }
    return render(request, 'news/news_detail.html', context=context)

@xfz_login_required
def public_comment(request):
    form = PublicCommentForm(request.POST)
    if form.is_valid():
        news_id = form.cleaned_data.get('news_id')
        content = form.cleaned_data.get('content')
        news = News.objects.get(pk=news_id)
        comment = Comment.objects.create(content=content, news=news, author=request.user)
        serizlize = CommentSerizlizer(comment)
        data = serizlize.data
        return restful.result(data=data)
    else:
        return restful.params_error(message=form.get_errors())


def search(request):
    return render(request, 'search/search.html')
