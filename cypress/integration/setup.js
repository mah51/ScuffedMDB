describe('Auth Tests', () => {
  it('Loads login page', () => {
    cy.visit('/');

    cy.get('button').contains('Log in');
  });

  it('Redirects from movie page to login page', () => {
    cy.visit('http://localhost:3000/movie/61151f38a2522515e46d0fa4');

    cy.get('p').contains('Sign in to see details about Spider-Man');
  });

  it('Redirects from user page to login page', () => {
    cy.visit('http://localhost:3000/user/60f1992cc10be06b0c1874ba');

    cy.get('p').contains("Sign in to see Mikerophone's reviews.");
  });

  it('Returns 401 on movie post and get', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/api/movie',
      body: JSON.stringify({
        title: 'Spider-Man',
      }),
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.be.eq(401);
    });
    cy.request({
      method: 'GET',
      url: 'http://localhost:3000/api/movie',
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.be.eq(401);
    });
  });

  it('Returns 401 on review post and delete', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/api/review',
      body: JSON.stringify({
        movieId: '61151f38a2522515e46d0fa4',
        userId: '60f1992cc10be06b0c1874ba',
        rating: 5,
        comment: 'This is a comment',
      }),
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.be.eq(401);
    });
    cy.request({
      method: 'DELETE',
      url: 'http://localhost:3000/api/review',
      body: JSON.stringify({
        movieId: '61151f38a2522515e46d0fa4',
        reviewId: '60f1992cc10be06b0c1874ba',
      }),
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.be.eq(401);
    });
  });
});

describe('HomePage', () => {
  it('Logs in', () => {
    cy.visit('/');
    cy.setCookie('next-auth.csrf-token', Cypress.env('CSRF_TOKEN'));
    cy.setCookie('next-auth.session-token', Cypress.env('SESSION_TOKEN'));
    cy.visit('/');
    cy.get('div.chakra-container').contains('Latest Movie');
  });
});
