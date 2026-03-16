import React from "react";
import "../styles/appointments.css";

export default function BookingModal({ open, onClose, onConfirm, details }) {
  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h3>Confirm Appointment</h3>
        <div className="modal-body">
          <p>
            <strong>Doctor:</strong> {details?.doctorName}
          </p>
          <p>
            <strong>Date:</strong> {details?.date}
          </p>
          <p>
            <strong>Time:</strong> {details?.time}
          </p>
          <p>
            <strong>Reason:</strong> {details?.reason}
          </p>
        </div>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
