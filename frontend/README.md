# Sweet Shop Frontend

A modern React + Vite frontend application for the Sweet Shop Management System.

## Features

- ✅ User authentication (Login/Register)
- ✅ Dashboard with all sweets display
- ✅ Search and filter functionality (by name, category, price range)
- ✅ Purchase functionality (disabled when quantity is 0)
- ✅ Admin panel for managing sweets (Add, Update, Delete, Restock)
- ✅ Protected routes based on user role
- ✅ Responsive design with Tailwind CSS

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Backend Setup

Make sure the backend server is running on `http://localhost:5000` (configured in `vite.config.js`).

## Project Structure

```
frontend/
├── src/
│   ├── components/      # Reusable components
│   │   ├── Navbar.jsx
│   │   └── SweetCard.jsx
│   ├── contexts/        # React contexts
│   │   └── AuthContext.jsx
│   ├── pages/          # Page components
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── AdminPanel.jsx
│   ├── services/       # API services
│   │   └── api.js
│   ├── App.jsx         # Main app component with routing
│   └── main.jsx        # Entry point
├── tailwind.config.js  # Tailwind CSS configuration
└── vite.config.js      # Vite configuration
```

## Usage

1. **Register/Login**: Create an account or login with existing credentials
2. **Browse Sweets**: View all available sweets on the dashboard
3. **Search & Filter**: Use the search bar to find sweets by name, category, or price range
4. **Purchase**: Click the "Purchase" button to buy a sweet (disabled when out of stock)
5. **Admin Features**: If you're an admin, access the Admin Panel to:
   - Add new sweets
   - Edit existing sweets
   - Delete sweets
   - Restock inventory

## Technologies

- React 18
- Vite
- React Router DOM
- Axios
- Tailwind CSS



