document.getElementById("quiz-form").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission

    const topic = document.getElementById("topic").value.trim();
    const difficulty = document.getElementById("difficulty").value;
    const numQuestions = document.getElementById("numQuestions").value;

    if (!topic) {
        alert("Please enter a valid topic.");
        return;
    }

    sessionStorage.setItem("quizTopic", topic);
    sessionStorage.setItem("quizDifficulty", difficulty);
    sessionStorage.setItem("quizNumQuestions", numQuestions);

    window.location.href = "quiz.html"; // Redirect to quiz page
});
