# KuKu's Blog backend server 

## Overview
KuKu's Blog API is a RESTful Node API that allows users to create, view, edit, and delete blog posts. It supports authentication using JWT, user role-based restrictions, and media storage via Cloudinary. The API is built using **Node.js, Express.js, MongoDB (via Mongoose), and Cloudinary**.

## Features
- User authentication (Signup & Signin) with JWT
- Role-based access control
- CRUD operations for blog posts
- Cloudinary integration for image uploads
- Search functionality for posts
- User management with protected routes

---

## Installation

### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Cloudinary Account](https://cloudinary.com/)

### Clone Repository
```sh
git clone https://github.com/yourusername/kuku-api.git
cd kuku-api
```

### Install Dependencies
```sh
npm install
```

### Environment Variables
Create a `.env` file and configure the following:
```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRES=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## Running the Server

### Development Mode
```sh
npm run dev
```

### Production Mode
```sh
npm start
```

---

## API Endpoints

### Authentication Routes
| Method | Endpoint  | Description |
|--------|----------|-------------|
| POST   | `/v1/auth/signup` | Register a new user |
| POST   | `/v1/auth/signin` | Authenticate and get a token |

### Post Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/v1/posts/create` | Create a new post (Auth required) |
| GET    | `/v1/posts/view` | View all posts |
| GET    | `/v1/posts/:id` | View a single post by ID |
| GET    | `/v1/posts/search/:value` | Search posts by title, tags, categories, or user |
| PUT    | `/v1/posts/edit` | Edit an existing post |
| DELETE | `/v1/posts/:id` | Delete a post |

### User Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/v1/users/` | Get all users (Admin only) |
| GET    | `/v1/users/:id` | Get a user by ID |

---

## Middleware
### Authentication Middleware
- **verify**: Protects routes and ensures only authenticated users can access certain features.
- **restrict**: Ensures only admin users can access certain endpoints.

---

## Cloudinary Image Upload Process
### Steps to Upload an Image
1. Install Cloudinary SDK:
   ```sh
   npm install cloudinary
   ```
2. Configure Cloudinary in `config/cloudinary.js`:
   ```js
   import { v2 as cloudinary } from 'cloudinary';

   cloudinary.config({
     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
     api_key: process.env.CLOUDINARY_API_KEY,
     api_secret: process.env.CLOUDINARY_API_SECRET,
   });

   export default cloudinary;
   ```
3. Modify the `createPost` function to handle image uploads:
   ```js
   import cloudinary from '../config/cloudinary.js';
   import Post from '../models/post.model.js';

   export const createPost = async (req, res, next) => {
     try {
       const { title, content } = req.body;
       let imageUrl = '';

       if (req.file) {
         const uploadResponse = await cloudinary.uploader.upload(req.file.path);
         imageUrl = uploadResponse.secure_url;
       }

       const newPost = new Post({
         title,
         content,
         image: imageUrl,
         user: req.user._id,
       });

       await newPost.save();

       res.status(201).json({ success: true, data: newPost });
     } catch (error) {
       next(error);
     }
   };
   ```

---

## Error Handling
- Uses Express error-handling middleware to catch and respond to errors.
- Ensures consistent error messages with proper HTTP status codes.

---

## Contribution
1. Fork the repository.
2. Create a new branch (`feature/your-feature`).
3. Commit your changes.
4. Push to your fork.
5. Open a pull request.

---

## License
This project is licensed under the MIT License.

