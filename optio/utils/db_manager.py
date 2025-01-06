import psycopg2
from psycopg2.extras import RealDictCursor

import time
import logging


def create_connection(max_retries : int = 5):
    retries : int = 0
    while retries < max_retries:
        try:
            conn = psycopg2.connect(
                host='localhost',
                database='todoler',
                user='dinesh',
                password='neverworry'
            )
            cur = conn.cursor(cursor_factory=RealDictCursor)
            logging.info("Database connection was successful")
            return conn, cur
        except Exception as err:
            logging.error("Error when trying to connect to PostgreSQL DB: %s", err)
            retries += 1
            logging.info("Retrying... (%d/%d)", retries, max_retries)
            time.sleep(2)

    raise Exception("Failed to connect to the database after multiple attempts.")


def close_connection(conn, cur):
    cur.close()
    conn.close()
    print("Database connection closed")
