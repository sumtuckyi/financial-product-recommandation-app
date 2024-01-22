from django.urls import path
from . import views

urlpatterns = [
    path('pdt_list/<cate_idx>', views.get_list_by_cate),
    path('pdt_list/search/<keyword>', views.get_list_by_keyword),
    path('category/', views.get_category),
    path('order/', views.write_order)
]
