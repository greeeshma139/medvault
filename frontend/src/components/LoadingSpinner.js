import React from "react";
import "../styles/appointments.css";

export default function LoadingSpinner({ size = 40 }) {
  return <div className="spinner" style={{ width: size, height: size }} />;
}
