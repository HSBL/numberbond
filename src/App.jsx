import { useState, useCallback, useEffect } from 'react'
import confetti from 'canvas-confetti'
import './index.css'

const LEVEL_CONFIG = {
  1: { min: 4, max: 10, label: 'Level 1', range: '4 – 10', emoji: '🌟', color: 'from-candy-blue to-candy-teal' },
  2: { min: 11, max: 15, label: 'Level 2', range: '11 – 15', emoji: '🚀', color: 'from-candy-purple to-candy-pink' },
  3: { min: 5, max: 20, label: 'Level 3', range: '5 – 20', emoji: '🦄', color: 'from-candy-orange to-candy-yellow' },
}

const WHOLE_COLORS = [
  'bg-candy-pink',
  'bg-candy-purple',
  'bg-candy-blue',
  'bg-candy-teal',
  'bg-candy-green',
  'bg-candy-orange',
  'bg-candy-red',
]

function generateQuiz(level) {
  const { min, max } = LEVEL_CONFIG[level]
  const questions = []
  for (let i = 0; i < 10; i++) {
    const whole = Math.floor(Math.random() * (max - min + 1)) + min
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

function NumberBond({ q, index, answer, onChange, submitted, showInputError, wholeColor }) {
  const isCorrect = submitted && parseInt(answer) === q.correctAnswer
  const isWrong = submitted && parseInt(answer) !== q.correctAnswer

  const leftPart = q.hideFirst ? null : q.part1
  const rightPart = q.hideFirst ? q.part2 : null

  return (
    <div
      className={`relative flex flex-col items-center rounded-3xl p-5 pt-7 transition-all duration-300 ${
        isCorrect
          ? 'bg-green-50 border-3 border-green-400 shadow-lg shadow-green-200 scale-105'
          : isWrong
            ? 'bg-red-50 border-3 border-red-400 shadow-lg shadow-red-200'
            : 'bg-white border-2 border-gray-100 shadow-md hover:shadow-xl hover:-translate-y-1'
      }`}
    >
      <span className="absolute top-2 left-3 text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
        #{index + 1}
      </span>

      {isCorrect && (
        <span className="absolute -top-3 -right-2 text-2xl animate-bounce">✅</span>
      )}
      {isWrong && (
        <span className="absolute -top-3 -right-2 text-2xl">❌</span>
      )}

      <div
        className={`w-[70px] h-[70px] rounded-full ${wholeColor} text-white text-2xl font-extrabold flex items-center justify-center shadow-lg mb-1`}
      >
        {q.whole}
      </div>

      <div className="relative w-[80%] h-[45px] my-[-8px]">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 45" preserveAspectRatio="none">
          <line x1="50" y1="0" x2="15" y2="45" stroke="#C7D2FE" strokeWidth="3" strokeLinecap="round" />
          <line x1="50" y1="0" x2="85" y2="45" stroke="#C7D2FE" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>

      <div className="flex justify-between w-[80%]">
        <div className="w-[60px] h-[60px] rounded-full bg-candy-blue text-white text-xl font-bold flex items-center justify-center shadow-md">
          {leftPart !== null ? leftPart : (
            <input
              type="number"
              min="0"
              max="20"
              value={answer || ''}
              onChange={(e) => onChange(e.target.value)}
              disabled={submitted}
              className={`w-[42px] h-[42px] rounded-full text-center text-lg font-bold border-0 outline-none
                -webkit-appearance-none -moz-appearance-none appearance-none
                ${submitted
                  ? isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  : 'bg-white text-soft-text focus:ring-3 focus:ring-candy-purple'
                }
                ${showInputError ? 'ring-3 ring-candy-yellow bg-yellow-50' : ''}
              `}
            />
          )}
        </div>
        <div className="w-[60px] h-[60px] rounded-full bg-candy-blue text-white text-xl font-bold flex items-center justify-center shadow-md">
          {rightPart !== null ? rightPart : (
            <input
              type="number"
              min="0"
              max="20"
              value={answer || ''}
              onChange={(e) => onChange(e.target.value)}
              disabled={submitted}
              className={`w-[42px] h-[42px] rounded-full text-center text-lg font-bold border-0 outline-none
                -webkit-appearance-none -moz-appearance-none appearance-none
                ${submitted
                  ? isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  : 'bg-white text-soft-text focus:ring-3 focus:ring-candy-purple'
                }
                ${showInputError ? 'ring-3 ring-candy-yellow bg-yellow-50' : ''}
              `}
            />
          )}
        </div>
      </div>

      {isWrong && (
        <div className="mt-2 text-xs font-bold text-candy-red">
          Answer: {q.correctAnswer}
        </div>
      )}
    </div>
  )
}

function App() {
  const [level, setLevel] = useState(1)
  const [questions, setQuestions] = useState(() => generateQuiz(1))
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [missingInputs, setMissingInputs] = useState(false)

  const handleLevelChange = (newLevel) => {
    setLevel(newLevel)
    setQuestions(generateQuiz(newLevel))
    setAnswers({})
    setSubmitted(false)
    setMissingInputs(false)
  }

  const handleNewQuiz = useCallback(() => {
    setQuestions(generateQuiz(level))
    setAnswers({})
    setSubmitted(false)
    setMissingInputs(false)
  }, [level])

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

  useEffect(() => {
    if (submitted && score === 10) {
      const duration = 3000
      const end = Date.now() + duration

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#FF6B9D', '#C44DFF', '#4DC9FF', '#2DD4BF', '#4ADE80', '#FBBF24', '#FB923C'],
        })
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#FF6B9D', '#C44DFF', '#4DC9FF', '#2DD4BF', '#4ADE80', '#FBBF24', '#FB923C'],
        })
        if (Date.now() < end) requestAnimationFrame(frame)
      }
      frame()

      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#FF6B9D', '#C44DFF', '#4DC9FF', '#2DD4BF', '#4ADE80', '#FBBF24', '#FB923C'],
      })
    }
  }, [submitted, score])

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 flex">
      {/* Sidebar */}
      <aside className="w-[150px] bg-gradient-to-b from-indigo-500 to-purple-600 p-4 flex flex-col items-center gap-3 flex-shrink-0 shadow-xl shadow-indigo-200">
        <h2 className="text-white font-extrabold text-lg tracking-wide mb-2">Levels</h2>
        {Object.entries(LEVEL_CONFIG).map(([key, cfg]) => (
          <button
            key={key}
            onClick={() => handleLevelChange(Number(key))}
            className={`w-full py-3 px-2 rounded-2xl text-center font-bold transition-all duration-200 cursor-pointer border-0
              ${level === Number(key)
                ? 'bg-white text-indigo-600 shadow-lg scale-105'
                : 'bg-white/20 text-white hover:bg-white/30 hover:scale-102'
              }
            `}
          >
            <span className="text-xl">{cfg.emoji}</span><br />
            <span className="text-sm">{cfg.label}</span><br />
            <span className="text-[10px] opacity-80">{cfg.range}</span>
          </button>
        ))}
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-[1200px] mx-auto">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-candy-pink via-candy-purple to-candy-blue bg-clip-text text-transparent mb-1">
            Number Bond Practice
          </h1>
          <p className="text-soft-muted mb-6 text-sm">
            Fill in the missing numbers, then click "Check Answers"! 🎯
          </p>

          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5 mb-8">
            {questions.map((q, i) => (
              <NumberBond
                key={`${level}-${i}`}
                q={q}
                index={i}
                answer={answers[i] || ''}
                onChange={(val) => handleAnswerChange(i, val)}
                submitted={submitted}
                showInputError={missingInputs && !answers[i]?.trim()}
                wholeColor={WHOLE_COLORS[i % WHOLE_COLORS.length]}
              />
            ))}
          </div>

          {submitted && (
            <div
              className={`text-center text-2xl font-extrabold mb-4 py-3 rounded-2xl ${
                score === 10
                  ? 'bg-green-100 text-green-600'
                  : score >= 7
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-orange-100 text-orange-600'
              }`}
            >
              {score === 10
                ? 'Perfect Score! 🌟 10/10 🎉'
                : score >= 7
                  ? `Great Effort! 👍 Score: ${score}/10`
                  : `Keep Practicing! 💪 Score: ${score}/10`}
            </div>
          )}

          {missingInputs && (
            <div className="text-center text-lg font-bold text-candy-yellow bg-yellow-50 py-3 rounded-2xl mb-4">
              Please answer all 10 questions first! ⚠️
            </div>
          )}

          <div className="flex justify-center gap-4">
            {!submitted ? (
              <button
                onClick={handleCheck}
                className="px-8 py-3 bg-gradient-to-r from-candy-green to-candy-teal text-white font-extrabold text-lg rounded-2xl shadow-lg shadow-green-200 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border-0"
              >
                Check Answers ✨
              </button>
            ) : (
              <button
                onClick={handleNewQuiz}
                className="px-8 py-3 bg-gradient-to-r from-candy-blue to-candy-purple text-white font-extrabold text-lg rounded-2xl shadow-lg shadow-blue-200 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border-0"
              >
                New Quiz 🎲
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
