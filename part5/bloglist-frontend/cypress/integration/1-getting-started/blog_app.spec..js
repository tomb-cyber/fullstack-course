describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'testuser',
      username: 'testuser',
      password: 'password'
    }

    cy.request('POST', 'http://localhost:3000/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('Log in to application')
    cy.get('form')
    cy.get('#username')
    cy.get('#password')
    cy.get('#loginButton')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('testuser')
      cy.get('#password').type('password')
      cy.get('#loginButton').click()

      cy.contains('blogs')
      cy.contains('testuser is logged in')
      cy.get('#logoutButton').click()
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('nonexistent')
      cy.get('#password').type('nonexistent')
      cy.get('#loginButton').click()

      cy.contains('wrong credentials')
      cy.contains('Log in to application')
      cy.get('form')
      cy.get('#username')
      cy.get('#password')
      cy.get('#loginButton')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.get('#username').type('testuser')
      cy.get('#password').type('password')
      cy.get('#loginButton').click()
      cy.wait(500)
    })

    const createFirstBlog = () => {
      cy.contains('create blog').click()
      cy.get('#title').type('This is the title')
      cy.get('#author').type('This is the author')
      cy.get('#url').type('This is the url')
      cy.contains('save').click()
    }

    it('A blog can be created', function() {
      createFirstBlog()
      cy.contains('This is the title')
      cy.contains('by This is the author')
    })

    it('A blog can be liked', function() {
      createFirstBlog()

      cy.contains('view').click()
      cy.contains('Likes: 0')
      cy.get('#likeButton').click()
      cy.contains('Likes: 1')
    })

    it('A blog can be removed', function() {
      createFirstBlog()

      cy.contains('remove').click()

      cy.get('#blogFeed').should('be.empty')
    })

    it('Blogs are in order of likes', function() {
      createFirstBlog()

      cy.contains('view').click()
      cy.get('#likeButton').click()
      cy.get('#likeButton').click()
      cy.get('#likeButton').click()

      cy.contains('create blog').click()
      cy.get('#title').type('This is the title of 2nd')
      cy.get('#author').type('This is the author of 2nd')
      cy.get('#url').type('This is the url of 2nd')
      cy.contains('save').click()

      cy.wait(500)
      cy.get('.blog').eq(1).as('secondBlog').contains('view').click()
      cy.get('@secondBlog').contains('like').click()


      cy.contains('create blog').click()
      cy.get('#title').type('This is the title of 3rd')
      cy.get('#author').type('This is the author of 3rd')
      cy.get('#url').type('This is the url of 3rd')
      cy.contains('save').click()

      cy.wait(500)
      cy.get('.blog').eq(2).as('thirdBlog').contains('view').click()
      cy.get('@thirdBlog').contains('like').click()
      cy.get('@thirdBlog').contains('like').click()
      cy.get('@thirdBlog').contains('like').click()
      cy.get('@thirdBlog').contains('like').click()
      cy.get('@thirdBlog').contains('like').click()

      cy.contains('create blog').click()
      cy.get('#title').type('This is the title of 4th')
      cy.get('#author').type('This is the author of 4th')
      cy.get('#url').type('This is the url of 4th')
      cy.contains('save').click()

      cy.wait(500)
      cy.get('.blog').eq(3).contains('view').click()

      cy.get('.blog').eq(0)
        .contains('Likes: 5')
      cy.get('.blog').eq(1)
        .contains('Likes: 3')
      cy.get('.blog').eq(2)
        .contains('Likes: 1')
      cy.get('.blog').eq(3)
        .contains('Likes: 0')
    })
  })

})
