import React, { useContext, useEffect, useRef, useState } from "react";
import Layout from "../LayoutComponent/Layout";
import { ScoreContext } from "../ScoreComponents/ScoreContext";
import "./admin.css";

export default function AdminView() {
  const {
    score,
    setScore,
    wickets,
    setWickets,
    over,
    setOver,
    currentBall,
    setCurrentBall,
    balls,
    setBalls,
    oversData,
    setOversData,
  } = useContext(ScoreContext);

  const [showOptions, setShowOptions] = useState(false);
  const url = process.env.URL;
  const ballOptionsRef = useRef();

  const fetchMatchData = async () => {
    try {
      const response = await fetch(
        "https://crickscore-1093.onrender.com/api/scores/match"
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      setScore(data.score);
      setWickets(data.wickets);
      setOver(data.currentOver);
      setCurrentBall(data.currentBall);
      setBalls(data.overs[data.currentOver]?.balls || []);
      setOversData(data.overs);
    } catch (err) {
      console.error("Error fetching match data:", err);
    }
  };

  const handleBallClick = async (run, isWicket) => {
    // Update score and wickets based on selection
    const updatedBalls = [...balls, { run, isWicket }];
    const newScore = isWicket ? score : score + run;
    const newWickets = isWicket ? wickets + 1 : wickets;

    if (isWicket) {
      setWickets(wickets + 1);
    } else {
      setScore(score + run);
    }

    // Store ball data
    const newBall = { run, isWicket };
    setBalls([...balls, newBall]);
    setBalls(updatedBalls);
    setCurrentBall(currentBall + 1);
    try {
      const response = await fetch(
        `https://crickscore-1093.onrender.com/api/scores/match`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            score: newScore,
            wickets: newWickets,
            currentBall: currentBall + 1,
            currentOver: over,
            balls: updatedBalls,
          }),
        }
      );

      const data = await response.json();
      if (data.currentBall == 0) {
        fetchMatchData();
      }
    } catch (error) {
      console.error("Error updating match data:", error);
    }

    setShowOptions(false);
  };
  const handleCurrentBallClick = () => {
    setShowOptions(true);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        ballOptionsRef.current &&
        !ballOptionsRef.current.contains(event.target)
      ) {
        setShowOptions(false);
      }
    }
    fetchMatchData();

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ballOptionsRef]);

  return (
    <Layout>
      <div className="admin">
        <div className="scroll">
          <div className="scores-display">
            <h1 className="scores-wicket-display">
              {score}/{wickets}
            </h1>

            <h4 className="ovres-display">
              Over (
              {currentBall === 6 ? `${over + 1}.0` : `${over}.${currentBall}`})
            </h4>
          </div>

          <div className="over-run-container">
            <div className="balls-container">
              <p className="current-over-title">This Over</p>
              <div className="balls-div">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className={`ball ${
                      balls[i]
                        ? balls[i].isWicket
                          ? "wicket"
                          : `run-${balls[i].run}`
                        : ""
                    } ${i === currentBall ? "active" : ""}`}
                    onClick={() =>
                      i === currentBall && handleCurrentBallClick()
                    }
                  >
                    {balls[i] ? (balls[i].isWicket ? "W" : balls[i].run) : "-"}
                  </div>
                ))}
                <div style={{ display: "flex", gap: "10px" }}>
                  {[...Array(6)].map((_, i) => {
                    const suffix =
                      i + 1 === 1
                        ? "st"
                        : i + 1 === 2
                        ? "nd"
                        : i + 1 === 3
                        ? "rd"
                        : "th";

                    return (
                      <div
                        key={i}
                        style={{
                          fontSize: "12px",
                          paddingLeft: "10px",
                          color: "red",
                          marginTop: "-8px",
                        }}
                      >
                        {`${i + 1}${suffix} ball`}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Show options when the current ball is clicked */}
            {showOptions && (
              <div className="run-ball-display">
                <p className="ball-para">run scored</p>
                <div className="ball-options" ref={ballOptionsRef}>
                  {" "}
                  <button onClick={() => handleBallClick(0, false)}>0</button>
                  <button onClick={() => handleBallClick(1, false)}>1</button>
                  <button onClick={() => handleBallClick(2, false)}>2</button>
                  <button onClick={() => handleBallClick(3, false)}>3</button>
                  <button onClick={() => handleBallClick(4, false)}>4</button>
                  <button onClick={() => handleBallClick(6, false)}>6</button>
                  <button onClick={() => handleBallClick(0, true)}>Out</button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="overs-layout">
          {oversData && oversData.length > 1 && (
            <>
              <h4>Over Listings</h4>
              <div className="over-listing">
                <p className="overs-label">Overs</p>
                <p className="runs-label">Runs</p>
              </div>
            </>
          )}

          <div className="overs-summary">
            {oversData.slice(0, -1).map((over, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  gap: "20px",
                  marginBottom: "5px",
                }}
              >
                <div
                  style={{
                    width: "15%",
                    height: "40px",
                    textAlign: "center",
                    paddingTop: "8px",
                    margin: "6px 0",
                  }}
                >
                  {1 + index}
                </div>
                <div
                  style={{
                    width: "80%",
                    height: "40px",
                    textAlign: "center",
                    padding: "5px 7px",
                    display: "flex",
                    gap: "10px",
                    border: "1px solid gray",
                    margin: "5px",
                    height: "40px",
                  }}
                >
                  {over.balls.map((ball, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "35px",
                        height: "35px",
                        border: "0.5px solid gray",
                        borderRadius: "50%",
                        backgroundColor: ball.isWicket
                          ? "#f1361d"
                          : ball.run === 0
                          ? "white"
                          : ball.run === 1 || ball.run === 2 || ball.run === 3
                          ? "#b8b7b7"
                          : ball.run === 4
                          ? "#64dbd1"
                          : ball.run === 6
                          ? "#119e71"
                          : "transparent",
                        color: ball.run === 0 ? "black" : "white",
                      }}
                    >
                      {ball.isWicket ? "W" : ball.run}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
