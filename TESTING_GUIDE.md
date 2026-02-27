# MedVault Milestone 2 - Quick Start Testing Guide

## ✅ System Status

- Backend: Running on http://localhost:5000
- Frontend: Running on http://localhost:3000
- Database: MongoDB Atlas Connected

## 🧪 Step-by-Step Testing

### 1. Patient: Book an Appointment

1. Open http://localhost:3000
2. Go to **Signup** → Register as **Patient**
   - Email: patient@test.com
   - Password: Test@123
   - DOB: Select date
   - Gender: Select gender
3. Verify email at https://yopmail.com/
4. **Login** with credentials
5. Go to **Patient Dashboard** → Click **"Book Appointment"**
6. Select a doctor from dropdown
7. Choose date and time
8. Enter reason for visit
9. Click **"Book Appointment"**
10. View appointment at **"My Appointments"** → Status: **PENDING**

### 2. Professional: Manage Appointments

1. Open http://localhost:3000 in new tab/incognito
2. Go to **Signup** → Register as **Professional**
   - Email: doctor@test.com
   - Password: Test@123
   - Specialization: Cardiology
   - License #: LIC123
3. Verify email
4. **Login**
5. Go to **Professional Dashboard** → Click **"My Availability"**
6. Add time slots:
   - Day: Monday
   - Start: 09:00
   - End: 17:00
7. Click **"Add Slot"**
8. Go to **"Manage Appointments"**
9. See patient's appointment request
10. Click **"Approve"** or **"Reject"**
11. After approval, click **"Mark as Completed"**

### 3. Patient: Leave Feedback

1. Go back to Patient tab
2. Refresh **"My Appointments"**
3. See appointment status: **COMPLETED** ✅
4. Click **"Leave Feedback"**
5. Select **Rating**: ⭐⭐⭐⭐⭐
6. Enter comment: "Great doctor!"
7. Submit Feedback

### 4. Professional: View Feedback

1. Go back to Doctor tab
2. Go to **"Patient Feedback"**
3. See:
   - Average Rating: 5.0/5 ⭐
   - Patient name
   - Feedback comment

## 🔄 Complete Workflow

```
Patient Books → Doctor Receives → Doctor Approves →
Doctor Completes → Patient Feedback → Doctor Sees Rating
```

## 📊 Test Scenarios

### Scenario 1: Appointment Rejection

- Book appointment
- Doctor rejects it
- Status shows RED badge "REJECTED"

### Scenario 2: Pending Appointment

- Book appointment
- Don't approve yet
- Status shows ORANGE badge "PENDING"

### Scenario 3: Multiple Feedback

- Complete 3 appointments with same doctor
- Leave different ratings
- Doctor sees average rating calculated

## 🛠️ Troubleshooting

### If Backend Not Responding

```powershell
cd backend
npm run dev
```

### If Frontend Not Loading

```powershell
cd frontend
npm start
```

### If Port 5000 Already in Use

```powershell
netstat -ano | findstr :5000
taskkill /PID [PID] /F
```

## 📱 Mobile Testing

Open http://localhost:3000 on mobile device to test responsive design:

- ✅ Cards stack vertically
- ✅ Buttons full width
- ✅ Forms are readable
- ✅ Navigation works smoothly

## ✨ Features Verified

| Feature           | Status | Location            |
| ----------------- | ------ | ------------------- |
| Book Appointment  | ✅     | Patient Dashboard   |
| View Appointments | ✅     | My Appointments     |
| Manage Requests   | ✅     | Doctor Dashboard    |
| Set Availability  | ✅     | Availability        |
| Leave Feedback    | ✅     | My Appointments     |
| View Ratings      | ✅     | Patient Feedback    |
| Role-based Access | ✅     | App.js Routes       |
| Form Validation   | ✅     | All forms           |
| Error Messages    | ✅     | Toast notifications |

## 📞 API Testing with Postman

### Headers (All Requests)

```
Authorization: Bearer [JWT_TOKEN]
Content-Type: application/json
```

### Book Appointment

```
POST http://localhost:5000/api/appointments
Body:
{
  "doctorId": "[DOCTOR_ID]",
  "date": "2024-12-25T10:00:00",
  "reason": "Checkup"
}
```

### Update Appointment Status

```
PUT http://localhost:5000/api/appointments/[ID]/status
Body:
{
  "status": "approved"
}
```

### Submit Feedback

```
POST http://localhost:5000/api/feedback/[APPOINTMENT_ID]
Body:
{
  "rating": 5,
  "comment": "Great!"
}
```

## 🎉 Success Indicators

✅ All pages load without errors
✅ Appointments can be booked
✅ Doctors can approve/reject
✅ Feedback can be submitted
✅ Ratings are calculated
✅ UI is responsive
✅ Status badges show correct colors
✅ Notifications appear on actions
