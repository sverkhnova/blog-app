import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
} from '@mui/material';

const BlogList: React.FC = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('http://localhost:5000/blog');
        if (!response.ok) {
          throw new Error('Failed to fetch blogs');
        }
        const data = await response.json();
        setBlogs(data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setMessage('Error fetching blogs.');
      }
    };

    fetchBlogs();
  }, []); 

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Blog List
      </Typography>
      {message && (
        <Typography color="error" gutterBottom>
          {message}
        </Typography>
      )}
      <Grid container spacing={3}>
        {blogs.map((blog) => (
          <Grid item xs={12} sm={6} md={4} key={blog.id}>
            <Card>
              {blog.mediaUrl && (
                <CardMedia
                  component="img"
                  alt="Blog Media"
                  height="140"
                  image={blog.mediaUrl}
                />
              )}
              <CardContent>
                <Typography variant="h5">Blog #{blog.id}</Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {blog.content}
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  Author: {blog.author.username}
                </Typography>
                <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 2 }}>
                  Created At: {new Date(blog.createdAt).toLocaleString()}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate(`/edit-blog/${blog.id}`)}
                >
                  Edit Blog
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default BlogList;
