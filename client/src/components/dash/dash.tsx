import './dash.css'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Steps from '../steps/steps'
import Register from '../steps/all-steps/register/register'
import Test from '../steps/all-steps/test/test'
import { updateCandidate, fetchCandidate, testCandidate } from '../../services/candidate-input'
import profilePic from '../../assets/profile-pic.png'
import logo from '../../assets/logo-bw.webp'
import { Icon } from '@mdi/react'
import { icons } from '../../ui/icons'
import type { Candidate } from '../../types'

export default function Dashboard() {
  const { id } = useParams() as { id: string }
  const [currentStep, setCurrentStep] = useState<string | null>(null)
  const [candidate, setCandidate] = useState<Candidate | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchCandidate(id)
        setCandidate(data)
      } catch (err) {
        console.log(err)
      }
    }
    load()
  }, [id])

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
      const registeredCandidate = await updateCandidate(id, { firstName, lastNames, phone })
      setCandidate(registeredCandidate)
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
      const testedCandidate = await testCandidate(id, choices)
      setCandidate(testedCandidate)
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
