-- Seeds for the tests table. Each test contains one or more questions as a JSONB array.

INSERT INTO tests (subject, topic, description, difficulty, grade, questions)
VALUES 
(
    'Mathematics',
    'Stereometry',
    'Questions about three-dimensional figures',
    'easy',
    '9',
    '[
        {
            "question": "What is the surface area of a cube with side 4 cm?",
            "options": { "A": "96 cm^2", "B": "48 cm^2", "C": "16 cm^2", "D": "64 cm^2" },
            "correct_answer": "D"
        },
        {
            "question": "How many faces does a rectangular parallelepiped have?",
            "options": { "A": "6", "B": "8", "C": "12", "D": "4" },
            "correct_answer": "A"
        }
    ]'
),
(
    'Biology',
    'Cell Structure',
    'Basic cell structure questions',
    'medium',
    '10',
    '[
        {
            "question": "Which organelle is known as the powerhouse of the cell?",
            "options": { "A": "Nucleus", "B": "Mitochondria", "C": "Ribosome", "D": "Chloroplast" },
            "correct_answer": "B"
        }
    ]'
),
(
    'History',
    'Ancient Egypt',
    'General questions about Ancient Egypt',
    'easy',
    '7',
    '[
        {
            "question": "Who was the first female pharaoh of Egypt?",
            "options": { "A": "Nefertiti", "B": "Cleopatra", "C": "Hatshepsut", "D": "Meritaten" },
            "correct_answer": "C"
        }
    ]'
);
