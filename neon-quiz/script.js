// Quiz Questions
const questions = [
  {
    question: "What is the capital of France?",
    answers: [
      { text: "Paris", correct: true },
      { text: "London", correct: false },
      { text: "Rome", correct: false },
      { text: "Berlin", correct: false },
    ],
  },
  {
    question: "Which planet is known as the Red Planet?",
    answers: [
      { text: "Venus", correct: false },
      { text: "Jupiter", correct: false },
      { text: "Mars", correct: true },
      { text: "Saturn", correct: false },
    ],
  },
  {
    question: "What is the largest mammal in the world?",
    answers: [
      { text: "African Elephant", correct: false },
      { text: "Blue Whale", correct: true },
      { text: "Giraffe", correct: false },
      { text: "Polar Bear", correct: false },
    ],
  },
  {
    question: "Which element has the chemical symbol 'O'?",
    answers: [
      { text: "Gold", correct: false },
      { text: "Osmium", correct: false },
      { text: "Oxygen", correct: true },
      { text: "Oganesson", correct: false },
    ],
  },
  {
    question: "Who painted the Mona Lisa?",
    answers: [
      { text: "Vincent van Gogh", correct: false },
      { text: "Pablo Picasso", correct: false },
      { text: "Michelangelo", correct: false },
      { text: "Leonardo da Vinci", correct: true },
    ],
  },
]

// DOM Elements
const questionContainer = document.getElementById("question-container")
const resultsContainer = document.getElementById("results-container")
const questionText = document.getElementById("question-text")
const answersContainer = document.getElementById("answers-container")
const submitButton = document.getElementById("submit-btn")
const nextButton = document.getElementById("next-btn")
const restartButton = document.getElementById("restart-btn")
const progressBar = document.getElementById("progress-bar")
const scoreValue = document.getElementById("score-value")
const scoreTotal = document.getElementById("score-total")
const resultsBreakdown = document.getElementById("results-breakdown")

// Quiz State
let currentQuestionIndex = 0
let score = 0
let userAnswers = []
let selectedAnswerIndex = null

// Initialize Quiz
function initQuiz() {
  currentQuestionIndex = 0
  score = 0
  userAnswers = []
  showQuestion(currentQuestionIndex)
  updateProgressBar()
}

// Show Question
function showQuestion(index) {
  resetState()
  const question = questions[index]
  questionText.textContent = question.question

  question.answers.forEach((answer, i) => {
    const button = document.createElement("button")
    button.textContent = answer.text
    button.classList.add("answer-btn")
    button.dataset.index = i
    button.addEventListener("click", selectAnswer)
    answersContainer.appendChild(button)
  })

  submitButton.disabled = true
}

// Reset Question State
function resetState() {
  selectedAnswerIndex = null
  submitButton.disabled = true
  nextButton.classList.add("hidden")
  submitButton.classList.remove("hidden")

  while (answersContainer.firstChild) {
    answersContainer.removeChild(answersContainer.firstChild)
  }
}

// Select Answer
function selectAnswer(e) {
  // Remove selected class from all buttons
  const answerButtons = answersContainer.querySelectorAll(".answer-btn")
  answerButtons.forEach((button) => {
    button.classList.remove("selected")
  })

  // Add selected class to clicked button
  e.target.classList.add("selected")
  selectedAnswerIndex = Number.parseInt(e.target.dataset.index)
  submitButton.disabled = false
}

// Submit Answer
function submitAnswer() {
  if (selectedAnswerIndex === null) return

  const question = questions[currentQuestionIndex]
  const selectedAnswer = question.answers[selectedAnswerIndex]

  // Record user's answer
  userAnswers.push({
    questionIndex: currentQuestionIndex,
    answerIndex: selectedAnswerIndex,
    correct: selectedAnswer.correct,
  })

  // Update score
  if (selectedAnswer.correct) {
    score++
  }

  // Disable all answer buttons
  const answerButtons = answersContainer.querySelectorAll(".answer-btn")
  answerButtons.forEach((button, index) => {
    button.disabled = true

    // Show correct/incorrect styling
    if (index === selectedAnswerIndex) {
      if (question.answers[index].correct) {
        button.classList.add("correct")
      } else {
        button.classList.add("incorrect")
      }
    } else if (question.answers[index].correct) {
      button.classList.add("correct")
    }
  })

  // Show next button or results
  submitButton.classList.add("hidden")

  if (currentQuestionIndex < questions.length - 1) {
    nextButton.classList.remove("hidden")
  } else {
    nextButton.textContent = "Show Results"
    nextButton.classList.remove("hidden")
  }
}

// Next Question
function nextQuestion() {
  currentQuestionIndex++

  if (currentQuestionIndex < questions.length) {
    showQuestion(currentQuestionIndex)
    updateProgressBar()
  } else {
    showResults()
  }
}

// Update Progress Bar
function updateProgressBar() {
  const progressPercentage = (currentQuestionIndex / questions.length) * 100
  progressBar.style.width = `${progressPercentage}%`
}

// Show Results
function showResults() {
  questionContainer.classList.add("hidden")
  resultsContainer.classList.remove("hidden")

  // Update score display
  scoreValue.textContent = score
  scoreTotal.textContent = `/${questions.length}`

  // Generate results breakdown
  resultsBreakdown.innerHTML = ""

  questions.forEach((question, qIndex) => {
    const userAnswer = userAnswers.find((a) => a.questionIndex === qIndex)

    const resultItem = document.createElement("div")
    resultItem.classList.add("result-item")

    // Question
    const questionElement = document.createElement("div")
    questionElement.classList.add("result-question")
    questionElement.textContent = `Q${qIndex + 1}: ${question.question}`
    resultItem.appendChild(questionElement)

    // User's answer
    const userAnswerElement = document.createElement("div")
    userAnswerElement.classList.add("result-answer", "user-answer")

    if (userAnswer) {
      const answerText = question.answers[userAnswer.answerIndex].text
      userAnswerElement.textContent = `Your answer: ${answerText}`

      if (userAnswer.correct) {
        userAnswerElement.classList.add("correct-answer")
      } else {
        userAnswerElement.classList.add("incorrect-answer")

        // Show correct answer if user was wrong
        const correctAnswerElement = document.createElement("div")
        correctAnswerElement.classList.add("result-answer", "correct-answer")
        const correctAnswer = question.answers.find((a) => a.correct)
        correctAnswerElement.textContent = `Correct answer: ${correctAnswer.text}`
        resultItem.appendChild(correctAnswerElement)
      }
    } else {
      userAnswerElement.textContent = "No answer provided"
      userAnswerElement.classList.add("incorrect-answer")

      // Show correct answer
      const correctAnswerElement = document.createElement("div")
      correctAnswerElement.classList.add("result-answer", "correct-answer")
      const correctAnswer = question.answers.find((a) => a.correct)
      correctAnswerElement.textContent = `Correct answer: ${correctAnswer.text}`
      resultItem.appendChild(correctAnswerElement)
    }

    resultItem.appendChild(userAnswerElement)
    resultsBreakdown.appendChild(resultItem)
  })

  // Update progress bar to 100%
  progressBar.style.width = "100%"
}

// Restart Quiz
function restartQuiz() {
  resultsContainer.classList.add("hidden")
  questionContainer.classList.remove("hidden")
  initQuiz()
}

// Event Listeners
submitButton.addEventListener("click", submitAnswer)
nextButton.addEventListener("click", nextQuestion)
restartButton.addEventListener("click", restartQuiz)

// Start Quiz
initQuiz()
