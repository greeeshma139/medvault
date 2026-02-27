import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import "../styles/appointments.css";
import { toast } from "react-toastify";

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
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    fetchAvailability();
  }, [user, isAuthenticated]);

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
    <div className="appointment-container">
      <h2>Manage Your Availability</h2>

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
              {loading ? "Saving..." : editingId ? "Save Changes" : "Add Slot"}
            </button>
            {editingId && (
              <button
                type="button"
                className="btn btn-secondary"
                style={{ marginLeft: 8 }}
                onClick={() => {
                  setEditingId(null);
                  setFormData({ day: "Monday", startTime: "09:00", endTime: "17:00" });
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
                        if (!window.confirm("Are you sure you want to delete this slot?")) return;
                        try {
                          await api.delete(`/availability/${slot._id}`);
                          toast.success("Slot removed");
                          fetchAvailability();
                        } catch (err) {
                          console.error('Delete availability error:', err);
                          const msg = err.response?.data?.message || err.message || "Failed to remove slot";
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
  );
}
