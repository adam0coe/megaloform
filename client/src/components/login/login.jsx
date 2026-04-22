import './login.css'
import logo from '../../assets/logo-color.png'

export default function Login({handleSubmit}) {

  return (
    <>
    <div id="login-container">
      <div id="art-div">
        <div id='img-container'>
          <img src="" alt="" />
        </div>
        <div id="eb-logo"></div>
        <div id="art-txt">
          <h1 id='welcome-title'></h1>
          <p id='welcome-txt'></p>
        </div>
      </div>
      <div id="login-form">
        <div id="form-title">
          <img id='logo-img' src={logo} alt="" />
          <p className="data-form-title">Access your account</p>
        </div>
        <div id="form-body">
          <form action="" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">EMAIL</label>
              <input type="email" name="email" id="email" placeholder='john.smith@mail.com' required/>
            </div>
            <div className="form-group">
              <label htmlFor="password">PASSWORD</label>
              <input type="password" name="password" id="password" minLength="4" required/>
            </div>
              <input type="submit" name="sumbmit" id="submit" value={'Submit'}/>
          </form>
        </div>
      </div>
    </div>
    </>
  )
}