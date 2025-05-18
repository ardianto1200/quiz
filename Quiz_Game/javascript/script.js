const configContainer = document.querySelector(".config-container");
const quizContainer = document.querySelector(".quiz-container");
const answerOptions = document.querySelector(".answer-options");
const nextQuestionBtn = document.querySelector(".next-question-btn");
const questionStatus = document.querySelector(".question-status");
const timerDisplay = document.querySelector(".time-duration");
const resultContainer = document.querySelector(".result-container");

const QUIZ_TIME_LIMIT = 10;
let currentTime = QUIZ_TIME_LIMIT;
let timer = null;
let quizCategory = "matematika";
let currenQuestion = null;
let numberOfQuestion = 3;
const questionIndexHistory = [];
let correcAnswerCount = 0;

// Display the quiz result and hide the quiz container
const showQuizResult = () => {
  quizContainer.style.display = "none";
  resultContainer.style.display = "block";

  const resultText = `Jawaban Kamu <b>${correcAnswerCount}</b> dari <b>${numberOfQuestion}</b> Jawaban Benar. Luar bisa!`;

  document.querySelector(".result-message").innerHTML = resultText;
};

// Clear and reset the timer
const resetTimer = () => {
  clearInterval(timer);
  currentTime = QUIZ_TIME_LIMIT;
  timerDisplay.textContent = `${currentTime}s`;
};

// Initialize and start timer for the current question
const startTimer = () => {
  timer = setInterval(() => {
    currentTime--;
    timerDisplay.textContent = `${currentTime}s`;
    if (currentTime <= 0) {
      clearInterval(timer);
      highlightCorrectAnswer();
      nextQuestionBtn.style.visibility = "visible";
      quizContainer.querySelector(".quiz-timer").style.background = "#c31402";

      // Disabled all answer
      answerOptions
        .querySelectorAll(".answer-option")
        .forEach((option) => (option.style.pointerEvents = "none"));
    }
  }, 1000);
};

// Fetch a random question from based on teh selected category
const getRandomQuestion = () => {
  const categoryQuestions =
    questions.find(
      (cat) => cat.category.toLowerCase() === quizCategory.toLowerCase()
    ).questions || [];

  // show the result if all question have been used
  if (
    questionIndexHistory.length >=
    Math.min(categoryQuestions.length, numberOfQuestion)
  ) {
    return showQuizResult();
  }

  const availableQuestion = categoryQuestions.filter(
    (_, index) => !questionIndexHistory.includes(index)
  );

  //   Filter out already asked question and choose a random one
  const randomQuestion =
    availableQuestion[Math.floor(Math.random() * categoryQuestions.length)];

  questionIndexHistory.push(categoryQuestions.indexOf(randomQuestion));
  return randomQuestion;
};

// Highlight the correct answer
const highlightCorrectAnswer = () => {
  const correctOption =
    answerOptions.querySelectorAll(".answer-option")[
      currenQuestion.correctAnswer
    ];
  correctOption.classList.add("correct");
  const iconHTML = `<span class="material-symbols-rounded"> check_circle</span>`;
  correctOption.insertAdjacentHTML("beforeend", iconHTML);
};

// Handle the user answer selection
const handleAnswer = (option, answerIndex) => {
  clearInterval(timer);
  const isCorrect = currenQuestion.correctAnswer === answerIndex;
  option.classList.add(isCorrect ? "correct" : "incorrect");
  !isCorrect ? highlightCorrectAnswer() : correcAnswerCount++;

  // Insert icon based on correction
  const iconHTML = `<span class="material-symbols-rounded">${
    isCorrect ? "check_circle" : "cancel"
  }</span>`;
  option.insertAdjacentHTML("beforeend", iconHTML);

  //   Disable all answer options after one option is selected
  answerOptions
    .querySelectorAll(".answer-option")
    .forEach((option) => (option.style.pointerEvents = "none"));

  nextQuestionBtn.style.visibility = "visible";
};

// Render the current question and its option in the quiz
const renderQuestion = () => {
  currenQuestion = getRandomQuestion();
  if (!currenQuestion) return;

  resetTimer();
  startTimer();

  // Update the UI
  answerOptions.innerHTML = "";
  nextQuestionBtn.style.visibility = "hidden";
  quizContainer.querySelector(".quiz-timer").style.background = "#000";
  document.querySelector(".question-text").textContent =
    currenQuestion.question;

  questionStatus.innerHTML = `<b>${questionIndexHistory.length}</b> of <b>${numberOfQuestion}</b> Questions`;

  // Create option <li> elements, append them and add click event listener
  currenQuestion.options.forEach((option, index) => {
    const li = document.createElement("li");
    li.classList.add("answer-option");
    li.textContent = option;
    answerOptions.appendChild(li);
    li.addEventListener("click", () => handleAnswer(li, index));
  });
};

//Start the quiz and return to the configuration container
const startQuiz = () => {
  configContainer.style.display = "none";
  quizContainer.style.display = "block";

  // update the quiz category and number of questions
  quizCategory = configContainer.querySelector(
    ".category-option.active"
  ).textContent;

  numberOfQuestion = parseInt(
    configContainer.querySelector(".question-option.active").textContent
  );

  renderQuestion();
};
// Highlight the selected option on click - catogory or no. of question
document
  .querySelectorAll(".category-option, .question-option")
  .forEach((option) => {
    option.addEventListener("click", () => {
      option.parentNode.querySelector(".active").classList.remove("active");
      option.classList.add("active");
    });
  });

// Reset the Quiz and return to the configuration container
const resetQuiz = () => {
  resetTimer();
  correcAnswerCount = 0;
  questionIndexHistory.length = 0;
  configContainer.style.display = "block";
  resultContainer.style.display = "none";
};

nextQuestionBtn.addEventListener("click", renderQuestion);
document.querySelector(".try-again-btn").addEventListener("click", resetQuiz);
document.querySelector(".start-quiz-btn").addEventListener("click", startQuiz);
