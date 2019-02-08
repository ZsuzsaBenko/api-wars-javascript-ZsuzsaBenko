import connection
import datetime


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


@connection.connection_handler
def insert_vote(cursor, data):
    submission_time = datetime.datetime.now()
    cursor.execute("""
                    INSERT INTO planet_votes (planet_id, planet_name, user_id, submission_time)
                    VALUES (%(planet_id)s, %(planet_name)s, %(user_id)s, %(submission_time)s);
                   """,
                   {"planet_id": data["planet_id"], "planet_name": data["planet_name"], "user_id": data["user_id"],
                    "submission_time": submission_time})


@connection.connection_handler
def get_planet_votes(cursor):
    cursor.execute("""
                    SELECT planet_name, COUNT(planet_id) AS "received_votes" FROM planet_votes
                    GROUP BY planet_name
                    ORDER BY received_votes DESC, planet_name ASC;
                   """)
    planet_votes = cursor.fetchall()
    return planet_votes
