from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from api.serializer import *

# Create your views here.
@api_view(['GET', 'POST'])
def index(request):
    seralizer_data = AccountSeralizer(request.user)
    return Response(
        {
            'message': "User successfully authenticated",
            'user': seralizer_data.data
        },
        status=status.HTTP_200_OK,
    )