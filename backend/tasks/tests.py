from django.test import TestCase, Client
import psycopg2
from django.db import connection
from django.http import JsonResponse
from unittest.mock import patch, ANY, MagicMock
from unittest import mock
import json 
from tasks.views import create_task 
import logging
from psycopg2.extras import RealDictCursor

# logging module configuration for loggin 
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')



class CreateTaskViewTestCase(TestCase):
    
    def setUp(self):
        self.client = Client()

    def create_task(self):
        
        request_body = {
            "title": "something new is here",
            "project_id": 1,
            "subtasks": [
                "Subtask1",
                "Subtask2"
            ],
            "due_date": "2024-02-04",
            "comments": [
                "This is the first test comment",
                "This is the second comment"
            ],
            "description": "This is test description",
            "task_status": "In Progress"
            }
        response = self.client.post('/tasks/create/', data=request_body, content_type="application/json")
        task = dict(response.json())
        return task['id'], task['title']

    def test_wrong_request_method(self):
        expected_result = {
        "id": 33,
        "title": "Complete Project"
        }
        request_data = {
        "title": "Request from tests",
        "subtasks": ["Subtask1", "Subtask2"],
        "due_date": "2024-02-04",
        "comments": ["This is the first test comment", "This is the second comment"],
        "description": "This is test description",
        "task_status": "In Progress"
        }
        request_body = json.dumps(request_data)
        print(request_body)
        response = self.client.get('/tasks/create/')

        self.assertEqual(response.status_code,405)
        self.assertEqual(response.json(),{'error': 'Only POST requests are allowed.'})


    def test_create_task_success(self):

        expected_result = {
            "id": 33,
            "title": "Complete Project"
        }
        request_data = {
            "title": "Request from tests",
            "project_id": 1,
            "subtasks": ["Subtask1", "Subtask2"],
            "due_date": "2024-02-04",
            "comments": ["This is the first test comment", "This is the second comment"],
            "description": "This is test description",
            "task_status": "In Progress"
        }
        request_body = json.dumps(request_data)
        print(request_body)
        response = self.client.post('/tasks/create/', data=request_body, content_type="application/json")

        self.assertEqual(response.status_code, 200)


    def test_wrong_post(self):
        
        expected_result = {
            "id": 33,
            "title": "Complete Project"
        }
        request_data = {
            "title": "Request from tests",
            "subtasks": ["Subtask1", "Subtask2"],
            "due_date": "2024-02-04444",
            "comments": ["This is the first test comment", "This is the second comment"],
            "description": "This is test description",
            "task_status": "In Progress"
        }
        request_body = json.dumps(request_data)
        print(request_body)
        response = self.client.post('/tasks/create/', data=request_body, content_type="application/json")

        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.json(),{'error': 'wrong request body'})


    def test_wrong_request_get_task(self):
        
        response = self.client.post('/tasks/get/80/')

        self.assertEqual(response.status_code, 405)
        self.assertEqual(response.json(),{'ERROR': "Only GET requests are allowed."})

    
    def test_get_task(self):

        created_task_id, created_task_title = self.create_task()
        created_task_id = int(created_task_id)

        url = f'/tasks/get/{created_task_id}/'

        response = self.client.get(url)
        task = dict(response.json())

        self.assertEqual(response.status_code, 200)
        self.assertEqual(task['title'], created_task_title)
  

    def test_update_task(self):

        request_data = {
            "title": "response changed from unit test",
            "project_id": 2,
            "subtasks": [
            "Subtask1",
            "Subtask2"
            ],
            "due_date": "2024-02-04",
            "comments": [
            "This is the first test comment",
            "This is the second comment"
            ],
            "description": "This is test description",
            "task_status": "In Progress"
            }
        created_task_id, created_task_title = self.create_task()
        created_task_id = int(created_task_id)

        url = f'/tasks/update/{created_task_id}/'
        response = self.client.post(url, data=request_data)
        task = dict(response.json())
        
        self.assertEqual({'ERROR': "Only UPDATE requests are allowed."}, task)

        request_data = json.dumps(request_data)
        response = self.client.put(url, data=request_data)
        task = dict(response.json())

        self.assertEqual(task['title'], "response changed from unit test")
           

    def test_delete_task(self):

        created_task_id, created_task_title = self.create_task()
        created_task_id = int(created_task_id)

        url = f'/tasks/delete/{created_task_id}/'

        response = self.client.delete(url)
        response = response.json()

        self.assertEqual(response, {"message": "Task deleted successfully"})

        # test wrong request
        response = self.client.post(url)
        status_code = response.status_code
        response = response.json()
        self.assertEqual(response, {'ERROR': "Only DELETE requests are allowed."})
        self.assertEqual(status_code, 405)

