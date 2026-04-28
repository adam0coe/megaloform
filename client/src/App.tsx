import './App.css'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Login from './components/login/login'
import Dashboard from './components/dash/dash'
import { upsertCandidate } from './services/candidate-input'

function App() {
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim()
    const password = (form.elements.namedItem('password') as HTMLInputElement).value.trim()

    if (!email) {
      alert('Must insert valid email!')
      return
    }
    if (!password) {
      alert('Must insert valid password!')
      return
    }

    try {
      const userInput = await upsertCandidate({ email, password })
      navigate(`/candidate/${userInput._id}`)
      form.reset()
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login handleSubmit={handleSubmit} />} />
      <Route path="/candidate/:id" element={<Dashboard />} />
    </Routes>
  )
}

export default App
