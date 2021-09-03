import React, { useState } from 'react'

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const suurin = (t) => {
  let suurinInd = 0
  for (let i = 0; i < t.length; i++) {
    if (t[i] > t[suurinInd]) {
      suurinInd = i
    }
  }
  return suurinInd
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.'
  ]
  
   
  const [selected, setSelected] = useState(0)
  const [points, setIncrement] = useState({values: [0,0,0,0,0,0,0], biggest: 0})

  return (
    <div>
      <Button text="next anecdote" handleClick={() => {
        setSelected(Math.floor(Math.random() * 7))
        }} />
      <Button text="vote" handleClick={() => {
          const copy = {...points}
          copy.values[selected] += 1

          if (copy.values[copy.biggest] < copy.values[suurin(copy.values)]) {
            copy.biggest = suurin(copy.values)
          }

          setIncrement(copy)
        }} />
      <br/>
      <p>{anecdotes[selected]}</p>
      <p>This anecdote has {points.values[selected]} votes</p>
      <h2>Anecdote with the most votes</h2>
      <p>
        {anecdotes[points.biggest]}
        This anecdote has {points.values[points.biggest]} votes
      </p>
    </div>
  )
}

export default App