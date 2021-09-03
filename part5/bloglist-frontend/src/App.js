import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)

  const blogFormRef = useRef()
  const blogFormRef2 = useRef()

  useEffect(() => {
    blogService
      .getAll()
      .then(initialBlogs => {
        setBlogs(initialBlogs)
      })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          id="username"
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          id="password"
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button id="loginButton" type="submit">login</button>
    </form>
  )

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      blogService.setToken(user.token)
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }


  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()

    console.log(user.token)

    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setErrorMessage(
          `successfully added '${blogFormRef2.current.getNClearTitle()}' by ${blogFormRef2.current.getNClearAuthor()}`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
      .catch(() => {
        setErrorMessage(
          'some input lacking'
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }

  const blogForm = () => (
    <Togglable buttonLabel='create blog' ref={blogFormRef}>
      <BlogForm createBlog={addBlog} ref={blogFormRef2} />
    </Togglable>
  )

  const logout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
  }


  if (user === null) {
    return (
      <div>
        <Notification message={errorMessage} />
        <h2>Log in to application</h2>
        { loginForm() }
      </div>
    )
  }

  return (
    <div>
      <Notification message={errorMessage} />
      <h2>blogs</h2>
      <form onSubmit={logout}>
        <div>
          { user.name } is logged in
          <button id="logoutButton" type="submit">logout</button>
        </div>
      </form>
      { blogForm() }
      <div id="blogFeed">
        {blogs.sort((first, sec) => sec.likes - first.likes)
          .map(blog => {

            const deleteBlog = event => {
              event.preventDefault()
              if (window.confirm(`Do you really want to delete ${blog.title}?`)) {
                blogService.deleteBlog(blog.id)
                let updatedBlogs = blogs.filter(blogInArr =>
                  blogInArr.id !== blog.id
                )
                setBlogs(updatedBlogs)
              }
            }

            const deletionOption = blog.user === user.id || blog.user.username === user.username ?
              <form onSubmit={deleteBlog}>
                <button type="submit">remove</button>
              </form> : ''

            return(
              <div key={blog.id}>
                <Blog blog={blog} />
                {deletionOption}
                <br/>
              </div>
            )}
          )
        }
      </div>
    </div>
  )
}

export default App