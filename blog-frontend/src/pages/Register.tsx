import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async () => {
    try {
      const response = await fetch('http://localhost:5000/register', {
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
      setMessage('Registration successful! You can now log in.');
      setUsername('');
      setPassword('');
    } catch (error) {
      console.error('Error during registration:', error);
      setMessage('Error during registration.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Register
        </Typography>
        {message && (
          <Typography color={message.startsWith('Error') ? 'error' : 'primary'} gutterBottom>
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
          onClick={handleRegister}
          sx={{ mt: 2 }}
        >
          Register
        </Button>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Already have an account?{' '}
          <Button component={Link} to="/login" color="primary" sx={{ p: 0, textTransform: 'none' }}>
            Login here
          </Button>
        </Typography>
      </Box>
    </Container>
  );
};

export default Register;
