from django.db import connection
import psycopg2
from psycopg2.extras import RealDictCursor
import logging


# logging module configuration for loggin 
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')


def create_connection():
    while True:
        try:
            conn = psycopg2.connect(
                    host='localhost',
                    database='todoler',
                    user='dinesh',
                    password='neverworry'
                    )
            cur = conn.cursor(cursor_factory=RealDictCursor)
            print("Database connection was successful")
            return conn, cur
        except Exception as err:
            print("Error when trying to connect to PostgreSQL DB -> ", err)
            time.sleep(2)


def close_connection(conn, cur):
    cur.close()
    conn.close()
    print("Database connection closed")







