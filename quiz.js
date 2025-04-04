document.addEventListener("DOMContentLoaded", () => {      // Triggers the callback function once the DOM (Document Object Model) or (page) is loaded
    if (window.location.pathname.includes("quiz.html")) {
        startQuiz();
    }
});

async function startQuiz() {
    const topic = sessionStorage.getItem("quizTopic");
    const difficulty = sessionStorage.getItem("quizDifficulty");
    const numQuestions = sessionStorage.getItem("quizNumQuestions");

    if (!topic || !difficulty || !numQuestions) {
        alert("Quiz data missing. Returning to home page.");
        window.location.href = "index.html";
        return;
    }

    questions = await fetchQuiz(topic, difficulty, numQuestions);  //stores as an array               if it bypass the fecht qizz the questions may be empty
    if (questions.length > 0) {  //Checks if the questions array contains at least one question.
        currentQuestionIndex = 0; //question number
        score = 0;                
        displayQuestion();           //function which displays question
    }
}

async function fetchQuiz(topic, difficulty, numQuestions) {
    try {
        console.log("Fetching quiz:", { topic, difficulty, numQuestions });

        const response = await fetch("http://localhost:3000/generate-quiz", {
            method: "POST",
            headers: { "Content-Type": "application/json" },  // brothers this tells the server that "The data I’m sending is in JSON format." it reads the header, Since it's "application/json", the server knows to parse the body as JSON.
            body: JSON.stringify({ topic, difficulty, numQuestions }), //we need to convert it into a format the server can understand.
        });

        const data = await response.json();
        console.log("Quiz data received:", data); //if it is not json not actual quiz data (meta data)

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



function displayQuestion() {
    const questionEl = document.getElementById("question");
    const answersEl = document.getElementById("answers");
    const nextBtn = document.getElementById("next-btn");

    nextBtn.classList.add("hidden");   // hides the button until prompteds
    answersEl.innerHTML = "";   //Ensures that old answer buttons do not persist when displaying a new question.

    if (currentQuestionIndex < questions.length) {
        const q = questions[currentQuestionIndex]; // q stores the current questions options and answer
        questionEl.textContent = `${currentQuestionIndex + 1}. ${q.question}`; //dynamic syntax for displaying questions 

        q.options.forEach((option) => {
            const button = document.createElement("button"); // add a button element
            button.classList.add("option-btn");      //add a css class option-button
            button.textContent = option;             //display option
            button.onclick = () => checkAnswer(button, option, q.answer);
            answersEl.appendChild(button); // adds each answer button dynamically to the answer container
        });

        nextBtn.textContent = (currentQuestionIndex === questions.length - 1) ? "Finish Quiz" : "Next Question"; // sets the content of next btn
    } else {
        showScore();
    }
}

function checkAnswer(button, selected, correct) {
    const buttons = document.querySelectorAll(".option-btn");  //selects all the answer btns
    buttons.forEach((btn) => btn.disabled = true);             //after user disable selection

    if (selected === correct) {
        button.classList.add("correct"); //adds css class
        score++;
    } else {
        button.classList.add("incorrect");
        
        buttons.forEach((btn) => {
            if (btn.textContent === correct) {
                btn.classList.add("correct");  //shows the correct
            }
        });
    }

    document.getElementById("next-btn").classList.remove("hidden");  //reveals the next btn
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
    document.getElementById("final-score").textContent = `${score} / ${questions.length}`; //display score
}

document.getElementById("home-btn").addEventListener("click", () => {
    window.location.href = "index.html";
});
