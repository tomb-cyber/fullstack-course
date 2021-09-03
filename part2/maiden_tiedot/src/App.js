import React, { useState, useEffect } from 'react'
import axios from 'axios'

const api_key = process.env.REACT_APP_API_KEY

const FullCountry = ({country}) => {
  const request = `http://api.weatherstack.com/current?access_key=${api_key}&query=${country.capital}`
  const [weather, setWeather] = useState([])

  const hook = () => {
    console.log('effect')
    axios
      .get(request)
      .then(response => {
        console.log('promise fulfilled')
        console.log(response.data)
        setWeather(response.data)
      })
  }
  useEffect(hook, [])

  return(
  <div>
  <h2> {country.name } </h2>
  <p> 
    capital: {country.capital} 
  </p>
  <p> 
    population: {country.population} 
  </p>
  <h3>languages</h3>
  <ul>
    {country.languages.map(lang =>
    <li key={lang.name} >{lang.name}</li>)} 
  </ul>
  <img src={country.flag} height="200"/>
  <h3>Weather in {country.capital}</h3>
  {console.log(weather)}

  <p>temp (Celcius): {weather.current.temperature}</p>
  <p>wind (mph): {weather.current.wind_speed}</p>
</div>
)}


function App() {
  const [countries, setCountries] = useState([])
  const [ newSearch, setNewSearch ] = useState('')
  const handleSearchChange = (event) => {
    setNewSearch(event.target.value)
  }

  const hook = () => {
    console.log('effect')
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        console.log('promise fulfilled')
        setCountries(response.data)
      })
  }
  useEffect(hook, [])

  const shownCountries = newSearch === '' ?
                       [] :
                       countries.filter(country => 
                        country.name.toLowerCase().includes(newSearch.toLowerCase()))

  const showResults = () => {
    let result = 'Too many matches, specify another filter'

    if (shownCountries.length === 1) {
      result = <FullCountry country={shownCountries[0]} />
    }
    else if (shownCountries.length <= 10 && shownCountries.length !== 0) {
      result = <ul>
          {shownCountries.map(country =>
          <li key={country.name} >
            {country.name} 
            <button value={country.name} onClick={handleSearchChange} >
              show 
            </button>
          </li>)}
        </ul>
    }
    else if (shownCountries.length === 0 && newSearch !== '') {
      result = 'No matches'
    }

    return(result)
  } 

  return (
    <div>
    Find countries: <input value={newSearch} onChange={handleSearchChange} />
    <div>
      {showResults()}
    </div>
  </div>
  );
}

export default App;
