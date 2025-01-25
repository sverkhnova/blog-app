import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './utils/theme'; 
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BlogList from './pages/BlogList';
import CreateBlog from './pages/CreateBlog';
import EditBlog from './pages/EditBlog';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          {}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {}
          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />
          <Route
            path="/blogs"
            element={
              <Layout>
                <BlogList />
              </Layout>
            }
          />
          <Route
            path="/create-blog"
            element={
              <PrivateRoute>
                <Layout>
                  <CreateBlog />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/edit-blog/:id"
            element={
              <PrivateRoute>
                <Layout>
                  <EditBlog />
                </Layout>
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
