from django.shortcuts import render
from utils.db_connector import create_connection, close_connection 
import logging
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse 
import pandas as pd


# logging module configuration for logging 
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')


logging.info("PERFORMANCE_METRICS_ACTIVATING..")
conn, cur =  create_connection()


class PerformanceMetrics():
    def __init__(self):
        self._total_completed_tasks : int  = 0
        self._total_pending_tasks : int = 0
        self._total_in_progress_task : int = 0
        self._total_to_do_tasks : int = 0
        self.__task_status()

    def get_total_completed_tasks(self):
        logging.info("GETTING TOTAL COMPLETED TASK VALUE AS : %s", self._total_completed_tasks)
        return self._total_completed_tasks

    def set_total_completed_tasks(self, value):
        logging.info("TOTAL COMPLETED TASKS ARE : %s", value)
        if not isinstance(value, int) or value < 0:
            raise ValueError("Total completed tasks must be a non-negative integer")
        self._total_completed_tasks = value
        logging.info("VALUE SET TO : %s", self._total_completed_tasks)

    def get_total_pending_tasks(self):
        return self._total_pending_tasks

    def set_total_pending_tasks(self, value):
        if not isinstance(value, int) or value < 0:
            raise ValueError("Total pending tasks must be a non-negative integer")
        self._total_pending_tasks = value

    def get_total_in_progress_tasks(self):
        return self._total_in_progress_tasks

    def set_total_in_progress_tasks(self, value):
        if not isinstance(value, int) or value < 0:
            raise ValueError("Total in-progress tasks must be a non-negative integer")
        self._total_in_progress_tasks = value

    def get_total_to_do_tasks(self):
        return self._total_to_do_tasks

    def set_total_to_do_tasks(self, value):
        if not isinstance(value, int) or value < 0:
            raise ValueError("Total to-do tasks must be a non-negative integer")
        self._total_to_do_tasks = value

    def __execute_query(self,query):
        logging.info("EXECUTING QUERY FOR PERFORMANCE METRICS %s ", query)
        cur.execute(query)
        result = cur.fetchall()
        
        logging.info("RAW DATA : %s", result)
        result_list = [dict(row) for row in result]
        logging.info("RESULT LIST : %s ", result_list)
        df = pd.DataFrame(result_list)
        return df 

    def __task_status(self):
        try:
            query = """SELECT task_status, COUNT(task_status) as count  FROM tasks GROUP BY task_status"""
            
            task_performance_status = {} 

            task_stats = self.__execute_query(query)
            for index, row in task_stats.iterrows():
                task_performance_status[row[0]] = row['count']
                
            logging.info("PERFORMANCE STATS ARE : %s", task_performance_status)
            self.set_total_completed_tasks(task_performance_status['completed'])
            self.set_total_pending_tasks(task_performance_status['pending'])
            self.set_total_in_progress_tasks(task_performance_status['in progress'])
            self.set_total_to_do_tasks(task_performance_status['to do'])
            
            return JsonResponse({"total_completed_tasks": f"{total_completed_tasks}"}, status=200)
        except Exception as err:
            logging.info("AN ERROR OCCURED WHILE EXECUTING THE QUERY")
            return JsonResponse({'Error': f"{err} occured"})

@csrf_exempt
def total_completed_tasks(request):
    performance_metrics = PerformanceMetrics()
    result = performance_metrics.get_total_completed_tasks()
    return JsonResponse({"total_completed_tasks": result})

@csrf_exempt
def total_to_do_tasks(request):
    performance_metrics = PerformanceMetrics()
    result = performance_metrics.get_total_to_do_tasks()
    return JsonResponse({"total_to_do_tasks" : result})

@csrf_exempt
def total_in_progress_tasks(request):
    performance_metrics = PerformanceMetrics()
    result = performance_metrics.get_total_in_progress_tasks()
    return JsonResponse({"total_in_progress_tasks": result})

@csrf_exempt
def total_pending_tasks(request):
    performance_metrics = PerformanceMetrics()
    result = performance_metrics.get_total_pending_tasks()
    return JsonResponse({"total_pending_tasks" : result})

def success_in_project(project_id: int):
    pass


def to_do_in_projec(project_id: int):
    pass


def in_progress_in_project(project_id: int):
    pass
    
#logging.info("CLOSING DATABASE CONNECTION")
#close_connection(conn,cur)






