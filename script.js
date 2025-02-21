
// document.addEventListener("DOMContentLoaded", () => {
//     const form = document.getElementById("quiz-form");

//     if (form) {
//         form.addEventListener("submit", (event) => {
//             event.preventDefault();

//             const topic = document.getElementById("topic").value;
//             const difficulty = document.getElementById("difficulty").value;
//             const numQuestions = document.getElementById("numQuestions").value;

//             // Store quiz settings in session storage
//             sessionStorage.setItem("quizTopic", topic);
//             sessionStorage.setItem("quizDifficulty", difficulty);
//             sessionStorage.setItem("quizNumQuestions", numQuestions);

//             // Redirect to the quiz page
//             window.location.href = "quiz.html";
//         });
//     }

//     if (window.location.pathname.includes("quiz.html")) {
//         startQuiz();
//     }
// });

// let currentScore = 0;
// let currentQuestionIndex = 0;
// let questions = [];

// // Fetch Quiz Questions from Backend
// async function fetchQuiz(topic, difficulty, numQuestions) {
//     try {
//         const response = await fetch("http://localhost:3000/generate-quiz", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ topic, difficulty, numQuestions }),
//         });

//         const data = await response.json();
//         return data.questions || [];
//     } catch (error) {
//         console.error("Error fetching quiz:", error);
//         alert("Failed to fetch quiz questions.");
//         return [];
//     }
// }

// // Start Quiz
// async function startQuiz() {
//     const topic = sessionStorage.getItem("quizTopic");
//     const difficulty = sessionStorage.getItem("quizDifficulty");
//     const numQuestions = sessionStorage.getItem("quizNumQuestions");

//     if (!topic || !difficulty || !numQuestions) {
//         alert("Quiz data missing. Returning to home page.");
//         window.location.href = "index.html";
//         return;
//     }

//     questions = await fetchQuiz(topic, difficulty, numQuestions);
//     if (questions.length > 0) {
//         currentScore = 0;
//         currentQuestionIndex = 0;
//         displayQuestion();
//     }
// }

// // Display Question
// function displayQuestion() {
//     const questionEl = document.getElementById("question");
//     const answersEl = document.getElementById("answers");
//     const nextBtn = document.getElementById("next-btn");

//     nextBtn.classList.add("hidden");
//     answersEl.innerHTML = "";

//     if (currentQuestionIndex < questions.length) {
//         const q = questions[currentQuestionIndex];
//         questionEl.textContent = `${currentQuestionIndex + 1}. ${q.question}`;

//         q.options.forEach((option) => {
//             const button = document.createElement("button");
//             button.classList.add("option-btn");
//             button.textContent = option;
//             button.onclick = () => checkAnswer(button, option, q.answer);
//             answersEl.appendChild(button);
//         });
//     } else {
//         showScore();
//     }
// }

// // Check Answer
// function checkAnswer(button, selected, correct) {
//     const buttons = document.querySelectorAll(".option-btn");
//     buttons.forEach((btn) => (btn.disabled = true));

//     if (selected === correct) {
//         button.classList.add("correct");
//         currentScore++;
//     } else {
//         button.classList.add("incorrect");
//     }

//     document.getElementById("next-btn").classList.remove("hidden");
// }

// // Next Question
// document.getElementById("next-btn").addEventListener("click", () => {
//     currentQuestionIndex++;
//     displayQuestion();
// });

// // Show Score
// function showScore() {
//     document.getElementById("quiz-container").classList.add("hidden");
//     document.getElementById("score-container").classList.remove("hidden");
//     document.getElementById("final-score").textContent = `${currentScore} / ${questions.length}`;
// }

// // Restart Quiz
// document.getElementById("home-btn").addEventListener("click", () => {
//     sessionStorage.clear();
//     window.location.href = "index.html";
// });
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("quiz-form");

    if (form) {
        form.addEventListener("submit", (event) => {
            event.preventDefault();

            const topic = document.getElementById("topic").value;
            const difficulty = document.getElementById("difficulty").value;
            const numQuestions = document.getElementById("numQuestions").value;

            sessionStorage.setItem("quizTopic", topic);
            sessionStorage.setItem("quizDifficulty", difficulty);
            sessionStorage.setItem("quizNumQuestions", numQuestions);

            window.location.href = "quiz.html";
        });
    }

    if (window.location.pathname.includes("quiz.html")) {
        startQuiz();
    }
});

async function fetchQuiz(topic, difficulty, numQuestions) {
    try {
        const response = await fetch("http://localhost:3000/generate-quiz", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ topic, difficulty, numQuestions }),
        });

        const data = await response.json();
        return data.questions || [];
    } catch (error) {
        console.error("❌ Error fetching quiz:", error);
        alert("Failed to fetch quiz questions.");
        return [];
    }
}

let currentQuestionIndex = 0;
let questions = [];

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
    } else {
        showScore();
    }
}

function checkAnswer(button, selected, correct) {
    const buttons = document.querySelectorAll(".option-btn");
    buttons.forEach((btn) => (btn.disabled = true));

    if (selected === correct) {
        button.classList.add("correct");
    } else {
        button.classList.add("incorrect");
    }

    document.getElementById("next-btn").classList.remove("hidden");
}

document.getElementById("next-btn").addEventListener("click", () => {
    currentQuestionIndex++;
    displayQuestion();
});

function showScore() {
    document.getElementById("quiz-container").classList.add("hidden");
    document.getElementById("score-container").classList.remove("hidden");
}
