# Sweet Shop Management System

A full-stack web application for managing a sweet shop inventory, built with Node.js/Express backend and React frontend. This project demonstrates Test-Driven Development (TDD), RESTful API design, authentication, and modern frontend development practices.

# Tech Stack

## Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Jest** for testing
- **Supertest** for API testing

## Frontend
- **React 18** with Vite
- **React Router DOM** for routing
- **Axios** for API calls
- **Tailwind CSS** for styling

The backend will run on `http://localhost:5000`

The frontend will run on `http://localhost:3000`

## Testing

The backend includes a comprehensive test suite written with Jest:

```bash
cd backend
npm test
```

All tests follow TDD principles and cover:
- User authentication (register/login)
- Sweets CRUD operations
- Search functionality
- Purchase and restock operations
- Admin authorization
- Error handling

##  API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Sweets (Protected)
- `GET /api/sweets` - Get all sweets
- `POST /api/sweets` - Create a sweet (Admin only)
- `GET /api/sweets/search` - Search sweets
- `PUT /api/sweets/:id` - Update a sweet (Admin only)
- `DELETE /api/sweets/:id` - Delete a sweet (Admin only)

### Inventory (Protected)
- `POST /api/sweets/:id/purchase` - Purchase a sweet
- `POST /api/sweets/:id/restock` - Restock a sweet (Admin only)

## 🤖 My AI Usage

Throughout the development of this project, I leveraged AI tools to accelerate development, solve complex problems, and improve code quality. Here's a detailed breakdown of how AI assisted me:

### AI Tools Used

1. **Cursor AI** - Coding assistant integrated into my IDE
2. **ChatGPT** - For brainstorming, debugging, and architectural decisions

# How I Used AI Tools

**Debugging and Problem Solving**

**Cursor AI:**
- When tests were failing, I used Cursor to analyze error messages and suggest fixes
- Asked Cursor to help identify why MongoDB operations were timing out in tests
- Used Cursor to debug the JWT token generation issues and missing environment variables

**ChatGPT:**
- When I got stuck with the 500 errors during registration, I described the problem to ChatGPT and got suggestions on checking JWT_SECRET and MongoDB connection
- Asked ChatGPT to help understand why users were being created but login was failing
- Consulted ChatGPT about Tailwind CSS v4 migration issues and how to fix PostCSS configuration

