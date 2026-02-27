import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { patientAPI } from "../services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/dashboard.css";
import {
  FiUser,
  FiFileText,
  FiCalendar,
  FiUsers,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiEdit,
  FiBell,
  FiClock,
  FiLock,
} from "react-icons/fi";
import MyAppointments from "./MyAppointments";
import MedicalRecordsManager from "./MedicalRecordsManager";
import Notifications from "./Notifications";
import RemindersManager from "./RemindersManager";
import ConsentsManager from "./ConsentsManager";

const PatientDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("overview");
  const [formData, setFormData] = useState({
    dateOfBirth: "",
    gender: "",
    bloodType: "",
    allergies: [],
    address: {},
  });

  useEffect(() => {
    fetchPatientProfile();
  }, []);

  const fetchPatientProfile = async () => {
    try {
      setLoading(true);
      const response = await patientAPI.getProfile();
      setProfile(response.data.patient);
      setFormData({
        dateOfBirth: response.data.patient?.dateOfBirth || "",
        gender: response.data.patient?.gender || "",
        bloodType: response.data.patient?.bloodType || "",
        allergies: response.data.patient?.allergies || [],
        address: response.data.patient?.address || {},
      });
    } catch (error) {
      console.warn("Failed to load profile", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    { id: "overview", label: "Dashboard", icon: FiUser },
    { id: "profile", label: "Profile", icon: FiUser },
    { id: "records", label: "Medical Records", icon: FiFileText },
    { id: "appointments", label: "My Appointments", icon: FiCalendar },
    { id: "book-appointment", label: "Book Appointment", icon: FiCalendar },
    { id: "notifications", label: "Notifications", icon: FiBell },
    { id: "reminders", label: "Reminders", icon: FiClock },
    { id: "consents", label: "Access Control", icon: FiLock },
    { id: "settings", label: "Settings", icon: FiSettings },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await patientAPI.updateProfile(formData);
      toast.success("Profile updated successfully");
      setEditMode(false);
      fetchPatientProfile();
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return (
          <div className="content-section">
            <h2>My Profile</h2>
            {editMode ? (
              <div className="edit-form-card">
                <form onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Date of Birth</label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Gender</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Blood Type</label>
                      <select
                        name="bloodType"
                        value={formData.bloodType}
                        onChange={handleChange}
                      >
                        <option value="">Select Blood Type</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                      </select>
                    </div>
                  </div>
                  <button type="submit" className="submit-btn">
                    Save Changes
                  </button>
                </form>
              </div>
            ) : (
              <div className="profile-cards">
                <div className="info-card">
                  <h4>Personal Information</h4>
                  <p>
                    <strong>Name:</strong> {user?.firstName} {user?.lastName}
                  </p>
                  <p>
                    <strong>Email:</strong> {user?.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {user?.phoneNumber}
                  </p>
                  <button
                    className="edit-btn"
                    onClick={() => setEditMode(true)}
                  >
                    <FiEdit /> Edit
                  </button>
                </div>
                <div className="info-card">
                  <h4>Health Information</h4>
                  <p>
                    <strong>Blood Type:</strong>{" "}
                    {profile?.bloodType || "Not Set"}
                  </p>
                  <p>
                    <strong>Gender:</strong> {profile?.gender || "Not Set"}
                  </p>
                  <p>
                    <strong>DOB:</strong>{" "}
                    {profile?.dateOfBirth
                      ? new Date(profile.dateOfBirth).toLocaleDateString()
                      : "Not Set"}
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      case "records":
        return <MedicalRecordsManager />;
      case "notifications":
        return <Notifications />;
      case "reminders":
        return <RemindersManager />;
      case "consents":
        return <ConsentsManager />;
      case "appointments":
        return (
          <div className="content-section">
            <h2>My Appointments</h2>
            <MyAppointments />
          </div>
        );

      case "book-appointment":
        return (
          <div className="content-section">
            <h2>Book Appointment</h2>
            <div className="empty-state">
              <p>Schedule a new appointment with a healthcare professional</p>
              <button className="action-btn" onClick={() => navigate("/book")}>
                Book Now
              </button>
            </div>
          </div>
        );
      case "settings":
        return (
          <div className="content-section">
            <h2>Settings</h2>
            <div className="profile-cards">
              <div className="info-card">
                <h4>Account Settings</h4>
                <p>
                  <strong>Email Notifications:</strong> Enabled
                </p>
                <p>
                  <strong>Two-Factor Auth:</strong> Disabled
                </p>
                <button
                  className="action-btn"
                  onClick={() => toast.info("Feature coming soon")}
                >
                  Configure Settings
                </button>
              </div>
              <div className="info-card">
                <h4>Privacy & Security</h4>
                <p>Manage your privacy preferences and security settings</p>
                <button
                  className="action-btn"
                  onClick={() => toast.info("Feature coming soon")}
                >
                  Manage Privacy
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="content-section">
            <div className="welcome-header">
              <h1>Welcome back, {user?.firstName}! 👋</h1>
              <p>Here's your health dashboard overview</p>
            </div>
            <div className="dashboard-grid">
              <div
                className="dashboard-card"
                onClick={() => setActiveSection("profile")}
              >
                <FiUser className="card-icon" />
                <h3>Profile</h3>
                <p>View and update your information</p>
              </div>
              <div
                className="dashboard-card"
                onClick={() => setActiveSection("records")}
              >
                <FiFileText className="card-icon" />
                <h3>Medical Records</h3>
                <p>Access your medical documents</p>
              </div>
              <div
                className="dashboard-card"
                onClick={() => setActiveSection("appointments")}
              >
                <FiCalendar className="card-icon" />
                <h3>Appointments</h3>
                <p>Manage your appointments</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="new-dashboard-container">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Sidebar */}
      <aside className={`sidebar-new ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <h2>MedVault</h2>
          <button
            className="toggle-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        <div className="user-card">
          <div className="avatar-large">{user?.firstName?.charAt(0)}</div>
          <h3>
            {user?.firstName} {user?.lastName}
          </h3>
          <p className="subtitle">Patient</p>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeSection === item.id ? "active" : ""}`}
              onClick={() => {
                setActiveSection(item.id);
                if (window.innerWidth < 768) setSidebarOpen(false);
              }}
            >
              <span className="nav-icon">
                <item.icon />
              </span>
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          <FiLogOut /> {sidebarOpen && "Logout"}
        </button>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-wrapper">{renderContent()}</div>
      </main>
    </div>
  );
};

export default PatientDashboard;
