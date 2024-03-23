from django.shortcuts import render
from django.http import JsonResponse 
from django.views.decorators.csrf import csrf_exempt
from django.db import connection
import json
import pandas as pd
from rest_framework.response import Response
from rest_framework import status
import psycopg2
from psycopg2.extras import RealDictCursor
import time
import logging

# logging module configuration for loggin 
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')


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
            logging.info("executing query :  %s", query)
            cur.execute(query, (data.get('title', ''),
                                data.get('subtasks', []),
                                data.get('due_date', None),
                                data.get('comments', ''),
                                data.get('description', ''),
                                data.get('task_status', 'To Do'),
                                ))
            task = cur.fetchone()
            logging.info(task)


            conn.commit()
            close_connection(conn,cur)
            return JsonResponse(task, status=200)

        except Exception as err:
             return JsonResponse({"error": "wrong request body"}, status=500, content_type='application/json')
    else:
        return JsonResponse({'error': 'Only POST requests are allowed.'}, status=404)


@csrf_exempt
def get_task_by_id(request, task_id : int):

    if request.method == 'GET':
    
        conn, cur = create_connection() 

        try:
            query = """SELECT * FROM tasks WHERE id = %s"""
            task_id = str(task_id)
            cur.execute(query, (task_id,))

            task = cur.fetchone()
            task = dict(task)
            response_task = {
                "title": task['title'],
                "subtasks": task['subtasks'],
                "due_date": task['due_date'],
                "comments": task['comments'],
                "description": task['description'],
                "task_status": task['task_status']
            } 

            close_connection(conn,cur)
            logging.info("task by id : %s", task)
            return JsonResponse(response_task)

        except Exception as err:
            return JsonResponse({'ERROR': "Bad Request"}, status=500)

    else:
        return JsonResponse({'ERROR': "Only GET requests are allowed."}, status=405)





