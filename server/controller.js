const Candidate = require('./model');
const bcrypt = require("bcryptjs");

async function enter(req, res) {
  try {
    const { email, password } = req.body;

    if(!email || !password) {
      return res.status(400).json({ message: 'Email e senha são necessários'})
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
      return res.status(401).json({ message: "Senha incorreta" })
    }

    return res.status(200).json(existingCandidate)
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro de servidor" });
  }
}

module.exports = { enter }