import logging
from typing import Any, Dict, Optional, Tuple

class SubTaskOperations:
    def __init__(self, cur, conn):
        self.conn = conn
        self.cur = cur

    def create_sub_task(self, task_data):
        query = """ 
            INSERT INTO tasks(title, due_date, comments, description, task_status, project_id, parent_task_id)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            RETURNING *;
        """
        query_param = (
            task_data.get('title', ''),
            task_data.get('due_date', None),
            task_data.get('comments', ''),
            task_data.get('description', ''),
            task_data.get('task_status', 'To Do'),
            task_data.get('project_id', ''),
            task_data.get('parentTaskId', None)
        )

        return self.__execute_query(query, query_param)

    def get_sub_task(self, task_id : int)-> Optional[Dict[str, Any]]:
        query = f"SELECT * FROM tasks WHERE parent_task_id = {task_id}"
        return self.__execute_query(query, fetch_all = True)


    def __execute_query(self, query: str, params: Tuple[Any, ...] = None, fetch_all : bool = False) -> Optional[Dict[str, Any]]:
        try:
            logging.info("Executing the query on database")
            self.cur.execute(query, params)
            self.conn.commit()

            if fetch_all:
                return self.cur.fetchall()
            return self.cur.fetchone()
        except Exception as e:
            logging.error("Error while executing query: %s", str(e))
            self.conn.rollback()
            raise
