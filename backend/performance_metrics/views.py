from django.shortcuts import render
from utils.db_connector import create_connection, close_connection 
import logging
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse 
import pandas as pd
import json


# logging module configuration for logging 
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')


logging.info("PERFORMANCE_METRICS_ACTIVATING..")
conn, cur =  create_connection()


class TaskPerformanceMetrics():
    def __init__(self):
        self._total_completed_task_per_month  = [] 
        self._total_pending_tasks_per_month = [] 
        self._total_in_progress_task : int = 0
        self._total_to_do_tasks : int = 0
        self.__task_status()

    def get_total_completed_tasks(self):
        logging.info("GETTING TOTAL COMPLETED TASK VALUE AS : %s", self._total_completed_task_per_month)
        return self._total_completed_task_per_month 

    def set_total_completed_task_per_month(self, completed_task_status):
        if not isinstance(completed_task_status, dict) or  completed_task_status == None:
            raise ValueError("something is wrong with completed_task_status")
        self._total_completed_task_per_month.append(completed_task_status) 
        logging.info("VALUE SET TO : %s", self._total_completed_task_per_month)

    def get_total_pending_tasks_per_month(self):
        return self._total_pending_tasks_per_month

    def set_total_pending_tasks_per_month(self, pending_task_status):
        logging.info("RECEIVING PENDING TASK STAT AS : %s", pending_task_status)
        if not isinstance(pending_task_status, dict) or pending_task_status == None:
            raise ValueError("Something went wrong with pendign task status")
        self._total_pending_tasks_per_month.append(pending_task_status)
 
    def get_total_in_progress_tasks_per_month(self):
        return self._total_pending_tasks_per_month

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
                         
            query = """
            WITH LatestStatus AS (
                SELECT
                    task_id,
                    new_status,
                    date_trunc('month', update_time) AS month,
                    update_time,
                    ROW_NUMBER() OVER (PARTITION BY task_id, date_trunc('month', update_time) ORDER BY update_time DESC) AS rn
                FROM
                    task_status_history
            )
            SELECT
                month,
                new_status,
                COUNT(*) AS status_count
            FROM
                LatestStatus
            WHERE
                rn = 1
            GROUP BY
                month, new_status
            ORDER BY
                month, new_status;
            """
                        
            task_performance_status = [] 

            task_stats = self.__execute_query(query)
            for index, row in task_stats.iterrows():
                per_status_stat = {}

                # Extract date from pandas timestamp
                timestamp = row['month']
                date = timestamp.date()
                logging.info("EXTRACTED DATE IS %s", date)

                status = row['new_status']
                task_count = row['status_count']

                per_status_stat['month'] = date 
                per_status_stat['status'] = status 
                per_status_stat['count'] = task_count 

                if status == 'completed':
                    self.set_total_completed_task_per_month(per_status_stat)
                elif status == 'pending':
                    self.set_total_pending_tasks_per_month(per_status_stat) 


                task_performance_status.append(per_status_stat) 
            logging.info("PER TYPE OF TASK METRICS %s", task_performance_status)
            
            for object in task_performance_status:
                for key, value in object.items():
                    logging.info("key : %s value : %s", key, value)
            
#            for index, row in task_stats.iterrows():
#                task_performance_status[row[0]] = row['count']
#                
#            logging.info("PERFORMANCE STATS ARE : %s", task_performance_status)
#            self.set_total_completed_tasks(task_performance_status['completed'])
#            self.set_total_pending_tasks(task_performance_status['pending'])
#            self.set_total_in_progress_tasks(task_performance_status['in progress'])
#            self.set_total_to_do_tasks(task_performance_status['to do'])

        except Exception as err:
            logging.info("AN ERROR OCCURED %s", err)
            return JsonResponse({'Error': f"{err} occured"})

task_performance_metrics = TaskPerformanceMetrics()

@csrf_exempt
def total_completed_tasks_in_month(request):
    result = task_performance_metrics.get_total_completed_tasks()
    return JsonResponse(result, safe=False)

@csrf_exempt
def total_to_do_tasks_in_month(request):
    result = task_performance_metrics.get_total_to_do_tasks()
    return JsonResponse({"total_to_do_tasks" : result})

@csrf_exempt
def total_in_progress_tasks_in_month(request):
    result = task_performance_metrics.get_total_in_progress_tasks()
    return JsonResponse({"total_in_progress_tasks": result})

@csrf_exempt
def total_pending_tasks_in_month(request):
    result = task_performance_metrics.get_total_pending_tasks_per_month()
    return JsonResponse(result, safe=False)

def success_in_project(project_id: int):
    pass

def to_do_in_projec(project_id: int):
    pass

def in_progress_in_project(project_id: int):
    pass
    
#logging.info("CLOSING DATABASE CONNECTION")
#close_connection(conn,cur)





"""
1. Change the schema to get last modified time
    - The new query will be this 
    

        
WITH LatestStatus AS (
    SELECT
        task_id,
        new_status,
        date_trunc('month', update_time) AS month,
        update_time,
        ROW_NUMBER() OVER (PARTITION BY task_id, date_trunc('month', update_time) ORDER BY update_time DESC) AS rn
    FROM
        task_status_history
)
SELECT
    month,
    new_status,
    COUNT(*) AS status_count
FROM
    LatestStatus
WHERE
    rn = 1
GROUP BY
    month, new_status
ORDER BY
    month, new_status;

2. Implment logic to calculate performance on month basis
    (I) All Projects
    (II) Per Project
3. Unit test cases
"""



