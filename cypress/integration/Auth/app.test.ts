describe('Navigation', () => {
  it('should navigate to the about page', () => {
    // Start from the index page
    cy.setCookie('next-auth.session-token', Cypress.env('session_token'));

    cy.visit('http://localhost:3000/');
    cy.get('h1').contains('ScuffedMDB');
    cy.get('button').contains('Log in with discord');
    // Find a link with an href attribute containing "about" and click it
  });
});
