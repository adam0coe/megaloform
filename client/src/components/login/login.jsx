import './login.css'
import logo from '../../assets/logo-color-w.png'
import loginImg from '../../assets/bg-imgs/login.png'

export default function Login({handleSubmit}) {

  return (
    <div id="login-container">
      <div id="img-container">
        <img className="bg-decoration" src={loginImg} alt="" aria-hidden="true" />
  
        <div id="art-div">
          <div id="eb-logo-container">
            <img id="eb-img" src={logo} alt="Ensina Brasil" />
          </div>
          <div id="art-txt">
            <h1 id="welcome-title">
              Welcome to Ensina Brasil's{" "}
              <span id="welcome-title-highlight">Admission Process</span>
            </h1>
            <p id="welcome-txt">
              Log in to access the admission process and track your Trainee journey
            </p>
          </div>
        </div>
  
        <div id="login-form">
          <div id="form-title">
            <h1 className="data-form-title">Access your account</h1>
            <p>Use your email and password to continue</p>
          </div>
          <div id="form-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">E-Mail</label>
                <input type="email" name="email" id="email" placeholder="john.smith@mail.com" required />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="password" minLength={4} required />
              </div>
              <p className="forgot">I forgot my password</p>
              <input type="submit" name="submit" id="submit" value="Log in" />
            </form>
            <div id="divider">
              <span className="line"></span>
              <p id="divider-txt">or</p>
              <span className="line"></span>
            </div>
            <button type="button" id="google-enter-btn">
              <p>Login with Google</p>
            </button>
          </div>
          <p className="signup-prompt">
            If you haven't created an account yet, <a href="">click here to create it</a>
          </p>
        </div>
      </div>
    </div>
  );
}