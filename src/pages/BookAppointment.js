import { useState, useEffect } from "react";
import { normalizeDateInput } from "../utils/date";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "../styles/appointments.css";
import { toast } from "react-toastify";
import BookingModal from "../components/BookingModal";
import LoadingSpinner from "../components/LoadingSpinner";

export default function BookAppointment() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [doctorListLoading, setDoctorListLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalDetails, setModalDetails] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [formData, setFormData] = useState({
    doctorId: "",
    date: "",
    time: "",
    reason: "",
  });
  const [loading, setLoading] = useState(false);
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    // fetch slots when doctor and date chosen
    if (formData.doctorId && formData.date) {
      fetchSlots(formData.doctorId, formData.date);
    } else {
      setSlots([]);
    }
  }, [formData.doctorId, formData.date]);

  const fetchDoctors = async () => {
    try {
      setDoctorListLoading(true);
      const res = await api.get("/professionals");
      setDoctors(
        res.data && res.data.professionals ? res.data.professionals : [],
      );
    } catch (error) {
      toast.error("Failed to load doctors");
    } finally {
      setDoctorListLoading(false);
    }
  };

  const handleDoctorSelect = (doctorId) => {
    setFormData((prev) => ({ ...prev, doctorId }));
    const selectedDoc = doctors.find((d) => {
      const doctorUserId = d.userId ? d.userId._id || d.userId : d._id;
      return String(doctorUserId) === String(doctorId);
    });
    setSelectedDoctor(selectedDoc);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchSlots = async (doctorId, date) => {
    try {
      setSlotsLoading(true);
      // normalize date to YYYY-MM-DD to ensure backend parsing
      const qDate = normalizeDateInput(date);
      const res = await api.get(`/availability/${doctorId}`, {
        params: { date: qDate },
      });
      // Deduplicate slots by startTime as a safety measure (backend also dedupes)
      const raw = Array.isArray(res.data) ? res.data : [];
      const dedup = [];
      const seen = new Set();
      for (const s of raw) {
        const key = `${s.date || ""}_${s.startTime}`;
        if (!seen.has(key)) {
          seen.add(key);
          dedup.push(s);
        }
      }
      setSlots(dedup);
    } catch (err) {
      toast.error("Failed to load time slots");
      setSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  };

  // ensure date saved in formData is normalized so booking uses correct ISO date
  const normalizeAndSetDate = (rawDate) => {
    const normalized = normalizeDateInput(rawDate);
    setFormData((p) => ({ ...p, date: normalized }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.info("Please sign in to book an appointment");
      navigate("/login");
      return;
    }

    if (
      !formData.doctorId ||
      !formData.date ||
      !formData.time ||
      !formData.reason
    ) {
      toast.error("Please fill all fields");
      return;
    }

    const selectedDateTime = new Date(`${formData.date}T${formData.time}`);
    const now = new Date();
    if (selectedDateTime <= now) {
      toast.warning("The selected time has passed. Please choose a future date and time.");
      return;
    }

    const doctorName = selectedDoctor
      ? selectedDoctor.userId
        ? `${selectedDoctor.userId.firstName || ""} ${selectedDoctor.userId.lastName || ""}`.trim()
        : selectedDoctor.name || "Doctor"
      : "Doctor";
    setModalDetails({
      doctorName,
      date: formData.date,
      time: formData.time,
      reason: formData.reason,
    });
    setShowModal(true);
  };

  const handleConfirmBooking = async () => {
    setShowModal(false);
    try {
      setLoading(true);
      const appointmentDateTime = `${formData.date}T${formData.time}`;
      await api.post("/appointments", {
        doctorId: formData.doctorId,
        date: appointmentDateTime,
        reason: formData.reason,
      });

      toast.success("Appointment booked successfully!");
      setFormData({ doctorId: "", date: "", time: "", reason: "" });
      setSelectedDoctor(null);
      navigate("/my-appointments");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to book appointment",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-container">
      {/* Sidebar with doctor list */}
      <div className="booking-sidebar">
        <h3>Select a Doctor</h3>
        {doctorListLoading ? (
          <p>Loading doctors...</p>
        ) : doctors.length === 0 ? (
          <p className="no-doctors">No doctors available</p>
        ) : (
          <div className="doctor-list">
            {doctors.map((doc) => {
              const name = doc.userId
                ? `${doc.userId.firstName || ""} ${doc.userId.lastName || ""}`.trim()
                : doc.name || "Unknown";
              const doctorUserId = doc.userId
                ? doc.userId._id || doc.userId
                : doc._id;
              const isSelected =
                String(formData.doctorId) === String(doctorUserId);

              return (
                <div
                  key={doc._id}
                  className={`doctor-item ${isSelected ? "active" : ""}`}
                  onClick={() => handleDoctorSelect(doctorUserId)}
                >
                  <div className="doctor-info">
                    <h4>Dr. {name}</h4>
                    <p className="specialization">
                      {doc.specialization || "General"}
                    </p>
                    <p className="fee">${doc.consultationFee || "N/A"}</p>
                    <p className="rating">{doc.rating || "N/A"} ⭐</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Main form area */}
      <div className="booking-main">
        <div className="booking-card">
          <h2>Book an Appointment</h2>

          {selectedDoctor && (
            <div className="selected-doctor-info">
              <h4>Selected Doctor</h4>
              <div className="doctor-detail-card">
                <p>
                  <strong>
                    Dr. {selectedDoctor.userId?.firstName}{" "}
                    {selectedDoctor.userId?.lastName}
                  </strong>
                </p>
                <p>{selectedDoctor.specialization || "General"}</p>
                <p>Clinic: {selectedDoctor.clinicName || "N/A"}</p>
              </div>
              <button
                type="button"
                className="change-btn"
                onClick={() => {
                  // clear selected doctor so user can pick another while keeping sidebar visible
                  setSelectedDoctor(null);
                  setFormData((p) => ({ ...p, doctorId: "" }));
                }}
              >
                Change Doctor
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {!selectedDoctor && (
              <div className="form-group">
                <label>Select Doctor *</label>
                <select
                  name="doctorId"
                  value={formData.doctorId}
                  onChange={(e) => {
                    handleDoctorSelect(e.target.value);
                  }}
                  required
                >
                  <option value="">-- Choose a Doctor --</option>
                  {doctors.map((doc) => {
                    const name = doc.userId
                      ? `${doc.userId.firstName || ""} ${doc.userId.lastName || ""}`.trim()
                      : doc.name || "Unknown";
                    const doctorUserId = doc.userId
                      ? doc.userId._id || doc.userId
                      : doc._id;
                    return (
                      <option key={doc._id} value={doctorUserId}>
                        Dr. {name} - {doc.specialization || "General"}
                      </option>
                    );
                  })}
                </select>
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label>Date *</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={(e) => normalizeAndSetDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Select Time *</label>
              {slotsLoading ? (
                <LoadingSpinner />
              ) : slots.length === 0 ? (
                <p className="no-slots">
                  {formData.doctorId && formData.date
                    ? "No slots available for this date"
                    : "Select doctor and date to view available slots"}
                </p>
              ) : (
                <div className="time-slots-grid">
                  {slots.map((s, i) => (
                    <button
                      key={i}
                      type="button"
                      className={`time-slot ${
                        s.available ? "available" : "booked"
                      } ${formData.time === s.startTime ? "selected" : ""}`}
                      onClick={() =>
                        s.available &&
                        setFormData((p) => ({ ...p, time: s.startTime }))
                      }
                      disabled={!s.available}
                      title={
                        s.available ? "Click to select" : "This slot is booked"
                      }
                    >
                      {s.startTime}
                    </button>
                  ))}
                </div>
              )}
              {formData.time && (
                <p className="selected-time">
                  Selected time: <strong>{formData.time}</strong>
                </p>
              )}
            </div>

            <div className="form-group">
              <label>Reason for Consultation *</label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Describe your health concern..."
                rows="4"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Booking..." : "Book Appointment"}
            </button>
          </form>
        </div>
      </div>

      <BookingModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmBooking}
        details={modalDetails}
      />
    </div>
  );
}
