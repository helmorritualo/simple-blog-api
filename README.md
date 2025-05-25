# Simple Blog API

A RESTful API for a blog application built with Node.js, TypeScript, Hono framework, and MongoDB. This API provides complete functionality for user authentication, blog post management, comments, and file uploads.

## 🚀 Features

- **User Authentication**: Register, login with JWT tokens
- **User Management**: Profile management with profile picture upload
- **Blog Posts**: CRUD operations with thumbnail image upload
- **Comments**: Add and manage comments on blog posts
- **File Upload**: Support for profile pictures and blog thumbnails
- **Input Validation**: Comprehensive data validation using Zod
- **Error Handling**: Centralized error handling with custom error types
- **CORS Support**: Cross-origin resource sharing enabled
- **Static File Serving**: Serve uploaded images

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Hono
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Zod
- **Password Hashing**: bcrypt
- **File Upload**: Custom file upload middleware

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

## ⚙️ Installation & Setup

1. **Clone the repository**

   ```bash
   git clone [<repository-url>](https://github.com/helmorritualo/simple-blog-api.git)
   cd simple-blog-api
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**

   Create a `.env` file in the root directory and add the following variables:

   ```env
     PORT=
     JWT_SECRET=
     MONGO_URL=
     NODE_ENV=development
   ```

   **Environment Variables Explanation:**

   - `PORT`: Server por
   - `JWT_SECRET`: Secret key for JWT token generation (use a strong, random string)
   - `MONGO_URL`: MongoDB connection string
   - `NODE_ENV`: Environment mode (development/production)

4. **Run the application**

   **Development mode (with hot reload):**

   ```bash
   npm run dev
   ```

The server will start on `http://localhost:3000` (or your specified PORT).

## 📚 API Documentation

### Base URL

```
http://localhost:5000/api/v1
```

### Authentication

All endpoints except login and register require a Bearer token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Authentication Endpoints

### Register User

**POST** `/auth/register`

Register a new user account.

**Request Body:**

```json
{
  "full_name": "John Doe",
  "email": "john@example.com",
  "username": "johndoe",
  "password": "password123",
  "gender": "male"
}
```

**Validation Rules:**

- `full_name`: Required, minimum 1 character
- `email`: Required, valid email format
- `username`: Required, minimum 4 characters
- `password`: Required, minimum 6 characters
- `gender`: Required, must be "male" or "female"

**Response (201):**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "user_id",
      "full_name": "John Doe",
      "email": "john@example.com",
      "username": "johndoe",
      "gender": "male",
      "profile_picture": "https://avatar.iran.liara.run/public/boy",
      "createdAt": "2023-12-01T10:00:00.000Z",
      "updatedAt": "2023-12-01T10:00:00.000Z"
    }
  }
}
```

### Login User

**POST** `/auth/login`

Authenticate user and receive JWT token.

**Request Body:**

```json
{
  "username": "johndoe",
  "password": "password123"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "User logged in successfully",
  "data": {
    "user": {
      "_id": "user_id",
      "full_name": "John Doe",
      "email": "john@example.com",
      "username": "johndoe",
      "gender": "male",
      "profile_picture": "https://avatar.iran.liara.run/public/boy"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## 👤 User Management Endpoints

### Get User Profile

**GET** `/users/profile`

Get current user's profile information.

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "user_id",
      "full_name": "John Doe",
      "email": "john@example.com",
      "username": "johndoe",
      "gender": "male",
      "profile_picture": "/uploads/profile-pictures/profile-123456789.jpg"
    }
  }
}
```

### Update User Profile

**PUT** `/users/profile`

Update user profile information and/or profile picture.

**Headers:**

```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**

- `full_name` (optional): New full name
- `email` (optional): New email address
- `username` (optional): New username
- `gender` (optional): "male" or "female"
- `profilePicture` (optional): Image file (max 5MB)

**Validation Rules:**

- At least one field must be provided
- `email`: Valid email format
- `username`: Minimum 4 characters
- `gender`: Must be "male" or "female"
- `profilePicture`: Image files only, max 5MB

**Response (201):**

```json
{
  "success": true,
  "message": "User profile updated successfully",
  "data": {
    "user": {
      "_id": "user_id",
      "full_name": "John Smith",
      "email": "johnsmith@example.com",
      "username": "johnsmith",
      "gender": "male",
      "profile_picture": "/uploads/profile-pictures/profile-123456789.jpg"
    }
  }
}
```

### Update Password

**PATCH** `/users/password`

