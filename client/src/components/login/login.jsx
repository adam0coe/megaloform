import './login.css'
import logo from '../../assets/logo-color-w.png'
import loginImg from '../../assets/bg-imgs/login.png'

export default function Login({handleSubmit}) {

  return (
    <>
    <div id="login-container">
      <div id="art-div">
        <div id='img-container'>
          <img src={loginImg} alt="" />
        </div>
        <div id='info'>
          <div id="eb-logo-container"><img id='eb-img' src={logo} alt="" /></div>
            <div id="art-txt">
              <h1 id='welcome-title'>Welcome to Ensina Brasil's <h1 id='welcome-title-highlight'>Admission Process</h1></h1>
              <p id='welcome-txt'>Log in to access the admission process and track your Trainee journey</p>
            </div>
          </div>
        </div>
      <div id="login-form">
        <div id="dark-mode-toggler">
          <button>sunenmoon</button>
        </div>
        <div id="form-title">
          <h1 className="data-form-title">Access your account</h1>
          <p>Use you email and password to continue</p>
        </div>
        <div id="form-body">
          <form action="" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">E-Mail</label>
              <i className="input-icon"></i>
              <input type="email" name="email" id="email" placeholder='john.smith@mail.com' required/>
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <i className="input-icon"></i>
              <input type="password" name="password" id="password" minLength="4" required/>
              <button className="input-btn"></button>
            </div>
              <p>I forgot my password</p>
              <input type="submit" name="sumbmit" id="submit" value={'Log in'}/>
          </form>
          <div id='divider'>
            <span className='line'></span>
            <p id='divider-txt'>or</p>
            <span className='line'></span>
          </div>
          <button id='google-enter-btn'>
            <img src="" alt="" />
            <p>Login with Google</p>
            </button>
        </div>
        <p>If you haven't created an account yet, <a href="">clik here to create it</a></p>
      </div>
    </div>
    </>
  )
}