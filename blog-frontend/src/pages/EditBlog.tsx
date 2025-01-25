import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box } from '@mui/material';

const EditBlog: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Fetch blog details
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`http://localhost:5000/blog/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch blog');
        }
        const data = await response.json();

        console.log('Fetched Blog:', data);

        setContent(data.content || '');
        setMediaUrl(data.mediaUrl || '');
        setCreatedAt(data.createdAt || null);
        setUpdatedAt(data.updatedAt || null);
      } catch (error) {
        console.error('Error fetching blog:', error);
        setMessage('Error fetching blog.');
      }
    };

    fetchBlog();
  }, [id]);

  // Update blog
  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/blog/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content, mediaUrl }),
      });

      if (!response.ok) {
        throw new Error('Failed to update blog');
      }

      const data = await response.json();
      setUpdatedAt(data.blogPost.updatedAt || null); 
      setMessage('Blog updated successfully!');
      setTimeout(() => navigate('/blogs'), 1500);
    } catch (error) {
      console.error('Error updating blog:', error);
      setMessage('Error updating blog.');
    }
  };

  // Delete blog
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/blog/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete blog');
      }

      setMessage('Blog deleted successfully!');
      setTimeout(() => navigate('/blogs'), 1500);
    } catch (error) {
      console.error('Error deleting blog:', error);
      setMessage('Error deleting blog.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Edit Blog
        </Typography>
        {message && (
          <Typography color={message.startsWith('Error') ? 'error' : 'primary'} gutterBottom>
            {message}
          </Typography>
        )}
        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
          Created At:{' '}
          {createdAt ? new Date(createdAt).toLocaleString() : 'Date not available'}
        </Typography>
        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
          Last Updated At:{' '}
          {updatedAt ? new Date(updatedAt).toLocaleString() : 'Date not available'}
        </Typography>
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
        <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleUpdate}>
          Save Changes
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleDelete}
          sx={{ mt: 2, ml: 2 }}
        >
          Delete Blog
        </Button>
      </Box>
    </Container>
  );
};

export default EditBlog;
