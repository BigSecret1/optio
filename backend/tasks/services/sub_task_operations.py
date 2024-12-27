from utils.db_manager import  create_connection, close_connection
import logging

class TaskOperation:
    def __init__(self, cur, conn):
        self.conn = conn
        self.cur = cur

    def create_sub_task(self, task_data):
        query = """ 
            INSERT INTO tasks(title, due_date, comments, description, task_status, project_id, parent_task_id)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            RETURNING *;
        """
        logging.info("executing query on database")
        self.cur.execute(query, (
            task_data.get('title', ''),
            task_data.get('due_date', None),
            task_data.get('comments', ''),
            task_data.get('description', ''),
            task_data.get('task_status', 'To Do'),
            task_data.get('project_id', ''),
            task_data.get('parentTaskId', None)
        ))
        task = self.cur.fetchone()
        self.conn.commit()

    def execute_query(self, query, params):
        try:
            logging.info("Executing query on database: %s", query)
            self.cur.execute(query, params)
            self.conn.commit()
            return self.cur.fetchone()  # Return the created task record
        except Exception as e:
            logging.error("Error while executing query: %s", str(e))
            self.conn.rollback()
            raise
