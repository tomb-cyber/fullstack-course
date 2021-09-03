import axios from 'axios'
const baseUrl = '/api/persons'

const getAll = () => {
  const request = axios.get(baseUrl)

  const nonExisting = {
    id: 10000,
    name: 'non-existing',
    number: '00000000'
  }

  return request.then(response => response.data.concat(nonExisting))
}

const deletePerson = (id) => (
  axios.delete(`${baseUrl}/${id}`)
      .then(res => (
        console.log(res)  
    ))
)

const create = newPerson => {
  const request = axios.post(baseUrl, newPerson)
  return request.then(response => response.data)
}

const update = (newPerson, id) => {
  const request = axios.put(`${baseUrl}/${id}`, newPerson)
  return request.then(response => response.data)
}

const exported = { getAll, create, update, deletePerson }

export default exported