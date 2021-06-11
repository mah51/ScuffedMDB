import React from 'react';
import renderer from 'react-test-renderer';
import Rating from '.';

describe('<Rating />', () => {
  it('tests no reviews', () => {
    const component = renderer
      .create(<Rating numReviews={0} rating={0} />)
      .toJSON();

    expect(component).toMatchSnapshot();
  });
  it('tests whole integer of reviews', () => {
    const component = renderer
      .create(<Rating numReviews={13} rating={8} />)
      .toJSON();

    expect(component).toMatchSnapshot();
  });

  it('tests half star', () => {
    const component = renderer
      .create(<Rating numReviews={13} rating={5} />)
      .toJSON();

    expect(component).toMatchSnapshot();
  });

  it('tests floating number', () => {
    const component = renderer
      .create(<Rating numReviews={13} rating={7.754} />)
      .toJSON();

    expect(component).toMatchSnapshot();
  });
});
