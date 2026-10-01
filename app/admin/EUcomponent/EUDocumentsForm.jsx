"use client";
import { useState, useEffect } from "react";
import styles from "./EUDocumentsForm.module.css";

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

export default function EUDocumentsForm() {
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    annualReport: "",
    sustainability: "",
    integratedReport: "",
    other: "",
    sector: "supermarkets",
  });
  const [isCustomSector, setIsCustomSector] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [existingData, setExistingData] = useState([]);
  const [totals, setTotals] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  // Fetch existing data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setFetchLoading(true);
    try {
      const response = await fetch("/api/EU/eudoc");
      if (response.ok) {
        const result = await response.json();
        setExistingData(result.data);
        setTotals(result.totals);
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

  const handleEdit = (item) => {
    setEditingId(item._id);
    const itemSector = item.sector || "";
    const isPredefined = PREDEFINED_SECTOR_OPTIONS.some(
      (opt) => opt.value === itemSector.toLowerCase()
    );
    setIsCustomSector(!isPredefined && itemSector !== "");
    setFormData({
      from: item.from || "",
      to: item.to || "",
      annualReport: item.annualReport || "",
      sustainability: item.sustainability || "",
      integratedReport: item.integratedReport || "",
      other: item.other || "",
      sector: itemSector,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setIsCustomSector(false);
    setFormData({
      from: "",
      to: "",
      annualReport: "",
      sustainability: "",
      integratedReport: "",
      other: "",
      sector: "supermarkets",
    });
    setMessage({ text: "", type: "" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this document entry?")) {
      return;
    }

    try {
      const response = await fetch(`/api/EU/editeudoc/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ text: "Document deleted successfully!", type: "success" });
        fetchData();
      } else {
        setMessage({
          text: data.message || "Failed to delete document",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    // Prepare data for submission
    const submitData = {
      from: formData.from,
      to: formData.to,
      annualReport: formData.annualReport
        ? Number(formData.annualReport)
        : undefined,
      sustainability: formData.sustainability
        ? Number(formData.sustainability)
        : undefined,
      integratedReport: formData.integratedReport
        ? Number(formData.integratedReport)
        : undefined,
      other: formData.other ? Number(formData.other) : undefined,
      sector: formData.sector || "",
    };

    try {
      const url = editingId
        ? `/api/EU/editeudoc/${editingId}`
        : "/api/EU/eudoc";
      const method = editingId ? "PATCH" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          text: editingId
            ? "Document updated successfully!"
            : "Document submitted successfully!",
          type: "success",
        });
        setIsCustomSector(false);
        setFormData({
          from: "",
          to: "",
          annualReport: "",
          sustainability: "",
          integratedReport: "",
          other: "",
          sector: "supermarkets",
        });
        setEditingId(null);
        fetchData();
      } else {
        setMessage({
          text: data.message || "Failed to submit document",
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

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h2 className={styles.title}>
          {editingId ? "Edit EU Document" : "Submit EU Documents"}
        </h2>

        {message.text && (
          <div className={`${styles.message} ${styles[message.type]}`}>
            {message.text}
          </div>
        )}

        {editingId && (
          <div className={styles.editNotice}>
            <span>Editing mode active</span>
            <button
              type="button"
              onClick={handleCancelEdit}
              className={styles.cancelEditButton}
            >
              Cancel Edit
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup} style={{ marginBottom: "1.5rem" }}>
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
                {Array.from(
                  new Set(
                    existingData
                      .map((item) => item.sector?.trim())
                      .filter(
                        (s) =>
                          s &&
                          !PREDEFINED_SECTOR_OPTIONS.some(
                            (p) => p.value.toLowerCase() === s.toLowerCase()
                          )
                      )
                  )
                ).length > 0 && (
                  <optgroup label="Existing Custom Sectors">
                    {Array.from(
                      new Set(
                        existingData
                          .map((item) => item.sector?.trim())
                          .filter(
                            (s) =>
                              s &&
                              !PREDEFINED_SECTOR_OPTIONS.some(
                                (p) => p.value.toLowerCase() === s.toLowerCase()
                              )
                          )
                      )
                    ).map((sectorName) => (
                      <option key={sectorName} value={sectorName}>
                        {sectorName}
                      </option>
                    ))}
                  </optgroup>
                )}
                <option value="__custom__">➕ Add Custom Sector...</option>
              </select>
            )}
          </div>

          <div className={styles.yearRow}>
            <div className={styles.formGroup}>
              <label htmlFor="from" className={styles.label}>
                From Year <span className={styles.required}>*</span>
              </label>
              <input
                type="number"
                id="from"
                name="from"
                value={formData.from}
                onChange={handleChange}
                className={styles.input}
                placeholder="e.g., 2020"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="to" className={styles.label}>
                To Year <span className={styles.required}>*</span>
              </label>
              <input
                type="number"
                id="to"
                name="to"
                value={formData.to}
                onChange={handleChange}
                className={styles.input}
                placeholder="e.g., 2021"
                required
              />
            </div>
          </div>

          <div className={styles.documentsSection}>
            <h3 className={styles.sectionSubtitle}>Document Counts</h3>

            <div className={styles.formGroup}>
              <label htmlFor="annualReport" className={styles.label}>
                Annual Report
              </label>
              <input
                type="number"
                id="annualReport"
                name="annualReport"
                value={formData.annualReport}
                onChange={handleChange}
                className={styles.input}
                placeholder="Number of annual reports"
                min="0"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="sustainability" className={styles.label}>
                Sustainability
              </label>
              <input
                type="number"
                id="sustainability"
                name="sustainability"
                value={formData.sustainability}
                onChange={handleChange}
                className={styles.input}
                placeholder="Number of sustainability reports"
                min="0"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="integratedReport" className={styles.label}>
                Integrated Report
              </label>
              <input
                type="number"
                id="integratedReport"
                name="integratedReport"
                value={formData.integratedReport}
                onChange={handleChange}
                className={styles.input}
                placeholder="Number of integrated reports"
                min="0"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="other" className={styles.label}>
                Other
              </label>
              <input
                type="number"
                id="other"
                name="other"
                value={formData.other}
                onChange={handleChange}
                className={styles.input}
                placeholder="Number of other documents"
                min="0"
              />
            </div>
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading
              ? editingId
                ? "Updating..."
                : "Submitting..."
              : editingId
                ? "Update Document"
                : "Submit Document"}
          </button>
        </form>
      </div>

      {/* Statistics Card */}
      {totals && (
        <div className={styles.statsCard}>
          <h3 className={styles.statsTitle}>Total Document Statistics</h3>
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Annual Reports</span>
              <span className={styles.statValue}>{totals.totalAnnual}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Sustainability Reports</span>
              <span className={styles.statValue}>
                {totals.totalSustainability}
              </span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Integrated Reports</span>
              <span className={styles.statValue}>{totals.totalIntegrated}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Other Documents</span>
              <span className={styles.statValue}>{totals.totalOther}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Total Reports</span>
              <span className={styles.statValue}>{totals.totalReports}</span>
            </div>
          </div>
        </div>
      )}

      {/* Existing Data Table */}
      <div className={styles.dataTableWrapper}>
        <h2 className={styles.title}>Existing Documents</h2>

        {fetchLoading ? (
          <div className={styles.loadingState}>Loading data...</div>
        ) : existingData.length === 0 ? (
          <div className={styles.emptyState}>
            No documents found. Add one using the form above.
          </div>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Period</th>
                  <th>Sector</th>
                  <th>Annual Report</th>
                  <th>Sustainability</th>
                  <th>Integrated Report</th>
                  <th>Other</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {existingData.map((item) => {
                  const total =
                    (item.annualReport || 0) +
                    (item.sustainability || 0) +
                    (item.integratedReport || 0) +
                    (item.other || 0);
                  return (
                    <tr key={item._id}>
                      <td className={styles.periodCell}>
                        {item.from} - {item.to}
                      </td>
                      <td>
                        <span className={styles.sectorBadge}>
                          {getSectorLabel(item.sector)}
                        </span>
                      </td>
                      <td>{item.annualReport || 0}</td>
                      <td>{item.sustainability || 0}</td>
                      <td>{item.integratedReport || 0}</td>
                      <td>{item.other || 0}</td>
                      <td className={styles.totalCell}>{total}</td>
                      <td>
                        <div className={styles.actionButtons}>
                          <button
                            onClick={() => handleEdit(item)}
                            className={styles.editButton}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className={styles.deleteButton}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
