import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/appointments.css";
import { toast } from "react-toastify";

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

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
    <div className="appointment-container">
      <h2>Appointment Requests</h2>

      {appointments.length === 0 ? (
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
                <span className={`status-badge ${getStatusColor(a.status)}`}>
                  {a.status.toUpperCase()}
                </span>
              </div>

              <div className="appointment-details">
                <p>
                  <strong>Email:</strong> {a.patient?.email}
                </p>
                <p>
                  <strong>Date:</strong> {new Date(a.date).toLocaleDateString()}
                </p>
                <p>
                  <strong>Time:</strong> {new Date(a.date).toLocaleTimeString()}
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
  );
}
