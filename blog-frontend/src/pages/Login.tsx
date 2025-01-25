import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.message}`);
        return;
      }

      const data = await response.json();
      // Сохраняем токен и данные пользователя
      localStorage.setItem('token', data.token);
      localStorage.setItem(
        'user',
        JSON.stringify({ id: data.id, username: data.username, isAdmin: data.isAdmin })
      );

      setMessage('Login successful!');
      setTimeout(() => (window.location.href = '/'), 1000);
    } catch (error) {
      console.error('Error during login:', error);
      setMessage('Error during login.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        {message && (
          <Typography color="error" gutterBottom>
            {message}
          </Typography>
        )}
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleLogin}
          sx={{ mt: 2 }}
        >
          Login
        </Button>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Don't have an account?{' '}
          <Button
            component={Link}
            to="/register"
            color="primary"
            sx={{ p: 0, textTransform: 'none' }}
          >
            Register here
          </Button>
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;
