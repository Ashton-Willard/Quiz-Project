let Question = [];
const quest = document.getElementById('quest');
const opt = document.getElementById('opt');
const btn = document.getElementById('btn'); 

async function fetchQuestion() {
    try {
        const response = await fetch('https://opentdb.com/api.php?amount=10&category=21&difficulty=medium&type=multiple');
        if (!response.ok) {
            throw new Error('Error, Unable to receive data');
        }
        const data = await response.json();
        Question = data.results;
        loadQuestion();
    } catch (error) {
        console.log(error);
        quest.innerHTML = `<h5 style='color:red'>${error}</h5>`;
    }
}

fetchQuestion();

let currentquest = 0;
let score = 0;

function loadQuestion() {
    if (Question.length === 0) {
        quest.innerHTML = `<h5>Questions are loading...</h5>`;
        return;
    }

    let currentQuestion = Question[currentquest].question;

    if (currentQuestion.indexOf('&quot;') > -1) {
        currentQuestion = currentQuestion.replace(/&quot;/g, '\"');
    }
    if (currentQuestion.indexOf("'") > -1) {
        currentQuestion = currentQuestion.replace(/'/g, '\'');
    }

    quest.innerText = currentQuestion;
    opt.innerHTML = ""; 

    const correctAnswer = Question[currentquest].correct_answer;
    const incorrect = Question[currentquest].incorrect_answers;

    const options = [correctAnswer, ...incorrect];
    options.sort(() => Math.random() - 0.5); 


    options.forEach(option => {
        const choicesDiv = document.createElement("div");
        const choice = document.createElement("input");
        const choiceLabel = document.createElement("label");

        choice.type = "radio";
        choice.name = "answer";
        choice.value = option;
        choiceLabel.textContent = option;

        choicesDiv.appendChild(choice);
        choicesDiv.appendChild(choiceLabel);
        opt.appendChild(choicesDiv);
    });

    btn.textContent = "Submit";
    btn.onclick = checkAns;
}

function loadScore() {
    const totalScore = document.getElementById("score");
    totalScore.textContent = `You scored ${score} out of ${Question.length}`;
    totalScore.innerHTML += "<h3>All Answers</h3>";

    Question.forEach((el, index) => {
        totalScore.innerHTML += `<p>${index + 1}. ${el.correct_answer}</p>`;
    });
}

function nextQuestion() {
    if (currentquest < Question.length - 1) {
        currentquest++;
        loadQuestion();
    } else {
        document.getElementById("opt").remove();
        document.getElementById("quest").remove();
        btn.remove();
        loadScore();
    }
}

function checkAns() {
    const selectedAns = document.querySelector('input[name="answer"]:checked')?.value;

    if (!selectedAns) {
        alert('Please pick an answer!');
        return; 
    }
    if (selectedAns === Question[currentquest].correct_answer) {
        score++;
    }

    btn.textContent = "Next";

    btn.onclick = function () {
        nextQuestion();
    };
}
