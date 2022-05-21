import React, { useEffect, useState } from 'react'
import Dice from './components/Dice'
import {nanoid} from "nanoid"
import './Style.css';

export default function App() {
  const [dice, setDice] = useState(allNewDice())
  const [tenzies, setTenzies] = useState(false)
  const [stats, setStats] = useState({
    lowestRolls: parseInt(JSON.parse(localStorage.getItem("lowestRolls"))) || 0, 
    currentRolls: 0,
    firstGame: true
  })

  // this useEffect hook runs everytime lowestRoll changes and stores its value in local storage
  useEffect(() => {
    localStorage.setItem("lowestRolls", JSON.stringify(stats.lowestRolls))
  }, [stats.lowestRolls])

  // this useEffect hook is responsible to check if game is won. it checks it every time dice state changes
  useEffect(() => {
    // checks if all die are held. returned value is true or false
    const allheld = dice.every(die => die.isHeld)
    // gets one die value to compare it others
    const firstValue = dice[0].value
    // comparing dice values eachother. returned value is true or false
    const allSameValue = dice.every(die => die.value === firstValue)

    // if all dice are held and all dice values are same its changes tenzies state to true. basically its means game is won
    // later tenzies value gets checked in rolldice function to restart game
    if(allheld && allSameValue){
      setTenzies(true)
    }
  }, [dice])
  
  // this function is reponsible to changes values of stats
  function updateStats(){
    // checks if game is won to restart current rolls value to 0 and check if this round rolls was lowest
    if(tenzies){
      // this only work for first round to set first round rolls as a lowest since there is no value from start
      if(stats.firstGame){
        setStats(oldStats => ({
          ...oldStats, 
          lowestRolls: oldStats.currentRolls,
          currentRolls: 0,
          firstGame: false
        }))
      }
      // if its not first round then its checkes if current rolls is lowest and update lowest rolls value based on that. 
      // also resets current rolls value
      else {
        setStats(oldStats => ({
          ...oldStats,
          lowestRolls: (oldStats.currentRolls < oldStats.lowestRolls) ? oldStats.currentRolls : oldStats.lowestRolls,
          currentRolls: 0
        }))
      }
    }
    // if game not won yet function just counts rolls and updates stats
    else {
      setStats(oldStats => ({...oldStats, currentRolls: oldStats.currentRolls+1}))
    }
  }

  // this function is responsible to generate 1 random die object everytime its called
  function generateNewDie(){
    let randomNumber = Math.ceil(Math.random() * 6)
    return {
      value: randomNumber, 
      isHeld: false,
      id: nanoid()
    }
  }
  
  // this function runs once in the beggining and creates starting 10 dice
  function allNewDice() {
    const newDice = []
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie())
    }
    // counts time from the beggining of the game
    return newDice
  }

  // function is responsible to reroll unheld dice
  function rollDice() {
    // first it's checks if game is already won to restart the game
    if(tenzies)
    {
      setDice(allNewDice())
      setTenzies(false)
      updateStats()
    }
    // if game is not won yet it checks every unheld dice useing map function to reroll and change its value and also calls
    // updateStats function to increase round roll number
    else 
    {
      setDice(oldDice => oldDice.map(die => {
        return die.isHeld ? die : generateNewDie()
      }))
      updateStats()
    }
  }

  // this function goes as a prop in Dice.js where its used as a onClick function and its get die's id as a argument
  function holdDice(id) {
    //function maps over list of dice obj to find matching id and change that die held value to oppsite
    setDice(oldDice => oldDice.map(die => {
      return die.id === id ? {...die, isHeld: !die.isHeld} : die
    }))
  }
  
  // Creating dice element list with Dice.js component
  let diceElements = dice.map(die => 
    <Dice  key={die.id} value={die.value} isHeld={die.isHeld} holdDice={() => holdDice(die.id)}></Dice>
  )

  return (
    <main className='tenzies-game'>
      <div className='stats-div'>
        <p className='stats'>Lowest Rolls : {stats.lowestRolls}</p>
        <p className='stats'>Current Rolls : {stats.currentRolls}</p>
      </div>
      <div className='game'>
        <h1 className='title'>Tenzies</h1>
        <p className='insturctions'>Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
        <div className='dice--div'>{diceElements}</div>
        <button className='roll-dice' onClick={rollDice}>{tenzies ? "New Game" : "Roll"}</button>
      </div>
    </main>
  );
}