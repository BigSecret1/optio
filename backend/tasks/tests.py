from django.test import TestCase, Client
import json 
from tasks.views import create_task



class CreateTaskViewTestCase(TestCase):

    def setUp(self):
        self.client = Client()


    def test_invalid_request_status_code(self):

        response = self.client.get('/tasks/create/')

        # Assert the status code of response(Bad Request)
        self.assertEqual(response.status_code, 400)


    def test_invalid_request_error_message(self):

        response = self.client.get('/tasks/create/')
        
        print("RESPONSE: ", response)

        error = response.json()
        error_message = error.get("error")

        # Assert the expected response content
        self.assertEqual({'error': error_message}, {'error': 'Only POST requests are allowed.'})



