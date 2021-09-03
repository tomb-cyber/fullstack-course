import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  let component

  const mockHandler = jest.fn()

  beforeEach(() => {
    
    component = render(
        <BlogForm createBlog={mockHandler} />
    )
  })

  test('Sends correct inputs when submitted', () => {
  
    const titleInput = component.container.querySelector('#title')
    const authorInput = component.container.querySelector('#author')
    const urlInput = component.container.querySelector('#url')
    const form = component.container.querySelector('form')
  
    fireEvent.change(titleInput, { 
      target: { value: 'This is the title' } 
    })
    fireEvent.change(authorInput, { 
        target: { value: 'The author' } 
    })
    fireEvent.change(urlInput, { 
        target: { value: 'The url' } 
    })

    fireEvent.submit(form)
  
    expect(mockHandler.mock.calls).toHaveLength(1)
    expect(mockHandler.mock.calls[0][0].title).toBe('This is the title')
    expect(mockHandler.mock.calls[0][0].author).toBe('The author')
    expect(mockHandler.mock.calls[0][0].url).toBe('The url')
  })
  
})


  
  
