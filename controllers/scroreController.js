const Match = require("../models/scoreModel");

const getMatchScore = async (req, res) => {
  try {
    let match = await Match.findOne();

    if (!match) {
      match = new Match({
        score: 0,
        wickets: 0,
        overs: [{ balls: [] }],
        currentOver: 0,
        currentBall: 0,
      });

      await match.save();
      console.log("error");
    }

    res.status(200).json(match);
  } catch (error) {
    res.status(500).json({ error: "Error fetching match data all" });
  }
};



const updateScore = async (req, res) => {
  try {
    const { score, wickets, currentBall, currentOver, balls } = req.body;
    let match = await Match.findOne();

    if (!match) {
      match = new Match({
        score: score,
        wickets: wickets,
        currentBall: currentBall,
        currentOver: currentOver,
        overs: [{ balls }],
      });
    }

    // Update match data
    match.score = score;
    match.wickets = wickets;
    match.currentBall = currentBall;
    match.currentOver = currentOver;

    match.overs[currentOver].balls = balls;

    if (currentBall === 6) {
      match.currentBall = 0; // Update match object
      match.currentOver += 1; // Update match object

      // Update current over's balls
      if (match.overs.length <= currentOver + 1) {
        match.overs.push({ balls: [] }); // Add new over if not existing
      }
      match.overs[currentOver].balls = balls;
    }

    await match.save();
    req.app.get("io").emit("dataUpdate", match);

    res.status(200).json(match);
  } catch (error) {
    res.status(500).json({ error: "Error updating match data" });
  }
};

module.exports = { getMatchScore, updateScore };
