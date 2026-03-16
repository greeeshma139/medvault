import React, { useState, useEffect } from "react";
import { reminderAPI } from "../services/api";
import { toast } from "react-toastify";
import "../styles/appointments.css";

export default function RemindersManager() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: "appointment",
    title: "",
    description: "",
    reminderDate: "",
    frequency: "once",
  });

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      setLoading(true);
      const res = await reminderAPI.getReminders();
      setReminders(res.data.reminders || []);
    } catch (error) {
      toast.error("Failed to load reminders");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateReminder = async (e) => {
    e.preventDefault();
    try {
      if (!formData.title || !formData.reminderDate) {
        toast.error("Please fill in required fields");
        return;
      }

      await reminderAPI.createReminder(formData);
      toast.success("Reminder created successfully");
      setFormData({
        type: "appointment",
        title: "",
        description: "",
        reminderDate: "",
        frequency: "once",
      });
      setShowForm(false);
      fetchReminders();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create reminder");
    }
  };

  const handleCompleteReminder = async (id) => {
    try {
      await reminderAPI.completeReminder(id);
      toast.success("Reminder marked as completed");
      fetchReminders();
    } catch (error) {
      toast.error("Failed to complete reminder");
    }
  };

  const handleDeleteReminder = async (id) => {
    if (window.confirm("Are you sure you want to deactivate this reminder?")) {
      try {
        await reminderAPI.deleteReminder(id);
        toast.success("Reminder deactivated");
        fetchReminders();
      } catch (error) {
        toast.error("Failed to deactivate reminder");
      }
    }
  };

  const getRemiderIcon = (type) => {
    const icons = {
      appointment: "📅",
      prescription_refill: "💊",
      health_checkup: "🏥",
      medication: "⚕️",
      follow_up: "📋",
    };
    return icons[type] || "🔔";
  };

  const upcomingReminders = reminders.filter(
    (r) => r.isActive && !r.completedAt,
  );
  const completedReminders = reminders.filter((r) => r.completedAt);

  if (loading) {
    return (
      <div className="appointment-container">
        <p>Loading reminders...</p>
      </div>
    );
  }

  return (
    <div className="appointment-container">
      <div
        style={{
          marginBottom: "2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Health Reminders & Follow-ups</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "+ Create Reminder"}
        </button>
      </div>

      {showForm && (
        <div className="appointment-card">
          <h3>Create Health Reminder</h3>
          <form onSubmit={handleCreateReminder}>
            <div className="form-row">
              <div className="form-group">
                <label>Reminder Type *</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="appointment">Appointment</option>
                  <option value="prescription_refill">
                    Prescription Refill
                  </option>
                  <option value="health_checkup">Health Checkup</option>
                  <option value="medication">Medication Time</option>
                  <option value="follow_up">Follow-up</option>
                </select>
              </div>
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Take diabetes medication"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Add any additional details..."
                rows="3"
              ></textarea>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Reminder Date & Time *</label>
                <input
                  type="datetime-local"
                  name="reminderDate"
                  value={formData.reminderDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Frequency</label>
                <select
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleInputChange}
                >
                  <option value="once">Once</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-primary">
              Create Reminder
            </button>
          </form>
        </div>
      )}

      {upcomingReminders.length === 0 && completedReminders.length === 0 ? (
        <div className="empty-state">
          <p>No reminders yet</p>
          <p style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
            Create reminders for appointments, medications, and health checkups
          </p>
        </div>
      ) : (
        <>
          {upcomingReminders.length > 0 && (
            <div style={{ marginBottom: "3rem" }}>
              <h3 style={{ marginBottom: "1.5rem", color: "#2c3e50" }}>
                Upcoming Reminders
              </h3>
              <div className="appointments-grid">
                {upcomingReminders.map((reminder) => (
                  <div key={reminder._id} className="appointment-card">
                    <div className="appointment-header">
                      <h3>
                        {getRemiderIcon(reminder.type)} {reminder.title}
                      </h3>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          backgroundColor: "#e3f2fd",
                          color: "#3498db",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "4px",
                          textTransform: "capitalize",
                        }}
                      >
                        {reminder.frequency}
                      </span>
                    </div>

                    {reminder.description && (
                      <p className="appointment-details">
                        {reminder.description}
                      </p>
                    )}

                    <p
                      style={{
                        color: "#e74c3c",
                        fontWeight: "bold",
                        marginTop: "0.5rem",
                      }}
                    >
                      {new Date(reminder.reminderDate).toLocaleDateString()}{" "}
                      {new Date(reminder.reminderDate).toLocaleTimeString()}
                    </p>

                    <div
                      className="action-buttons"
                      style={{ marginTop: "1rem" }}
                    >
                      <button
                        className="btn btn-success"
                        onClick={() => handleCompleteReminder(reminder._id)}
                      >
                        Mark Done
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDeleteReminder(reminder._id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {completedReminders.length > 0 && (
            <div>
              <h3 style={{ marginBottom: "1.5rem", color: "#2c3e50" }}>
                Completed Reminders
              </h3>
              <div className="appointments-grid">
                {completedReminders.map((reminder) => (
                  <div
                    key={reminder._id}
                    className="appointment-card"
                    style={{ opacity: 0.7 }}
                  >
                    <div className="appointment-header">
                      <h3 style={{ textDecoration: "line-through" }}>
                        {getRemiderIcon(reminder.type)} {reminder.title}
                      </h3>
                      <span style={{ color: "#27ae60" }}>✓ Done</span>
                    </div>

                    <p style={{ color: "#95a5a6", fontSize: "0.9rem" }}>
                      Completed on{" "}
                      {new Date(reminder.completedAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