Update user password.

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "old_password": "currentpassword",
  "new_password": "newpassword123"
}
```

**Validation Rules:**

- `old_password`: Required, must match current password
- `new_password`: Required, minimum 6 characters, cannot be same as old password

**Response (200):**

```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

---

## 📝 Blog Posts Endpoints

### Get All Blog Posts

**GET** `/blog-posts`

Retrieve all blog posts with author information.

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "_id": "post_id",
      "title": "My First Blog Post",
      "content": "This is the content of my blog post...",
      "thumbnail": "/uploads/thumbnails/thumbnail-123456789.jpg",
      "postedBy": {
        "_id": "user_id",
        "full_name": "John Doe",
        "profile_picture": "/uploads/profile-pictures/profile-123456789.jpg"
      },
      "createdAt": "2023-12-01T10:00:00.000Z",
      "updatedAt": "2023-12-01T10:00:00.000Z"
    }
  ]
}
```

### Get Blog Post by ID

**GET** `/blog-posts/:id`

Retrieve a specific blog post by its ID.

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "_id": "post_id",
    "title": "My First Blog Post",
    "content": "This is the content of my blog post...",
    "thumbnail": "/uploads/thumbnails/thumbnail-123456789.jpg",
    "postedBy": {
      "_id": "user_id",
      "full_name": "John Doe",
      "profile_picture": "/uploads/profile-pictures/profile-123456789.jpg"
    },
    "createdAt": "2023-12-01T10:00:00.000Z",
    "updatedAt": "2023-12-01T10:00:00.000Z"
  }
}
```

### Create Blog Post

**POST** `/blog-posts`

Create a new blog post with optional thumbnail image.

**Headers:**

```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**

- `title` (required): Blog post title (min 6 characters)
- `content` (required): Blog post content (min 10 characters)
- `thumbnail` (optional): Image file (max 5MB)

**Response (201):**

```json
{
  "success": true,
  "message": "Blog post created successfully",
  "data": {
    "_id": "post_id",
    "title": "My New Blog Post",
    "content": "This is the content...",
    "thumbnail": "/uploads/thumbnails/thumbnail-123456789.jpg",
    "postedBy": "user_id",
    "createdAt": "2023-12-01T10:00:00.000Z",
    "updatedAt": "2023-12-01T10:00:00.000Z"
  }
}
```

### Update Blog Post

**PUT** `/blog-posts/:id`

Update an existing blog post.

**Headers:**

```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**

- `title` (optional): New blog post title (min 6 characters)
- `content` (optional): New blog post content (min 10 characters)
- `thumbnail` (optional): New image file (max 5MB)

**Validation Rules:**

- At least one field must be provided
- If provided, `title` must be at least 6 characters
- If provided, `content` must be at least 10 characters

**Response (201):**

```json
{
  "success": true,
  "message": "Blog post updated successfully",
  "data": {
    "_id": "post_id",
    "title": "Updated Blog Post Title",
    "content": "Updated content...",
    "thumbnail": "/uploads/thumbnails/thumbnail-987654321.jpg",
    "postedBy": "user_id",
    "createdAt": "2023-12-01T10:00:00.000Z",
    "updatedAt": "2023-12-01T11:00:00.000Z"
  }
}
```

### Delete Blog Post

**DELETE** `/blog-posts/:id`

Delete a blog post and its associated comments.

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "success": true,
  "message": "Blog post deleted successfully"
}
```

---

## 💬 Comments Endpoints

### Get Comments by Blog Post ID

**GET** `/blog-posts/:blog_id/comments`

Get all comments for a specific blog post.

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "_id": "comment_id",
      "comment": "Great blog post!",
      "blog_id": "blog_post_id",
      "postedBy": {
        "_id": "user_id",
        "full_name": "Jane Doe",
        "profile_picture": "/uploads/profile-pictures/profile-123456789.jpg"
      },
      "createdAt": "2023-12-01T10:30:00.000Z",
      "updatedAt": "2023-12-01T10:30:00.000Z"
    }
  ]
}
```

### Add Comment

**POST** `/blog-posts/:blog_id/comments`

Add a new comment to a blog post.

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "comment": "This is a great blog post!"
}
```

**Validation Rules:**

- `comment`: Required, cannot be empty

**Response (201):**

```json
{
  "success": true,
  "message": "Comment added successfully",
  "data": {
    "_id": "comment_id",
    "comment": "This is a great blog post!",
    "blog_id": "blog_post_id",
    "postedBy": "user_id",
    "createdAt": "2023-12-01T10:30:00.000Z",
    "updatedAt": "2023-12-01T10:30:00.000Z"
  }
}
```

### Delete Comment

**DELETE** `/blog-posts/:comment_id/comments`

Delete a comment (only comment owner can delete).

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "success": true,
  "message": "Comment deleted successfully"
}
```

