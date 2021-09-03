import React, { useState, useRef } from 'react'
import Togglable from './Togglable'
import blogService from '../services/blogs'
import PropTypes from 'prop-types'


const Blog = ({ blog, updateFunc }) => {

  const [likes, setLikes] = useState(blog.likes)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const blogRef = useRef()

  const update = async (event) => {
    event.preventDefault()

    setLikes(likes + 1)
    blog.likes += 1

    const response = await blogService.update(blog)
    console.log(response)
  }


  return(
    <div className="blog" style={ blogStyle }>
      <div className='title'>
        <h4 style={{ display:'inline' }}>{ blog.title }</h4>
        <p>by { blog.author }</p>
      </div>
      <Togglable buttonLabel='view' closeText='hide' ref={ blogRef }>
        <div className='details'>
          <p>Url: { blog.url }</p>
          <p style={{ display:'inline' }}>Likes: { likes }</p>
          <form onSubmit={ updateFunc ? updateFunc : update }>
            <div>
              <button id="likeButton" type="submit">like</button>
            </div>
          </form>
          <p>Author: { blog.author }</p>
        </div>
      </Togglable>
    </div>
  )}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  updateFunc: PropTypes.func
}

Blog.displayName = 'Blog'

export default Blog