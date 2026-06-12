"use client";
import { useState, useEffect } from "react";
import styles from "./UKCharitiesForm.module.css";

export default function UKCharitiesForm() {
  const [formData, setFormData] = useState({
    name: "",
    Url: "",
  });
  const [companies, setCompanies] = useState([""]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [existingData, setExistingData] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [expandedCharity, setExpandedCharity] = useState(null);
  const [showAddCompanyModal, setShowAddCompanyModal] = useState(false);
  const [selectedCharityId, setSelectedCharityId] = useState(null);
  const [newCompanyName, setNewCompanyName] = useState("");
  const [showEditUrlModal, setShowEditUrlModal] = useState(false);
  const [editUrlValue, setEditUrlValue] = useState("");

  // Fetch existing data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setFetchLoading(true);
    try {
      const response = await fetch("/api/getUkcharity");
      if (response.ok) {
        const result = await response.json();
        setExistingData(result.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCompanyChange = (index, value) => {
    const updated = [...companies];
    updated[index] = value;
    setCompanies(updated);
  };

  const addCompanyField = () => {
    setCompanies([...companies, ""]);
  };

  const removeCompanyField = (index) => {
    if (companies.length > 1) {
      setCompanies(companies.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    const filteredCompanies = companies.filter((c) => c.trim() !== "");

    if (filteredCompanies.length === 0) {
      setMessage({
        text: "At least one company is required",
        type: "error",
      });
      setLoading(false);
      return;
    }

    const submitData = {
      name: formData.name,
      companies: filteredCompanies,
      Url: formData.Url,
    };

    try {
      const response = await fetch("/api/getUkcharity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          text: "Charity created successfully!",
          type: "success",
        });
        setFormData({ name: "", Url: "" });
        setCompanies([""]);
        fetchData();
      } else {
        setMessage({
          text: data.message || "Failed to create charity",
          type: "error",
        });
      }
    } catch (error) {
      setMessage({
        text: "An error occurred. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCharity = async (id) => {
    if (!confirm("Are you sure you want to delete this charity?")) {
      return;
    }

    try {
      const response = await fetch(`/api/ukcharity/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "delete-alliance" }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ text: "Charity deleted successfully!", type: "success" });
        fetchData();
      } else {
        setMessage({
          text: data.message || "Failed to delete charity",
          type: "error",
        });
      }
    } catch (error) {
      setMessage({
        text: "An error occurred. Please try again.",
        type: "error",
      });
    }
  };

  const openAddCompanyModal = (charityId) => {
    setSelectedCharityId(charityId);
    setNewCompanyName("");
    setShowAddCompanyModal(true);
  };

  const closeAddCompanyModal = () => {
    setShowAddCompanyModal(false);
    setSelectedCharityId(null);
    setNewCompanyName("");
  };

  const handleAddCompany = async (e) => {
    e.preventDefault();

    if (!newCompanyName.trim()) return;

    try {
      const response = await fetch(`/api/ukcharity/${selectedCharityId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "add-company",
          company: newCompanyName.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ text: "Company added successfully!", type: "success" });
        closeAddCompanyModal();
        fetchData();
      } else {
        setMessage({
          text: data.message || "Failed to add company",
          type: "error",
        });
      }
    } catch (error) {
      setMessage({
        text: "An error occurred. Please try again.",
        type: "error",
      });
    }
  };

  const handleRemoveCompany = async (charityId, companyName) => {
    if (!confirm(`Remove ${companyName} from this charity?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/ukcharity/${charityId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "remove-company",
          company: companyName,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ text: "Company removed successfully!", type: "success" });
        fetchData();
      } else {
        setMessage({
          text: data.message || "Failed to remove company",
          type: "error",
        });
      }
    } catch (error) {
      setMessage({
        text: "An error occurred. Please try again.",
        type: "error",
      });
    }
  };

  const openEditUrlModal = (charityId) => {
    const charity = existingData.find((c) => c._id === charityId);
    setSelectedCharityId(charityId);
    setEditUrlValue(charity?.Url || "");
    setShowEditUrlModal(true);
  };

  const closeEditUrlModal = () => {
    setShowEditUrlModal(false);
    setSelectedCharityId(null);
    setEditUrlValue("");
  };

  const handleUpdateUrl = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/ukcharity/${selectedCharityId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "update-url",
          Url: editUrlValue,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ text: "URL updated successfully!", type: "success" });
        closeEditUrlModal();
        fetchData();
      } else {
        setMessage({
          text: data.message || "Failed to update URL",
          type: "error",
        });
      }
    } catch (error) {
      setMessage({
        text: "An error occurred. Please try again.",
        type: "error",
      });
    }
  };

  return (
    <>
      {/* Add Company Modal */}
      {showAddCompanyModal && (
        <div className={styles.modalOverlay} onClick={closeAddCompanyModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Add Partner Company</h3>
              <button
                onClick={closeAddCompanyModal}
                className={styles.modalCloseButton}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAddCompany} className={styles.modalForm}>
              <div className={styles.formGroup}>
                <label htmlFor="newCompanyName" className={styles.label}>
                  Company Name <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  id="newCompanyName"
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  className={styles.input}
                  placeholder="e.g., Tesco, Sainsbury's"
                  autoFocus
                  required
                />
              </div>
              <div className={styles.modalActions}>
                <button
                  type="button"
                  onClick={closeAddCompanyModal}
                  className={styles.modalCancelButton}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.modalSubmitButton}>
                  Add Company
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit URL Modal */}
      {showEditUrlModal && (
        <div className={styles.modalOverlay} onClick={closeEditUrlModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Edit Website URL</h3>
              <button
                onClick={closeEditUrlModal}
                className={styles.modalCloseButton}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleUpdateUrl} className={styles.modalForm}>
              <div className={styles.formGroup}>
                <label htmlFor="editUrlValue" className={styles.label}>
                  Website URL
                </label>
                <input
                  type="url"
                  id="editUrlValue"
                  value={editUrlValue}
                  onChange={(e) => setEditUrlValue(e.target.value)}
                  className={styles.input}
                  placeholder="https://example.com"
                  autoFocus
                />
              </div>
              <div className={styles.modalActions}>
                <button
                  type="button"
                  onClick={closeEditUrlModal}
                  className={styles.modalCancelButton}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.modalSubmitButton}>
                  Update URL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className={styles.container}>
        <div className={styles.formWrapper}>
          <h2 className={styles.title}>Add UK Charity</h2>

          {message.text && (
            <div className={`${styles.message} ${styles[message.type]}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>
                Charity Name <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={styles.input}
                placeholder="e.g., FareShare"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="Url" className={styles.label}>
                Website URL
              </label>
              <input
                type="url"
                id="Url"
                name="Url"
                value={formData.Url}
                onChange={handleChange}
                className={styles.input}
                placeholder="https://example.com"
              />
            </div>

            <div className={styles.companiesSection}>
              <div className={styles.companiesSectionHeader}>
                <label className={styles.label}>
                  Partner Companies <span className={styles.required}>*</span>
                </label>
                <button
                  type="button"
                  onClick={addCompanyField}
                  className={styles.addButton}
                >
                  + Add Company
                </button>
              </div>

              {companies.map((company, index) => (
                <div key={index} className={styles.companyItem}>
                  <span className={styles.itemNumber}>{index + 1}.</span>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => handleCompanyChange(index, e.target.value)}
                    className={styles.input}
                    placeholder="e.g., Tesco, Sainsbury's"
                  />
                  {companies.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCompanyField(index)}
                      className={styles.removeButtonSmall}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Charity"}
            </button>
          </form>
        </div>

        {/* Existing Charities List */}
        <div className={styles.dataTableWrapper}>
          <h2 className={styles.title}>Existing Charities</h2>

          {fetchLoading ? (
            <div className={styles.loadingState}>Loading data...</div>
          ) : existingData.length === 0 ? (
            <div className={styles.emptyState}>
              No charities found. Add one using the form above.
            </div>
          ) : (
            <div className={styles.charitiesList}>
              {existingData.map((charity) => (
                <div key={charity._id} className={styles.charityCard}>
                  <div className={styles.charityCardHeader}>
                    <div className={styles.charityInfo}>
                      <h3 className={styles.charityName}>{charity.name}</h3>
                      {charity.Url && (
                        <a
                          href={charity.Url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.charityUrl}
                        >
                          🔗 {charity.Url}
                        </a>
                      )}
                      <span className={styles.companyCount}>
                        {charity.companies?.length || 0} partner companies
                      </span>
                    </div>
                    <div className={styles.actionButtons}>
                      <button
                        onClick={() => openEditUrlModal(charity._id)}
                        className={styles.editButton}
                        title="Update URL"
                      >
                        Edit URL
                      </button>
                      <button
                        onClick={() => openAddCompanyModal(charity._id)}
                        className={styles.addCompanyButton}
                        title="Add company"
                      >
                        + Add Company
                      </button>
                      <button
                        onClick={() => handleDeleteCharity(charity._id)}
                        className={styles.deleteButton}
                      >
                        Delete
                      </button>
                      <button
                        onClick={() =>
                          setExpandedCharity(
                            expandedCharity === charity._id
                              ? null
                              : charity._id,
                          )
                        }
                        className={styles.expandButton}
                      >
                        {expandedCharity === charity._id ? "▲ Hide" : "▼ Show"}{" "}
                        Companies
                      </button>
                    </div>
                  </div>

                  {expandedCharity === charity._id && charity.companies && (
                    <div className={styles.expandedData}>
                      <h4 className={styles.companiesTitle}>
                        Partner Companies:
                      </h4>
                      <div className={styles.companiesGrid}>
                        {charity.companies.map((company, idx) => (
                          <div key={idx} className={styles.companyChip}>
                            <span className={styles.companyChipName}>
                              {company}
                            </span>
                            <button
                              onClick={() =>
                                handleRemoveCompany(charity._id, company)
                              }
                              className={styles.companyChipRemove}
                              title="Remove company"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
