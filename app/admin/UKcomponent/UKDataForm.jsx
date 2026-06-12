"use client";
import { useState, useEffect } from "react";
import styles from "./UKDataForm.module.css";

const SECTOR_OPTIONS = [
  { value: "", label: "Untagged" },
  { value: "supermarkets", label: "Supermarkets" },
  { value: "manufacturers", label: "Manufacturers" },
  { value: "distributors", label: "Distributors" },
  { value: "restaurants", label: "Restaurants" },
  { value: "contract-caterers", label: "Contract Caterers" },
];

export default function UKDataForm() {
  const [formData, setFormData] = useState({
    name: "",
    Baseline: "",
    sector: "",
  });
  const [targets, setTargets] = useState([""]);
  const [targetYears, setTargetYears] = useState([""]);
  const [metrics, setMetrics] = useState([""]);
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
      const response = await fetch("/api/getukdata");
      if (response.ok) {
        const data = await response.json();
        setExistingData(data);
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

  // Target handlers
  const handleTargetChange = (index, value) => {
    const updated = [...targets];
    updated[index] = value;
    setTargets(updated);
  };

  const addTarget = () => {
    setTargets([...targets, ""]);
  };

  const removeTarget = (index) => {
    if (targets.length > 1) {
      setTargets(targets.filter((_, i) => i !== index));
    }
  };

  // Target Year handlers
  const handleTargetYearChange = (index, value) => {
    const updated = [...targetYears];
    updated[index] = value;
    setTargetYears(updated);
  };

  const addTargetYear = () => {
    setTargetYears([...targetYears, ""]);
  };

  const removeTargetYear = (index) => {
    if (targetYears.length > 1) {
      setTargetYears(targetYears.filter((_, i) => i !== index));
    }
  };

  // Metric handlers
  const handleMetricChange = (index, value) => {
    const updated = [...metrics];
    updated[index] = value;
    setMetrics(updated);
  };

  const addMetric = () => {
    setMetrics([...metrics, ""]);
  };

  const removeMetric = (index) => {
    if (metrics.length > 1) {
      setMetrics(metrics.filter((_, i) => i !== index));
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setFormData({
      name: item.name,
      Baseline: item.Baseline || "",
      sector: item.sector || "",
    });
    setTargets(item.Target && item.Target.length > 0 ? item.Target : [""]);
    setTargetYears(
      item.Targetyear && item.Targetyear.length > 0
        ? item.Targetyear.map(String)
        : [""],
    );
    setMetrics(item.Metric && item.Metric.length > 0 ? item.Metric : [""]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: "", Baseline: "", sector: "" });
    setTargets([""]);
    setTargetYears([""]);
    setMetrics([""]);
    setMessage({ text: "", type: "" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this entry?")) {
      return;
    }

    try {
      const response = await fetch(`/api/editukdata/${id}`, {
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
      name: formData.name,
      Baseline: formData.Baseline,
      Target: targets.filter((t) => t.trim() !== ""),
      Targetyear: targetYears.filter((y) => y !== "").map((y) => Number(y)),
      Metric: metrics.filter((m) => m.trim() !== ""),
      sector: formData.sector,
    };

    try {
      const url = editingId ? `/api/editukdata/${editingId}` : "/api/ukdata";
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
          name: "",
          Baseline: "",
          sector: "",
        });
        setTargets([""]);
        setTargetYears([""]);
        setMetrics([""]);
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
          {editingId ? "Edit UK Company Target" : "Submit UK Company Targets"}
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
            <label htmlFor="name" className={styles.label}>
              Company Name <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter company name"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="Baseline" className={styles.label}>
              Baseline
            </label>
            <input
              type="text"
              id="Baseline"
              name="Baseline"
              value={formData.Baseline}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter baseline value"
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

          {/* Targets Section */}
          <div className={styles.arraySection}>
            <div className={styles.arraySectionHeader}>
              <label className={styles.label}>Targets</label>
              <button
                type="button"
                onClick={addTarget}
                className={styles.addButton}
              >
                + Add Target
              </button>
            </div>
            {targets.map((target, index) => (
              <div key={index} className={styles.arrayItem}>
                <span className={styles.itemNumber}>{index + 1}.</span>
                <input
                  type="text"
                  value={target}
                  onChange={(e) => handleTargetChange(index, e.target.value)}
                  className={styles.input}
                  placeholder="e.g., 50% reduction in food waste"
                />
                {targets.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTarget(index)}
                    className={styles.removeButtonSmall}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Target Years Section */}
          <div className={styles.arraySection}>
            <div className={styles.arraySectionHeader}>
              <label className={styles.label}>Target Years</label>
              <button
                type="button"
                onClick={addTargetYear}
                className={styles.addButton}
              >
                + Add Target Year
              </button>
            </div>
            {targetYears.map((year, index) => (
              <div key={index} className={styles.arrayItem}>
                <span className={styles.itemNumber}>{index + 1}.</span>
                <input
                  type="number"
                  value={year}
                  onChange={(e) =>
                    handleTargetYearChange(index, e.target.value)
                  }
                  className={styles.input}
                  placeholder="e.g., 2030"
                />
                {targetYears.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTargetYear(index)}
                    className={styles.removeButtonSmall}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Metrics Section */}
          <div className={styles.arraySection}>
            <div className={styles.arraySectionHeader}>
              <label className={styles.label}>Metrics</label>
              <button
                type="button"
                onClick={addMetric}
                className={styles.addButton}
              >
                + Add Metric
              </button>
            </div>
            {metrics.map((metric, index) => (
              <div key={index} className={styles.arrayItem}>
                <span className={styles.itemNumber}>{index + 1}.</span>
                <input
                  type="text"
                  value={metric}
                  onChange={(e) => handleMetricChange(index, e.target.value)}
                  className={styles.input}
                  placeholder="e.g., tonnes per year"
                />
                {metrics.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMetric(index)}
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
        <h2 className={styles.title}>Existing Company Targets</h2>

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
                  <th>Baseline</th>
                  <th>Targets</th>
                  <th>Target Years</th>
                  <th>Metrics</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {existingData.map((item) => (
                  <tr key={item._id}>
                    <td className={styles.companyName}>{item.name}</td>
                    <td>{item.sector || "Untagged"}</td>
                    <td>{item.Baseline || "N/A"}</td>
                    <td>
                      {item.Target && item.Target.length > 0 ? (
                        <ul className={styles.arrayList}>
                          {item.Target.map((target, idx) => (
                            <li key={idx}>{target}</li>
                          ))}
                        </ul>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td>
                      {item.Targetyear && item.Targetyear.length > 0 ? (
                        <ul className={styles.arrayList}>
                          {item.Targetyear.map((year, idx) => (
                            <li key={idx}>{year}</li>
                          ))}
                        </ul>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td>
                      {item.Metric && item.Metric.length > 0 ? (
                        <ul className={styles.arrayList}>
                          {item.Metric.map((metric, idx) => (
                            <li key={idx}>{metric}</li>
                          ))}
                        </ul>
                      ) : (
                        "N/A"
                      )}
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
