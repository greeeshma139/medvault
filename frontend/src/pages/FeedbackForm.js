import { useState } from "react";
import api from "../services/api";
import "../styles/appointments.css";
import { toast } from "react-toastify";

export default function FeedbackForm({ appointmentId, onClose }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!comment.trim()) {
      toast.error("Please enter your feedback");
      return;
    }

    try {
      setLoading(true);
      await api.post(`/feedback/${appointmentId}`, {
        rating: parseInt(rating),
        comment,
      });

      toast.success("Thank you for your feedback!");
      setComment("");
      setRating(5);
      if (onClose) onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="feedback-card">
      <form onSubmit={handleSubmit}>
        <h4>Share Your Feedback</h4>

        <div className="form-group">
          <label>Rating *</label>
          <div className="rating-input">
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              required
            >
              <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
              <option value="4">⭐⭐⭐⭐ Good</option>
              <option value="3">⭐⭐⭐ Average</option>
              <option value="2">⭐⭐ Fair</option>
              <option value="1">⭐ Poor</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Your Comments *</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience..."
            rows="4"
            required
          ></textarea>
        </div>

        <div className="action-buttons">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
          {onClose && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
