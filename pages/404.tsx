import ErrorPage from '@components/ErrorPage';
import React, { ReactElement } from 'react';

export default function ForeDohFore(): ReactElement {
  return <ErrorPage statusCode={404} message="Content could not be found" />;
}