---

## 📁 File Upload

### Supported File Types

- **Profile Pictures**: Image files (JPEG, PNG, GIF, WebP)
- **Blog Thumbnails**: Image files (JPEG, PNG, GIF, WebP)

### File Size Limits

- **Profile Pictures**: Maximum 5MB
- **Blog Thumbnails**: Maximum 5MB

### File Storage

- Files are stored in the `uploads/` directory
- Profile pictures: `uploads/profile-pictures/`
- Blog thumbnails: `uploads/thumbnails/`
- Files are accessible via: `http://localhost:${port}/uploads/folder/filename`

---

## 🔧 Testing

### Using the Test Interface

The project includes HTML test interfaces:

1. **Main Blog API Tester** (`test-blog-api.html`)

   - Open in browser: `file:///path/to/test-blog-api.html`
   - Test all blog post and authentication endpoints
   - Interactive UI for testing API functionality

2. **Profile Upload Tester** (`test-profile-upload.html`)
   - Open in browser: `file:///path/to/test-profile-upload.html`
   - Test user profile management and file uploads

### Using HTTP Client

You can also use the `api-testing.http` file with VS Code REST Client extension or any HTTP client like Postman, Insomnia, or curl.

### Example API Usage

1. **Register a new user:**

   ```bash
   curl -X POST http://localhost:5000/api/v1/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "full_name": "Test User",
       "email": "test@example.com",
       "username": "testuser",
       "password": "password123",
       "gender": "male"
     }'
   ```

2. **Login and get token:**

   ```bash
   curl -X POST http://localhost:5000/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "username": "testuser",
       "password": "password123"
     }'
   ```

3. **Create a blog post:**
   ```bash
   curl -X POST http://localhost:5000/api/v1/blog-posts \
     -H "Authorization: Bearer YOUR_TOKEN_HERE" \
     -F "title=My First Post" \
     -F "content=This is my first blog post content" \
     -F "thumbnail=@/path/to/image.jpg"
   ```

---

## 📂 Project Structure

```
simple-blog-api/
├── src/
│   ├── config/
│   │   ├── database.ts          # MongoDB connection
│   │   └── env.ts               # Environment variables
│   ├── controllers/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   └── route.ts
│   │   ├── blog-post/
│   │   │   ├── blog-post.controller.ts
│   │   │   └── route.ts
│   │   ├── comment/
│   │   │   ├── comment.controller.ts
│   │   │   └── route.ts
│   │   ├── user/
│   │   │   ├── user.controller.ts
│   │   │   └── route.ts
│   │   └── routes.ts            # Route aggregation
│   ├── middlewares/
│   │   ├── authentication.ts    # JWT authentication
│   │   ├── auth-validator.ts    # Auth validation
│   │   ├── blog-post-validator.ts
│   │   ├── comment-validator.ts
│   │   ├── user-validator.ts
│   │   ├── file-upload.ts       # File upload handling
│   │   └── error-handler.ts     # Global error handling
│   ├── models/
│   │   ├── user.model.ts        # User schema
│   │   ├── blog-post.model.ts   # Blog post schema
│   │   └── comment.model.ts     # Comment schema
│   ├── services/
│   │   └── user.service.ts      # User business logic
│   ├── utils/
│   │   └── error.ts             # Custom error classes
│   └── index.ts                 # Application entry point
├── uploads/                     # File upload directory
│   ├── profile-pictures/
│   └── thumbnails/
├── test-blog-api.html          # API testing interface
├── test-profile-upload.html    # Profile testing interface
├── api-testing.http            # HTTP requests for testing
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

---

## 🚦 Error Handling

The API uses consistent error response format:

```json
{
  "success": false,
  "message": "Error description"
}
```

### Common HTTP Status Codes

- **200 OK**: Successful GET, DELETE requests
- **201 Created**: Successful POST, PUT requests
- **400 Bad Request**: Invalid input data, validation errors
- **401 Unauthorized**: Missing or invalid authentication token
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server-side errors

---

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Comprehensive validation using Zod
- **File Upload Security**: File type and size validation
- **CORS Configuration**: Controlled cross-origin access
- **Error Sanitization**: Sensitive information is not exposed

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📧 Support

If you have any questions or need help with setup, please create an issue in the repository.
