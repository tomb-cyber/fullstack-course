const listHelper = require('../utils/list_helper')

describe('favoriteBlog', () => {
    test('favoriteBlog returns error', () => {
    const blogs = []

    const result = listHelper.favoriteBlog(blogs)
    expect(result).toEqual({error: 'no blogs'})
    })


    test('favoriteBlog returns blog1 with 8 likes', () => {
        const blog1 = 
            {
                _id: '5a422aa71b54a676234d17f8',
                title: 'Go To Statement Considered Harmful',
                author: 'Edsger W. Dijkstra',
                url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
                likes: 8,
                __v: 0
            }

        const blogs = [blog1]
    
        const result = listHelper.favoriteBlog(blogs)
        expect(result).toEqual(blog1)
    })

    test('favoriteBlog returns blog1 with 24 likes', () => {
        const blog1 = 
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 24,
            __v: 0
        }
        
        
        const blogs = [
            {
                _id: '5a422aa71b54a676234d17f8',
                title: 'Go To Statement Considered Harmful',
                author: 'Edsger W. Dijkstra',
                url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
                likes: 8,
                __v: 0
            },
            blog1,
            {
                _id: '5a422aa71b54a676234d17f8',
                title: 'Go To Statement Considered Harmful',
                author: 'Edsger W. Dijkstra',
                url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
                likes: 3,
                __v: 0
            }
        ]
    
        const result = listHelper.favoriteBlog(blogs)
        expect(result).toEqual(blog1)
    })
})