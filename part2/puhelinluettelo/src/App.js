import React, { useState, useEffect } from 'react'
import personService from './services/persons'
import Notification from './components/Notification'
import './index.css'


const Person = (props) => {
  const deletePerson = () => {
    if (window.confirm(`Delete ${props.name}?`)) {
      personService
      .deletePerson(props.id)
      .catch(() => {
        props.setTempMessage(`Person '${props.name}' was already removed from server`,
          'red')
      })

      props.setTempMessage(`Person '${props.name}' succesfully removed`,
        'green')

      props.handleDelete(props.id)
    }
  }

  return(
    <li>
      {props.name} {props.number}
      <button onClick={deletePerson}>delete</button>
    </li>)
}


const Filter = ({search, handleSearchChange}) => (
  <div>
    Filter shown with: <input value={search} onChange={handleSearchChange} />
  </div>
)


const PersonForm = (props) => (
  <form onSubmit={props.onSubmit} >
    <div>
      name: <input value={props.newName} onChange={props.handleNameChange} />
    </div>
    <div>
      number: <input value={props.newNumber} onChange={props.handleNumberChange}/></div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)


const Persons = (props) => (
  <ul>
    {props.persons.map(person =>
      <Person key={person.id} id={person.id} 
      name={person.name} number={person.number} 
      handleDelete={props.handleDelete}
      setTempMessage={props.setTempMessage} />
    )}
  </ul>
)


const App = () => {
  const [persons, setPersons] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newSearch, setNewSearch ] = useState('')
  const [message, setMessage] = useState({ message: null, className: 'red'})

  
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearchChange = (event) => {
    setNewSearch(event.target.value)
  }

  const handleDelete = (id) => {
    setPersons(persons.filter(person => person.id !== id))
  }

  const setTempMessage = (message, className) => {
    setMessage(
      { message: message,
       className: className}
    )
    setTimeout(() => {
      setMessage({ message: '',
                  className: null})
    }, 5000)
  }


  const hook = () => {
    personService
    .getAll()
    .then(initialPersons => {
      setPersons(initialPersons)
    })
  }
  useEffect(hook, [])

  const addPerson = (event) => {
    event.preventDefault()
    let newPerson = {
      name: newName,
      number: newNumber
    }
    
    if (!persons.map(person => person.name).includes(newName)) {
      personService
      .create(newPerson)
      .then(returned => {
          setPersons(persons.concat(returned))
          setTempMessage(`Person '${newName}' was succesfully added`,
            'green')
        })
        .catch(error => {
          console.log(error.response.data)
          setTempMessage(error.response.data.error, 'red')
        })
    }
    else {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        newPerson = {...persons.find(p => p.name === newName), number: newNumber}
        
        personService
          .update(newPerson, newPerson.id)
          .then(returned => {
            setPersons(persons.map(
              person => person.id !== newPerson.id 
              ? person 
              : returned))

            setTempMessage(`Person ${newName} was updated succesfully`, 'green')
          })
          .catch(() => {
            setTempMessage(`Person '${newName}' was already removed from server`,
              'red')
            setPersons(persons.filter(p => p.id !== newPerson.id))
          })
      }
    } 
    setNewName('')
    setNewNumber('')
  }

  const shownPersons = newSearch === '' ?
                       persons :
                       persons.filter(person => 
                        person.name.toLowerCase().includes(newSearch.toLowerCase()))
                   
  return (
    <div>
      <Notification message={message.message} className={message.className} />
      <h2>Phonebook</h2>
      <Filter search={newSearch} handleSearchChange={handleSearchChange} />
      <h2>Add a new contact</h2>
      <PersonForm onSubmit={addPerson} newName={newName}
                  handleNameChange={handleNameChange}
                  newNumber={newNumber} 
                  handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <Persons persons={shownPersons} handleDelete={handleDelete}
       setTempMessage={setTempMessage} />
    </div>
  )
}


export default App