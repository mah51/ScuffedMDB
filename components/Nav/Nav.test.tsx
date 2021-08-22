import { Session } from 'next-auth';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import Nav from '.';
import { render } from '@testing-library/react';

describe('<Nav />', () => {
  const queryClient = new QueryClient();
  it('matches screenshot', () => {
    const mockSession: Session = {
      expires: '1',
      user: {
        _id: '611a87491dfec4fd5eaf3764',
        id: '611a87491dfec4fd5eaf3764',
        discord_id: '143699512790089729',
        email: 'john@smith.co.uk',
        image: 'https://cdn.discordapp.com/embed/avatars/1.png',
        sub: '611a87491dfec4fd5eaf3764',
        name: 'Mikerophone',
        username: 'Mikerophone',
        discriminator: '0001',
        public_flags: 640,
        premium_type: 1,
        iat: Date.now() - 1000,
        exp: Date.now() + 1000000,
        flags: 640,
        isAdmin: true,
        isReviewer: true,
        isBanned: false,
        createdAt: new Date(Date.now() - 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        locale: 'en-GB',
        mfa_enabled: true,
      },
    };

    const component = render(
      <QueryClientProvider client={queryClient}>
        <Nav user={mockSession.user} showMovies showReview />
      </QueryClientProvider>
    );
    expect(component).toMatchSnapshot();
  });
});
