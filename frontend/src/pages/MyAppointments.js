import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/appointments.css";
import { toast } from "react-toastify";
import FeedbackForm from "./FeedbackForm";

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbackId, setFeedbackId] = useState(null);
  const [feedbackStatus, setFeedbackStatus] = useState({});

  useEffect(() => {
    if (appointments === null) return; // guard
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await api.get("/appointments/my");
      const data = res.data;
      console.log("appointments response", res.status, data);
      if (!Array.isArray(data)) {
        console.error("Unexpected appointments response", data);
        setAppointments([]);
      } else {
        setAppointments(data);
      }

      // Check feedback status for each completed appointment
      const feedbackMap = {};
      for (const appointment of Array.isArray(data) ? data : []) {
        if (appointment.status === "completed") {
          try {
            const feedbackRes = await api.get(
              `/feedback/appointment/${appointment._id}`,
            );
            if (feedbackRes.data) {
              feedbackMap[appointment._id] = true;
            }
          } catch (error) {
            feedbackMap[appointment._id] = false;
          }
        }
      }
      setFeedbackStatus(feedbackMap);
    } catch (error) {
      console.error("MyAppointments fetch error", error);
      const msg =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : error.message;
      toast.error(`Failed to load appointments: ${msg}`);
      setAppointments([]);
    } finally {
      setLoading(false);
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

  const handleFeedbackClose = () => {
    setFeedbackId(null);
    // Refresh feedback status after submission
    setTimeout(() => {
      fetchAppointments();
    }, 500);
  };

  if (loading)
    return (
      <div className="appointment-container">
        <p>Loading appointments...</p>
      </div>
    );

  return (
    <div className="appointment-container">
      <h2>My Appointments</h2>
      {appointments.length === 0 ? (
        <div className="empty-state">
          <p>No appointments yet</p>
        </div>
      ) : (
        <div className="appointments-grid">
          {appointments.map((a) => (
            <div key={a._id} className="appointment-card">
              <div className="appointment-header">
                <h3>
                  Dr.{" "}
                  {`${a.doctor?.firstName || ""} ${a.doctor?.lastName || ""}`.trim()}
                </h3>
                <span className={`status-badge ${getStatusColor(a.status)}`}>
                  {a.status.toUpperCase()}
                </span>
              </div>

              <div className="appointment-row">
                <div className="appointment-details-col">
                  <div className="appointment-details">
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
                </div>

                <div className="appointment-action-col">
                  {a.status === "completed" &&
                    feedbackId !== a._id &&
                    !feedbackStatus[a._id] && (
                      <button
                        className="btn btn-secondary"
                        onClick={() => setFeedbackId(a._id)}
                      >
                        Leave Feedback
                      </button>
                    )}

                  {a.status === "completed" &&
                    feedbackStatus[a._id] &&
                    feedbackId !== a._id && (
                      <p className="feedback-submitted">✓ Feedback submitted</p>
                    )}

                  {feedbackId === a._id && (
                    <FeedbackForm
                      appointmentId={a._id}
                      onClose={handleFeedbackClose}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
