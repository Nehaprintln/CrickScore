const mongoose = require("mongoose");

const ballSchema = new mongoose.Schema({
  run: { type: Number, default: 0 },
  isWicket: { type: Boolean, default: false },
});

const overSchema = new mongoose.Schema({
  balls: [ballSchema], // Array to store ball details for each over
});

const matchSchema = new mongoose.Schema({
  score: { type: Number, default: 0 },
  wickets: { type: Number, default: 0 },
  overs: [overSchema], // Array to store data for each over
  currentOver: { type: Number, default: 0 },
  currentBall: { type: Number, default: 0 },
});

module.exports = mongoose.model("Match", matchSchema);
