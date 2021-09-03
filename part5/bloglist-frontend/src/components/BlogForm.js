import React, { useState, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'

const BlogForm = React.forwardRef(({ createBlog }, ref) => {
  const [newBlog, setNewBlog] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleBlogChange = (event) => {
    console.log(event.target.value)
    setNewBlog(event.target.value)
  }

  const handleAuthorChange = (event) => {
    console.log(event.target.value)
    setAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    console.log(event.target.value)
    setUrl(event.target.value)
  }

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newBlog,
      author: author,
      url: url
    })

    setUrl('')
  }

  const getNClearTitle = () => {
    const title = newBlog
    setNewBlog('')
    return title
  }

  const getNClearAuthor = () => {
    const auth = author
    setAuthor('')
    return auth
  }

  useImperativeHandle(ref, () => {
    return {
      getNClearAuthor,
      getNClearTitle
    }
  })


  return (
    <div>
      <h2>Create a new blog</h2>

      <form onSubmit={addBlog}>
        <div>
        title
          <input
            value={newBlog}
            id='title'
            onChange={handleBlogChange}
          />
        </div>
        <div>
          author
          <input
            value={author}
            id='author'
            onChange={handleAuthorChange}
          />
        </div>
        <div>
          url
          <input
            value={url}
            id='url'
            onChange={handleUrlChange}
          />
        </div>
        <button  type="submit">save</button>
      </form>
    </div>
  )
})

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}


BlogForm.displayName = 'BlogForm'

export default BlogForm
