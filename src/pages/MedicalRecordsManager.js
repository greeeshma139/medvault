import React, { useState, useEffect } from "react";
import { patientAPI } from "../services/api";
import { toast } from "react-toastify";
import "../styles/appointments.css";

export default function MedicalRecordsManager() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [formData, setFormData] = useState({
    recordType: "other",
    title: "",
    description: "",
    fileName: "",
    fileUrl: "",
  });
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const res = await patientAPI.getRecords();
      setRecords(res.data.records || []);
    } catch (error) {
      toast.error("Failed to load medical records");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      if (!formData.title || !formData.recordType) {
        toast.error("Please fill in required fields");
        return;
      }

      const uploadData = {
        recordType: formData.recordType,
        title: formData.title,
        description: formData.description,
      };

      const res = await patientAPI.createRecord(uploadData);
      toast.success("Record created successfully");

      if (formData.fileName && formData.fileUrl) {
        await patientAPI.addDocument(res.data.record._id, {
          fileName: formData.fileName,
          fileUrl: formData.fileUrl,
        });
        toast.success("Document added to record");
      }

      setFormData({
        recordType: "other",
        title: "",
        description: "",
        fileName: "",
        fileUrl: "",
      });
      setShowUploadForm(false);
      fetchRecords();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create record");
    }
  };

  const handleDelete = async (recordId) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await patientAPI.deleteRecord(recordId);
        toast.success("Record deleted successfully");
        fetchRecords();
      } catch (error) {
        toast.error("Failed to delete record");
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        title: selectedRecord.title,
        description: selectedRecord.description,
      };

      await patientAPI.updateRecord(selectedRecord._id, updateData);
      toast.success("Record updated successfully");
      setIsEditing(false);
      setSelectedRecord(null);
      fetchRecords();
    } catch (error) {
      toast.error("Failed to update record");
    }
  };

  const filteredRecords =
    filter === "all" ? records : records.filter((r) => r.recordType === filter);

  const recordTypes = ["all", ...new Set(records.map((r) => r.recordType))];

  if (loading) {
    return (
      <div className="appointment-container">
        <p>Loading medical records...</p>
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
        <h2>Medical Records</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowUploadForm(!showUploadForm)}
        >
          {showUploadForm ? "Cancel" : "+ Upload Record"}
        </button>
      </div>

      {showUploadForm && (
        <div className="appointment-card">
          <h3>Upload New Medical Record</h3>
          <form onSubmit={handleUpload}>
            <div className="form-row">
              <div className="form-group">
                <label>Record Type *</label>
                <select
                  name="recordType"
                  value={formData.recordType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="prescription">Prescription</option>
                  <option value="lab_report">Lab Report</option>
                  <option value="medical_history">Medical History</option>
                  <option value="vaccination">Vaccination</option>
                  <option value="surgery">Surgery</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., COVID-19 Vaccination"
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
                <label>Document Name (if available)</label>
                <input
                  type="text"
                  name="fileName"
                  value={formData.fileName}
                  onChange={handleInputChange}
                  placeholder="e.g., vaccination_certificate.pdf"
                />
              </div>
              <div className="form-group">
                <label>Document URL</label>
                <input
                  type="url"
                  name="fileUrl"
                  value={formData.fileUrl}
                  onChange={handleInputChange}
                  placeholder="https://..."
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary">
              Upload Record
            </button>
          </form>
        </div>
      )}

      {records.length > 0 && (
        <div style={{ marginBottom: "1.5rem" }}>
          <label>Filter by type: </label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              padding: "0.5rem",
              borderRadius: "4px",
              border: "1px solid #ecf0f1",
            }}
          >
            {recordTypes.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() +
                  type.slice(1).replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>
      )}

      {filteredRecords.length === 0 ? (
        <div className="empty-state">
          <p>No medical records found</p>
        </div>
      ) : (
        <div className="appointments-grid">
          {filteredRecords.map((record) => (
            <div key={record._id} className="appointment-card">
              <div className="appointment-header">
                <div>
                  <h3>{record.title}</h3>
                  <p
                    style={{
                      fontSize: "0.9rem",
                      color: "#7f8c8d",
                      margin: "0.3rem 0",
                    }}
                  >
                    {record.recordType.replace(/_/g, " ").toUpperCase()}
                  </p>
                </div>
              </div>

              {!isEditing || selectedRecord?._id !== record._id ? (
                <div className="appointment-details">
                  {record.description && (
                    <p>
                      <strong>Description:</strong> {record.description}
                    </p>
                  )}
                  {record.diagnosis && (
                    <p>
                      <strong>Diagnosis:</strong> {record.diagnosis}
                    </p>
                  )}
                  {record.treatment && (
                    <p>
                      <strong>Treatment:</strong> {record.treatment}
                    </p>
                  )}
                  {record.medicines && record.medicines.length > 0 && (
                    <div>
                      <strong>Medicines:</strong>
                      <ul>
                        {record.medicines.map((m, i) => (
                          <li key={i}>
                            {m.name} - {m.dosage} ({m.frequency})
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {record.documents && record.documents.length > 0 && (
                    <div>
                      <strong>Documents:</strong>
                      <ul>
                        {record.documents.map((doc, i) => (
                          <li key={i}>
                            <a
                              href={doc.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {doc.fileName}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "#95a5a6",
                      marginTop: "1rem",
                    }}
                  >
                    {new Date(record.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleUpdate}>
                  <div className="form-group">
                    <label>Title</label>
                    <input
                      type="text"
                      value={selectedRecord.title}
                      onChange={(e) =>
                        setSelectedRecord({
                          ...selectedRecord,
                          title: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={selectedRecord.description || ""}
                      onChange={(e) =>
                        setSelectedRecord({
                          ...selectedRecord,
                          description: e.target.value,
                        })
                      }
                      rows="3"
                    ></textarea>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button type="submit" className="btn btn-primary">
                      Save
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setIsEditing(false);
                        setSelectedRecord(null);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              <div className="action-buttons" style={{ marginTop: "1rem" }}>
                {!isEditing || selectedRecord?._id !== record._id ? (
                  <>
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        setSelectedRecord(record);
                        setIsEditing(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(record._id)}
                    >
                      Delete
                    </button>
                  </>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
