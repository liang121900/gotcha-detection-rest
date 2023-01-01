import { useRouteError } from "react-router-dom";
import Stack from '@mui/material/Stack';

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <Stack id="error-page" align="center" justify="center" alignItems="center" width="100%">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </Stack>
  );
}