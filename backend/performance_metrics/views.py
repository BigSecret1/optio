from django.shortcuts import render
from utils.db_connector import create_connection, close_connection
import logging
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import pandas as pd
import json
from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from rest_framework.parsers import JSONParser


# logging module configuration for logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

logging.info("PERFORMANCE_METRICS_ACTIVATING..")
conn, cur = create_connection()


class TaskPerformanceMetrics():
    def __init__(self):
        self._total_completed_task_per_month = []
        self._total_pending_tasks_per_month = []
        self._total_in_progress_tasks_per_month: int = []
        self._total_to_do_tasks_per_month = []
        self.__overall_task_status()

    def get_total_completed_tasks(self):
        logging.info("GETTING TOTAL COMPLETED TASK VALUE AS : %s", self._total_completed_task_per_month)
        return self._total_completed_task_per_month

    def set_total_completed_task_per_month(self, completed_task_status):
        if not isinstance(completed_task_status, dict) or completed_task_status == None:
            raise ValueError("something is wrong with completed_task_status")
        self._total_completed_task_per_month.append(completed_task_status)
        logging.info("VALUE SET TO : %s", self._total_completed_task_per_month)

    def get_total_pending_tasks_per_month(self):
        return self._total_pending_tasks_per_month

    def set_total_pending_tasks_per_month(self, pending_task_status):
        logging.info("RECEIVING PENDING TASK STAT AS : %s", pending_task_status)
        if not isinstance(pending_task_status, dict) or pending_task_status == None:
            raise ValueError("Something went wrong with pending task status")
        self._total_pending_tasks_per_month.append(pending_task_status)

    def get_total_in_progress_tasks_per_month(self):
        return self._total_in_progress_tasks_per_month

    def set_total_in_progress_tasks_per_month(self, in_progress_task_status):
        if not isinstance(in_progress_task_status, dict) or in_progress_task_status == None:
            raise ValueError("Something went wrong with in progress task status")
        self._total_in_progress_tasks_per_month.append(in_progress_task_status)

    def get_total_to_do_tasks_per_month(self):
        return self._total_to_do_tasks_per_month

    def set_total_to_do_tasks_per_month(self, to_do_task_status):
        if not isinstance(to_do_task_status, dict) or to_do_task_status == None:
            raise ValueError("Something went wrong with to do task status")
        self._total_to_do_tasks_per_month = to_do_task_status

    def __execute_query(self, query):
        logging.info("EXECUTING QUERY FOR PERFORMANCE METRICS %s ", query)
        cur.execute(query)
        result = cur.fetchall()

        logging.info("RAW DATA : %s", result)
        result_list = [dict(row) for row in result]
        logging.info("RESULT LIST : %s ", result_list)
        df = pd.DataFrame(result_list)
        return df

    def __overall_task_status(self):
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
                elif status == 'in progress':
                    self.set_total_in_progress_tasks_per_month(per_status_stat)
                elif status == 'to do':
                    self.set_total_to_do_tasks_per_month(per_status_stat)

                task_performance_status.append(per_status_stat)
            logging.info("PER TYPE OF TASK METRICS %s", task_performance_status)

            for object in task_performance_status:
                for key, value in object.items():
                    logging.info("key : %s value : %s", key, value)

        except Exception as err:
            logging.info("AN ERROR OCCURED %s", err)
            return JsonResponse({'Error': f"{err} occured"})


    def per_project_tasks_status(self, project_id: int, task_status_type : str):
        try:
            query = f"""
                    WITH LatestStatus AS (
            SELECT
                tasks.project_id,
                task_status_history.new_status,
                task_status_history.update_time,
                tasks.id,
                ROW_NUMBER() OVER (PARTITION BY tasks.id ORDER BY task_status_history.update_time DESC) AS rn
            FROM
                task_status_history
            RIGHT JOIN
                tasks
            ON
                task_status_history.task_id = tasks.id
        ),
        MonthlyStatus AS (
            SELECT
                project_id,
                new_status,
                date_trunc('month', update_time) AS month,
                id
            FROM
                LatestStatus
            WHERE
                rn = 1
        )
        SELECT
            month,
            new_status,
            project_id,
            COUNT(*) AS status_count
        FROM
            MonthlyStatus
            WHERE project_id = {project_id} AND
            new_status='{task_status_type}'
        GROUP BY
            project_id, month, new_status
        ORDER BY
            month DESC, new_status
                    """

            result = self.__execute_query(query)
            project_status_record_per_month = {}
            for index, row in result.iterrows():
                if row['month'] == None or row['new_status'] == None:
                    continue
                status_stat = {
                        "status_type": row['new_status'],
                        "count": row['status_count'],
                        "project_id": row['project_id']
                    }

                timestamp = row['month']
                date = str(timestamp.date())
                if date not in project_status_record_per_month:
                    project_status_record_per_month[date] = []
                project_status_record_per_month[date].append(status_stat)
            logging.info("PER PROJECT MONTH WISE STATUS IS : %s", project_status_record_per_month)
            return project_status_record_per_month
        except Exception as e:
            return f"something wrong {e}" 


task_performance_metrics = TaskPerformanceMetrics()

@csrf_exempt
def total_completed_tasks_in_month(request):
    result = task_performance_metrics.get_total_completed_tasks()
    return JsonResponse(result, safe=False)


@csrf_exempt
def total_to_do_tasks_in_month(request):
    result = task_performance_metrics.get_total_to_do_tasks_per_month()
    return JsonResponse(result, safe=False)


@csrf_exempt
def total_in_progress_tasks_in_month(request):
    result = task_performance_metrics.get_total_in_progress_tasks_per_month()
    return JsonResponse(result, safe=False)


@csrf_exempt
def total_pending_tasks_in_month(request):
    result = task_performance_metrics.get_total_pending_tasks_per_month()
    return JsonResponse(result, safe=False)

@api_view(['GET'])
@csrf_exempt
def total_completed_tasks_per_project_in_month(request, project_id: int, task_status_type: str):
    result = task_performance_metrics.per_project_tasks_status(project_id, task_status_type)
    return JsonResponse(result, safe=False)


def to_do_in_projec(project_id: int):
    pass


def in_progress_in_project(project_id: int):
    pass


# logging.info("CLOSING DATABASE CONNECTION")
# close_connection(conn,cur)


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
