import connection


@connection.connection_handler
def check_username(cursor, username):
    cursor.execute("""
                    SELECT * FROM users
                    WHERE username = %(username)s;
                    """,
                   {'username': username})
    username = cursor.fetchone()
    return username


@connection.connection_handler
def insert_user(cursor, username, password):
    cursor.execute("""
                    INSERT INTO users (username, password)
                    VALUES (%(username)s, %(password)s);
                   """,
                   {'username': username, 'password': password})
