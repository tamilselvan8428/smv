# Raja Snacks Wholesale Website

A modern wholesale snacks shop website with a hidden admin panel for product management.

## Features

- **Home Page**: Hero banner, featured snacks, about section
- **Products Page**: Responsive product grid with images, prices, and descriptions
- **Contact Page**: Contact form with business information
- **Hidden Admin Panel**: Accessible only at `/adminrajamani` with authentication
  - Add, Edit, Delete products
  - Upload product images
  - Secure login system

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- React Router

### Backend
- Node.js
- Express.js
- MongoDB
- Multer (for image uploads)

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (installed and running locally)
- npm or yarn

## Installation

### 1. Clone the repository (if not already cloned)

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd web
npm install
```

## Configuration

### Backend Configuration

The backend uses environment variables. Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/raja-snacks
ADMIN_USERNAME=admin
ADMIN_PASSWORD=rajamani123
```

### MongoDB Setup

Make sure MongoDB is running on your machine. The default connection string is:
```
mongodb://localhost:27017/raja-snacks
```

If you're using MongoDB Atlas or a different configuration, update the `MONGODB_URI` in the `.env` file.

## Running the Application

### Start the Backend

```bash
cd backend
npm start
```

The backend will run on `http://localhost:5000`

### Start the Frontend (in a new terminal)

```bash
cd web
npm run dev
```

The frontend will run on `http://localhost:5173` (or the port Vite assigns)

## Accessing the Website

- **Home Page**: `http://localhost:5173/`
- **Products**: `http://localhost:5173/products`
- **Contact**: `http://localhost:5173/contact`
- **Admin Panel**: `http://localhost:5173/adminrajamani`

## Admin Panel Credentials

- **Username**: `admin`
- **Password**: `rajamani123`

## API Endpoints

### Products

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get a single product
- `POST /api/products` - Create a new product (with image upload)
- `PUT /api/products/:id` - Update a product (with optional image upload)
- `DELETE /api/products/:id` - Delete a product

### Authentication

- `POST /api/auth/login` - Admin login

## Project Structure

```
shop/
├── backend/
│   ├── models/
│   │   └── Product.js          # MongoDB Product model
│   ├── routes/
│   │   ├── products.js         # Product API routes
│   │   └── auth.js             # Authentication routes
│   ├── uploads/                # Uploaded product images
│   ├── .env                    # Environment variables
│   ├── package.json
│   └── server.js               # Express server
├── web/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navigation.jsx  # Navigation bar
│   │   │   └── Footer.jsx      # Footer component
│   │   ├── pages/
│   │   │   ├── Home.jsx        # Home page
│   │   │   ├── Products.jsx    # Products page
│   │   │   ├── Contact.jsx     # Contact page
│   │   │   └── Admin.jsx       # Admin panel
│   │   ├── App.jsx             # Main app with routing
│   │   ├── main.jsx            # React entry point
│   │   └── index.css           # Tailwind CSS
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
└── README.md
```

## Features in Detail

### Home Page
- Attractive hero section with call-to-action buttons
- Featured products section (displays first 4 products)
- About section highlighting business values
- Responsive design for all screen sizes

### Products Page
- Grid layout displaying all products
- Product cards with images, names, prices, and descriptions
- Hover effects and smooth transitions
- Empty state when no products exist

### Contact Page
- Contact form with validation
- Business information display
- Placeholder for Google Maps integration
- Responsive layout

### Admin Panel
- Secure login system
- Product management table
- Add/Edit product form with image upload
- Delete confirmation
- Responsive design

## Image Upload

- Supported formats: JPEG, JPG, PNG, WebP
- Maximum file size: 5MB
- Images are stored in `backend/uploads/` directory
- Images are served via `/uploads` static route

## Development

### Backend Development

For development with auto-reload:
```bash
cd backend
npm run dev
```

### Frontend Development

```bash
cd web
npm run dev
```

## Production Build

### Frontend Build

```bash
cd web
npm run build
```

The built files will be in the `web/dist` directory.

### Backend Production

The backend is production-ready. You may want to:
1. Use a process manager like PM2
2. Set up proper CORS for your domain
3. Use environment variables for sensitive data
4. Set up a proper MongoDB connection (Atlas for cloud)

## Troubleshooting

### MongoDB Connection Error

Make sure MongoDB is running:
- Windows: Start MongoDB service
- Mac/Linux: `sudo systemctl start mongod` or `mongod`

### Port Already in Use

If port 5000 is in use, change the PORT in the `.env` file.

### CORS Issues

The backend is configured to allow CORS from all origins. For production, update the CORS configuration in `server.js`.

### Image Upload Not Working

- Ensure the `uploads` directory exists in the backend
- Check file size (max 5MB)
- Verify file format (JPEG, JPG, PNG, WebP)

## Future Enhancements

- User authentication and registration
- Shopping cart functionality
- Order management system
- Payment gateway integration
- Product categories and filters
- Search functionality
- Review and rating system
- Email notifications
- Advanced admin analytics

## License

This project is for demonstration purposes.

## Support

For issues or questions, please contact the development team.
