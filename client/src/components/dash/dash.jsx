import './dash.css'
import { useParams } from 'react-router-dom';



export default function Dashboard() {
  const { id } = useParams();

  return (
    <>
    <div id='dash-container'>
      <div id="dash-side-menu">
        <div id="user">
          <div id="user-img" className='user-icons'>😄</div>
          <p id="username">{id}</p>
        </div>
        <div id="config" className='user-icons'>⚙️</div>
      </div>
      <div id="dash-main">
        <div id="dash-header">
          <div id="notifications">🔔</div>
          <div id="warning">⚠️</div>
        </div>
        <div id="dash-steps">
          <div className="step">1</div>
          <div className="step">2</div>
          <div className="step">3</div>
          <div className="step">4</div>
          <div className="step">5</div>
          <div className="step">6</div>
        </div>
      </div>
    </div>
    </>
  )
}