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

    def __execute_query(self, query: str, params: Tuple[Any, ...]) -> Optional[
        Dict[str, Any]]:
        try:
            logging.info("Executing the query on database")
            self.cur.execute(query, params)
            self.conn.commit()

            return self.cur.fetchone()
        except Exception as e:
            logging.error("Error while executing query: %s", str(e))
            self.conn.rollback()
            raise
