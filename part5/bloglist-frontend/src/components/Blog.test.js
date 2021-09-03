import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'


describe('<Blog />', () => {
    let component

    const mockHandler = jest.fn()
  
    beforeEach(() => {
        const blog = {
            title: 'The title of the blog post',
            author: 'The author',
            url: '/the/url',
            likes: 3
        }

        component = render(
            <Blog blog={blog} updateFunc={mockHandler} />
        )

        //component.debug()
    })

  test('renders title and author, but not details', () => {

    expect(component.container.querySelector('.title'))
      .toBeDefined()

    expect(component.container.querySelector('.details'))
      .toBeDefined()

    expect(component.container.querySelector('.title'))
      .not.toHaveStyle('display: none')

    expect(component.container.querySelector('.togglableContent'))
      .toHaveStyle('display: none')

    expect(component.container.querySelector('.togglableContent.details'))
      .toBeDefined()
  })

  test('after clicking the button, children are displayed', () => {
      const button = component.getByText('view')
      fireEvent.click(button)

      const div = component.container.querySelector('.togglableContent')
      expect(div).not.toHaveStyle('display: none')
  })

  test('after clicking the button, children are displayed', () => {
    expect(mockHandler.mock.calls).toHaveLength(0)

    const button = component.getByText('like')
    fireEvent.click(button)
    fireEvent.click(button)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})
