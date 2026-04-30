import './dash.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Steps from '../steps/steps'
import Register from '../steps/all-steps/register/register'
import Test from '../steps/all-steps/test/test'
import { updateCandidate, testCandidate } from '../../services/candidate-input'
import { useAuth } from '../../auth/AuthContext'
import profilePic from '../../assets/profile-pic.png'
import logo from '../../assets/logo-bw.webp'
import { Icon } from '@mdi/react'
import { icons } from '../../ui/icons'

export default function Dashboard() {
  // candidate, token, and refresh helpers all come from AuthContext now.
  // No more useEffect+fetch on mount — login/signup already populated context.
  const { candidate, token, setCandidate, logout } = useAuth()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState<string | null>(null)

  function handleLogout() {
    logout()
    // `replace` so the back button doesn't return the user to the dashboard
    // they just logged out of.
    navigate('/login', { replace: true })
  }

  // Token is guaranteed by ProtectedRoute, but TS doesn't know that —
  // narrow it here so the service calls below get a string.
  if (!candidate || !token) return null

  const id = candidate._id

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const firstName = (form.elements.namedItem('firstName') as HTMLInputElement).value.trim()
    const lastNames = (form.elements.namedItem('lastNames') as HTMLInputElement).value.trim()
    const phone = (form.elements.namedItem('phone') as HTMLInputElement).value.trim()

    if (!firstName || !lastNames) {
      alert('Must insert valid name!')
      return
    }
    if (!phone) {
      alert('Must insert valid phone!')
      return
    }

    try {
      const registered = await updateCandidate(id, { firstName, lastNames, phone }, token!)
      setCandidate(registered)
      form.reset()
    } catch (err) {
      console.log(err)
    }
  }

  async function handleTest(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const choices = ['q1', 'q2', 'q3', 'q4', 'q5'].map(
      n => (form.elements.namedItem(n) as HTMLInputElement).value
    )

    if (choices.some(c => !c)) {
      alert('All questions should be answered!')
      return
    }

    try {
      const tested = await testCandidate(id, choices, token!)
      setCandidate(tested)
      form.reset()
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <>
      <div id='dash-container'>
        <div id="dash-side-menu">
          <div id="user">
            <div className='user-icons'><img id="user-img" src={profilePic} alt="" /></div>
            <p id="username">{
              candidate?.profile?.firstName ? `Hello, ${candidate.profile.firstName}!` : 'Welcome to PS2027!'
            }</p>
            <button
              type="button"
              onClick={handleLogout}
              style={{
                marginTop: '0.5rem',
                padding: '0.4rem 0.8rem',
                background: 'transparent',
                color: 'inherit',
                border: '1px solid currentColor',
                borderRadius: '0.25rem',
                cursor: 'pointer',
                fontSize: '0.85rem',
              }}
            >
              Log out
            </button>
          </div>
          <div id="config" className='user-icons'><Icon path={icons.menu} size={1.5} /></div>
        </div>
        <div id="dash-main">
          <div id="dash-header">
            <img id='logo-side-menu' src={logo} alt="" />
            <div id='header-icons'>
              <div id="notifications" className='user-icons'><Icon path={icons.bell} size={1.5} /></div>
              <div id="warning" className='user-icons'><Icon path={icons.alert} size={1.5} /></div>
            </div>
          </div>
          <div id="main-content">
            {currentStep === null ? (
              <Steps onCurrentStep={setCurrentStep} steps={candidate?.steps} />
            ) : (
              <div id="dash-step">
                <button id='close-btn' onClick={() => setCurrentStep(null)}><Icon path={icons.close} size={1.5} /></button>
                {currentStep === 'registration' && <Register handleRegister={handleRegister} registrationStatus={candidate?.steps?.registration?.currentStatus} />}
                {currentStep === 'test' && <Test handleTest={handleTest} testStatus={candidate?.steps?.test?.currentStatus} username={candidate?.profile?.firstName} />}
                {!['registration', 'test'].includes(currentStep) && (
                  <p className="step-coming-soon">This step is coming soon.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
