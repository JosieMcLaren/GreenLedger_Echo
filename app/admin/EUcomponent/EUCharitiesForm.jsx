"use client";
import { useState, useEffect } from "react";
import styles from "./EUCharitiesForm.module.css";

const PREDEFINED_SECTOR_OPTIONS = [
  { value: "supermarkets", label: "Supermarkets" },
  { value: "manufacturers", label: "Manufacturers" },
  { value: "distributors", label: "Distributors" },
  { value: "restaurants", label: "Restaurants" },
  { value: "contract-caterers", label: "Contract Caterers" },
  { value: "", label: "Untagged" },
];

export const getSectorLabel = (sector) => {
  if (!sector || !sector.trim()) return "Untagged";
  const match = PREDEFINED_SECTOR_OPTIONS.find(
    (opt) => opt.value === sector.toLowerCase().trim()
  );
  if (match && match.value !== "") return match.label;
  return sector
    .split(/[\s-_]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
};

export default function EUCharitiesForm() {
  const [formData, setFormData] = useState({
    name: "",
    Url: "",
    sector: "supermarkets",
  });
  const [isCustomSector, setIsCustomSector] = useState(false);
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
  const [showEditSectorModal, setShowEditSectorModal] = useState(false);
  const [editSectorValue, setEditSectorValue] = useState("");
  const [editCustomSector, setEditCustomSector] = useState(false);

  // Fetch existing data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setFetchLoading(true);
    try {
      const response = await fetch("/api/EU/eucharity");
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
      sector: formData.sector || "",
    };

    try {
      const response = await fetch("/api/EU/eucharity", {
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
        setIsCustomSector(false);
        setFormData({ name: "", Url: "", sector: "supermarkets" });
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
      const response = await fetch(`/api/EU/editeucharity/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "delete-charity" }),
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
      const response = await fetch(
        `/api/EU/editeucharity/${selectedCharityId}`,
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

  const handleRemoveCompany = async (charityId, companyName) => {
    if (!confirm(`Remove ${companyName} from this charity?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/EU/editeucharity/${charityId}`, {
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
      const response = await fetch(
        `/api/EU/editeucharity/${selectedCharityId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "update-Url",
            Url: editUrlValue,
          }),
        },
      );

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

  const openEditSectorModal = (charityId) => {
    const charity = existingData.find((c) => c._id === charityId);
    setSelectedCharityId(charityId);
    const currentSector = charity?.sector || "";
    setEditSectorValue(currentSector);
    const isStandard = PREDEFINED_SECTOR_OPTIONS.some(
      (opt) => opt.value === currentSector.toLowerCase()
    );
    setEditCustomSector(!isStandard && currentSector !== "");
    setShowEditSectorModal(true);
  };

  const closeEditSectorModal = () => {
    setShowEditSectorModal(false);
    setSelectedCharityId(null);
    setEditSectorValue("");
    setEditCustomSector(false);
  };

  const handleUpdateSector = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `/api/EU/editeucharity/${selectedCharityId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "update-sector",
            sector: editSectorValue || "",
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage({ text: "Sector updated successfully!", type: "success" });
        closeEditSectorModal();
        fetchData();
      } else {
        setMessage({
          text: data.message || "Failed to update sector",
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

      {/* Edit Sector Modal */}
      {showEditSectorModal && (
        <div className={styles.modalOverlay} onClick={closeEditSectorModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Edit Sector</h3>
              <button
                onClick={closeEditSectorModal}
                className={styles.modalCloseButton}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleUpdateSector} className={styles.modalForm}>
              <div className={styles.formGroup}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <label htmlFor="editSectorValue" className={styles.label} style={{ margin: 0 }}>
                    Sector
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const next = !editCustomSector;
                      setEditCustomSector(next);
                      if (!next && !PREDEFINED_SECTOR_OPTIONS.some((o) => o.value === (editSectorValue || "").toLowerCase())) {
                        setEditSectorValue("supermarkets");
                      }
                    }}
                    className={styles.toggleSectorModeBtn}
                  >
                    {editCustomSector ? "← Choose Predefined" : "+ Custom Sector"}
                  </button>
                </div>

                {editCustomSector ? (
                  <input
                    type="text"
                    id="editSectorValue"
                    value={editSectorValue}
                    onChange={(e) => setEditSectorValue(e.target.value)}
                    className={styles.input}
                    placeholder="e.g. Wholesalers, Food Service..."
                    autoFocus
                  />
                ) : (
                  <select
                    id="editSectorValue"
                    value={editSectorValue}
                    onChange={(e) => {
                      if (e.target.value === "__custom__") {
                        setEditCustomSector(true);
                        setEditSectorValue("");
                      } else {
                        setEditSectorValue(e.target.value);
                      }
                    }}
                    className={styles.input}
                  >
                    <optgroup label="Predefined Sectors">
                      {PREDEFINED_SECTOR_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </optgroup>
                    <option value="__custom__">+ Enter Custom Sector...</option>
                  </select>
                )}
              </div>
              <div className={styles.modalActions}>
                <button
                  type="button"
                  onClick={closeEditSectorModal}
                  className={styles.modalCancelButton}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.modalSubmitButton}>
                  Update Sector
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
          <h2 className={styles.title}>Add EU Charity</h2>

          {message.text && (
            <div className={`${styles.message} ${styles[message.type]}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <label htmlFor="sector" className={styles.label} style={{ margin: 0 }}>
                  Sector Tag
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const nextMode = !isCustomSector;
                    setIsCustomSector(nextMode);
                    if (!nextMode && !PREDEFINED_SECTOR_OPTIONS.some((o) => o.value === (formData.sector || "").toLowerCase())) {
                      setFormData((prev) => ({ ...prev, sector: "supermarkets" }));
                    }
                  }}
                  className={styles.toggleSectorModeBtn}
                >
                  {isCustomSector ? "← Choose Predefined" : "+ Enter Custom Sector"}
                </button>
              </div>

              {isCustomSector ? (
                <input
                  type="text"
                  id="sector"
                  name="sector"
                  value={formData.sector}
                  onChange={handleChange}
                  placeholder="e.g. Wholesalers, Food Service..."
                  className={styles.input}
                />
              ) : (
                <select
                  id="sector"
                  name="sector"
                  value={formData.sector}
                  onChange={(e) => {
                    if (e.target.value === "__custom__") {
                      setIsCustomSector(true);
                      setFormData((prev) => ({ ...prev, sector: "" }));
                    } else {
                      handleChange(e);
                    }
                  }}
                  className={styles.input}
                >
                  <optgroup label="Predefined Sectors">
                    {PREDEFINED_SECTOR_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </optgroup>
                  <option value="__custom__">+ Enter Custom Sector...</option>
                </select>
              )}
            </div>

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
                placeholder="e.g., European Food Banks Federation"
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
                      <span className={styles.sectorBadge}>
                        {getSectorLabel(charity.sector)}
                      </span>
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
                        onClick={() => openEditSectorModal(charity._id)}
                        className={styles.editButton}
                        title="Update Sector"
                      >
                        Edit Sector
                      </button>
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
