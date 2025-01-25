import express from 'express';
import cors from 'cors';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { AppDataSource } from './data-source';
import { User } from './entity/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { BlogPost } from './entity/BlogPost';
import { authenticateToken } from './middleware/authenticateToken';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

// Swagger options
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Blog API',
      version: '1.0.0',
      description: 'API documentation for the Blog application',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        BlogPost: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            content: { type: 'string', example: 'This is a blog post' },
            mediaUrl: { type: 'string', example: 'http://example.com/image.jpg' },
            createdAt: { type: 'string', format: 'date-time', example: '2025-01-25T13:49:57.869Z' },
            author: { $ref: '#/components/schemas/User' },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            username: { type: 'string', example: 'testuser' },
            isAdmin: { type: 'boolean', example: false },
          },
        },
      },
    },
  },
  apis: ['./src/index.ts'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

AppDataSource.initialize()
  .then(() => {
    console.log('Database connected');
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });

/**
 * Authentication Routes
 */

// Примеры API
/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: User already exists
 */

app.post('/register', async (req, res) => {
  const { username, password, isAdmin = false } = req.body;
  try {
    const userRepository = AppDataSource.getRepository(User);
    const existingUser = await userRepository.findOneBy({ username });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User();
    user.username = username;
    user.password = hashedPassword;
    user.isAdmin = isAdmin;
    await userRepository.save(user);
    res.status(201).json({ message: 'User registered successfully!', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering user' });
  }
});


/**
 * @swagger
 * /login:
 *   post:
 *     summary: Log in a user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Invalid credentials
 */

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ username });
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }
    const tokenPayload = { id: user.id, username: user.username, isAdmin: user.isAdmin };
    const token = jwt.sign(tokenPayload, 'your_jwt_secret', { expiresIn: '1h' });
    res.status(200).json({ token, id: user.id, username: user.username, isAdmin: user.isAdmin });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

/**
 * Blog Routes
 */

/**
 * @swagger
 * /blog:
 *   post:
 *     summary: Create a new blog post
 *     tags:
 *       - Blogs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BlogPost'
 *     responses:
 *       201:
 *         description: Blog post created successfully
 *       500:
 *         description: Error creating blog post
 */

app.post('/blog', authenticateToken, async (req, res) => {
  const { content, mediaUrl } = req.body;
  const user = (req as any).user;
  try {
    const blogRepository = AppDataSource.getRepository(BlogPost);
    const blogPost = new BlogPost();
    blogPost.content = content;
    blogPost.mediaUrl = mediaUrl;
    blogPost.author = user;
    await blogRepository.save(blogPost);
    res.status(201).json({ message: 'Blog post created', blogPost });
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).json({ message: 'Error creating blog post' });
  }
});

app.get('/blog', async (req, res) => {
  try {
    const blogRepository = AppDataSource.getRepository(BlogPost);
    const blogs = await blogRepository.find({ relations: ['author'] });
    res.status(200).json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ message: 'Error fetching blogs' });
  }
});

app.get('/blog/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const blogRepository = AppDataSource.getRepository(BlogPost);

    const blog = await blogRepository.findOne({
      where: { id: Number(id) },
      relations: ['author'],
    });

    if (!blog) {
      res.status(404).json({ message: 'Blog post not found' });
      return;
    }

    res.status(200).json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ message: 'Error fetching blog' });
  }
});

app.put('/blog/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { content, mediaUrl } = req.body;
  const user = (req as any).user;
  try {
    const blogRepository = AppDataSource.getRepository(BlogPost);
    const blogPost = await blogRepository.findOne({
      where: { id: Number(id) },
      relations: ['author'],
    });
    if (!blogPost) {
      res.status(404).json({ message: 'Blog post not found' });
      return;
    }
    if (blogPost.author.id !== user.id && !user.isAdmin) {
      res.status(403).json({ message: 'Not authorized to edit this post' });
      return;
    }
    blogPost.content = content || blogPost.content;
    blogPost.mediaUrl = mediaUrl || blogPost.mediaUrl;
    await blogRepository.save(blogPost);
    res.status(200).json({ message: 'Blog post updated', blogPost });
  } catch (error) {
    console.error('Error updating blog post:', error);
    res.status(500).json({ message: 'Error updating blog post' });
  }
});

/**
 * @swagger
 * /blog/{id}:
 *   delete:
 *     summary: Delete a blog post
 *     tags:
 *       - Blogs
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           description: ID of the blog post
 *     responses:
 *       200:
 *         description: Blog deleted successfully
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Error deleting blog
 */

app.delete('/blog/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const user = (req as any).user;
  try {
    const blogRepository = AppDataSource.getRepository(BlogPost);
    const blogPost = await blogRepository.findOne({
      where: { id: Number(id) },
      relations: ['author'],
    });
    if (!blogPost) {
      res.status(404).json({ message: 'Blog post not found' });
      return;
    }
    if (blogPost.author.id !== user.id && !user.isAdmin) {
      res.status(403).json({ message: 'Not authorized to delete this post' });
      return;
    }
    await blogRepository.remove(blogPost);
    res.status(200).json({ message: 'Blog post deleted successfully!' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({ message: 'Error deleting blog post' });
  }
});
