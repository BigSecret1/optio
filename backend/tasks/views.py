from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
import json
import logging
import psycopg2
from psycopg2.extras import RealDictCursor
import time

# logging module configuration for logging
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


def to_lowercase(value):
    converted_value = value 
    logging.info("CONVERTING VALUE %s ", value)
    if isinstance(value, str):
        converted_value = value.lower()
    if isinstance(value, list):
        converted_value = [to_lowercase(item) for item in value]
    logging.info("CONVERTED VALUE : %s", converted_value)
    return converted_value 


class CreateTask(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            data = json.loads(request.body.decode('utf-8'))
            conn, cur = create_connection()

            query = """ 
                INSERT INTO tasks(title, subtasks, due_date, comments, description, task_status, project_id)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                RETURNING *;
            """

            logging.info("Converting task into lowercase")
            data = dict(data)
            new_task = {key: to_lowercase(value) for key, value in data.items()}
            logging.info("Converted task is %s", new_task)

            logging.info("executing query :  %s", query)
            cur.execute(query, (
                new_task.get('title', ''),
                new_task.get('subtasks', []),
                new_task.get('due_date', None),
                new_task.get('comments', ''),
                new_task.get('description', ''),
                new_task.get('task_status', 'To Do'),
                new_task.get('project_id', ''),
            ))
            task = cur.fetchone()
            logging.info(task)

            conn.commit()
            close_connection(conn, cur)
            return JsonResponse(task, status=200)

        except Exception as err:
            return JsonResponse({"error": "wrong request body"}, status=500, content_type='application/json')


class GetTaskById(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, task_id):
        try:
            conn, cur = create_connection()
            query = "SELECT * FROM tasks WHERE id = %s"
            cur.execute(query, (task_id,))
            task = cur.fetchone()
            if task:
                task = dict(task)
                response_task = {
                    "title": task['title'],
                    "subtasks": task['subtasks'],
                    "due_date": task['due_date'],
                    "comments": task['comments'],
                    "description": task['description'],
                    "task_status": task['task_status']
                }
                close_connection(conn, cur)
                logging.info("task by id : %s", task)
                return JsonResponse(response_task)
            else:
                return JsonResponse({"error": "Task not found"}, status=404)
        except Exception as err:
            return JsonResponse({'ERROR': "Bad Request"}, status=500)


class UpdateTask(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def put(self, request, task_id):
        try:
            data = json.loads(request.body.decode('utf-8'))
            conn, cur = create_connection()
            data = dict(data)
            new_task = {key: to_lowercase(value) for key, value in data.items()}

            cur.execute("SELECT * FROM tasks WHERE id = %s", (task_id,))
            existing_task = cur.fetchone()

            if existing_task:
                query = """
                    UPDATE tasks
                    SET title = %s, subtasks = %s, due_date = %s, comments = %s,
                        description = %s, task_status = %s, project_id = %s
                    WHERE id = %s
                """
                cur.execute(query, (
                    new_task.get('title', ''),
                    new_task.get('subtasks', []),
                    new_task.get('due_date', None),
                    new_task.get('comments', ''),
                    new_task.get('description', ''),
                    new_task.get('task_status', 'To Do'),
                    new_task.get('project_id', ''),
                    task_id
                ))
                conn.commit()

                cur.execute("SELECT * FROM tasks WHERE id = %s", (task_id,))
                updated_task = cur.fetchone()
                if updated_task:
                    response_task = {
                        "title": updated_task['title'],
                        "project_id": updated_task['project_id'],
                        "subtasks": updated_task['subtasks'],
                        "due_date": updated_task['due_date'],
                        "comments": updated_task['comments'],
                        "description": updated_task['description'],
                        "task_status": updated_task['task_status']
                    }
                    logging.info("Task updated successfully")
                    return JsonResponse(response_task)
                else:
                    return JsonResponse({"error": "Task not found"}, status=404)

            else:
                return JsonResponse({"error": "Task not found"}, status=404)
        except Exception as e:
            logging.error("Error updating task: %s", str(e))
            return JsonResponse({"error": "Failed to update task"}, status=500)


class DeleteTask(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def delete(self, request, task_id):
        try:
            conn, cur = create_connection()
            cur.execute("DELETE FROM tasks WHERE id = %s", (task_id,))
            conn.commit()

            if cur.rowcount == 0:
                return JsonResponse({"error": "Task not found"}, status=404)
            else:
                return JsonResponse({"message": "Task deleted successfully"}, status=200)
        except psycopg2.Error as e:
            logging.error("Error deleting task: %s", e)
            return JsonResponse({"error": "Failed to delete task"}, status=500)
        finally:
            if conn:
                close_connection(conn, cur)





