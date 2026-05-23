import sqlite3

conn = sqlite3.connect("interview.db")

cursor = conn.cursor()

questions = [

("Data Analyst",
"Explain the difference between INNER JOIN and LEFT JOIN"),

("Data Analyst",
"What is data cleaning?"),

("Data Analyst",
"What is the purpose of GROUP BY in SQL?"),

("Python Developer",
"What are Python decorators?"),

("Python Developer",
"Difference between list and tuple?"),

("Python Developer",
"What is Flask?")
]

cursor.executemany(
"INSERT INTO questions(role,question) VALUES(?,?)",
questions
)

conn.commit()
conn.close()

print("Questions Inserted")