import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { professionalAPI } from "../services/api";
import { ToastContainer, toast } from "react-toastify";
import {
  FiUser,
  FiFileText,
  FiUsers,
  FiCalendar,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiEdit,
  FiBell,
  FiClock,
  FiLock,
} from "react-icons/fi";
import "react-toastify/dist/ReactToastify.css";
import "../styles/dashboard.css";
import Notifications from "./Notifications";
import ConsentsManager from "./ConsentsManager";

const ProfessionalDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("overview");
  const [formData, setFormData] = useState({
    specialization: "",
    licenseNumber: "",
    registrationNumber: "",
    yearsOfExperience: "",
    qualifications: [],
    clinicName: "",
    clinicAddress: {},
    consultationFee: "",
  });
  const [patients, setPatients] = useState([]);
  const [patientsLoading, setPatientsLoading] = useState(false);
  const [prescriptionForm, setPrescriptionForm] = useState({
    patientId: "",
    title: "",
    description: "",
    medicinesText: "",
  });

  const menuItems = [
    { id: "overview", label: "Dashboard", icon: FiUser },
    { id: "profile", label: "Profile", icon: FiUser },
    { id: "patients", label: "My Patients", icon: FiUsers },
    { id: "appointments", label: "Appointments", icon: FiCalendar },
    {
      id: "appointments-manage",
      label: "Manage Appointments",
      icon: FiCalendar,
    },
    { id: "availability", label: "My Availability", icon: FiCalendar },
    { id: "feedback", label: "Patient Feedback", icon: FiFileText },
    { id: "prescriptions", label: "Prescriptions", icon: FiFileText },
    { id: "notifications", label: "Notifications", icon: FiBell },
    { id: "consents", label: "Access Requests", icon: FiLock },
    { id: "settings", label: "Settings", icon: FiSettings },
  ];

  useEffect(() => {
    fetchProfessionalProfile();
  }, []);

  useEffect(() => {
    if (activeSection === "patients" || activeSection === "prescriptions") {
      fetchPatientsFromAppointments();
    }
  }, [activeSection]);

  const fetchPatientsFromAppointments = async () => {
    try {
      setPatientsLoading(true);
      const res = await api.get("/appointments/my");
      const data = res.data;
      const list = Array.isArray(data) ? data : data.appointments || [];
      const map = new Map();
      list.forEach((a) => {
        if (a.patient && a.patient._id) map.set(a.patient._id, a.patient);
      });
      setPatients(Array.from(map.values()));
    } catch (error) {
      console.warn("Failed to load patients", error);
    } finally {
      setPatientsLoading(false);
    }
  };

  const fetchProfessionalProfile = async () => {
    try {
      setLoading(true);
      const response = await professionalAPI.getProfile();
      setProfile(response.data.professional);
      setFormData({
        specialization: response.data.professional?.specialization || "",
        licenseNumber: response.data.professional?.licenseNumber || "",
        registrationNumber:
          response.data.professional?.registrationNumber || "",
        yearsOfExperience: response.data.professional?.yearsOfExperience || "",
        qualifications: response.data.professional?.qualifications || [],
        clinicName: response.data.professional?.clinicName || "",
        clinicAddress: response.data.professional?.clinicAddress || {},
        consultationFee: response.data.professional?.consultationFee || "",
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

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="content-section">
            <div className="welcome-header">
              <h1>Welcome back, Dr. {user?.lastName}! 👋</h1>
              <p>Here's your dashboard overview</p>
            </div>
            <div className="dashboard-grid">
              <div
                className="dashboard-card"
                onClick={() => setActiveSection("profile")}
              >
                <div className="card-icon">👤</div>
                <h3>Profile</h3>
                <p>Manage your professional information</p>
              </div>
              <div
                className="dashboard-card"
                onClick={() => setActiveSection("patients")}
              >
                <div className="card-icon">👥</div>
                <h3>My Patients</h3>
                <p>View and manage your patients</p>
              </div>
              <div
                className="dashboard-card"
                onClick={() => setActiveSection("appointments")}
              >
                <div className="card-icon">📅</div>
                <h3>Appointments</h3>
                <p>Check your scheduled appointments</p>
              </div>
              <div
                className="dashboard-card"
                onClick={() => setActiveSection("prescriptions")}
              >
                <div className="card-icon">📋</div>
                <h3>Prescriptions</h3>
                <p>Create and manage prescriptions</p>
              </div>
            </div>
          </div>
        );
      case "profile":
        return (
          <div className="content-section">
            <div className="welcome-header">
              <h1>Professional Profile</h1>
              <p>Manage your credentials and information</p>
            </div>
            {editMode ? (
              <div className="edit-form-card">
                <h2>Edit Your Professional Profile</h2>
                <form onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Specialization *</label>
                      <input
                        type="text"
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleChange}
                        placeholder="e.g., Cardiology"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>License Number *</label>
                      <input
                        type="text"
                        name="licenseNumber"
                        value={formData.licenseNumber}
                        onChange={handleChange}
                        placeholder="Your license number"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Registration Number</label>
                      <input
                        type="text"
                        name="registrationNumber"
                        value={formData.registrationNumber}
                        onChange={handleChange}
                        placeholder="Your registration number"
                      />
                    </div>
                    <div className="form-group">
                      <label>Years of Experience</label>
                      <input
                        type="number"
                        name="yearsOfExperience"
                        value={formData.yearsOfExperience}
                        onChange={handleChange}
                        placeholder="e.g., 10"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Clinic Name</label>
                    <input
                      type="text"
                      name="clinicName"
                      value={formData.clinicName}
                      onChange={handleChange}
                      placeholder="Your clinic name"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Consultation Fee</label>
                      <input
                        type="number"
                        name="consultationFee"
                        value={formData.consultationFee}
                        onChange={handleChange}
                        placeholder="Consultation fee"
                      />
                    </div>
                  </div>

                  <h3>Clinic Address</h3>
                  <div className="form-group">
                    <label>Street</label>
                    <input
                      type="text"
                      name="street"
                      value={formData.clinicAddress.street || ""}
                      onChange={handleAddressChange}
                      placeholder="Street address"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.clinicAddress.city || ""}
                        onChange={handleAddressChange}
                        placeholder="City"
                      />
                    </div>
                    <div className="form-group">
                      <label>State</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.clinicAddress.state || ""}
                        onChange={handleAddressChange}
                        placeholder="State"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Zip Code</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.clinicAddress.zipCode || ""}
                        onChange={handleAddressChange}
                        placeholder="Zip Code"
                      />
                    </div>
                    <div className="form-group">
                      <label>Country</label>
                      <input
                        type="text"
                        name="country"
                        value={formData.clinicAddress.country || ""}
                        onChange={handleAddressChange}
                        placeholder="Country"
                      />
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
                  <h4>Professional Information</h4>
                  <p>
                    <strong>Name:</strong> Dr. {user?.firstName}{" "}
                    {user?.lastName}
                  </p>
                  <p>
                    <strong>Specialization:</strong>{" "}
                    {profile?.specialization || "Not Set"}
                  </p>
                  <p>
                    <strong>License Number:</strong>{" "}
                    {profile?.licenseNumber || "Not Set"}
                  </p>
                  <p>
                    <strong>Years of Experience:</strong>{" "}
                    {profile?.yearsOfExperience || "Not Set"}
                  </p>
                  <button
                    className="edit-btn"
                    onClick={() => setEditMode(true)}
                  >
                    <FiEdit size={16} /> Edit Profile
                  </button>
                </div>

                <div className="info-card">
                  <h4>Clinic Information</h4>
                  <p>
                    <strong>Clinic:</strong> {profile?.clinicName || "Not Set"}
                  </p>
                  <p>
                    <strong>Consultation Fee:</strong> $
                    {profile?.consultationFee || "Not Set"}
                  </p>
                  <p>
                    <strong>Rating:</strong> {profile?.rating} ⭐
                  </p>
                  <p>
                    <strong>Verified:</strong>{" "}
                    {profile?.isVerified ? "✓ Yes" : "✗ No"}
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      case "patients":
        return (
          <div className="content-section">
            <div className="welcome-header">
              <h1>My Patients</h1>
              <p>Manage your patient list</p>
            </div>
            {patientsLoading ? (
              <p>Loading patients...</p>
            ) : patients.length === 0 ? (
              <div className="empty-state">
                <p>No patients yet</p>
              </div>
            ) : (
              <div className="appointments-grid">
                {patients.map((p) => (
                  <div key={p._id} className="appointment-card">
                    <div className="appointment-header">
                      <h3>
                        {p.firstName} {p.lastName}
                      </h3>
                      <span>{p.email}</span>
                    </div>
                    <div className="appointment-details">
                      <p>
                        <strong>Phone:</strong> {p.phoneNumber}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case "appointments":
        return (
          <div className="content-section">
            <div className="welcome-header">
              <h1>Appointments</h1>
              <p>View your scheduled appointments</p>
            </div>
            <div className="empty-state">
              <p>No appointments scheduled yet</p>
              <button
                className="action-btn"
                onClick={() => navigate("/doctor-appointments")}
              >
                View All Appointments
              </button>
            </div>
          </div>
        );
      case "appointments-manage":
        return (
          <div className="content-section">
            <h2>Manage Appointments</h2>
            <div className="empty-state">
              <p>Review and manage your scheduled appointments</p>
              <button
                className="action-btn"
                onClick={() => navigate("/doctor-appointments")}
              >
                Manage Now
              </button>
            </div>
          </div>
        );
      case "availability":
        return (
          <div className="content-section">
            <h2>My Availability</h2>
            <div className="empty-state">
              <p>Set your available time slots for appointments</p>
              <button
                className="action-btn"
                onClick={() => navigate("/availability")}
              >
                Set Availability
              </button>
            </div>
          </div>
        );
      case "feedback":
        return (
          <div className="content-section">
            <h2>Patient Feedback</h2>
            <div className="empty-state">
              <p>View ratings and feedback from your patients</p>
              <button
                className="action-btn"
                onClick={() => navigate("/doctor-feedback")}
              >
                View Feedback
              </button>
            </div>
          </div>
        );
      case "prescriptions":
        return (
          <div className="content-section">
            <div className="welcome-header">
              <h1>Prescriptions</h1>
              <p>Create and manage prescriptions</p>
            </div>
            <div className="edit-form-card">
              <h3>Create Prescription</h3>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    const medicines = prescriptionForm.medicinesText
                      .split("\n")
                      .map((line) => {
                        const parts = line.split("|").map((s) => s.trim());
                        return {
                          name: parts[0] || "",
                          dosage: parts[1] || "",
                          frequency: parts[2] || "",
                        };
                      })
                      .filter((m) => m.name);
                    const body = {
                      patientId: prescriptionForm.patientId,
                      recordType: "prescription",
                      title: prescriptionForm.title,
                      description: prescriptionForm.description,
                      medicines,
                    };
                    const res = await fetch("/api/medical-records", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                      },
                      body: JSON.stringify(body),
                    });
                    const data = await res.json();
                    if (res.ok) {
                      toast.success("Prescription created");
                      setPrescriptionForm({
                        patientId: "",
                        title: "",
                        description: "",
                        medicinesText: "",
                      });
                    } else {
                      toast.error(data.message || "Failed");
                    }
                  } catch (err) {
                    toast.error("Failed to create prescription");
                  }
                }}
              >
                <div className="form-group">
                  <label>Select Patient</label>
                  <select
                    value={prescriptionForm.patientId}
                    onChange={(e) =>
                      setPrescriptionForm((prev) => ({
                        ...prev,
                        patientId: e.target.value,
                      }))
                    }
                    required
                  >
                    <option value="">-- Choose Patient --</option>
                    {patients.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.firstName} {p.lastName} - {p.email}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Title</label>
                  <input
                    value={prescriptionForm.title}
                    onChange={(e) =>
                      setPrescriptionForm((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={prescriptionForm.description}
                    onChange={(e) =>
                      setPrescriptionForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="form-group">
                  <label>
                    Medicines (one per line as: name | dosage | frequency)
                  </label>
                  <textarea
                    value={prescriptionForm.medicinesText}
                    onChange={(e) =>
                      setPrescriptionForm((prev) => ({
                        ...prev,
                        medicinesText: e.target.value,
                      }))
                    }
                    placeholder="Paracetamol | 500mg | 3 times a day"
                  />
                </div>
                <button className="btn btn-primary" type="submit">
                  Create Prescription
                </button>
              </form>
            </div>
          </div>
        );
      case "notifications":
        return <Notifications />;
      case "consents":
        return <ConsentsManager />;
      case "settings":
        return (
          <div className="content-section">
            <div className="welcome-header">
              <h1>Settings</h1>
              <p>Manage your account settings</p>
            </div>
            <div className="empty-state">
              <p>Settings management coming soon</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      clinicAddress: {
        ...prev.clinicAddress,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.specialization || !formData.licenseNumber) {
      toast.error("Please fill required fields");
      return;
    }

    try {
      setLoading(true);
      const response = await professionalAPI.updateProfile(formData);
      toast.success("Profile updated successfully");
      // Update profile with response data
      if (response.data && response.data.professional) {
        setProfile(response.data.professional);
      }
      setEditMode(false);
      // Fetch fresh profile data to ensure UI is in sync
      setTimeout(() => {
        fetchProfessionalProfile();
      }, 500);
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="new-dashboard-container">
      <ToastContainer position="top-right" autoClose={3000} />

      <aside className={`sidebar-new ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <h2 style={{ display: sidebarOpen ? "block" : "none" }}>MedVault</h2>
          <button
            className="toggle-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>

        <div
          className="user-card"
          style={{ display: sidebarOpen ? "block" : "none" }}
        >
          <div className="avatar-large">
            {user?.firstName?.charAt(0).toUpperCase()}
          </div>
          <h3>
            Dr. {user?.firstName} {user?.lastName}
          </h3>
          <p className="subtitle">{user?.email}</p>
          <p className="subtitle">{profile?.specialization}</p>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                className={`nav-item ${activeSection === item.id ? "active" : ""}`}
                onClick={() => setActiveSection(item.id)}
              >
                <span className="nav-icon">
                  <IconComponent size={18} />
                </span>
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          <FiLogOut size={16} />
          {sidebarOpen && <span>Logout</span>}
        </button>
      </aside>

      <main className="main-content">
        <div className="content-wrapper">{renderContent()}</div>
      </main>
    </div>
  );
};

export default ProfessionalDashboard;
