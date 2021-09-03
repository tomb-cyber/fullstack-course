const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const bcrypt = require('bcrypt')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')


const getToken = async (user, pass) => {
  const loginInfo =
    {
      username: user,
      password: pass
    }
  
  const response = await api
                         .post('/api/login')
                         .send(loginInfo)
        
  return response.body.token
}


beforeEach(async () => {
  jest.setTimeout(100000)
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

describe('request for blogs', () => {
  test('blogs are returned as json', async () => {
    await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('blogs have id not _id', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body[0].id).toBeDefined()
  })

  test('succeeds with valid data', async () => {
    const blog = {
      title: 'added blog',
      author: 'test',
      url: '/test',
      likes: 8,

    }

    const token = await getToken('root','sekret')

    await api
      .post('/api/blogs')
      .send(blog)
      .set('Authorization', 'bearer ' + token)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(b => b.title)
    expect(titles).toContain(
      'added blog'
    )
  })

  test('succeeds with valid data, default likes are 0', async () => {
    const blog = {
      title: 'added blog',
      author: 'test',
      url: '/test'
    }

    const token = await getToken('root','sekret')
    
    await api
      .post('/api/blogs')
      .send(blog)
      .set('Authorization', 'bearer ' + token)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const added = blogsAtEnd.find(b => b.title === 'added blog')
    
    expect(added.likes).toEqual(0)
  })


  test('fails with status code 400 if data invaild', async () => {
    const blog = {
      author: 'test',
      likes: 8
    }

    const token = await getToken('root','sekret')

    await api
      .post('/api/blogs')
      .set('Authorization', 'bearer ' + token)
      .send(blog)
      .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

    test('fails without token with code 401', async () => {
      const blog = {
        title: 'added blog',
        author: 'test',
        url: '/test',
        likes: 8
      }
    
      await api
        .post('/api/blogs')
        .send(blog)
        .expect(401)
        .expect('Content-Type', /application\/json/)
  
      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })
})



describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation fails with proper statuscode and message if username or password too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'sml',
      name: 'these are too short',
      password: 'a',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('username or password is too short')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})



afterAll(() => {
    mongoose.connection.close()
})