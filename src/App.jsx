import { useEffect, useMemo, useState } from 'react'
import questions from './data/questions.json'
import './styles.css'

const tabs = ['Learn Mode', 'Drill Mode', 'Conversation Mode', 'Roleplay Mode', 'Field Mode', 'Manager Scorecard']
const customerTypes = ['bakery', 'food manufacturer', '3PL', 'warehouse', 'e-commerce shipper', 'industrial manufacturer']

const drillTime = 30

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5)
}

export default function App() {
  const [tab, setTab] = useState(tabs[0])
  const [learnIndex, setLearnIndex] = useState(0)

  return (
    <main className="app">
      <header className="header">
        <h1>Vision 10Q Trainer</h1>
        <p>Train to ask all 10 discovery questions naturally in the field.</p>
      </header>

      <nav className="tabs">
        {tabs.map((t) => (
          <button key={t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>{t}</button>
        ))}
      </nav>

      {tab === 'Learn Mode' && <LearnMode learnIndex={learnIndex} setLearnIndex={setLearnIndex} />}
      {tab === 'Drill Mode' && <DrillMode />}
      {tab === 'Conversation Mode' && <ConversationMode />}
      {tab === 'Roleplay Mode' && <RoleplayMode />}
      {tab === 'Field Mode' && <FieldMode />}
      {tab === 'Manager Scorecard' && <ManagerMode />}
    </main>
  )
}

function LearnMode({ learnIndex, setLearnIndex }) {
  const q = questions[learnIndex]
  return <section className="card">
    <h2>{q.id}. {q.original}</h2>
    <p><strong>Why it matters:</strong> {q.purpose}</p>
    <p><strong>Casual field version:</strong> {q.casual}</p>
    <h3>Follow-ups</h3>
    <ul>{q.followUps.map((f) => <li key={f}>{f}</li>)}</ul>
    <p><strong>Common mistake:</strong> {q.commonMistake}</p>
    <p><strong>Manager coaching note:</strong> {q.managerNote}</p>
    <div className="footerRow">
      <span>Card {learnIndex + 1} / {questions.length}</span>
      <div className="row">
        <button onClick={() => setLearnIndex((learnIndex + questions.length - 1) % questions.length)}>Previous</button>
        <button onClick={() => setLearnIndex((learnIndex + 1) % questions.length)}>Next</button>
      </div>
    </div>
  </section>
}

function DrillMode() {
  const [score, setScore] = useState(Number(localStorage.getItem('drill_score') || 0))
  const [timer, setTimer] = useState(drillTime)
  const [active, setActive] = useState(false)
  const [prompt, setPrompt] = useState(questions[0])
  const [choices, setChoices] = useState([])
  const [result, setResult] = useState('')

  useEffect(() => {
    if (!active) return
    if (timer === 0) {
      setActive(false)
      setResult('Time is up. Start another round.')
      return
    }
    const id = setTimeout(() => setTimer((t) => t - 1), 1000)
    return () => clearTimeout(id)
  }, [active, timer])

  const nextQuestion = () => {
    const q = questions[Math.floor(Math.random() * questions.length)]
    setPrompt(q)
    const distractors = shuffle(questions.filter((x) => x.id !== q.id)).slice(0, 3).map((x) => x.purpose)
    setChoices(shuffle([q.purpose, ...distractors]))
    setResult('')
  }

  const start = () => {
    setTimer(drillTime)
    setActive(true)
    nextQuestion()
  }

  const choose = (purpose) => {
    if (!active) return
    const ok = purpose === prompt.purpose
    if (ok) {
      const next = score + 1
      setScore(next)
      localStorage.setItem('drill_score', String(next))
      setResult('Correct ✔')
    } else setResult('Not quite. Keep going.')
    nextQuestion()
  }

  return <section className="card">
    <h2>Timed Recall Drill</h2>
    <p><strong>Timer:</strong> {timer}s &nbsp; <strong>Total score:</strong> {score}</p>
    <div className="row"><button onClick={start}>Start 30s Drill</button><button onClick={() => { setScore(0); localStorage.setItem('drill_score', '0') }}>Reset Score</button></div>
    <p className="prompt">Question: {prompt.original}</p>
    <p>Match to the correct purpose:</p>
    <div className="grid">{choices.map((c) => <button key={c} onClick={() => choose(c)}>{c}</button>)}</div>
    <p className="accent">{result}</p>
  </section>
}

function ConversationMode() {
  const [type, setType] = useState(customerTypes[0])
  const flow = useMemo(() => questions.map((q, idx) => `${idx + 1}. ${q.casual}`), [type])
  return <section className="card">
    <h2>Natural Conversation Builder</h2>
    <label>Customer type<select value={type} onChange={(e) => setType(e.target.value)}>{customerTypes.map((c) => <option key={c}>{c}</option>)}</select></label>
    <p>Use this flow for a {type} prospect without sounding like a checklist:</p>
    <ol>{flow.map((line) => <li key={line}>{line}</li>)}</ol>
  </section>
}

const scenarios = [
  { customer: 'We already have a packaging supplier.', options: ['What do they do especially well for you?', 'You should switch today.', 'Who owns your company?'], best: 0, note: 'Great: neutral and discovery-focused.' },
  { customer: 'Pricing is our biggest issue.', options: ['Can I ask what you pay and what’s driving cost up?', 'We are always cheaper.', 'Price should not matter.'], best: 0, note: 'Great: explores total cost before pitching.' }
]

function RoleplayMode() {
  const [index, setIndex] = useState(0)
  const [feedback, setFeedback] = useState('')
  const s = scenarios[index]
  return <section className="card">
    <h2>Roleplay Mode</h2>
    <p><strong>Customer says:</strong> “{s.customer}”</p>
    {s.options.map((op, i) => <button key={op} onClick={() => setFeedback(i === s.best ? s.note : 'Try a more consultative next question.')}>{op}</button>)}
    <p className="accent">{feedback}</p>
    <button onClick={() => { setIndex((index + 1) % scenarios.length); setFeedback('') }}>Next scenario</button>
  </section>
}

function FieldMode() {
  return <section className="card">
    <h2>Field Mode (Mobile Cheat Sheet)</h2>
    <p><strong>Opening line:</strong> I work with teams shipping similar products. Mind if I ask a few quick packaging questions?</p>
    <ol>{questions.map((q) => <li key={q.id}>{q.casual}</li>)}</ol>
    <p><strong>Closing question:</strong> If we can improve cost, consistency, or damage rates, does a short follow-up call make sense?</p>
    <textarea readOnly value={'Salesforce Call Note\nAccount:\nContact:\nWhat they do:\nCurrent packaging SKUs:\nOrder frequency:\nCurrent pricing insight:\nShipping method and pain points:\nNext order timing:\nDecision maker:\nNext step + date:'} />
  </section>
}

function ManagerMode() {
  const [scores, setScores] = useState({ memory: 3, meaning: 3, conversation: 3, followUp: 3, salesUse: 3 })
  const total = Object.values(scores).reduce((a, b) => a + Number(b), 0)

  const save = () => {
    const rows = JSON.parse(localStorage.getItem('manager_scores') || '[]')
    rows.push({ date: new Date().toISOString(), ...scores, total })
    localStorage.setItem('manager_scores', JSON.stringify(rows))
    alert('Saved locally.')
  }

  const exportCsv = () => {
    const rows = JSON.parse(localStorage.getItem('manager_scores') || '[]')
    const headers = 'date,memory,meaning,conversation,followUp,salesUse,total'
    const csv = [headers, ...rows.map((r) => [r.date, r.memory, r.meaning, r.conversation, r.followUp, r.salesUse, r.total].join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'manager-scorecard.csv'
    link.click()
  }

  return <section className="card">
    <h2>Manager Scorecard</h2>
    {Object.keys(scores).map((k) => <label key={k}>{k}<input min="1" max="5" type="number" value={scores[k]} onChange={(e) => setScores({ ...scores, [k]: Number(e.target.value) })} /></label>)}
    <p><strong>Total:</strong> {total} / 25</p>
    <div className="row"><button onClick={save}>Save Locally</button><button onClick={exportCsv}>Export CSV</button></div>
  </section>
}
