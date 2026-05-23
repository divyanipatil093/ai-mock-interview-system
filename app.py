from flask import Flask, render_template, request
import sqlite3

app = Flask(__name__)


# ---------------- HOME PAGE ----------------
@app.route('/')
def home():
    return render_template('home.html')


# ---------------- START INTERVIEW ----------------
@app.route('/start', methods=['POST'])
def start():

    name = request.form['name']
    role = request.form['role']

    conn = sqlite3.connect('interview.db')
    cursor = conn.cursor()

    # save candidate
    cursor.execute("""
        INSERT INTO candidate(name, role)
        VALUES (?, ?)
    """, (name, role))

    # get first question
    cursor.execute("""
        SELECT question FROM questions
        WHERE role = ?
        LIMIT 1
    """, (role,))

    data = cursor.fetchone()
    conn.close()

    if data:
        question = data[0]
    else:
        question = "No questions available for this role."

    return render_template(
        "interview.html",
        name=name,
        role=role,
        question=question
    )


# ---------------- SUBMIT ANSWER ----------------
@app.route('/submit_answer', methods=['POST'])
def submit_answer():

    answer = request.form['answer']

    return f"Answer received: {answer}"


if __name__ == '__main__':
    app.run(debug=True)