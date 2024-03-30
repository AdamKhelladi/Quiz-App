// Select Element

let countSpan = document.querySelector(".quiz-info .count span");
let bullets = document.querySelector(".bullets");
let bulletsSpans = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let resultContainer = document.querySelector("#results");
let countdownElement = document.querySelector(".countdown");

let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval = 0;

function getQuestions() {
  let myRequest = new XMLHttpRequest();
  myRequest.open("GET", "htmlQuestions.json", true);
  myRequest.send();

  myRequest.onreadystatechange = () => {
    if (myRequest.readyState === 4 && myRequest.status === 200) {
      let data = JSON.parse(myRequest.responseText);
      // console.log(data[0].title);
      let questionCount = data.length;
      createBullets(questionCount);

      addData(data[currentIndex], questionCount);

      countdown(3, questionCount);

      submitButton.addEventListener("click", () => {
        let rightAnswer = data[currentIndex].right_answer;

        currentIndex++;
        checkAnswer(rightAnswer, questionCount);

        quizArea.innerHTML = "";
        answersArea.innerHTML = "";

        addData(data[currentIndex], questionCount);

        handelBullets();

        clearInterval(countdownInterval);
        countdown(3, questionCount);

        showResults(questionCount);
      });
    }
  };
}
getQuestions();

function createBullets(num) {
  countSpan.innerHTML = num;

  for (let i = 0; i < num; i++) {
    let theBullet = document.createElement("span");

    if (i === 0) {
      theBullet.className = "on";
    }

    bulletsSpans.appendChild(theBullet);
  }
}

function addData(obj, count) {
  if (currentIndex < count) {
    let questionTitle = document.createElement("h2");
    let questionText = document.createTextNode(obj.title);
    questionTitle.appendChild(questionText);

    quizArea.appendChild(questionTitle);

    for (let i = 1; i <= 4; i++) {
      let answer = document.createElement("div");
      answer.className = "answer";

      let radioInput = document.createElement("input");
      radioInput.type = "Radio";
      radioInput.name = "question";
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = obj[`answer_${i}`];

      if (i === 1) {
        radioInput.checked = true;
      }

      let label = document.createElement("label");
      label.htmlFor = `answer_${i}`;

      let labelText = document.createTextNode(obj[`answer_${i}`]);
      label.appendChild(labelText);

      answer.appendChild(radioInput);
      answer.appendChild(label);

      answersArea.append(answer);
    }
  }
}

function checkAnswer(rAnswer, count) {
  let answers = document.getElementsByName("question");
  let theChoosenAnswer;

  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChoosenAnswer = answers[i].dataset.answer;
    }
  }

  if (rAnswer === theChoosenAnswer) {
    rightAnswers++;
  }
}

function handelBullets() {
  let bulletsSpans = document.querySelectorAll(".bullets .spans span");
  let spansArray = Array.from(bulletsSpans);

  spansArray.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "on";
    }
  });
}

function showResults(count) {
  let theResults;
  if (currentIndex === count) {
    quizArea.remove();
    answersArea.remove();
    submitButton.remove();
    bullets.remove();

    resultContainer.classList.add("results");

    if (rightAnswers > count / 2 && rightAnswers < count) {
      theResults = `<span class="good">Good,</span> ${rightAnswers} From ${count} is Right.`;
    } else if (rightAnswers === count) {
      theResults = `<span class="perfect">Perfect,</span> All Answers Is Good`;
    } else {
      theResults = `<span class="bad">Bad,</span> ${rightAnswers} From ${count} is Right.`;
    }

    resultContainer.innerHTML = theResults;
  }
}

function countdown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countdownInterval = setInterval(() => {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countdownElement.innerHTML = `${minutes}:${seconds}`;

      if (--duration < 0) {
        clearInterval(countdownInterval);
        submitButton.click();
      }
    }, 1000);
  }
}
