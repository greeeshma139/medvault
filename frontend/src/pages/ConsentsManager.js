import React, { useState, useEffect } from "react";
import { consentAPI, patientAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import "../styles/appointments.css";

export default function ConsentsManager() {
  const { user } = useAuth();
  const [consents, setConsents] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showRecordsModal, setShowRecordsModal] = useState(false);
  const [selectedPatientRecords, setSelectedPatientRecords] = useState(null);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [formData, setFormData] = useState({
    patientId: "",
    consentType: "all_records",
    recordTypesAllowed: [],
    accessScope: "read_only",
    reason: "",
    expiryDate: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (user.role === "patient") {
        const [consentsRes, requestsRes] = await Promise.all([
          consentAPI.getConsents(),
          consentAPI.getPendingRequests(),
        ]);
        setConsents(consentsRes.data.consents || []);
        setPendingRequests(requestsRes.data.requests || []);
      } else {
        const res = await consentAPI.getMyConsents();
        setConsents(res.data.consents || []);
      }
    } catch (error) {
      toast.error("Failed to load consent data");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRecordTypeChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      recordTypesAllowed: checked
        ? [...prev.recordTypesAllowed, value]
        : prev.recordTypesAllowed.filter((t) => t !== value),
    }));
  };

  const handleRequestConsent = async (e) => {
    e.preventDefault();
    try {
      if (!formData.patientId.trim()) {
        toast.error("Please enter a patient email or ID");
        return;
      }

      const requestData = {
        ...formData,
        expiryDate: formData.expiryDate
          ? new Date(formData.expiryDate).toISOString()
          : null,
      };

      await consentAPI.requestConsent(requestData);
      toast.success("Access request sent to patient");
      setFormData({
        patientId: "",
        consentType: "all_records",
        recordTypesAllowed: [],
        accessScope: "read_only",
        reason: "",
        expiryDate: "",
      });
      setShowRequestForm(false);
      fetchData();
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Failed to request consent";
      toast.error(msg);
      console.error("Consent request error:", {
        error,
        response: error.response?.data,
      });
    }
  };

  const handleApproveConsent = async (id) => {
    try {
      await consentAPI.approveConsent(id);
      toast.success("Access request approved");
      fetchData();
    } catch (error) {
      toast.error("Failed to approve consent");
    }
  };

  const handleRejectConsent = async (id) => {
    try {
      await consentAPI.rejectConsent(id, { reason: "Rejected by patient" });
      toast.success("Access request rejected");
      fetchData();
    } catch (error) {
      toast.error("Failed to reject consent");
    }
  };

  const handleRevokeConsent = async (id) => {
    if (window.confirm("Are you sure you want to revoke this access?")) {
      try {
        await consentAPI.revokeConsent(id);
        toast.success("Access revoked");
        fetchData();
      } catch (error) {
        toast.error("Failed to revoke consent");
      }
    }
  };

  const handleViewPatientRecords = async (consent) => {
    try {
      setRecordsLoading(true);
      setShowRecordsModal(true);
      // Fetch records for the consented patient
      const response = await patientAPI.getPatientRecords(
        consent.patientId._id,
      );
      setSelectedPatientRecords({
        patientId: consent.patientId._id,
        patientName: `${consent.patientId.firstName} ${consent.patientId.lastName}`,
        records: response.data?.records || response.data || [],
        consent,
      });
    } catch (error) {
      toast.error(
        "Failed to load patient records: " +
          (error.response?.data?.message || error.message),
      );
      console.error("Records fetch error:", error);
      setShowRecordsModal(false);
    } finally {
      setRecordsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="appointment-container">
        <p>Loading consent data...</p>
      </div>
    );
  }

  return (
    <div className="appointment-container">
      <h2>Manage Access & Consents</h2>

      {user.role === "professional" && (
        <div style={{ marginBottom: "2rem" }}>
          <button
            className="btn btn-primary"
            onClick={() => setShowRequestForm(!showRequestForm)}
          >
            {showRequestForm ? "Cancel" : "+ Request Access"}
          </button>

          {showRequestForm && (
            <div className="appointment-card">
              <h3>Request Access to Patient Records</h3>
              <form onSubmit={handleRequestConsent}>
                <div className="form-group">
                  <label>Patient ID (Email or ID) *</label>
                  <input
                    type="text"
                    name="patientId"
                    value={formData.patientId}
                    onChange={handleInputChange}
                    placeholder="Enter patient email (e.g., patient@example.com) or ID"
                    required
                  />
                  <small
                    style={{
                      display: "block",
                      marginTop: "0.25rem",
                      color: "#7f8c8d",
                    }}
                  >
                    Enter patient's email address or unique ID
                  </small>
                </div>

                <div className="form-group">
                  <label>Access Type *</label>
                  <select
                    name="consentType"
                    value={formData.consentType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="all_records">All Records</option>
                    <option value="specific_records">Specific Records</option>
                    <option value="record_type">By Record Type</option>
                  </select>
                </div>

                {formData.consentType === "record_type" && (
                  <div className="form-group">
                    <label>Record Types</label>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5rem",
                      }}
                    >
                      {[
                        "prescription",
                        "lab_report",
                        "medical_history",
                        "vaccination",
                        "surgery",
                      ].map((type) => (
                        <label
                          key={type}
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          <input
                            type="checkbox"
                            value={type}
                            checked={formData.recordTypesAllowed.includes(type)}
                            onChange={handleRecordTypeChange}
                            style={{ marginRight: "0.5rem" }}
                          />
                          {type.replace(/_/g, " ").toUpperCase()}
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label>Access Scope *</label>
                  <select
                    name="accessScope"
                    value={formData.accessScope}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="read_only">Read Only</option>
                    <option value="read_write">Read & Write</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Reason for Access</label>
                  <textarea
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    placeholder="e.g., Follow-up consultation"
                    rows="3"
                  ></textarea>
                </div>

                <div className="form-group">
                  <label>Access Expiry Date</label>
                  <input
                    type="datetime-local"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                  />
                </div>

                <button type="submit" className="btn btn-primary">
                  Send Request
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {user.role === "patient" && pendingRequests.length > 0 && (
        <div style={{ marginBottom: "3rem" }}>
          <h3 style={{ marginBottom: "1.5rem", color: "#2c3e50" }}>
            Pending Access Requests ({pendingRequests.length})
          </h3>
          <div className="appointments-grid">
            {pendingRequests.map((request) => (
              <div key={request._id} className="appointment-card">
                <div className="appointment-header">
                  <h3>Access Request</h3>
                  <span
                    style={{
                      backgroundColor: "#f39c12",
                      color: "white",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "4px",
                      fontSize: "0.75rem",
                    }}
                  >
                    Pending
                  </span>
                </div>

                <div className="appointment-details">
                  <p>
                    <strong>Healthcare Professional:</strong>{" "}
                    {request.professionalId.firstName}{" "}
                    {request.professionalId.lastName}
                  </p>
                  <p>
                    <strong>Email:</strong> {request.professionalId.email}
                  </p>
                  <p>
                    <strong>Access Type:</strong>{" "}
                    {request.consentType.replace(/_/g, " ").toUpperCase()}
                  </p>
                  {request.reason && (
                    <p>
                      <strong>Reason:</strong> {request.reason}
                    </p>
                  )}
                  {request.expiryDate && (
                    <p>
                      <strong>Expires:</strong>{" "}
                      {new Date(request.expiryDate).toLocaleDateString()}
                    </p>
                  )}
                </div>

                <div className="action-buttons">
                  <button
                    className="btn btn-success"
                    onClick={() => handleApproveConsent(request._id)}
                  >
                    Approve
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleRejectConsent(request._id)}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 style={{ marginBottom: "1.5rem", color: "#2c3e50" }}>
          {user.role === "patient" ? "Approved Access" : "Patient Access"}
        </h3>
        {consents.length === 0 ? (
          <div className="empty-state">
            <p>
              {user.role === "patient"
                ? "No approved access yet"
                : "No access granted yet"}
            </p>
          </div>
        ) : (
          <div className="appointments-grid">
            {consents.map((consent) => (
              <div key={consent._id} className="appointment-card">
                <div className="appointment-header">
                  <h3>
                    {user.role === "patient"
                      ? `Dr. ${consent.professionalId.firstName} ${consent.professionalId.lastName}`
                      : consent.patientId.firstName +
                        " " +
                        consent.patientId.lastName}
                  </h3>
                  <span
                    style={{
                      backgroundColor:
                        consent.status === "approved"
                          ? "#27ae60"
                          : consent.status === "revoked"
                            ? "#e74c3c"
                            : "#95a5a6",
                      color: "white",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "4px",
                      fontSize: "0.75rem",
                      textTransform: "capitalize",
                    }}
                  >
                    {consent.status}
                  </span>
                </div>

                <div className="appointment-details">
                  <p>
                    <strong>Email:</strong>{" "}
                    {user.role === "patient"
                      ? consent.professionalId.email
                      : consent.patientId.email}
                  </p>
                  <p>
                    <strong>Access Type:</strong>{" "}
                    {consent.consentType.replace(/_/g, " ").toUpperCase()}
                  </p>
                  <p>
                    <strong>Scope:</strong>{" "}
                    {consent.accessScope === "read_only"
                      ? "View Only"
                      : "View & Edit"}
                  </p>
                  {consent.expiryDate && (
                    <p>
                      <strong>Expires:</strong>{" "}
                      {new Date(consent.expiryDate).toLocaleDateString()}
                    </p>
                  )}
                </div>

                {user.role === "patient" && consent.status === "approved" && (
                  <button
                    className="btn btn-danger"
                    onClick={() => handleRevokeConsent(consent._id)}
                    style={{ width: "100%", marginTop: "1rem" }}
                  >
                    Revoke Access
                  </button>
                )}

                {user.role === "professional" &&
                  consent.status === "approved" && (
                    <button
                      className="btn btn-primary"
                      onClick={() => handleViewPatientRecords(consent)}
                      style={{ width: "100%", marginTop: "1rem" }}
                    >
                      View Patient Records
                    </button>
                  )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Records Modal */}
      {showRecordsModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowRecordsModal(false)}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "2rem",
              maxWidth: "600px",
              width: "90%",
              maxHeight: "80vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <h3>{selectedPatientRecords?.patientName}'s Medical Records</h3>
              <button
                onClick={() => setShowRecordsModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  color: "#7f8c8d",
                }}
              >
                ✕
              </button>
            </div>

            {recordsLoading ? (
              <p style={{ textAlign: "center", color: "#7f8c8d" }}>
                Loading records...
              </p>
            ) : selectedPatientRecords?.records?.length === 0 ? (
              <p style={{ textAlign: "center", color: "#7f8c8d" }}>
                No records found.
              </p>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                {selectedPatientRecords?.records?.map((record, idx) => (
                  <div
                    key={idx}
                    style={{
                      border: "1px solid #ecf0f1",
                      borderRadius: "6px",
                      padding: "1rem",
                      backgroundColor: "#f9fafb",
                    }}
                  >
                    <h4
                      style={{
                        marginTop: 0,
                        marginBottom: "0.5rem",
                        color: "#2c3e50",
                      }}
                    >
                      {record.recordType || "Medical Record"}
                    </h4>
                    <p style={{ marginBottom: "0.25rem", color: "#7f8c8d" }}>
                      <strong>Date:</strong>{" "}
                      {new Date(record.createdAt).toLocaleDateString()}
                    </p>
                    {record.description && (
                      <p style={{ marginBottom: "0.25rem", color: "#34495e" }}>
                        <strong>Description:</strong> {record.description}
                      </p>
                    )}
                    {record.notes && (
                      <p style={{ marginBottom: "0.25rem", color: "#34495e" }}>
                        <strong>Notes:</strong> {record.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
