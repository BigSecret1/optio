from django.shortcuts import render
from utils.db_connector import create_connection, close_connection 
import logging
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse 
import pandas as pd


# logging module configuration for loggin 
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')


logging.info("PERFORMANCE_METRICS_ACTIVATING..")
conn, cur =  create_connection()


def execute_query(query):

    logging.info("EXECUTING QUERY FOR PERFORMANCE METRICS %s ", query)
    cur.execute(query)
    result = cur.fetchall()
    
    logging.info("RAW DATA : %s", result)
    result_list = [dict(row) for row in result]
    logging.info("RESULT LIST : %s ", result_list)
    df = pd.DataFrame(result_list)
    return df 

#Class PerformanceMetrics():
#
#
#    def __init__(self, query : str):
#
#        self.execute_query(query)
#        



@csrf_exempt
def total_completed_tasks(request):

    if request.method == 'GET':
        try:
            query = """SELECT task_status, COUNT(task_status) as count  FROM tasks GROUP BY task_status"""
            total_completed_tasks : int  = 0
            total_pending_tasks : int = 0
            total_in_progress_task : int = 0
            total_to_do_tasks : int = 0
            task_performance_status = {} 

            task_stats = execute_query(query)
            for index, row in task_stats.iterrows():
                task_performance_status[row[0]] = row['count']
                

            logging.info("PERFORMANCE STATS ARE : %s", task_performance_status)
            total_completed_tasks = task_performance_status['completed']
            total_pending_tasks = task_performance_status['pending']
            total_in_progress_tasks = task_performance_status['in progress']
            total_to_do = task_performance_status['to do']
            
            return JsonResponse({"total_completed_tasks": f"{total_completed_tasks}"}, status=200)
        except Exception as err:
            logging.info("AN ERROR OCCURED WHILE EXECUTING THE QUERY")
            return JsonResponse({'Error': f"{err} occured"})
    else:
        return JsonResponse({'Error' : 'Only GET requests are allowed.'}, status=405)
 

def total_to_do():
    pass
    
#    if request.method == 'GET':
#        try:
#            query = """SELECT COUNT(task_status) as total_completed_tasks  FROM tasks WHERE task_status='to do'"""
#            total_do_do_tasks : int = execute_query(query)[


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






