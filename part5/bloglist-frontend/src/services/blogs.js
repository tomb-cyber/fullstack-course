import axios from 'axios'
const baseUrl = '/api/blogs'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}


const create = async newObject => {

  const config = {
    headers: { Authorization: token }
  }


  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async newObject => {
  const response = await axios.put(baseUrl + '/' + newObject.id, newObject)
  return response.data
}

const deleteBlog = async (blogId) => {
  const config = {
    headers: { Authorization: token }
  }

  axios.delete(baseUrl + '/' + blogId, config)
}


const exported =  { getAll, create, setToken, update, deleteBlog }

export default exported