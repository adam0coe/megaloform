import './login.css'

export default function Login() {

  return (
    <>
    <div id="login-container">
      <div id="login-form">
        <div id="form-title">
          <p>Log in or Sing up</p>
        </div>
        <div id="form-body">
          <form action="">
            <div className="form-group">
              <label htmlFor="email">email</label>
              <input type="email" name="email" id="email" placeholder='john.smith@mail.com' required/>
            </div>
            <div className="form-group">
              <label htmlFor="">password</label>
              <input type="password" name="password" id="password" minlength="4" required/>
            </div>
            <div className="form-group">
              <input type="submit" name="sumbmit" id="submit" value={'submit'}/>
            </div>
          </form>
        </div>
      </div>
    </div>
    </>
  )
}