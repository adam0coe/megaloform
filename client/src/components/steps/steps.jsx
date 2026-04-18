import './steps.css'

export default function Steps({ onCurrentStep }) {
  return (
    <>
      <div id="dash-steps">
      <button className="step" onClick={() => onCurrentStep("registration")}>1</button>
      <button className="step" onClick={() => onCurrentStep("test")}>2</button>
      <button className="step" onClick={() => onCurrentStep("questions")}>3</button>
      <button className="step" onClick={() => onCurrentStep("group-dynamic")}>4</button>
      <button className="step" onClick={() => onCurrentStep("final-interview")}>5</button>
      <button className="step" onClick={() => onCurrentStep("bootcamp")}>6</button>
      </div>
    </>
  )
}