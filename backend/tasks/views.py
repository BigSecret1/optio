from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import connection
import json


@csrf_exempt
def create_task(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))

        with connection.cursor() as cursor:
            cursor.execute(
                    '''
                INSERT INTO tasks(title, subtasks, due_date, comments, description, task_status)
                VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING id;
                ''',
                [
                    data.get('title', ''),
                    data.get('subtasks', []),
                    data.get('due_date', None),
                    data.get('comments', ''),
                    data.get('description', ''),
                    data.get('task_status', 'To Do'),
                    ]
                )

            task_id = cursor.fetchone()[0]

        return JsonResponse({'task_id': task_id})
    else:
        return JsonResponse({'error': 'Only POST requests are allowed.'})
