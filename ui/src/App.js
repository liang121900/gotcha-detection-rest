import Box from '@mui/material/Box';
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import './App.css';
import RootHeader from './component/RootHeader';
import ErrorPage from "./page/ErrorPage";
import ImageDetectionPage from './page/ImageDetectionPage';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import UnderConstructionPage from './page/UnderConstructionPage';
import Layout from './component/Layout';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ProtectedRoute from './component/route/ProtectedRoute'
import AuthPage from './page/AuthPage';

const theme = createTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
    text: {
      primary: 'rgba(0,0,0,0.65)',
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none"
        }
      }
    }
  }
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout><ImageDetectionPage /></Layout>,
    errorElement: <ErrorPage />,
  },
  {
    path: "/image-object-detection",
    element: <Layout><ImageDetectionPage /></Layout>,
    errorElement: <ErrorPage />,
  },
  {
    path: "/video-object-detection",
    element: <ProtectedRoute><Layout><UnderConstructionPage /></Layout></ProtectedRoute>
  },
  {
    path: "/real-time-object-detection",
    element: <ProtectedRoute><Layout><UnderConstructionPage /></Layout></ProtectedRoute>
  },
  {
    path: "/about-me",
    element: <Layout><UnderConstructionPage /></Layout>
  },
  {
    path: "/what-is-this",
    element: <Layout><UnderConstructionPage /></Layout>
  },
  {
    path: "/auth",
    element: <Layout><AuthPage /></Layout>,
    errorElement: <ErrorPage />,
  },
]);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Grid container className="App" spacing={2} >
        <RouterProvider router={router} />
      </Grid>
    </ThemeProvider>
  );
}

export default App;
