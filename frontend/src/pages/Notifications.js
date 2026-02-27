import React, { useState, useEffect } from "react";
import { notificationAPI } from "../services/api";
import { toast } from "react-toastify";
import "../styles/appointments.css";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
    // Refresh every 30 seconds
    const interval = setInterval(() => {
      fetchNotifications();
      fetchUnreadCount();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await notificationAPI.getNotifications();
      setNotifications(res.data.notifications || []);
    } catch (error) {
      console.error("Failed to load notifications", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const res = await notificationAPI.getUnreadCount();
      setUnreadCount(res.data.count || 0);
    } catch (error) {
      console.error("Failed to get unread count", error);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      fetchNotifications();
      fetchUnreadCount();
    } catch (error) {
      toast.error("Failed to mark notification as read");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      fetchNotifications();
      fetchUnreadCount();
      toast.success("All notifications marked as read");
    } catch (error) {
      toast.error("Failed to mark all as read");
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationAPI.deleteNotification(id);
      fetchNotifications();
    } catch (error) {
      toast.error("Failed to delete notification");
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      appointment: "📅",
      prescription: "💊",
      health_checkup: "🏥",
      record_update: "📄",
      access_request: "🔐",
      general: "📢",
    };
    return icons[type] || "📧";
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: "#95a5a6",
      medium: "#f39c12",
      high: "#e74c3c",
    };
    return colors[priority] || "#3498db";
  };

  if (loading) {
    return (
      <div className="appointment-container">
        <p>Loading notifications...</p>
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
        <div>
          <h2>Notifications</h2>
          {unreadCount > 0 && (
            <p style={{ color: "#e74c3c", fontWeight: "bold" }}>
              {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <button className="btn btn-primary" onClick={handleMarkAllAsRead}>
            Mark All as Read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="empty-state">
          <p>No notifications</p>
        </div>
      ) : (
        <div className="appointments-grid">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className="appointment-card feedback-card"
              style={{
                borderLeft: `4px solid ${getPriorityColor(notification.priority)}`,
                opacity: notification.isRead ? 0.7 : 1,
              }}
            >
              <div className="appointment-header">
                <h3>
                  {getNotificationIcon(notification.type)} {notification.title}
                </h3>
                {!notification.isRead && (
                  <span
                    style={{
                      backgroundColor: "#3498db",
                      color: "white",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "4px",
                      fontSize: "0.75rem",
                      fontWeight: "bold",
                    }}
                  >
                    New
                  </span>
                )}
              </div>

              <p className="feedback-comment">{notification.message}</p>

              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  marginTop: "1rem",
                  alignItems: "center",
                }}
              >
                <p className="feedback-date">
                  {new Date(notification.createdAt).toLocaleDateString()}{" "}
                  {new Date(notification.createdAt).toLocaleTimeString()}
                </p>
                <span
                  style={{
                    fontSize: "0.75rem",
                    backgroundColor: "#ecf0f1",
                    padding: "0.25rem 0.5rem",
                    borderRadius: "4px",
                    textTransform: "capitalize",
                  }}
                >
                  {notification.priority}
                </span>
              </div>

              <div className="action-buttons" style={{ marginTop: "1rem" }}>
                {!notification.isRead && (
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleMarkAsRead(notification._id)}
                  >
                    Mark as Read
                  </button>
                )}
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(notification._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
