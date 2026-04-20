import './test.css'

export default function Test({ handleTest, testStatus }) {
  if (testStatus === "failed") {
  return (
  <>
  <p>Your answers did not pass our test. We're sorry to see you go. Thanks for being part our process!</p>
  </>
  )
  }

    if (testStatus === "passed") {
  return (
  <>
  <p>Congratulations, you passed our test! You may close this window and proceed to next step</p>
  </>
  )
  }

  return (
    <>
      <div id="login-container">
        <div id="login-form">
          <div id="form-title">
            <p>Test</p>
          </div>
          <div id="form-body">
            <form action="" onSubmit={handleTest}>
              <div className="form-group">
                <p>1) What is your name?</p>
                <div className='question-group'>
                  <label>
                  <input type="radio" name="q1" value={'a'} required/> id
                  </label>
                  <label>
                  <input type="radio" name="q1" value={'b'} /> Borbobulus Lemura
                  </label>
                  <label>
                  <input type="radio" name="q1" value={'c'} /> Zyg Xolthar
                  </label>
                  <label>
                  <input type="radio" name="q1" value={'d'} /> Lendalpher Higgs
                  </label>
                </div>
              </div>
              <div className="form-group">
                  <p>2) What is king Artur's quest?</p>
                <div className='question-group'>
                  <label>
                  <input type="radio" name="q2" value={'a'} required/> party at Camelot
                  </label>
                  <label>
                  <input type="radio" name="q2" value={'b'} /> seek the holy grail
                  </label>
                  <label>
                  <input type="radio" name="q2" value={'c'} /> to defeat the Bridge Knight
                  </label>
                  <label>
                  <input type="radio" name="q2" value={'d'} /> defeat the french
                  </label>
                </div>
              </div>
              <div className="form-group">
                <p>3) What is the colour of the sky?</p>
                <div className='question-group'>
                  <label>
                  <input type="radio" name="q3" value={'a'} required/> black
                  </label>
                  <label>
                  <input type="radio" name="q3" value={'b'} /> grey
                  </label>
                  <label>
                  <input type="radio" name="q3" value={'c'} /> blue
                  </label>
                  <label>
                  <input type="radio" name="q3" value={'d'} /> orange
                  </label>
                </div>
              </div>
                <div className="form-group">
                <p>4) What is the Capital of Assyria?</p>
                <div className='question-group'>
                  <label>
                  <input type="radio" name="q4" value={'a'} required/> Assur
                  </label>
                  <label>
                  <input type="radio" name="q4" value={'b'} /> Nimrud
                  </label>
                  <label>
                  <input type="radio" name="q4" value={'c'} /> Nineveh
                  </label>
                  <label>
                  <input type="radio" name="q4" value={'d'} /> Harran
                  </label>
                </div>
              </div>
                <div className="form-group">
                <p>5) What is the airspeed velocity of an unladen swallow?</p>
                <div className='question-group'>
                  <label>
                  <input type="radio" name="q5" value={'a'} required/> 22 km/h
                  </label>
                  <label>
                  <input type="radio" name="q5" value={'b'} /> 33 km/h
                  </label>
                  <label>
                  <input type="radio" name="q5" value={'c'} /> 55 km/h
                  </label>
                  <label>
                  <input type="radio" name="q5" value={'d'} /> which kind of swallow: african or european?
                  </label>
                </div>
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