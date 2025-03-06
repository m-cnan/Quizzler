document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname.includes("quiz.html")) {
        startQuiz();
    }
});

async function fetchQuiz(topic, difficulty, numQuestions) {
    try {
        console.log("Fetching quiz:", { topic, difficulty, numQuestions });

        const response = await fetch("http://localhost:3000/generate-quiz", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ topic, difficulty, numQuestions }),
        });

        const data = await response.json();
        console.log("Quiz data received:", data);

        return data.questions || [];
    } catch (error) {
        console.error("❌ Error fetching quiz:", error);
        alert("Failed to fetch quiz questions.");
        return [];
    }
}

let currentQuestionIndex = 0;
let questions = [];
let score = 0;

async function startQuiz() {
    const topic = sessionStorage.getItem("quizTopic");
    const difficulty = sessionStorage.getItem("quizDifficulty");
    const numQuestions = sessionStorage.getItem("quizNumQuestions");

    if (!topic || !difficulty || !numQuestions) {
        alert("Quiz data missing. Returning to home page.");
        window.location.href = "index.html";
        return;
    }

    questions = await fetchQuiz(topic, difficulty, numQuestions);
    if (questions.length > 0) {
        currentQuestionIndex = 0;
        score = 0;
        displayQuestion();
    }
}

function displayQuestion() {
    const questionEl = document.getElementById("question");
    const answersEl = document.getElementById("answers");
    const nextBtn = document.getElementById("next-btn");

    nextBtn.classList.add("hidden");
    answersEl.innerHTML = "";

    if (currentQuestionIndex < questions.length) {
        const q = questions[currentQuestionIndex];
        questionEl.textContent = `${currentQuestionIndex + 1}. ${q.question}`;

        q.options.forEach((option) => {
            const button = document.createElement("button");
            button.classList.add("option-btn");
            button.textContent = option;
            button.onclick = () => checkAnswer(button, option, q.answer);
            answersEl.appendChild(button);
        });

        nextBtn.textContent = (currentQuestionIndex === questions.length - 1) ? "Finish Quiz" : "Next Question";
    } else {
        showScore();
    }
}

function checkAnswer(button, selected, correct) {
    const buttons = document.querySelectorAll(".option-btn");
    buttons.forEach((btn) => btn.disabled = true);

    if (selected === correct) {
        button.classList.add("correct");
        score++;
    } else {
        button.classList.add("incorrect");
        buttons.forEach((btn) => {
            if (btn.textContent === correct) {
                btn.classList.add("correct");
            }
        });
    }

    document.getElementById("next-btn").classList.remove("hidden");
}

document.getElementById("next-btn").addEventListener("click", () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        displayQuestion();
    } else {
        showScore();
    }
});

function showScore() {
    document.getElementById("quiz-container").classList.add("hidden");
    document.getElementById("score-container").classList.remove("hidden");
    document.getElementById("final-score").textContent = `${score} / ${questions.length}`;
}

document.getElementById("home-btn").addEventListener("click", () => {
    window.location.href = "index.html";
});
