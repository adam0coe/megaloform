import './App.css'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './components/login/login';
import Dashboard from './components/dash/dash';
import { upsertCandidate } from './services/candidate-input';

function App() {

  const navigate = useNavigate();

  async function handleSubmit (e) {
    e.preventDefault();
    if (e.target.email.value.trim() === '') {
      alert('Must insert valid email!');
    } else if (e.target.password.value.trim() === '') {
      alert('Must insert valid password!');
    } else {
      const { email, password } = {
        email: e.target.email.value,
        password: e.target.password.value
      };

      try {
        const userInput = await upsertCandidate({ email, password });
        navigate(`/candidate/${userInput._id}`)
        e.target.reset();
      } catch (err) {
        console.log(err)
      }
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
