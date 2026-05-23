import sqlite3

conn = sqlite3.connect("interview.db")

cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS candidate(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    role TEXT,
    interview_date DATETIME DEFAULT CURRENT_TIMESTAMP
)
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS questions(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    role TEXT,
    question TEXT
)
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS responses(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    candidate_id INTEGER,
    question TEXT,
    answer TEXT,
    score INTEGER
)
""")

conn.commit()
conn.close()

print("Database Created Successfully")