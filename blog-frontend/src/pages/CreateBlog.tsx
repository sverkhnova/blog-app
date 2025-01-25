import React, { useState } from 'react';
import { Container, TextField, Button, Typography } from '@mui/material';

const CreateBlog: React.FC = () => {
  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [message, setMessage] = useState('');

  const handleCreateBlog = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('You are not authorized to create a blog.');
        return;
      }

      const response = await fetch('http://localhost:5000/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content, mediaUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.message}`);
        return;
      }

      setMessage('Blog created successfully!');
      setContent('');
      setMediaUrl('');
    } catch (error) {
      console.error('Error creating blog:', error);
      setMessage('Error creating blog.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Create Blog
      </Typography>
      {message && (
        <Typography color="error" gutterBottom>
          {message}
        </Typography>
      )}
      <TextField
        label="Content"
        multiline
        rows={4}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Media URL"
        value={mediaUrl}
        onChange={(e) => setMediaUrl(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleCreateBlog}
        style={{ marginTop: '20px' }}
      >
        Create Blog
      </Button>
    </Container>
  );
};

export default CreateBlog;
