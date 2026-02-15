# MedVault - Personal Electronic Health Record System

## Project Overview
MedVault is a comprehensive web-based Personal Electronic Health Record (EHR) system that enables patients to securely store, manage, and exchange their medical records with healthcare professionals. The system empowers patients by allowing them to track their medical history, receive health reminders, and communicate efficiently with doctors or hospitals.

## Milestone 1 - Database Design & User Management Module (COMPLETED)

### Features Implemented:

#### 1. Database Design
- **User Model**: Core user authentication with roles (patient/professional)
- **Patient Model**: Patient profile with medical information
- **Professional Model**: Healthcare professional profile with specialization
- **Medical Record Model**: Secure medical records storage

#### 2. User Management
- User registration with email verification
- Secure login authentication with JWT tokens
- Password encryption with bcryptjs
- Email verification via Yop Mail compatible system
- Role-based access control (Patient/Professional)

#### 3. Authentication System
- JWT token-based authentication
- Secure password hashing
- Email verification workflow
- Protected routes with middleware

#### 4. Frontend Pages

##### Authentication Pages:
- **Signup Page** (`/signup`): User registration form for both patients and professionals
  - First name, last name, email, phone number
  - Password confirmation
  - Account type selection
  - Email verification integration

- **Login Page** (`/login`): Secure user login
  - Email and password authentication
  - Role-based dashboard redirection
  - Forgot password option

- **Email Verification Page** (`/verify-email/:token`): Email verification confirmation
  - Automatic token verification
  - Verification status display

##### Dashboard Pages:
- **Patient Dashboard** (`/patient-dashboard`): Personalized patient interface
  - Profile information display
  - Health information management
  - Edit profile functionality
  - Quick actions (Find Doctors, Book Appointment, View Records)
  - Navigation to other modules

- **Professional Dashboard** (`/professional-dashboard`): Healthcare professional interface
  - Professional profile management
  - License and specialization information
  - Clinic details and consultation fees
  - Quick actions (View Patients, Appointments, Prescriptions)
  - Navigation to other modules

- **Home Page** (`/`): Marketing and landing page
  - Feature showcase
  - Authentication links
  - System benefits

#### 5. Profile Management
- Patient profile with detailed health information
- Professional profile with credentials and specialization
- Profile update functionality
- Address management
- Health history tracking

### Technical Stack

#### Backend
- **Node.js & Express.js**: RESTful API server
- **MongoDB**: Document database for data storage
- **Mongoose**: ODM for database schema management
- **JWT**: Token-based authentication
- **bcryptjs**: Password encryption
- **Nodemailer**: Email sending service
- **CORS**: Cross-origin resource sharing

#### Frontend
- **React 18**: User interface library
- **React Router DOM**: Client-side routing
- **Axios**: HTTP client for API calls
- **React Toastify**: Notifications system
- **React Icons**: Icon library
- **CSS3**: Responsive styling

### Directory Structure

```
medvault/
├── backend/
│   ├── config/
│   │   ├── database.js
│   │   └── mail.js
│   ├── controllers/
│   │   ├── userController.js
│   │   ├── patientController.js
│   │   └── professionalController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Patient.js
│   │   ├── Professional.js
│   │   └── MedicalRecord.js
│   ├── routes/
│   │   ├── userRoutes.js
│   │   ├── patientRoutes.js
│   │   └── professionalRoutes.js
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   └── ProtectedRoute.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── Signup.js
│   │   │   ├── VerifyEmail.js
│   │   │   ├── PatientDashboard.js
│   │   │   └── ProfessionalDashboard.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── styles/
│   │   │   ├── auth.css
│   │   │   ├── dashboard.css
│   │   │   ├── home.css
│   │   │   └── index.css
│   │   ├── App.js
│   │   └── index.js
│   ├── .gitignore
│   └── package.json
```

## API Endpoints

### User Routes
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/verify-email/:token` - Email verification
- `GET /api/users/me` - Get current user (protected)
- `PUT /api/users/profile` - Update user profile (protected)

### Patient Routes
- `GET /api/patients/profile` - Get patient profile (protected)
- `PUT /api/patients/profile` - Update patient profile (protected)
- `POST /api/patients/add-preferred-doctor` - Add preferred doctor (protected)

### Professional Routes
- `GET /api/professionals` - Get all professionals (with filters)
- `GET /api/professionals/:id` - Get professional by ID
- `GET /api/professionals/profile` - Get current professional profile (protected)
- `PUT /api/professionals/profile` - Update professional profile (protected)

## Setup Instructions

### Backend Setup
1. Navigate to backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Create `.env` file with required variables:
   ```
   MONGODB_URI=mongodb://localhost:27017/medvault
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   NODEMAILER_EMAIL=your_email@gmail.com
   NODEMAILER_PASSWORD=your_app_password
   ```
4. Start MongoDB service on your system
5. Run server: `npm start` or `npm run dev` (with nodemon)

### Frontend Setup
1. Navigate to frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Create `.env` file:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```
4. Start development server: `npm start`
5. Application will open at `http://localhost:3000`

## Testing with Yop Mail

For email verification testing:
1. Use email format: `yourname@yopmail.com` during signup
2. Create account with Yop Mail email
3. Check verification at `https://yopmail.com/` using your email prefix
4. Verification link will be displayed in the page

## Future Enhancements

### Milestone 2: Appointment Booking & Consultation Module
- Appointment scheduling system
- Doctor availability management
- Appointment confirmation and reminders
- Consultation history

### Milestone 3: Medical Records Storage & Notifications
- Document upload and storage
- Medical record categorization
- Health reminders and notifications
- Record sharing with healthcare professionals

### Milestone 4: Bug Fixing, Review & Documentation
- System testing and bug fixes
- Performance optimization
- Comprehensive documentation
- User guides and API documentation

## Security Features

- Password encryption with bcryptjs
- JWT token-based authentication
- Email verification for new accounts
- Protected routes with middleware
- CORS configuration
- Input validation and sanitization
- Secure HTTP headers

## Notes

- The system uses JSON Web Tokens (JWT) for stateless authentication
- All passwords are hashed using bcryptjs with salt rounds of 10
- Email verification tokens expire after 24 hours
- The system supports two user roles: patients and healthcare professionals
- MongoDB connection string should be configured in environment variables

## License

This project is proprietary and confidential.

## Support

For support and inquiries, please contact the development team.
