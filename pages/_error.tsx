import ErrorPage from '@components/ErrorPage';
import { NextApiResponse } from 'next';

function Error({ statusCode }: { statusCode: number }): JSX.Element {
  return (
    <ErrorPage
      statusCode={statusCode}
      message={
        statusCode
          ? `An error ${statusCode} occurred on server`
          : 'An error occurred on client'
      }
    />
  );
}

Error.getInitialProps = ({
  res,
  err,
}: {
  res: NextApiResponse;
  err: { statusCode: number };
}) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
