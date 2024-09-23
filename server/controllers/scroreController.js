// const Score = require('../models/scoreModel');
const Match = require('../models/scoreModel');

// Fetch current score
// const getCurrentScore = async (req, res) => {
//   const score = await Score.findOne({});
//   res.json(score);
// };

// // Update score for current ball
// const updateScore = async (req, res) => {
//   const { runs, ball, over, wickets } = req.body;

//   let score = await Score.findOne({});
//   if (!score) {
//     score = new Score({ over: 0, ball: 0, runs: 0, wickets: 0, completedOvers: [] });
//   }

//   score.runs += runs;
//   score.ball = ball;
//   score.over = over;
//   score.wickets = wickets;

//   await score.save();
//   res.send(score);
// };

// module.exports = { getCurrentScore, updateScore };

const getMatchScore = async (req, res) => {
  try {
    console.log("error before");

    let  match = await Match.findOne(); 
    console.log("error after");
    // Fetch match data
    // TODO:
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
    // TODO:
  // res.send(match);
     res.status(200).json(match); //TODO:
  } catch (error) {
    res.status(500).json({ error: 'Error fetching match data all' });
  }
}

const updateScore = async(req, res) => {
  try {
    console.log("error before patch");
    const { score, wickets, currentBall, currentOver, balls } = req.body;
    console.log("error after patch");
    console.log("Received request body:", req.body); 
   let match = await Match.findOne();
    console.log("error after patch match");

    // TODO:
    if (!match) {
      // match = new Match(); //TODO: 21.
      match = new Match({
        score: score,
        wickets: wickets,
        currentBall: currentBall,
        currentOver: currentOver,
        overs: [{ balls }]
      });
    }
    // TODO:
    // Update match data
    match.score = score;
    match.wickets = wickets;
    match.currentBall = currentBall;
    match.currentOver = currentOver;
    
    console.log("error after patch", match.overs.length);
    console.log("error after patch",currentOver );
    match.overs[currentOver].balls = balls;

    if(currentBall === 6  ){
      match.currentBall = 0; // Update match object
      match.currentOver += 1; // Update match object
      console.log("error after patch 6", match.overs.length);
      console.log("error after patch",match.currentOver );

 // Update current over's balls
 if (match.overs.length <= currentOver+1) {
  match.overs.push({ balls: [] });  // Add new over if not existing
}   
 match.overs[currentOver].balls = balls;

    }

    console.log("error after patch 5",currentOver );

    // Update current over's balls
    // if (match.overs.length <= currentOver) {
    //   match.overs.push({ balls: [] });  // Add new over if not existing
    // }
    // match.overs[currentOver].balls = balls;

    await match.save();
    console.log(JSON.stringify(req.app) +"req app");
    req.app.get('io').emit('dataUpdate', match); 
    
    // res.send(match);
     res.status(200).json(match); //TODO: 21.
  } catch (error) {
    res.status(500).json({ error: 'Error updating match data' });
  }
}

module.exports = { getMatchScore, updateScore };
