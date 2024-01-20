from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import connection
import json
import pandas as pd
from django.http import JsonResponse


@csrf_exempt
def create_task(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))

            with connection.cursor() as cursor:
                cursor.execute(
                        '''
                    INSERT INTO tasks(title, subtasks, due_date, comments, description, task_status)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    RETURNING *;
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

                columns = [col[0] for col in cursor.description]
                task = cursor.fetchone()
                task = dict(zip(columns, task))
                df = pd.DataFrame.from_records([task])
                task_detail = {}
                task_detail["id"] = int(df.at[0,"id"])
                task_detail["title"] = str(df.at[0,"title"])

            return JsonResponse(task_detail, status=200)
        except exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Only POST requests are allowed.'}, status=400)
