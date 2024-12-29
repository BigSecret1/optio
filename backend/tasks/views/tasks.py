from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.http import JsonResponse
import json
import psycopg2
from psycopg2.extras import RealDictCursor
import time

import logging
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


class GetTasks(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
            conn, cur = create_connection()
            project_id = request.GET.get("project_id")
            # project_id = None
            logging.info("Project id is %s", project_id)

            if not project_id:
                query = "SELECT * FROM tasks"
                param = []
            else:
                query = "SELECT * FROM tasks WHERE project_id=%s"
                param = [project_id]

            cur.execute(query, (param))
            tasks = cur.fetchall()
            return JsonResponse(tasks, safe=False)
        except Exception as err:
            return JsonResponse({'ERROR': "Bad Request"}, status=500)


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
            return JsonResponse({'ERROR': err}, status=500)


class UpdateTask(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def put(self, request, task_id):
        try:
            data = json.loads(request.body.decode('utf-8'))
            conn, cur = create_connection()
            data = dict(data)
            new_task = {key: to_lowercase(value) for key, value in data.items()}
            logging.info("NEW TASK IS %s", new_task)

            cur.execute("SELECT * FROM tasks WHERE id = %s", (task_id,))
            existing_task = cur.fetchone()

            if 'comments' in new_task and new_task['comments'] is not None:
                logging.info("New task comments are: %s", new_task['comments'])

                if isinstance(existing_task['comments'], list) and isinstance(new_task['comments'], list):
                    existing_task['comments'] += new_task['comments']  # Concatenate comments lists
                else:
                    logging.info("Comments are not lists, creating new comment list")
                    existing_task["comments"] = new_task["comments"]

            if existing_task:
                query = """
                    UPDATE tasks
                    SET title = %s, subtasks = %s, due_date = %s, comments = %s,
                        description = %s, task_status = %s, project_id = %s
                    WHERE id = %s
                """
                cur.execute(query, (
                    new_task.get('title', existing_task['title']),
                    new_task.get('subtasks', existing_task['subtasks']),
                    new_task.get('due_date', existing_task['due_date']),
                    existing_task['comments'],
                    new_task.get('description', existing_task['description']),
                    new_task.get('task_status', existing_task['task_status']),
                    new_task.get('project_id', existing_task['project_id']),
                    task_id
                ))
                logging.info("QUERY : %s", query)
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


class Searcher(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        title = request.GET.get("title")
        project = request.GET.get("project")
        status = request.GET.get("status")

        tasks = self.__search(title=title, status=status, project=project)
        return JsonResponse(tasks, safe=False)
    # To filter the tasks
    def __search(self, **kwargs):
        conn, cur = create_connection()

        # \n was getting appended so trimmed white space
        title = (kwargs.get("title", "") or "").strip()
        project = (kwargs.get("project", "") or "").strip()
        status = (kwargs.get("status", "") or "").strip()

        logging.info("task in searcher is %s and project is %s ", title, project)

        query = '''
                    SELECT * 
                    FROM tasks
                    JOIN projects ON tasks.project_id = projects.id
                    WHERE 1 = 1
                    AND (tasks.title IS NULL OR tasks.title LIKE %s)
                    AND (projects.name IS NULL OR projects.name LIKE %s)
                    AND (tasks.task_status IS NULL OR tasks.task_status LIKE %s);
                '''

        params = (
            f"%{title}%" if title else '%',
            f"%{project}%" if project else '%',
            f"%{status}%" if status else '%',
        )

        # Debug: Format query for logging
        debug_query = query % tuple(repr(p) for p in params)
        logging.debug("Executing SQL query: %s", debug_query)

        cur.execute(query, params)
        tasks = cur.fetchall()
        conn.close()
        cur.close()

        return tasks




