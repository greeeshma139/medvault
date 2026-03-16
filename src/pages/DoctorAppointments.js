import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { getSocket } from "../services/socket";
import "../styles/appointments.css";
import "../styles/dashboard.css";
import { toast } from "react-toastify";
import Sidebar from "../components/Sidebar";
import {
  FiUser,
  FiCalendar,
  FiFileText,
  FiUsers,
  FiBell,
  FiLock,
  FiSettings,
} from "react-icons/fi";

export default function DoctorAppointments() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("appointments");

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

  useEffect(() => {
    fetchAppointments();

    const socket = getSocket();
    socket.on("appointment", () => {
      fetchAppointments();
    });

    return () => {
      socket.off("appointment");
    };
  }, []);

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

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await api.get("/appointments/my");
      setAppointments(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("DoctorAppointments fetch error:", error);
      toast.error("Failed to load appointments");
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/appointments/${id}/status`, { status });
      toast.success(`Appointment ${status}!`);
      fetchAppointments();
    } catch (error) {
      toast.error("Failed to update appointment");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "status-approved";
      case "rejected":
        return "status-rejected";
      case "completed":
        return "status-completed";
      default:
        return "status-pending";
    }
  };

  if (loading)
    return (
      <div className="appointment-container">
        <p>Loading appointments...</p>
      </div>
    );

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
              <h1>Appointment Requests</h1>
              <p>Review and manage patient consultation requests</p>
            </div>
            {loading ? (
              <div className="appointment-container">
                <p>Loading appointments...</p>
              </div>
            ) : appointments.length === 0 ? (
              <div className="empty-state">
                <p>No appointments</p>
              </div>
            ) : (
              <div className="appointments-grid">
                {appointments.map((a) => (
                  <div key={a._id} className="appointment-card">
                    <div className="appointment-header">
                      <h3>
                        {`${a.patient?.firstName || ""} ${a.patient?.lastName || "Patient"}`.trim()}
                      </h3>
                      <span
                        className={`status-badge ${getStatusColor(a.status)}`}
                      >
                        {a.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="appointment-details">
                      <p>
                        <strong>Email:</strong> {a.patient?.email}
                      </p>
                      <p>
                        <strong>Date:</strong>{" "}
                        {new Date(a.date).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Time:</strong>{" "}
                        {new Date(a.date).toLocaleTimeString()}
                      </p>
                      <p>
                        <strong>Reason:</strong> {a.reason}
                      </p>
                    </div>

                    {a.status === "pending" && (
                      <div className="action-buttons">
                        <button
                          className="btn btn-success"
                          onClick={() => updateStatus(a._id, "approved")}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => updateStatus(a._id, "rejected")}
                        >
                          Reject
                        </button>
                      </div>
                    )}

                    {a.status === "approved" && (
                      <button
                        className="btn btn-info"
                        onClick={() => updateStatus(a._id, "completed")}
                      >
                        Mark as Completed
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
