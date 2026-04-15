const mongoose = require('mongoose');

async function main() {
  await mongoose.connect('mongodb://127.0.0.1/ps2027');
  console.log("✅ Mongoose is loose!")
}

module.exports = main;