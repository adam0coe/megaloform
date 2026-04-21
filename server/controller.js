const Candidate = require('./model');
const bcrypt = require("bcryptjs");

async function enter(req, res) {
  try {
    const { email, password } = req.body;

    if(!email || !password) {
      return res.status(400).json({ message: 'Email and Password are needed!'})
    }

    const sanitizedEmail = email.trim().toLowerCase();
    const existingCandidate = await Candidate.findOne({ "profile.email": sanitizedEmail });

    if(!existingCandidate) {
      const passwordHash = await bcrypt.hash(password, 10);

      const candidate = await Candidate.create({
        profile: {
          email: sanitizedEmail,
          firstName: "",
          lastNames: "",
          phone: "",
        },
        isApproved: false,
        passwordHash,
      });

      return res.status(200).json(candidate);
    }

    const isPasswordCorrect = await bcrypt.compare(password, existingCandidate.passwordHash);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Incorrect Password" })
    }

    return res.status(200).json(existingCandidate)
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function register(req, res){

  const { id } = req.params;
  const { firstName, lastNames, phone } = req.body;

  if (!firstName || !lastNames || !phone) return res.status(400).json({ message: "This register is missing fields!" })

  try {
    const registeredCandidate = await Candidate.findByIdAndUpdate(id,
      {
        $set: {
          "profile.firstName": firstName,
          "profile.lastNames": lastNames,
          "profile.phone": phone,
          "steps.registration.currentStatus": "passed",
          "steps.registration.updatedAt": new Date(),
          "steps.test.access": "available"
        },
      },
      { new: true, runValidators: true }
     );

     if (!registeredCandidate) {
      return res.status(404).json({ message: "Candidate not found!" })
     }

     return res.status(200).json(registeredCandidate);
  } catch(err) {
    console.error(err);
    return res.status(500).json({ message: 'Server Error' })
  }
}

async function fetchCandidate(req, res) {
  const { id } = req.params;
  try {
    const candidate = await Candidate.findById(id)
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }
    return res.status(200).json(candidate);
  } catch(err) {
    console.error(err)
    return res.status(500).json({ message: "Failed to fetch" });
  }
}

async function testCandidate(req, res) {
  const { id } = req.params;
  const { choices } = req.body;
  let score = 0;
  const correctChoices = ['a', 'b', 'c', 'd', 'a']

  if (!Array.isArray(choices) || choices.length !== 5 || choices.some(c => !c)) {
    return res.status(400).json({ message: "The test has unanswered items!" })
  }


  for (let i = 0; i < correctChoices.length; i++) {
    if (choices[i] === correctChoices[i]) score += 2;
  }

  const status = score < 6 ? "failed" : "passed";
  const letterAvailable = status === "failed" ? "locked" : "available"

  try {
    const testedCandidate = await Candidate.findByIdAndUpdate(id,
      {
        $set: {
          "steps.test.choices": choices,
          "steps.test.score": score,
          "steps.test.currentStatus": status,
          "steps.test.updatedAt": new Date(),
          "steps.reflectiveQuestions.access": letterAvailable,
        },
      },
      { new: true, runValidators: true }
     );

     if (!testedCandidate) {
      return res.status(404).json({ message: "Candidate not found!" })
     }

     return res.status(200).json(testedCandidate);

  } catch(err) {
    console.error(err);
    return res.status(500).json({ message: 'Server Error' })
  }
}

module.exports = { enter, register, fetchCandidate, testCandidate}