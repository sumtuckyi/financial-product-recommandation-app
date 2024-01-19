import json
from datetime import datetime
import random
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response
from django.shortcuts import get_list_or_404, get_object_or_404

from .models import MajorCategory, SmallCategory, Product, Order
from .serializers import ProductSerializer, MajorCategorySerializer, SmallCategorySerializer, OrderSerializer

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



# 주문 데이터 추가하기 - 요청 시 데이터를 Json으로 받기
# {
# user : "fhdfhd4843dj",
# pdts : "[1, 43, 23, 90, 22]",
# }
@api_view(['POST'])
def write_order(request):
    # 상품목록이 배열에 담겨있고, 각각의 상품 목록마다 주문과 관계를 맺어주어야 함 
    data = json.loads(request.data)
    # 유저 정보 추출
    user = data.user

    # Order 테이블에 들어갈 딕셔너리 object 생성
    new_order = {
        'user_id': user,
        'date': datetime.today().strftime("%Y/%m/%d %H:%M"),
        'shipping_speed': random.randint(1, 24),
    }

    # 일단 해당 유저의 주문 instance를 생성 - 유효성 검사 필요
    serializer = OrderSerializer(data=new_order)
    
    if serializer.is_valid(raise_exception=True):
        new_order = serializer.save() # db에 저장
        
        # 주문과 상품간 mtom 테이블에 관계 추가해주기
        for pdt_idx in data.pdts:
            # Product table에서 필요한 인스턴스 찾아오기
            product = get_object_or_404(Product, pk=pdt_idx)
            new_order.products.add(product)
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    
        

    
 
