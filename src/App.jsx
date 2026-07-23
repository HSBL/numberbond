import { useState, useCallback } from 'react'
import './App.css'

function generateQuiz() {
  const questions = []
  for (let i = 0; i < 10; i++) {
    const whole = Math.floor(Math.random() * 7) + 4
    const part1 = Math.floor(Math.random() * (whole - 3)) + 2
    const part2 = whole - part1
    const hideFirst = Math.random() < 0.5
    questions.push({
      whole,
      part1,
      part2,
      hideFirst,
      correctAnswer: hideFirst ? part1 : part2,
    })
  }
  return questions
}

function App() {
  const [questions, setQuestions] = useState(() => generateQuiz())
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [missingInputs, setMissingInputs] = useState(false)

  const handleNewQuiz = useCallback(() => {
    setQuestions(generateQuiz())
    setAnswers({})
    setSubmitted(false)
    setMissingInputs(false)
  }, [])

  const handleAnswerChange = (index, value) => {
    setAnswers((prev) => ({ ...prev, [index]: value }))
    setMissingInputs(false)
  }

  const handleCheck = () => {
    const allFilled = questions.every((_, i) => answers[i]?.trim() !== '')
    if (!allFilled) {
      setMissingInputs(true)
      return
    }
    setSubmitted(true)
  }

  const score = submitted
    ? questions.filter((q, i) => parseInt(answers[i]) === q.correctAnswer).length
    : 0

  return (
    <>
      <h1>Number Bond Practice</h1>
      <p className="subtitle">
        Fill in the missing numbers, then click &quot;Check Answers&quot; at the bottom!
      </p>

      <div className="quiz-grid">
        {questions.map((q, i) => {
          const isCorrect = submitted && parseInt(answers[i]) === q.correctAnswer
          const isWrong = submitted && parseInt(answers[i]) !== q.correctAnswer
          const showInputError = missingInputs && !answers[i]?.trim()

          const leftPart = q.hideFirst ? null : q.part1
          const rightPart = q.hideFirst ? q.part2 : null

          return (
            <div
              key={i}
              className={`bond-card ${isCorrect ? 'correct-card' : ''} ${isWrong ? 'wrong-card' : ''}`}
            >
              <div className="question-number">#{i + 1}</div>
              <div className="whole">{q.whole}</div>
              <div className="connector">
                <div className="line line-left"></div>
                <div className="line line-right"></div>
              </div>
              <div className="parts-row">
                <div className="part">
                  {leftPart !== null ? (
                    leftPart
                  ) : (
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={answers[i] || ''}
                      onChange={(e) => handleAnswerChange(i, e.target.value)}
                      disabled={submitted}
                      className={showInputError ? 'input-error' : ''}
                    />
                  )}
                </div>
                <div className="part">
                  {rightPart !== null ? (
                    rightPart
                  ) : (
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={answers[i] || ''}
                      onChange={(e) => handleAnswerChange(i, e.target.value)}
                      disabled={submitted}
                      className={showInputError ? 'input-error' : ''}
                    />
                  )}
                </div>
              </div>
              {isWrong && (
                <div className="correct-answer">
                  Answer: {q.correctAnswer}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {submitted && (
        <div
          className="result-banner"
          style={{
            color: score === 10 ? '#2ecc71' : score >= 7 ? '#3498db' : '#e74c3c',
          }}
        >
          {score === 10
            ? `Perfect Score! 🌟 10/10 🎉`
            : score >= 7
              ? `Great Effort! 👍 Score: ${score}/10`
              : `Keep Practicing! 💪 Score: ${score}/10`}
        </div>
      )}

      {missingInputs && (
        <div className="result-banner" style={{ color: '#f1c40f' }}>
          Please answer all 10 questions first! ⚠️
        </div>
      )}

      <div className="btn-container">
        {!submitted ? (
          <button id="submit-btn" onClick={handleCheck}>
            Check Answers
          </button>
        ) : (
          <button id="refresh-btn" onClick={handleNewQuiz}>
            New Page
          </button>
        )}
      </div>
    </>
  )
}

export default App
