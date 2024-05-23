from django.shortcuts import render
from utils.db_connector import create_connection, close_connection 
import logging
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse 

# logging module configuration for loggin 
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')


logging.info("performance_metrics activating ..")
conn, cur =  create_connection()

@csrf_exempt
def test_view(request):
    test_query = "SELECT * FROM tasks"
    id = 1
    cur.execute(test_query)
    result = cur.fetchall()
    close_connection(conn,cur)
    return JsonResponse({"message": f"{result}"}) 


def execute_query(query: str):
    pass


def total_completed():
    pass
 

def total_to_do():
    pass


def total_in_progress():
    pass


def success_in_project(project_id: int):
    pass


def to_do_in_projec(project_id: int):
    pass


def in_progress_in_project(project_id: int):
    pass
    


