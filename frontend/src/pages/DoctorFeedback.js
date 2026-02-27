import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "../styles/appointments.css";
import { toast } from "react-toastify";

export default function DoctorFeedback() {
  const { user } = useAuth();
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ avgRating: 0, totalFeedback: 0 });

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
            res.data.reduce((sum, f) => sum + (f.rating || 0), 0) / res.data.length
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
      <div className="appointment-container">
        <p>Loading feedback...</p>
      </div>
    );

  return (
    <div className="appointment-container">
      <h2>Patient Feedback</h2>

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
                <span className="rating-stars">{renderStars(f.rating)}</span>
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
  );
}
