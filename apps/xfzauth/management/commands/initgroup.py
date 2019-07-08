from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission, ContentType
from apps.news.models import News, NewsCategory, Banner, Comment
from apps.course.models import Course, CourseCategory, Teacher
from apps.payinfo.models import Payinfo
from apps.course.models import CourseOrder
from apps.payinfo.models import PayinfoOrder


class Command(BaseCommand):
    def handle(self, *args, **options):
        # 1.編輯組(管理文章/管理課程/管理評論/管理輪播圖)
        edit_content_types = [
            # 拿到模型的所屬apps
            ContentType.objects.get_for_model(News),
            ContentType.objects.get_for_model(NewsCategory),
            ContentType.objects.get_for_model(Banner),
            ContentType.objects.get_for_model(Comment),
            ContentType.objects.get_for_model(Course),
            ContentType.objects.get_for_model(CourseCategory),
            ContentType.objects.get_for_model(Teacher),
            ContentType.objects.get_for_model(Payinfo)
        ]
        # 拿到模型的所有權限
        edit_permissions = Permission.objects.filter(content_type__in=edit_content_types)
        editGroup = Group.objects.create(name="編輯")  # 創建分組
        editGroup.permissions.set(edit_permissions)  # 為組分配權限
        editGroup.save()
        self.stdout.write(self.style.SUCCESS('編輯分組創建成功'))

        # 2.財務組(課程訂單/付貴資訊單)

        finance_content_types = [
            ContentType.objects.get_for_model(CourseOrder),
            ContentType.objects.get_for_model(PayinfoOrder)
        ]
        finance_permissions = Permission.objects.filter(content_type__in=finance_content_types)
        financeGroup = Group.objects.create(name="財務")
        financeGroup.permissions.set(finance_permissions)
        financeGroup.save()
        self.stdout.write(self.style.SUCCESS('財務分組創建成功'))
        # 3.管理員組(編輯組+財務組)
        admin_permissions = edit_permissions.union(finance_permissions)  # 將兩個quertSet合併
        adminGroup = Group.objects.create(name='管理員')
        adminGroup.permissions.set(admin_permissions)
        adminGroup.save()
        self.stdout.write(self.style.SUCCESS('管理分組創建成功'))
        # 4.超級管理員


