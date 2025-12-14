# Environment Variables Setup

The backend requires a `.env` file in the `backend` directory with the following variables:

## Required Variables

1. **MONGO_URI** - Your MongoDB connection string
   - For MongoDB Atlas: `mongodb+srv://username:password@cluster.mongodb.net/database-name`
   - For local MongoDB: `mongodb://localhost:27017/sweet-shop`

2. **JWT_SECRET** - A secret key for signing JWT tokens
   - Use a long, random string (at least 32 characters)
   - Example: `my-super-secret-jwt-key-change-this-in-production-12345`

3. **PORT** (optional) - Server port (defaults to 5000)
   - Example: `5000`

## Example .env file

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/sweet-shop
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
PORT=5000
```

## Setup Instructions

1. Open the `.env` file in the `backend` directory
2. Replace `your-mongodb-connection-string-here` with your actual MongoDB Atlas connection string
3. Replace `your-super-secret-jwt-key-change-this-in-production` with a secure random string
4. Save the file
5. Restart your backend server

## Security Note

- Never commit the `.env` file to version control
- Use different JWT_SECRET values for development and production
- Keep your MongoDB credentials secure



