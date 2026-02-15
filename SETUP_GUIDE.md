# MedVault - Setup and Installation Guide

## Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or cloud)
- Git

## Backend Installation

### Step 1: Install MongoDB
- **Option A (Local)**: Download and install from https://www.mongodb.com/try/download/community
- **Option B (Cloud)**: Use MongoDB Atlas at https://www.mongodb.com/cloud/atlas

### Step 2: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 3: Configure Environment Variables
Create `.env` file in the backend directory:
```
MONGODB_URI=mongodb://localhost:27017/medvault
JWT_SECRET=medvault_secret_key_2024
PORT=5000
NODE_ENV=development
NODEMAILER_EMAIL=your_email@gmail.com
NODEMAILER_PASSWORD=your_app_password
YOPMAIL_API_KEY=your_yopmail_key
FRONTEND_URL=http://localhost:3000
```

### Step 4: Start MongoDB
```bash
# For Windows (if installed locally)
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe"

# For macOS
brew services start mongodb-community

# For Linux
sudo systemctl start mongodb
```

### Step 5: Run Backend Server
```bash
npm start
# or with nodemon (auto-reload)
npm run dev
```

Backend will be available at: `http://localhost:5000`

## Frontend Installation

### Step 1: Install Frontend Dependencies
```bash
cd frontend
npm install
```

### Step 2: Configure Environment Variables
Create `.env` file in the frontend directory:
```
REACT_APP_API_URL=http://localhost:5000/api
```

### Step 3: Start Frontend Development Server
```bash
npm start
```

Frontend will open at: `http://localhost:3000`

## Testing the Application

### 1. Register as a Patient
1. Go to http://localhost:3000/signup
2. Select "Patient" as account type
3. Use email like: `yourname@yopmail.com`
4. Fill in all required fields
5. Click "Sign Up"

### 2. Email Verification
1. After registration, you'll see "Please verify your email"
2. Get verification code from console or email service
3. Verify your email using the link

### 3. Login
1. Go to http://localhost:3000/login
2. Use your registered email and password
3. You'll be redirected to Patient Dashboard

### 4. Register as Healthcare Professional
1. Repeat signup process
2. Select "Healthcare Professional" as account type
3. After login, access Professional Dashboard

## API Testing

### Using Postman or cURL

#### Register User
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@yopmail.com",
    "password": "password123",
    "confirmPassword": "password123",
    "phoneNumber": "+1234567890",
    "role": "patient"
  }'
```

#### Login User
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@yopmail.com",
    "password": "password123"
  }'
```

#### Get Current User (Requires Auth Token)
```bash
curl -X GET http://localhost:5000/api/users/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Yop Mail Integration

Yop Mail is a free temporary email service perfect for testing:

1. **Create Email**: Use format `anyname@yopmail.com`
2. **Check Email**: Go to https://yopmail.com/
3. **Check Inbox**: Enter your email prefix (before @)
4. **View Verification Link**: Emails appear instantly

## Troubleshooting

### Backend Issues
- **Port 5000 already in use**: Change PORT in .env file
- **MongoDB connection failed**: Ensure MongoDB service is running
- **Email not sending**: Check email credentials in .env file

### Frontend Issues
- **Cannot connect to backend**: Ensure backend is running on port 5000
- **API URL issues**: Check REACT_APP_API_URL in .env file
- **Port 3000 in use**: Kill process or run on different port: `PORT=3001 npm start`

### Email Verification Issues
- Use Yop Mail for testing (free and instant)
- Check email spam folder
- Verify email configuration in backend .env file

## Project Structure

```
medvault/
├── backend/
│   ├── config/          # Configuration files
│   ├── controllers/     # Business logic
│   ├── middleware/      # Express middleware
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── .env             # Environment variables
│   ├── .gitignore
│   ├── package.json
│   └── server.js        # Entry point
├── frontend/
│   ├── public/          # Static files
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── context/     # React context
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   ├── styles/      # CSS files
│   │   ├── App.js       # Main App component
│   │   └── index.js     # Entry point
│   ├── .env             # Environment variables
│   ├── .gitignore
│   └── package.json
└── README.md
```

## Features Overview

### Authentication
- User registration with email verification
- Secure login with JWT tokens
- Password encryption
- Role-based access (Patient/Professional)

### Patient Features
- Profile management
- Health information storage
- Find and connect with doctors
- Book appointments
- View medical records

### Professional Features
- Professional profile setup
- Manage patient list
- Schedule appointments
- Create prescriptions
- View patient medical records

## Security Best Practices

1. **Never commit .env files** to version control
2. **Use strong passwords** for your accounts
3. **Change JWT_SECRET** in production
4. **Use HTTPS** in production
5. **Validate all inputs** on client and server
6. **Keep dependencies updated**: `npm update`

## Performance Tips

1. **Clear browser cache** if styles aren't loading
2. **Restart backend** if getting connection errors
3. **Check network tab** for API call issues
4. **Use MongoDB indexes** for faster queries
5. **Optimize images** before uploading

## Next Steps

After successful setup:
1. Explore the dashboard features
2. Test appointment booking (when available)
3. Upload medical records (when available)
4. Invite other users to test the system
5. Review and test all API endpoints

## Support

For issues or questions:
1. Check the console for error messages
2. Review the README.md file
3. Check browser's Network tab for API errors
4. Verify all environment variables are set correctly

## Production Deployment

When ready for production:
1. Update environment variables with production URLs
2. Use a production database (MongoDB Atlas recommended)
3. Set NODE_ENV=production
4. Use HTTPS instead of HTTP
5. Configure proper CORS settings
6. Set up email service (Gmail, SendGrid, etc.)
7. Deploy backend and frontend to hosting services

## Version History

- **v1.0.0** - Initial Milestone 1 release
  - Database design and user management
  - Authentication system
  - Login and signup pages
  - Patient and professional dashboards
  - Email verification

---

**Project**: MedVault - Personal Electronic Health Record System
**Status**: Milestone 1 Complete - Ready for Milestone 2
**Last Updated**: February 2026
