from django.db import models
from django.conf import settings


# Create your models here.
# 각 상품을 카테고리로 분류 
class MajorCategory(models.Model):
    name = models.TextField() # 대분류 이름


class SmallCategory(models.Model):
    name = models.TextField() # 소분류 이름
    upper_cate = models.ForeignKey(MajorCategory, on_delete=models.CASCADE)


class Product(models.Model):
    item = models.TextField() # 상품명
    price = models.TextField() # 가격
    exp = models.IntegerField(null=True, blank=True) # 유통기한
    img_url = models.TextField() # 이미지 url
    category = models.ForeignKey(SmallCategory, on_delete=models.CASCADE) # 소분류 인덱스
    

class Order(models.Model):
    # 주문 건과 유저를 연결
    # 회원 고유 번호
    user_id = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    date = models.DateField() # 주문시간
    shipping_speed = models.IntegerField() # 소요시간
    products = models.ManyToManyField(Product, related_name='my_order', blank=True)


