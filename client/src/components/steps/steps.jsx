import './steps.css'

function getStepUI(step) {
  if (!step) return { className: "step step--loading", icon: "…" };

  if (step.access === "locked") return { className: "step step--locked", icon: "🔒" };
  if (step.currentStatus === "failed") return { className: "step step--failed", icon: "🔴" };
  if (step.currentStatus === "passed") return { className: "step step--passed", icon: "🟢" };

  return { className: "step step--available", icon: "🔵" };
}

export default function Steps({ onCurrentStep, steps }) {
  const reg = getStepUI(steps?.registration);
  const test = getStepUI(steps?.test);
  const questions = getStepUI(steps?.reflectiveQuestions);
  const group = getStepUI(steps?.groupDynamic);
  const interview = getStepUI(steps?.finalInterview);
  const bootcamp = { className: "step step--locked", icon: "🔒" };


  return (
    <>
    <div id="dash-steps">
      <button className={reg.className} onClick={() => onCurrentStep("registration")}>
        {reg.icon} Registration
      </button>

      <button className={test.className} onClick={() => onCurrentStep("test")}>
        {test.icon} Test
      </button>

      <button className={questions.className} onClick={() => onCurrentStep("questions")}>
        {questions.icon} Recommendation Letter
      </button>

      <button className={group.className} onClick={() => onCurrentStep("group-dynamic")}>
        {group.icon} Group Interview
      </button>

      <button className={interview.className} onClick={() => onCurrentStep("final-interview")}>
        {interview.icon} Solo Interview
      </button>

      <button className={bootcamp.className} onClick={() => onCurrentStep("bootcamp")}>
        {bootcamp.icon} Training
      </button>
    </div>
    </>
  )
}