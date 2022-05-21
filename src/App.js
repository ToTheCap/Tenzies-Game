import React, { useEffect } from 'react'
import Dice from './components/Dice'
import {nanoid} from "nanoid"
import './Style.css';

export default function App() {
  const [dice, setDice] = React.useState(allNewDice());
  const [tenzies, setTenzies] = React.useState(false)

  useEffect(() => {
    const allheld = dice.every(die => die.isHeld)
    const firstValue = dice[0].value
    const allSameValue = dice.every(die => die.value === firstValue)

    if(allheld && allSameValue){
      setTenzies(true)
    }
  }, [dice])
  
  function generateNewDie(){
    let randomNumber = Math.ceil(Math.random() * 6)
    return {
      value: randomNumber, 
      isHeld: false, 
      id: nanoid()
    }
  }
  
  function allNewDice() {
    const newDice = []
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie())
    }
    return newDice
  }

  function rollDice() {
    if(tenzies)
    {
      setDice(allNewDice())
      setTenzies(false)
    } 
    else 
    {
      setDice(oldDice => oldDice.map(die => {
        return die.isHeld ? die : generateNewDie()
      }))
    }
  }

  function holdDice(id) {
    setDice(oldDice => oldDice.map(die => {
      return die.id === id ? {...die, isHeld: !die.isHeld} : die
    }))
  }
  
  let diceElements = dice.map(die => 
    <Dice  key={die.id} value={die.value} isHeld={die.isHeld} holdDice={() => holdDice(die.id)}></Dice>
  )

  return (
    <main className='tenzies-game'>
      <div className='game'>
        <h1 className='title'>Tenzies</h1>
        <p className='insturctions'>Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
        <div className='dice--div'>{diceElements}</div>
        <button className='roll-dice' onClick={rollDice}>{tenzies ? "New Game" : "Roll"}</button>
      </div>
    </main>
  );
}