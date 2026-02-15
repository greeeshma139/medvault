# MedVault - Quick Start Guide

## ⚡ Quick Start (5 Minutes)

### Prerequisites
- Node.js installed
- MongoDB running locally or MongoDB Atlas account

### 1️⃣ Clone and Setup Backend
```bash
cd backend
npm install
```

**Create `.env` file:**
```
MONGODB_URI=mongodb://localhost:27017/medvault
JWT_SECRET=medvault_secret_key
PORT=5000
NODEMAILER_EMAIL=your_email@gmail.com
NODEMAILER_PASSWORD=your_app_password
FRONTEND_URL=http://localhost:3000
```

**Start Backend:**
```bash
npm start
```
✅ Backend running on `http://localhost:5000`

### 2️⃣ Setup Frontend
```bash
cd frontend
npm install
```

**Create `.env` file:**
```
REACT_APP_API_URL=http://localhost:5000/api
```

**Start Frontend:**
```bash
npm start
```
✅ Frontend running on `http://localhost:3000`

---

## 🧪 Test It Out

### Create a Test Account
1. Go to http://localhost:3000/signup
2. Fill in details (use email like `test@yopmail.com`)
3. Select "Patient" or "Professional"
4. Click "Sign Up"

### Verify Email
1. Check https://yopmail.com/
2. Enter your email prefix
3. Click the verification link
4. Email verified! ✅

### Login
1. Go to http://localhost:3000/login
2. Use your email and password
3. Access your dashboard!

---

## 📁 Project Structure

```
backend/
├── models/        → Database schemas
├── routes/        → API endpoints
├── controllers/   → Business logic
├── middleware/    → Auth & validators
└── server.js      → Start here

frontend/
├── pages/         → Login, Dashboard, etc.
├── components/    → Reusable components
├── services/      → API calls
└── App.js         → Main component
```

---

## 🔑 Key Files to Know

### Backend
- `server.js` - Main server file
- `config/database.js` - MongoDB connection
- `routes/userRoutes.js` - User endpoints
- `middleware/authMiddleware.js` - JWT verification

### Frontend
- `App.js` - Main routes
- `context/AuthContext.js` - Auth state management
- `pages/Login.js` - Login page
- `pages/PatientDashboard.js` - Patient interface

---

## 🐛 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Port 5000 in use | Change PORT in .env |
| MongoDB not found | Start MongoDB service |
| API calls failing | Check REACT_APP_API_URL |
| CORS errors | Verify backend CORS config |
| Email not working | Check email credentials |

---

## 📚 Available API Endpoints

### User Routes
- `POST /api/users/register` - Sign up
- `POST /api/users/login` - Sign in
- `GET /api/users/verify-email/:token` - Verify email
- `GET /api/users/me` - Current user (protected)

### Patient Routes
- `GET /api/patients/profile` - Get profile (protected)
- `PUT /api/patients/profile` - Update profile (protected)

### Professional Routes
- `GET /api/professionals` - Get all doctors
- `GET /api/professionals/:id` - Get doctor details

---

## 🚀 Next Steps

After setup and testing:
1. ✅ Verify both signup and login work
2. ✅ Test email verification with Yop Mail
3. ✅ Create patient and professional accounts
4. ✅ Explore dashboards
5. ⏭️ Ready for Milestone 2 (Appointments)

---

## 💡 Tips

- Use **Yop Mail** for instant email testing
- Check **Network tab** in DevTools for API errors
- Use **MongoDB Compass** to view database
- Keep both servers running in separate terminals

---

## 📞 Need Help?

- Check SETUP_GUIDE.md for detailed setup
- Review README.md for full documentation
- Check .env.example files for configuration

---

**Happy Testing!** 🎉
