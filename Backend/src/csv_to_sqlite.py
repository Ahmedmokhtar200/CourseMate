import csv
import sqlite3
import os
from contextlib import contextmanager
import re
from nltk.stem import WordNetLemmatizer

lemmatizer = WordNetLemmatizer()


def create_database_and_table(db_name):
    """
    Creates a SQLite database and a courses table if it doesn't exist.
    """
    try:
        with sqlite3.connect(db_name) as conn:
            cursor = conn.cursor()
            cursor.execute("""
                           CREATE TABLE IF NOT EXISTS courses
                           (
                               id
                               INTEGER
                               PRIMARY
                               KEY
                               AUTOINCREMENT,
                               course_name
                               TEXT
                               NOT
                               NULL,
                               university
                               TEXT,
                               difficulty_level
                               TEXT,
                               course_rating
                               REAL,
                               course_url
                               TEXT,
                               course_description
                               TEXT,
                               skills
                               TEXT
                           )
                           """)
            conn.commit()
            print("Database and table created successfully.")
    except sqlite3.Error as e:
        print(f"Database error: {e}")


def is_numeric(value):
    """
    Checks if a string can be converted to a float.
    """
    try:
        float(value)
        return True
    except (ValueError, TypeError):
        return False

def clean_for_tags(text):
    text = re.sub(r'��+', '', text)  # This removes "��" or any repeated "��" characters
    text = re.sub(r'[^\x00-\x7F]+', '', text)  # Removes non-ASCII characters
    text = re.sub(r'[^a-zA-Z\s]', '', text)  # Remove anything that is not a letter or space
    text = text.lower()  # Convert text to lowercase
    text = ' '.join([lemmatizer.lemmatize(word) for word in text.split()])  # Lemmatization
    return text


def import_csv_to_sqlite(csv_file_path, db_name):
    """
    Imports data from coursera.csv into the SQLite database, handling non-numeric course ratings.
    """
    try:
        # Check if the CSV file exists
        if not os.path.exists(csv_file_path):
            raise FileNotFoundError(f"The file {csv_file_path} does not exist.")

        # Connect to the database
        with sqlite3.connect(db_name) as conn:
            cursor = conn.cursor()

            # Open and read the CSV file
            with open(csv_file_path, mode='r', encoding='utf-8') as file:
                csv_reader = csv.DictReader(file)

                # Verify expected columns
                expected_columns = [
                    'Course Name', 'University', 'Difficulty Level',
                    'Course Rating', 'Course URL', 'Course Description', 'Skills'
                ]
                if csv_reader.fieldnames != expected_columns:
                    raise ValueError(
                        f"CSV file has incorrect columns. Expected: {expected_columns}, Found: {csv_reader.fieldnames}")

                # Insert data into the courses table
                invalid_ratings = []
                for row in csv_reader:
                    # Handle course rating: convert to float if numeric, else None
                    course_rating = float(row['Course Rating']) if is_numeric(row['Course Rating']) else None
                    if not is_numeric(row['Course Rating']) and row['Course Rating']:
                        invalid_ratings.append((row['Course Name'], row['Course Rating']))
                    row['Course Name'] = clean_for_tags(row['Course Name'])
                    row['Course Description'] = clean_for_tags(row['Course Description'])


                    cursor.execute("""
                                   INSERT INTO courses (name, university, difficulty_level,
                                                        rating, url, description, skills, thumnail)
                                   VALUES (?, ?, ?, ?, ?, ?, ?)
                                   """, (
                                       row['Course Name'],
                                       row['University'],
                                       row['Difficulty Level'],
                                       course_rating,
                                       row['Course URL'],
                                       row['Course Description'],
                                       row['Skills']
                                   ))

                conn.commit()
                print(f"Successfully imported {csv_reader.line_num - 1} rows into the database.")

                # Report any invalid ratings
                if invalid_ratings:
                    print("Rows with non-numeric course ratings (stored as NULL):")
                    for course_name, rating in invalid_ratings:
                        print(f"Course: {course_name}, Rating: {rating}")

    except FileNotFoundError as e:
        print(f"Error: {e}")
    except ValueError as e:
        print(f"Error: {e}")
    except sqlite3.Error as e:
        print(f"Database error: {e}")
    except Exception as e:
        print(f"An error occurred: {e}")


if __name__ == "__main__":
    csv_file_path = "coursera.csv"
    db_name = "db.sqlite3"
    create_database_and_table(db_name)
    import_csv_to_sqlite(csv_file_path, db_name)