from rest_framework import serializers
from .models import Product, SmallCategory, MajorCategory

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product

class SmallCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SmallCategory

class MajorCategorySerializer(serializers.ModelSerializer):
    small_categories = SmallCategorySerializer(many=True, read_only=True)

    class Meta:
        model = MajorCategory
