from django.shortcuts import render
from utils.db_connector import create_connection, close_connection 
import logging
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse 


# logging module configuration for loggin 
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')


logging.info("PERFORMANCE_METRICS_ACTIVATING..")
conn, cur =  create_connection()


def execute_query(query):

    logging.info("EXECUTING QUERY FOR PERFORMANCE METRICS %s ", query)
    cur.execute(query)
    result = dict(cur.fetchone())
    logging.info("QUERY RETURNED %s ", result)
    return result


@csrf_exempt
def total_completed_tasks(request):
    if request.method == 'GET':
        try:
            query = """SELECT COUNT(task_status) as total_completed_tasks  FROM tasks WHERE task_status='completed'"""
            total_completed_tasks : int = execute_query(query)['total_completed_tasks']
            logging.info("TOTAL COMPLETED TASKS ARE : %s ", total_completed_tasks)
            return JsonResponse({"total_completed_tasks": f"{total_completed_tasks}"}, status=200)
        except Exception as err:
            logging.info("AN ERROR OCCURED WHILE EXECUTING THE QUERY : %s ", query)
            return JsonResponse({'Error': f"{err} occured"})
    else:
        return JsonResponse({'Error' : 'Only GET requests are allowed.'}, status=405)
 

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
    
#logging.info("CLOSING DATABASE CONNECTION")
#close_connection(conn,cur)






