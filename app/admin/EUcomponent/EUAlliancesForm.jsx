"use client";
import { useState, useEffect } from "react";
import styles from "./EUAlliancesForm.module.css";

export default function EUAlliancesForm() {
  const [formData, setFormData] = useState({
    name: "",
    link: "",
  });
  const [companies, setCompanies] = useState([""]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [existingData, setExistingData] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [expandedAlliance, setExpandedAlliance] = useState(null);
  const [showAddCompanyModal, setShowAddCompanyModal] = useState(false);
  const [selectedAllianceId, setSelectedAllianceId] = useState(null);
  const [newCompanyName, setNewCompanyName] = useState("");
  const [showEditLinkModal, setShowEditLinkModal] = useState(false);
  const [editLinkValue, setEditLinkValue] = useState("");

  // Fetch existing data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setFetchLoading(true);
    try {
      const response = await fetch("/api/EU/eualiance");
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
      link: formData.link,
    };

    try {
      const response = await fetch("/api/EU/eualiance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          text: "Alliance created successfully!",
          type: "success",
        });
        setFormData({ name: "", link: "" });
        setCompanies([""]);
        fetchData();
      } else {
        setMessage({
          text: data.message || "Failed to create alliance",
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

  const handleDeleteAlliance = async (id) => {
    if (!confirm("Are you sure you want to delete this alliance?")) {
      return;
    }

    try {
      const response = await fetch(`/api/EU/editeualiance/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ text: "Alliance deleted successfully!", type: "success" });
        fetchData();
      } else {
        setMessage({
          text: data.message || "Failed to delete alliance",
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

  const openAddCompanyModal = (allianceId) => {
    setSelectedAllianceId(allianceId);
    setNewCompanyName("");
    setShowAddCompanyModal(true);
  };

  const closeAddCompanyModal = () => {
    setShowAddCompanyModal(false);
    setSelectedAllianceId(null);
    setNewCompanyName("");
  };

  const handleAddCompany = async (e) => {
    e.preventDefault();

    if (!newCompanyName.trim()) return;

    try {
      const response = await fetch(
        `/api/EU/editeualiance/${selectedAllianceId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "add-company",
            company: newCompanyName.trim(),
          }),
        },
      );

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

  const handleRemoveCompany = async (allianceId, companyName) => {
    if (!confirm(`Remove ${companyName} from this alliance?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/EU/editeualiance/${allianceId}`, {
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

  const openEditLinkModal = (allianceId) => {
    const alliance = existingData.find((a) => a._id === allianceId);
    setSelectedAllianceId(allianceId);
    setEditLinkValue(alliance?.link || "");
    setShowEditLinkModal(true);
  };

  const closeEditLinkModal = () => {
    setShowEditLinkModal(false);
    setSelectedAllianceId(null);
    setEditLinkValue("");
  };

  const handleUpdateLink = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `/api/EU/editeualiance/${selectedAllianceId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "update-link",
            link: editLinkValue,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setMessage({ text: "Link updated successfully!", type: "success" });
        closeEditLinkModal();
        fetchData();
      } else {
        setMessage({
          text: data.message || "Failed to update link",
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
                  placeholder="e.g., Carrefour, Aldi"
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

      {/* Edit Link Modal */}
      {showEditLinkModal && (
        <div className={styles.modalOverlay} onClick={closeEditLinkModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Edit Website Link</h3>
              <button
                onClick={closeEditLinkModal}
                className={styles.modalCloseButton}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleUpdateLink} className={styles.modalForm}>
              <div className={styles.formGroup}>
                <label htmlFor="editLinkValue" className={styles.label}>
                  Website Link
                </label>
                <input
                  type="url"
                  id="editLinkValue"
                  value={editLinkValue}
                  onChange={(e) => setEditLinkValue(e.target.value)}
                  className={styles.input}
                  placeholder="https://example.com"
                  autoFocus
                />
              </div>
              <div className={styles.modalActions}>
                <button
                  type="button"
                  onClick={closeEditLinkModal}
                  className={styles.modalCancelButton}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.modalSubmitButton}>
                  Update Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className={styles.container}>
        <div className={styles.formWrapper}>
          <h2 className={styles.title}>Add EU Alliance</h2>

          {message.text && (
            <div className={`${styles.message} ${styles[message.type]}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>
                Alliance Name <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={styles.input}
                placeholder="e.g., EU Retail Action Group"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="link" className={styles.label}>
                Website Link
              </label>
              <input
                type="url"
                id="link"
                name="link"
                value={formData.link}
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
                    placeholder="e.g., Carrefour, Aldi, Lidl"
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
              {loading ? "Creating..." : "Create Alliance"}
            </button>
          </form>
        </div>

        {/* Existing Alliances List */}
        <div className={styles.dataTableWrapper}>
          <h2 className={styles.title}>Existing Alliances</h2>

          {fetchLoading ? (
            <div className={styles.loadingState}>Loading data...</div>
          ) : existingData.length === 0 ? (
            <div className={styles.emptyState}>
              No alliances found. Add one using the form above.
            </div>
          ) : (
            <div className={styles.alliancesList}>
              {existingData.map((alliance) => (
                <div key={alliance._id} className={styles.allianceCard}>
                  <div className={styles.allianceCardHeader}>
                    <div className={styles.allianceInfo}>
                      <h3 className={styles.allianceName}>{alliance.name}</h3>
                      {alliance.link && (
                        <a
                          href={alliance.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.allianceLink}
                        >
                          🔗 {alliance.link}
                        </a>
                      )}
                      <span className={styles.companyCount}>
                        {alliance.companies?.length || 0} partner companies
                      </span>
                    </div>
                    <div className={styles.actionButtons}>
                      <button
                        onClick={() => openEditLinkModal(alliance._id)}
                        className={styles.editButton}
                        title="Update Link"
                      >
                        Edit Link
                      </button>
                      <button
                        onClick={() => openAddCompanyModal(alliance._id)}
                        className={styles.addCompanyButton}
                        title="Add company"
                      >
                        + Add Company
                      </button>
                      <button
                        onClick={() => handleDeleteAlliance(alliance._id)}
                        className={styles.deleteButton}
                      >
                        Delete
                      </button>
                      <button
                        onClick={() =>
                          setExpandedAlliance(
                            expandedAlliance === alliance._id
                              ? null
                              : alliance._id,
                          )
                        }
                        className={styles.expandButton}
                      >
                        {expandedAlliance === alliance._id
                          ? "▲ Hide"
                          : "▼ Show"}{" "}
                        Companies
                      </button>
                    </div>
                  </div>

                  {expandedAlliance === alliance._id && alliance.companies && (
                    <div className={styles.expandedData}>
                      <h4 className={styles.companiesTitle}>
                        Partner Companies:
                      </h4>
                      <div className={styles.companiesGrid}>
                        {alliance.companies.map((company, idx) => (
                          <div key={idx} className={styles.companyChip}>
                            <span className={styles.companyChipName}>
                              {company}
                            </span>
                            <button
                              onClick={() =>
                                handleRemoveCompany(alliance._id, company)
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
