import './dash.css'
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Steps from '../steps/steps'
import Register from '../steps/all-steps/register/register'
import Test from '../steps/all-steps/test/test'
import { updateCandidate, fetchCandidate, testCandidate } from '../../services/candidate-input';



export default function Dashboard() {
  const { id } = useParams();
  const [currentStep, setCurrentStep] = useState(null);
  const [candidate, setCandidate] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchCandidate(id);
        setCandidate(data);
      } catch (err) {
        console.log(err);
      }
    }
    load();
  }, [id]);

  async function handleRegister (e) {
      e.preventDefault();
      if (e.target.firstName.value.trim() === '' || e.target.lastNames.value.trim() === '' ) {
        alert('Must insert valid name!');
      } else if (e.target.phone.value.trim() === '') {
        alert('Must insert valid phone!');
      } else {
        const { firstName, lastNames, phone } = {
          firstName: e.target.firstName.value,
          lastNames: e.target.lastNames.value,
          phone: e.target.phone.value,
        };

        try {
          const registeredCandidate = await updateCandidate(id, { firstName, lastNames, phone });
          setCandidate(registeredCandidate)
          e.target.reset();
        } catch (err) {
          console.log(err)
        }
      }
  }

  async function handleTest (e) {
      e.preventDefault();
      if (!e.target.q1.value || !e.target.q2.value || !e.target.q3.value || !e.target.q4.value || !e.target.q5.value) {
        alert('All questions should be answered!');
      } else {
        const choices = [
          e.target.q1.value,
          e.target.q2.value,
          e.target.q3.value,
          e.target.q4.value,
          e.target.q5.value
        ]

        try {
          const testedCandidate = await testCandidate(id, choices);
          setCandidate(testedCandidate)
          e.target.reset();
        } catch (err) {
          console.log(err)
        }
      }
    }

  return (
    <>
    <div id='dash-container'>
      <div id="dash-side-menu">
        <div id="user">
          <div id="user-img" className='user-icons'>😄</div>
          <p id="username">{
            candidate?.profile?.firstName ? `Hello, ${candidate.profile.firstName}!` : 'Welcome to PS2027!'
            }</p>
        </div>
        <div id="config" className='user-icons'>⚙️</div>
      </div>
      <div id="dash-main">
        <div id="dash-header">
          <div id="notifications">🔔</div>
          <div id="warning">⚠️</div>
        </div>
        {currentStep === null ? (
          < Steps onCurrentStep={setCurrentStep}/>
        ) : (
          <div id="dash-step">
            <button onClick={() => setCurrentStep(null)}>❌</button>
            {currentStep === 'registration' && <Register handleRegister={handleRegister} registrationStatus={candidate?.steps?.registration?.currentStatus}/>}
            {currentStep === 'test' && <Test handleTest={handleTest} testStatus={candidate?.steps?.test?.currentStatus} />}
          </div>
        )}
        </div>
      </div>
    </>
  )
}