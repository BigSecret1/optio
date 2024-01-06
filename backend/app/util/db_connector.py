import psycopg2
from django.conf import settings

def create_connection():
    # Extract database configuration from Django settings
    db_config = settings.DATABASES['default']

    # Create a connection to the PostgreSQL database
    conn = psycopg2.connect(
        host=db_config['HOST'],
        port=db_config['PORT'],
        user=db_config['USER'],
        password=db_config['PASSWORD'],
        database=db_config['NAME'],
    )

    return conn

def close_connection(conn):
    # Close the database connection
    conn.close()

def execute_query(conn, query, params=None):
    # Execute a SQL query on the database
    with conn.cursor() as cursor:
        cursor.execute(query, params)
        result = cursor.fetchall()

    return result

