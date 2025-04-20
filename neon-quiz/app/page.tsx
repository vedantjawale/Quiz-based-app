"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Quiz data
const quizData = [
  {
    id: 1,
    question: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Rome"],
    correctAnswer: "Paris",
  },
  {
    id: 2,
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: "Mars",
  },
  {
    id: 3,
    question: "What is the largest mammal in the world?",
    options: ["Elephant", "Blue Whale", "Giraffe", "Polar Bear"],
    correctAnswer: "Blue Whale",
  },
  {
    id: 4,
    question: "Which element has the chemical symbol 'O'?",
    options: ["Gold", "Oxygen", "Silver", "Iron"],
    correctAnswer: "Oxygen",
  },
  {
    id: 5,
    question: "Who painted the Mona Lisa?",
    options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
    correctAnswer: "Leonardo da Vinci",
  },
]

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [userAnswers, setUserAnswers] = useState<string[]>([])
  const [answerSubmitted, setAnswerSubmitted] = useState(false)

  const handleAnswerClick = (answer: string) => {
    if (!answerSubmitted) {
      setSelectedAnswer(answer)
    }
  }

  const handleNextClick = () => {
    // Save the user's answer
    const newUserAnswers = [...userAnswers]
    newUserAnswers[currentQuestion] = selectedAnswer || ""
    setUserAnswers(newUserAnswers)

    // Reset for next question
    setAnswerSubmitted(false)
    setSelectedAnswer(null)

    // Move to next question or show results
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowResult(true)
    }
  }

  const handleSubmitAnswer = () => {
    setAnswerSubmitted(true)
  }

  const restartQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setUserAnswers([])
    setAnswerSubmitted(false)
  }

  const calculateScore = () => {
    let score = 0
    quizData.forEach((question, index) => {
      if (userAnswers[index] === question.correctAnswer) {
        score++
      }
    })
    return score
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Interactive Quiz</h1>

        {!showResult ? (
          <Card className="p-6 shadow-lg">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-gray-500">
                  Question {currentQuestion + 1} of {quizData.length}
                </span>
                <span className="text-sm font-medium text-gray-500">
                  Score: {calculateScore()} / {quizData.length}
                </span>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">{quizData[currentQuestion].question}</h2>
            </div>

            <div className="space-y-3 mb-6">
              {quizData[currentQuestion].options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left h-auto py-3 px-4",
                    selectedAnswer === option && !answerSubmitted && "border-blue-500 bg-blue-50",
                    answerSubmitted &&
                      option === quizData[currentQuestion].correctAnswer &&
                      "border-green-500 bg-green-50 text-green-700",
                    answerSubmitted &&
                      selectedAnswer === option &&
                      option !== quizData[currentQuestion].correctAnswer &&
                      "border-red-500 bg-red-50 text-red-700",
                  )}
                  onClick={() => handleAnswerClick(option)}
                  disabled={answerSubmitted}
                >
                  {option}
                </Button>
              ))}
            </div>

            <div className="flex justify-between">
              {!answerSubmitted ? (
                <Button onClick={handleSubmitAnswer} disabled={!selectedAnswer} className="w-full">
                  Submit Answer
                </Button>
              ) : (
                <Button onClick={handleNextClick} className="w-full">
                  {currentQuestion < quizData.length - 1 ? "Next Question" : "Show Results"}
                </Button>
              )}
            </div>
          </Card>
        ) : (
          <Card className="p-6 shadow-lg">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Quiz Results</h2>
              <p className="text-center text-lg font-medium">
                Your score: {calculateScore()} out of {quizData.length}
              </p>
            </div>

            <div className="space-y-6 mb-6">
              {quizData.map((question, qIndex) => (
                <div key={qIndex} className="border rounded-lg p-4">
                  <h3 className="font-medium text-gray-800 mb-2">
                    {qIndex + 1}. {question.question}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-600 mr-2">Your answer:</span>
                      <span
                        className={cn(
                          "px-2 py-1 rounded text-sm",
                          userAnswers[qIndex] === question.correctAnswer
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800",
                        )}
                      >
                        {userAnswers[qIndex] || "No answer"}
                      </span>
                    </div>
                    {userAnswers[qIndex] !== question.correctAnswer && (
                      <div className="flex items-center">
                        <span className="font-medium text-gray-600 mr-2">Correct answer:</span>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                          {question.correctAnswer}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <Button onClick={restartQuiz} className="w-full">
              Restart Quiz
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}
