import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import "../styles/appointments.css";
import "../styles/dashboard.css";
import { toast } from "react-toastify";
import {
  FiUser,
  FiFileText,
  FiCalendar,
  FiUsers,
  FiBell,
  FiLock,
  FiSettings,
} from "react-icons/fi";

export default function DoctorFeedback() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ avgRating: 0, totalFeedback: 0 });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("feedback");

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
    const path = location.pathname;
    const searchParams = new URLSearchParams(location.search);
    const sectionParam = searchParams.get("section");

    if (path.startsWith("/doctor-appointments")) {
      setActiveSection("appointments");
    } else if (path.startsWith("/availability")) {
      setActiveSection("availability");
    } else if (path.startsWith("/doctor-feedback")) {
      setActiveSection("feedback");
    } else if (path.startsWith("/professional-dashboard")) {
      if (sectionParam) {
        setActiveSection(sectionParam);
      } else {
        setActiveSection("overview");
      }
    }
  }, [location.pathname, location.search]);

  useEffect(() => {
    fetchFeedback();
  }, [user]);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      if (!user || !user.id) {
        console.warn("User not authenticated");
        setLoading(false);
        return;
      }

      const res = await api.get(`/feedback/doctor/${user.id}`);
      if (res.data && Array.isArray(res.data)) {
        setFeedback(res.data);

        if (res.data.length > 0) {
          const avgRating = (
            res.data.reduce((sum, f) => sum + (f.rating || 0), 0) /
            res.data.length
          ).toFixed(1);
          setStats({ avgRating, totalFeedback: res.data.length });
        } else {
          setStats({ avgRating: 0, totalFeedback: 0 });
        }
      }
    } catch (error) {
      console.error("Feedback fetch error:", error);
      // Don't show error toast if no feedback exists
      if (error.response?.status !== 404) {
        toast.error(error.response?.data?.message || "Failed to load feedback");
      }
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return "⭐".repeat(rating) + "☆".repeat(5 - rating);
  };

  if (loading)
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
          <div className="loading">Loading feedback...</div>
        </main>
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
              <h1>Patient Feedback</h1>
              <p>View ratings and feedback from your patients</p>
            </div>

            {feedback.length > 0 && (
              <div className="feedback-stats">
                <div className="stat-card">
                  <h4>Average Rating</h4>
                  <p className="rating-value">{stats.avgRating}/5 ⭐</p>
                </div>
                <div className="stat-card">
                  <h4>Total Reviews</h4>
                  <p className="rating-value">{stats.totalFeedback}</p>
                </div>
              </div>
            )}

            {feedback.length === 0 ? (
              <div className="empty-state">
                <p>No feedback yet</p>
              </div>
            ) : (
              <div className="feedback-grid">
                {feedback.map((f) => (
                  <div key={f._id} className="feedback-card">
                    <div className="feedback-header">
                      <span className="rating-stars">
                        {renderStars(f.rating)}
                      </span>
                    </div>
                    <p className="feedback-comment">{f.comment}</p>
                    <p className="feedback-date">
                      {new Date(f.createdAt).toLocaleDateString()}
                    </p>
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
