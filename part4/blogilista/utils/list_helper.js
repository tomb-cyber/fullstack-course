const dummy = (blogs) => {
    return 1
}


const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}


const favoriteBlog = (blogs) => {
    const fav = blogs.length === 0 ? {error: 'no blogs'} :
    blogs.reduce((currentFav, newBlog) => (currentFav.likes < newBlog.likes ? newBlog : currentFav))

    return fav
}


const mostBlogs = (blogs) => {    

    if (blogs.length === 0) {
        return  {error: 'no blogs'}
    }

    const addToAuths = (auths, blog) => {
        if (auths.length === 0) {
            auths.push({ author: blog.author, blogs: 1 })
            return auths
        }
        
        const authIndex = auths.findIndex((element) => 
            element.author === blog.author)

        if (authIndex === -1) {
            auths.push({ author: blog.author, blogs: 1 })
        }
        else {
            auths[authIndex].blogs += 1
            
        }
        return auths
    }

    const allAuths = blogs.reduce((authors, blog) => addToAuths(authors, blog), [])

    return allAuths.reduce((topAuth, newAuth) => topAuth.blogs < newAuth.blogs ? newAuth : topAuth)
}


const mostLikes = (blogs) => {    

    if (blogs.length === 0) {
        return  {error: 'no blogs'}
    }

    const addToAuths = (auths, blog) => {
        if (auths.length === 0) {
            auths.push({ author: blog.author, likes: blog.likes })
            return auths
        }
        
        const authIndex = auths.findIndex((element) => 
            element.author === blog.author)

        if (authIndex === -1) {
            auths.push({ author: blog.author, likes: blog.likes })
        }
        else {
            auths[authIndex].likes += blog.likes
            
        }
        return auths
    }

    const allAuths = blogs.reduce((authors, blog) => addToAuths(authors, blog), [])

    return allAuths.reduce((topAuth, newAuth) => topAuth.likes < newAuth.likes ? newAuth : topAuth)
}

  
module.exports = {
    dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}