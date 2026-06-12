"use client";
import { useState, useEffect } from "react";
import styles from "./EUCompanyForm.module.css";

const SECTOR_OPTIONS = [
  { value: "", label: "Untagged" },
  { value: "supermarkets", label: "Supermarkets" },
  { value: "manufacturers", label: "Manufacturers" },
  { value: "distributors", label: "Distributors" },
  { value: "restaurants", label: "Restaurants" },
  { value: "contract-caterers", label: "Contract Caterers" },
];

export default function EUCompanyForm() {
  const [formData, setFormData] = useState({
    companyName: "",
    fromBaseline: "",
    toBaseline: "",
    sector: "",
  });
  const [commitments, setCommitments] = useState([""]);
  const [targetDates, setTargetDates] = useState([""]);
  const [targetMetrics, setTargetMetrics] = useState([""]);
  const [standardised, setStandardised] = useState([""]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [existingData, setExistingData] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  // Fetch existing data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setFetchLoading(true);
    try {
      const response = await fetch("/api/EU/eucompany");
      if (response.ok) {
        const result = await response.json();
        setExistingData(result.data || []);
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

  // Commitment handlers
  const handleCommitmentChange = (index, value) => {
    const updated = [...commitments];
    updated[index] = value;
    setCommitments(updated);
  };

  const addCommitment = () => {
    setCommitments([...commitments, ""]);
  };

  const removeCommitment = (index) => {
    if (commitments.length > 1) {
      setCommitments(commitments.filter((_, i) => i !== index));
    }
  };

  // Target Date handlers
  const handleTargetDateChange = (index, value) => {
    const updated = [...targetDates];
    updated[index] = value;
    setTargetDates(updated);
  };

  const addTargetDate = () => {
    setTargetDates([...targetDates, ""]);
  };

  const removeTargetDate = (index) => {
    if (targetDates.length > 1) {
      setTargetDates(targetDates.filter((_, i) => i !== index));
    }
  };

  // Target Metric handlers
  const handleTargetMetricChange = (index, value) => {
    const updated = [...targetMetrics];
    updated[index] = value;
    setTargetMetrics(updated);
  };

  const addTargetMetric = () => {
    setTargetMetrics([...targetMetrics, ""]);
  };

  const removeTargetMetric = (index) => {
    if (targetMetrics.length > 1) {
      setTargetMetrics(targetMetrics.filter((_, i) => i !== index));
    }
  };

  // Standardised handlers
  const handleStandardisedChange = (index, value) => {
    const updated = [...standardised];
    updated[index] = value;
    setStandardised(updated);
  };

  const addStandardised = () => {
    setStandardised([...standardised, ""]);
  };

  const removeStandardised = (index) => {
    if (standardised.length > 1) {
      setStandardised(standardised.filter((_, i) => i !== index));
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setFormData({
      companyName: item.companyName,
      fromBaseline:
        item.fromBaseline !== null && item.fromBaseline !== undefined
          ? item.fromBaseline
          : "",
      toBaseline:
        item.toBaseline !== null && item.toBaseline !== undefined
          ? item.toBaseline
          : "",
      sector: item.sector || "",
    });
    setCommitments(
      item.Commitment && item.Commitment.length > 0 ? item.Commitment : [""],
    );
    setTargetDates(
      item.targetDate && item.targetDate.length > 0
        ? item.targetDate.map(String)
        : [""],
    );
    setTargetMetrics(
      item.TargetMetric && item.TargetMetric.length > 0
        ? item.TargetMetric
        : [""],
    );
    setStandardised(
      item.Standardised && item.Standardised.length > 0
        ? item.Standardised
        : [""],
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ companyName: "", fromBaseline: "", toBaseline: "", sector: "" });
    setCommitments([""]);
    setTargetDates([""]);
    setTargetMetrics([""]);
    setStandardised([""]);
    setMessage({ text: "", type: "" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this entry?")) {
      return;
    }

    try {
      const response = await fetch(`/api/EU/editeucompany/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ text: "Data deleted successfully!", type: "success" });
        fetchData();
      } else {
        setMessage({
          text: data.message || "Failed to delete data",
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
      companyName: formData.companyName,
      Commitment: commitments.filter((c) => c.trim() !== ""),
      targetDate: targetDates.filter((d) => d !== "").map((d) => Number(d)),
      TargetMetric: targetMetrics.filter((m) => m.trim() !== ""),
      Standardised: standardised.filter((s) => s.trim() !== ""),
      fromBaseline:
        formData.fromBaseline !== "" ? Number(formData.fromBaseline) : null,
      toBaseline:
        formData.toBaseline !== "" ? Number(formData.toBaseline) : null,
      sector: formData.sector,
    };

    try {
      const url = editingId
        ? `/api/EU/editeucompany/${editingId}`
        : "/api/EU/eucompany";
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
            ? "Data updated successfully!"
            : "Data submitted successfully!",
          type: "success",
        });
        setFormData({
          companyName: "",
          fromBaseline: "",
          toBaseline: "",
          sector: "",
        });
        setCommitments([""]);
        setTargetDates([""]);
        setTargetMetrics([""]);
        setStandardised([""]);
        setEditingId(null);
        fetchData();
      } else {
        setMessage({
          text: data.message || "Failed to submit data",
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
          {editingId ? "Edit EU Company Target" : "Submit EU Company Targets"}
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
          <div className={styles.formGroup}>
            <label htmlFor="companyName" className={styles.label}>
              Company Name <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter company name"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="sector" className={styles.label}>
              Sector Tag
            </label>
            <select
              id="sector"
              name="sector"
              value={formData.sector}
              onChange={handleChange}
              className={styles.input}
            >
              {SECTOR_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Commitments Section */}
          <div className={styles.arraySection}>
            <div className={styles.arraySectionHeader}>
              <label className={styles.label}>Commitments</label>
              <button
                type="button"
                onClick={addCommitment}
                className={styles.addButton}
              >
                + Add Commitment
              </button>
            </div>
            {commitments.map((commitment, index) => (
              <div key={index} className={styles.arrayItem}>
                <span className={styles.itemNumber}>{index + 1}.</span>
                <input
                  type="text"
                  value={commitment}
                  onChange={(e) =>
                    handleCommitmentChange(index, e.target.value)
                  }
                  className={styles.input}
                  placeholder="e.g., Reduce FW by 50% by 2030"
                />
                {commitments.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeCommitment(index)}
                    className={styles.removeButtonSmall}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Target Dates Section */}
          <div className={styles.arraySection}>
            <div className={styles.arraySectionHeader}>
              <label className={styles.label}>Target Dates</label>
              <button
                type="button"
                onClick={addTargetDate}
                className={styles.addButton}
              >
                + Add Target Date
              </button>
            </div>
            {targetDates.map((date, index) => (
              <div key={index} className={styles.arrayItem}>
                <span className={styles.itemNumber}>{index + 1}.</span>
                <input
                  type="number"
                  value={date}
                  onChange={(e) =>
                    handleTargetDateChange(index, e.target.value)
                  }
                  className={styles.input}
                  placeholder="e.g., 2030"
                />
                {targetDates.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTargetDate(index)}
                    className={styles.removeButtonSmall}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Target Metrics Section */}
          <div className={styles.arraySection}>
            <div className={styles.arraySectionHeader}>
              <label className={styles.label}>Target Metrics</label>
              <button
                type="button"
                onClick={addTargetMetric}
                className={styles.addButton}
              >
                + Add Target Metric
              </button>
            </div>
            {targetMetrics.map((metric, index) => (
              <div key={index} className={styles.arrayItem}>
                <span className={styles.itemNumber}>{index + 1}.</span>
                <input
                  type="text"
                  value={metric}
                  onChange={(e) =>
                    handleTargetMetricChange(index, e.target.value)
                  }
                  className={styles.input}
                  placeholder="e.g., FW intensity as a % of all food handled"
                />
                {targetMetrics.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTargetMetric(index)}
                    className={styles.removeButtonSmall}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Standardised Metrics Section */}
          <div className={styles.arraySection}>
            <div className={styles.arraySectionHeader}>
              <label className={styles.label}>Standardised Metrics</label>
              <button
                type="button"
                onClick={addStandardised}
                className={styles.addButton}
              >
                + Add Standardised Metric
              </button>
            </div>
            {standardised.map((metric, index) => (
              <div key={index} className={styles.arrayItem}>
                <span className={styles.itemNumber}>{index + 1}.</span>
                <input
                  type="text"
                  value={metric}
                  onChange={(e) =>
                    handleStandardisedChange(index, e.target.value)
                  }
                  className={styles.input}
                  placeholder="e.g., Food Waste/Food Handled"
                />
                {standardised.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeStandardised(index)}
                    className={styles.removeButtonSmall}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Baseline Section */}
          <div className={styles.baselineSection}>
            <h3 className={styles.sectionTitle}>Baseline Period</h3>
            <div className={styles.baselineRow}>
              <div className={styles.formGroup}>
                <label htmlFor="fromBaseline" className={styles.label}>
                  From Baseline
                </label>
                <input
                  type="number"
                  id="fromBaseline"
                  name="fromBaseline"
                  value={formData.fromBaseline}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="e.g., 2016"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="toBaseline" className={styles.label}>
                  To Baseline
                </label>
                <input
                  type="number"
                  id="toBaseline"
                  name="toBaseline"
                  value={formData.toBaseline}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="e.g., 2017"
                />
              </div>
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
                ? "Update Data"
                : "Submit Data"}
          </button>
        </form>
      </div>

      {/* Existing Data Table */}
      <div className={styles.dataTableWrapper}>
        <h2 className={styles.title}>Existing EU Company Targets</h2>

        {fetchLoading ? (
          <div className={styles.loadingState}>Loading data...</div>
        ) : existingData.length === 0 ? (
          <div className={styles.emptyState}>
            No company targets found. Add one using the form above.
          </div>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Company Name</th>
                  <th>Sector</th>
                  <th>Commitments</th>
                  <th>Target Dates</th>
                  <th>Target Metrics</th>
                  <th>Standardised</th>
                  <th>Baseline</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {existingData.map((item) => (
                  <tr key={item._id}>
                    <td className={styles.companyName}>{item.companyName}</td>
                    <td>{item.sector || "Untagged"}</td>
                    <td>
                      {item.Commitment && item.Commitment.length > 0 ? (
                        <ul className={styles.arrayList}>
                          {item.Commitment.map((commitment, idx) => (
                            <li key={idx}>{commitment}</li>
                          ))}
                        </ul>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td>
                      {item.targetDate && item.targetDate.length > 0 ? (
                        <ul className={styles.arrayList}>
                          {item.targetDate.map((date, idx) => (
                            <li key={idx}>{date}</li>
                          ))}
                        </ul>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td>
                      {item.TargetMetric && item.TargetMetric.length > 0 ? (
                        <ul className={styles.arrayList}>
                          {item.TargetMetric.map((metric, idx) => (
                            <li key={idx}>{metric}</li>
                          ))}
                        </ul>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td>
                      {item.Standardised && item.Standardised.length > 0 ? (
                        <ul className={styles.arrayList}>
                          {item.Standardised.map((metric, idx) => (
                            <li key={idx}>{metric}</li>
                          ))}
                        </ul>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td>
                      {item.fromBaseline === 0 && item.toBaseline === 0
                        ? "N/A"
                        : item.fromBaseline !== null && item.toBaseline !== null
                          ? `${item.fromBaseline}/${item.toBaseline}`
                          : item.fromBaseline !== null ||
                              item.toBaseline !== null
                            ? item.fromBaseline !== null
                              ? item.fromBaseline
                              : item.toBaseline
                            : "N/A"}
                    </td>
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
