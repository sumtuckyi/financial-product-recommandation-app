from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response
from django.shortcuts import get_list_or_404, get_object_or_404

from .models import MajorCategory, SmallCategory, Product, Order
from .serializers import ProductSerializer, MajorCategorySerializer, SmallCategorySerializer

# Create your views here.
# 선택한 품목의 리스트 보여주기(예-우유)
# url파라미터로 소분류 인덱스를 받아서 해당하는 품목 데이터 보내기
@api_view(['GET'])
def get_list_by_cate(request, cate_idx):
    products = get_list_or_404(Product, category=cate_idx)
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


# 키워드를 받아서 해당 키워드를 포함하는 품목 데이터 보내기
@api_view(['GET'])
def get_list_by_keyword(request, keyword):
    products = Product.objects.filter(item__contains=keyword)
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


# 카테고리 목록을 보내기
@api_view(['GET'])
def get_category(request):
    categories = get_list_or_404(MajorCategory)
    serializer = MajorCategorySerializer(categories)
    return Response(serializer.data)



