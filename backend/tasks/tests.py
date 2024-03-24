from django.test import TestCase, Client
import psycopg2
from django.db import connection
from django.http import JsonResponse
from unittest.mock import patch, ANY, MagicMock
from unittest import mock
import json 
from tasks.views import create_task 

from psycopg2.extras import RealDictCursor


class CreateTaskViewTestCase(TestCase):
    
    def setUp(self):
        self.client = Client()

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







