import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import Sidebar from "../components/Sidebar";
import "../styles/appointments.css";
import "../styles/dashboard.css";
import { toast } from "react-toastify";
import {
  FiUser,
  FiCalendar,
  FiFileText,
  FiUsers,
  FiBell,
  FiLock,
  FiSettings,
} from "react-icons/fi";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function DoctorAvailability() {
  const [availability, setAvailability] = useState([]);
  const [formData, setFormData] = useState({
    day: "Monday",
    startTime: "09:00",
    endTime: "17:00",
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("availability");
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const menuItems = [
    { id: "overview", label: "Dashboard", icon: FiUser },
    { id: "profile", label: "Profile", icon: FiUser },
    { id: "appointments", label: "Appointments", icon: FiCalendar },
    { id: "availability", label: "My Availability", icon: FiCalendar },
    { id: "feedback", label: "Patient Feedback", icon: FiFileText },
    { id: "patients", label: "My Patients", icon: FiUsers },
    { id: "prescriptions", label: "Prescriptions", icon: FiFileText },
    { id: "notifications", label: "Notifications", icon: FiBell },
    { id: "consents", label: "Access Requests", icon: FiLock },
    { id: "settings", label: "Settings", icon: FiSettings },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
    switch (section) {
      case "overview":
        navigate("/professional-dashboard");
        break;
      case "profile":
        navigate("/professional-dashboard?section=profile");
        break;
      case "appointments":
        navigate("/doctor-appointments");
        break;
      case "availability":
        navigate("/availability");
        break;
      case "feedback":
        navigate("/doctor-feedback");
        break;
      case "patients":
        navigate("/professional-dashboard?section=patients");
        break;
      case "prescriptions":
        navigate("/professional-dashboard?section=prescriptions");
        break;
      case "notifications":
        navigate("/professional-dashboard?section=notifications");
        break;
      case "consents":
        navigate("/professional-dashboard?section=consents");
        break;
      case "settings":
        navigate("/professional-dashboard?section=settings");
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, [user, isAuthenticated]);

  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith("/doctor-appointments")) {
      setActiveSection("appointments");
    } else if (path.startsWith("/availability")) {
      setActiveSection("availability");
    } else if (path.startsWith("/doctor-feedback")) {
      setActiveSection("feedback");
    }
  }, [location.pathname]);

  const fetchAvailability = async () => {
    try {
      if (!isAuthenticated || !user || !user.id) {
        console.warn("User not authenticated for availability");
        setAvailability([]);
        return;
      }
      setFetching(true);
      const res = await api.get(`/availability/${user.id}`);
      setAvailability(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Availability fetch error:", error);
      toast.error("Failed to load availability");
      setAvailability([]);
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.day || !formData.startTime || !formData.endTime) {
      toast.error("Please fill all fields");
      return;
    }

    if (formData.startTime >= formData.endTime) {
      toast.error("End time must be after start time");
      return;
    }

    if (!isAuthenticated) {
      toast.info("Please sign in to manage availability");
      navigate("/login");
      return;
    }
    if (!user || user.role !== "professional") {
      toast.error("Only healthcare professionals can manage availability");
      return;
    }

    try {
      setLoading(true);
      if (editingId) {
        await api.put(`/availability/${editingId}`, formData);
        setEditingId(null);
      } else {
        await api.post("/availability", formData);
      }
      toast.success("Availability saved successfully!");
      setFormData({ day: "Monday", startTime: "09:00", endTime: "17:00" });
      fetchAvailability();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to save availability",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="new-dashboard-container">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        menuItems={menuItems}
        activeSection={activeSection}
        setActiveSection={handleSectionChange}
        onLogout={handleLogout}
        userRole="professional"
      />

      <main className="main-content">
        <div className="content-wrapper">
          <div className="content-section">
            <div className="welcome-header">
              <h1>Manage Your Availability</h1>
              <p>Set your available time slots for appointments</p>
            </div>

            <div className="availability-layout">
              <div className="availability-form">
                <h3>Add Time Slot</h3>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Day *</label>
                    <select
                      name="day"
                      value={formData.day}
                      onChange={handleChange}
                      required
                    >
                      {DAYS.map((day) => (
                        <option key={day} value={day}>
                          {day}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Start Time *</label>
                      <input
                        type="time"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>End Time *</label>
                      <input
                        type="time"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading
                      ? "Saving..."
                      : editingId
                        ? "Save Changes"
                        : "Add Slot"}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      style={{ marginLeft: 8 }}
                      onClick={() => {
                        setEditingId(null);
                        setFormData({
                          day: "Monday",
                          startTime: "09:00",
                          endTime: "17:00",
                        });
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </form>
              </div>

              <div className="availability-list">
                <h3>Your Availability</h3>
                {fetching ? (
                  <div style={{ textAlign: "center" }}>
                    <LoadingSpinner size={48} />
                  </div>
                ) : availability.length === 0 ? (
                  <p>No availability slots set</p>
                ) : (
                  <div className="slot-list">
                    {availability.map((slot) => (
                      <div key={slot._id} className="slot-card">
                        <strong>{slot.day}</strong>
                        <p>
                          {slot.startTime} - {slot.endTime}
                        </p>
                        <div style={{ marginTop: 8 }}>
                          <button
                            className="btn btn-secondary"
                            onClick={() => {
                              setEditingId(slot._id);
                              setFormData({
                                day: slot.day,
                                startTime: slot.startTime,
                                endTime: slot.endTime,
                              });
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger"
                            style={{ marginLeft: 8 }}
                            onClick={async () => {
                              if (
                                !window.confirm(
                                  "Are you sure you want to delete this slot?",
                                )
                              )
                                return;
                              try {
                                await api.delete(`/availability/${slot._id}`);
                                toast.success("Slot removed");
                                // immediately update local state to remove slot
                                setAvailability((prev) =>
                                  prev.filter((s) => s._id !== slot._id),
                                );
                                // also refresh from server in case other changes occured
                                fetchAvailability();
                              } catch (err) {
                                console.error(
                                  "Delete availability error:",
                                  err,
                                );
                                const msg =
                                  err.response?.data?.message ||
                                  err.message ||
                                  "Failed to remove slot";
                                toast.error(msg);
                              }
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
