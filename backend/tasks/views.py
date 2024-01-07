from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import connection
import json

@csrf_exempt
def create_task(request):
    if request.method == 'GET':
        return JsonResponse({'name': "My name is Alice !"})
    else:
        return JsonResponse({'error': 'Only POST requests are allowed.'})

