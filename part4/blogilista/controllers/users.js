const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')


usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('blogs')

  response.json(users.map(u => u.toJSON()))
})
  

usersRouter.post('/', async (request, response) => {
  const body = request.body

  if (body.password.length < 3 || body.username.length < 3) {
    const error = { name: 'SignupError', message: 'username and password have to be longer than 3 characters'}
    throw error
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.json(savedUser)
})


module.exports = usersRouter