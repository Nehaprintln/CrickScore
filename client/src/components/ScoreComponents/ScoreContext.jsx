import React from 'react'
import {createContext, useState } from "react";

export const ScoreContext = createContext();


export default function ScoreProvider({children}) {

    const [score, setScore] = useState(0);
    const [wickets, setWickets] = useState(0);
    const [over, setOver] = useState(0); 
    const [currentBall, setCurrentBall] = useState(0); 
    const [balls, setBalls] = useState([]); 
    const [oversData, setOversData] = useState([]); 

  return (
    <ScoreContext.Provider value={{
        score, setScore,
        wickets, setWickets,
        over, setOver,
        currentBall, setCurrentBall,
        balls, setBalls,
        oversData, setOversData
    }}>
        {children}
    </ScoreContext.Provider>
  )
}
