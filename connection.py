import os
import urllib.parse
import psycopg2
import psycopg2.extras


def get_connection_string():
    if os.environ.get('DATABASE_URL') is not None:
        urllib.parse.uses_netloc.append('postgres')
        url = urllib.parse.urlparse(os.environ.get('DATABASE_URL'))

        user_name = url.username
        password = url.password
        host = url.hostname
        database_name = url.path[1:]
        port = url.port

        return 'postgres://{user_name}:{password}@{host}:{port}/{database_name}'.format(
            user_name=user_name,
            password=password,
            host=host,
            database_name=database_name,
            port=port)

    else:
        user_name = os.environ.get('PSQL_USER_NAME')
        password = os.environ.get('PSQL_PASSWORD')
        host = os.environ.get('PSQL_HOST')
        database_name = os.environ.get('PSQL_DB_NAME')

        return 'postgresql://{user_name}:{password}@{host}/{database_name}'.format(
            user_name=user_name,
            password=password,
            host=host,
            database_name=database_name)


def open_database():
    try:
        connection_string = get_connection_string()
        connection = psycopg2.connect(connection_string)
        connection.autocommit = True
    except psycopg2.DatabaseError as exception:
        print('Database connection problem')
        raise exception
    return connection


def connection_handler(function):
    def wrapper(*args, **kwargs):
        connection = open_database()
        dict_cur = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        ret_value = function(dict_cur, *args, **kwargs)
        dict_cur.close()
        connection.close()
        return ret_value

    return wrapper
