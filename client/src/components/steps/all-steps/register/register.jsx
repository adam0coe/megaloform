export default function Register({ handleRegister, registrationStatus }) {
  if (registrationStatus === "submitted") {
  return (
  <>
  <p>congratulations, You've succesfully submitted your info! You may close this window and proceed to the next step!</p>
  </>
  )
  ;
}
  return (
    <>
      <div id="login-container">
        <div id="login-form">
          <div id="form-title">
            <p>Registration:</p>
          </div>
          <div id="form-body">
            <form action="" onSubmit={handleRegister}>
              <div className="form-group">
                <label htmlFor="firstName">Name</label>
                <input type="text" name="firstName" id="firstName" required/>
              </div>
              <div className="form-group">
                <label htmlFor="lastNames">Last Name</label>
                <input type="text" name="lastNames" id="lastNames" required/>
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input type="tel" name="phone" id="phone" required/>
              </div>
              <div className="form-group">
                <input type="submit" name="register-sumbmit" id="register-submit" value={'submit'}/>
              </div>
            </form>
        </div>
      </div>
    </div>
    </>
  )
}