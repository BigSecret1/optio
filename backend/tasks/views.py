from django.shortcuts import render
from django.http import JsonResponse 
from django.views.decorators.csrf import csrf_exempt
from django.db import connection
import json
import pandas as pd
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework import status


import psycopg2
from psycopg2.extras import RealDictCursor
import time




import logging

# Configure the logging module (usually done at the beginning of your script)
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')


def create_connection():
    while True:
        try:
            conn = psycopg2.connect(
                    host='localhost',
                    database='todoler',
                    user='dinesh',
                    password='neverworry'
                    )
            cur = conn.cursor(cursor_factory=RealDictCursor)
            print("Database connection was successful")
            return conn, cur
        except Exception as err:
            print("Error when trying to connect to PostgreSQL DB -> ", err)
            time.sleep(2)

def close_connection(conn, cur):
    cur.close()
    conn.close()
    print("Database connection closed")


@csrf_exempt
def create_task(request):

    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))

            conn, cur = create_connection() 
            query = """ 
                INSERT INTO tasks(title, subtasks, due_date, comments, description, task_status)
                VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING *;
               """ 
            logging.info(query)
            cur.execute(query, (data.get('title', ''),
                                data.get('subtasks', []),
                                data.get('due_date', None),
                                data.get('comments', ''),
                                data.get('description', ''),
                                data.get('task_status', 'To Do'),
                                ))
            post = cur.fetchone()
            logging.info(post)


            conn.commit()
            conn.close()
            return JsonResponse(post, status=200)

        except Exception as err:
            #return Response({"error": "wrong request body"},status=status.HTTP_201_CREATED)
             return JsonResponse({"error": "wrong request body"}, status=500, content_type='application/json')
    else:
        return JsonResponse({'error': 'Only POST requests are allowed.'}, status=400)









