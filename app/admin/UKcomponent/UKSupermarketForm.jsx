"use client";
import { useState, useEffect } from "react";
import styles from "./UKSupermarketForm.module.css";

const SECTOR_OPTIONS = [
  { value: "", label: "Untagged" },
  { value: "supermarkets", label: "Supermarkets" },
  { value: "manufacturers", label: "Manufacturers" },
  { value: "distributors", label: "Distributors" },
  { value: "restaurants", label: "Restaurants" },
  { value: "contract-caterers", label: "Contract Caterers" },
];

export default function UKSupermarketForm() {
  const [formData, setFormData] = useState({
    company: "",
    color: "#3498db",
    sector: "",
  });
  const [dataEntries, setDataEntries] = useState([
    {
      from: "",
      to: "",
      foodHandled: "",
      unsoldFood: "",
      foodSurplus: "",
      foodWaste: "",
      foodWastePerHandled: "",
      unsoldFoodPerHandled: "",
      foodWasteToAnimalFeed: "",
      humanRedistribution: "",
      foodWasteReductionRate: "",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [existingData, setExistingData] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [editingCompanyId, setEditingCompanyId] = useState(null);
  const [editingCompanyInfo, setEditingCompanyInfo] = useState(false);
  const [expandedCompany, setExpandedCompany] = useState(null);
  const [editingYear, setEditingYear] = useState(null);
  const [addingYearMode, setAddingYearMode] = useState(false);

  // Fetch existing data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setFetchLoading(true);
    try {
      const response = await fetch("/api/ukcom");
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

  const handleDataEntryChange = (index, field, value) => {
    const updated = [...dataEntries];
    updated[index][field] = value;
    setDataEntries(updated);
  };

  const addDataEntry = () => {
    setDataEntries([
      ...dataEntries,
      {
        from: "",
        to: "",
        foodHandled: "",
        unsoldFood: "",
        foodSurplus: "",
        foodWaste: "",
        foodWastePerHandled: "",
        unsoldFoodPerHandled: "",
        foodWasteToAnimalFeed: "",
        humanRedistribution: "",
        foodWasteReductionRate: "",
      },
    ]);
  };

  const removeDataEntry = (index) => {
    if (dataEntries.length > 1) {
      setDataEntries(dataEntries.filter((_, i) => i !== index));
    }
  };

  const handleEditCompanyInfo = (company) => {
    setEditingCompanyId(company._id);
    setEditingCompanyInfo(true);
    setFormData({
      company: company.company,
      color: company.color,
      sector: company.sector || "",
    });
    setDataEntries([
      {
        from: "",
        to: "",
        foodHandled: "",
        unsoldFood: "",
        foodSurplus: "",
        foodWaste: "",
        foodWastePerHandled: "",
        unsoldFoodPerHandled: "",
        foodWasteToAnimalFeed: "",
        humanRedistribution: "",
        foodWasteReductionRate: "",
      },
    ]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingCompanyId(null);
    setEditingCompanyInfo(false);
    setEditingYear(null);
    setAddingYearMode(false);
    setFormData({ company: "", color: "#3498db", sector: "" });
    setDataEntries([
      {
        from: "",
        to: "",
        foodHandled: "",
        unsoldFood: "",
        foodSurplus: "",
        foodWaste: "",
        foodWastePerHandled: "",
        unsoldFoodPerHandled: "",
        foodWasteToAnimalFeed: "",
        humanRedistribution: "",
        foodWasteReductionRate: "",
      },
    ]);
    setMessage({ text: "", type: "" });
  };

  const handleDeleteCompany = async (id) => {
    if (
      !confirm("Are you sure you want to delete this company and all its data?")
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/editukcom/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ text: "Company deleted successfully!", type: "success" });
        fetchData();
      } else {
        setMessage({
          text: data.message || "Failed to delete company",
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

  const handleDeleteYear = async (companyId, from, to) => {
    if (!confirm(`Are you sure you want to delete data for ${from}-${to}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/editukcom/${companyId}/delete-year`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ from, to }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          text: "Year data deleted successfully!",
          type: "success",
        });
        fetchData();
      } else {
        setMessage({
          text: data.message || "Failed to delete year data",
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

  const handleEditYear = (companyId, yearData) => {
    setEditingCompanyId(companyId);
    setEditingYear({ from: yearData.from, to: yearData.to });
    setEditingCompanyInfo(false);

    const company = existingData.find((c) => c._id === companyId);
    setFormData({
      company: company.company,
      color: company.color,
      sector: company.sector || "",
    });

    setDataEntries([
      {
        from: yearData.from.toString(),
        to: yearData.to.toString(),
        foodHandled: yearData.foodHandled || "",
        unsoldFood: yearData.unsoldFood || "",
        foodSurplus: yearData.foodSurplus || "",
        foodWaste: yearData.foodWaste || "",
        foodWastePerHandled: yearData.foodWastePerHandled || "",
        unsoldFoodPerHandled: yearData.unsoldFoodPerHandled || "",
        foodWasteToAnimalFeed: yearData.foodWasteToAnimalFeed || "",
        humanRedistribution: yearData.humanRedistribution || "",
        foodWasteReductionRate: yearData.foodWasteReductionRate || "",
      },
    ]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      // Case 1: Editing company info only (name and color)
      if (editingCompanyInfo && editingCompanyId) {
        const response = await fetch(`/api/editukcom/${editingCompanyId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            company: formData.company,
            color: formData.color,
            sector: formData.sector,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setMessage({
            text: "Company info updated successfully!",
            type: "success",
          });
          handleCancelEdit();
          fetchData();
        } else {
          setMessage({
            text: data.message || "Failed to update company info",
            type: "error",
          });
        }
        setLoading(false);
        return;
      }

      // Case 2: Adding a new year to existing company
      if (addingYearMode && editingCompanyId) {
        const entry = dataEntries[0];
        const newYearData = {
          from: Number(entry.from),
          to: Number(entry.to),
          foodHandled: entry.foodHandled ? Number(entry.foodHandled) : 0,
          unsoldFood: entry.unsoldFood ? Number(entry.unsoldFood) : 0,
          foodSurplus: entry.foodSurplus ? Number(entry.foodSurplus) : 0,
          foodWaste: entry.foodWaste ? Number(entry.foodWaste) : 0,
          foodWastePerHandled: entry.foodWastePerHandled
            ? Number(entry.foodWastePerHandled)
            : 0,
          unsoldFoodPerHandled: entry.unsoldFoodPerHandled
            ? Number(entry.unsoldFoodPerHandled)
            : 0,
          foodWasteToAnimalFeed: entry.foodWasteToAnimalFeed
            ? Number(entry.foodWasteToAnimalFeed)
            : 0,
          humanRedistribution: entry.humanRedistribution
            ? Number(entry.humanRedistribution)
            : 0,
          foodWasteReductionRate: entry.foodWasteReductionRate
            ? Number(entry.foodWasteReductionRate)
            : 0,
        };

        const response = await fetch(
          `/api/editukcom/${editingCompanyId}/add-year`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newYearData),
          },
        );

        const data = await response.json();

        if (response.ok) {
          setMessage({ text: "Year added successfully!", type: "success" });
          handleCancelEdit();
          fetchData();
        } else {
          setMessage({
            text: data.message || "Failed to add year",
            type: "error",
          });
        }
        setLoading(false);
        return;
      }

      // Case 3: Editing a specific year
      if (editingYear && editingCompanyId) {
        const entry = dataEntries[0];
        const updates = {
          foodHandled: entry.foodHandled ? Number(entry.foodHandled) : 0,
          unsoldFood: entry.unsoldFood ? Number(entry.unsoldFood) : 0,
          foodSurplus: entry.foodSurplus ? Number(entry.foodSurplus) : 0,
          foodWaste: entry.foodWaste ? Number(entry.foodWaste) : 0,
          foodWastePerHandled: entry.foodWastePerHandled
            ? Number(entry.foodWastePerHandled)
            : 0,
          unsoldFoodPerHandled: entry.unsoldFoodPerHandled
            ? Number(entry.unsoldFoodPerHandled)
            : 0,
          foodWasteToAnimalFeed: entry.foodWasteToAnimalFeed
            ? Number(entry.foodWasteToAnimalFeed)
            : 0,
          humanRedistribution: entry.humanRedistribution
            ? Number(entry.humanRedistribution)
            : 0,
          foodWasteReductionRate: entry.foodWasteReductionRate
            ? Number(entry.foodWasteReductionRate)
            : 0,
        };

        const response = await fetch(
          `/api/editukcom/${editingCompanyId}/update-year`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: Number(entry.from),
              to: Number(entry.to),
              updates,
            }),
          },
        );

        const data = await response.json();

        if (response.ok) {
          setMessage({
            text: "Year data updated successfully!",
            type: "success",
          });
          handleCancelEdit();
          fetchData();
        } else {
          setMessage({
            text: data.message || "Failed to update year data",
            type: "error",
          });
        }
        setLoading(false);
        return;
      }

      // Case 4: Creating a new company with year data
      const processedData = dataEntries
        .filter((entry) => entry.from && entry.to)
        .map((entry) => ({
          from: Number(entry.from),
          to: Number(entry.to),
          foodHandled: entry.foodHandled ? Number(entry.foodHandled) : 0,
          unsoldFood: entry.unsoldFood ? Number(entry.unsoldFood) : 0,
          foodSurplus: entry.foodSurplus ? Number(entry.foodSurplus) : 0,
          foodWaste: entry.foodWaste ? Number(entry.foodWaste) : 0,
          foodWastePerHandled: entry.foodWastePerHandled
            ? Number(entry.foodWastePerHandled)
            : 0,
          unsoldFoodPerHandled: entry.unsoldFoodPerHandled
            ? Number(entry.unsoldFoodPerHandled)
            : 0,
          foodWasteToAnimalFeed: entry.foodWasteToAnimalFeed
            ? Number(entry.foodWasteToAnimalFeed)
            : 0,
          humanRedistribution: entry.humanRedistribution
            ? Number(entry.humanRedistribution)
            : 0,
          foodWasteReductionRate: entry.foodWasteReductionRate
            ? Number(entry.foodWasteReductionRate)
            : 0,
        }));

      const submitData = {
        company: formData.company,
        color: formData.color,
        sector: formData.sector,
        data: processedData,
      };

      const response = await fetch("/api/ukcom", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          text: "Company created successfully!",
          type: "success",
        });
        setFormData({ company: "", color: "#3498db", sector: "" });
        setDataEntries([
          {
            from: "",
            to: "",
            foodHandled: "",
            unsoldFood: "",
            foodSurplus: "",
            foodWaste: "",
            foodWastePerHandled: "",
            unsoldFoodPerHandled: "",
            foodWasteToAnimalFeed: "",
            humanRedistribution: "",
            foodWasteReductionRate: "",
          },
        ]);
        fetchData();
      } else {
        setMessage({
          text: data.message || "Failed to create company",
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

  const handleAddYearToCompany = (company) => {
    setAddingYearMode(true);
    setEditingCompanyId(company._id);
    setEditingCompanyInfo(false);
    setEditingYear(null);
    setFormData({
      company: company.company,
      color: company.color,
      sector: company.sector || "",
    });
    setDataEntries([
      {
        from: "",
        to: "",
        foodHandled: "",
        unsoldFood: "",
        foodSurplus: "",
        foodWaste: "",
        foodWastePerHandled: "",
        unsoldFoodPerHandled: "",
        foodWasteToAnimalFeed: "",
        humanRedistribution: "",
        foodWasteReductionRate: "",
      },
    ]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getFormTitle = () => {
    if (editingCompanyInfo) return "Edit Company Info (Name & Color)";
    if (addingYearMode) return `Add New Year to ${formData.company}`;
    if (editingYear)
      return `Edit Year Data (${editingYear.from}-${editingYear.to})`;
    return "Add New UK Supermarket Company";
  };

  const getSubmitButtonText = () => {
    if (loading) {
      if (editingCompanyInfo) return "Updating Info...";
      if (addingYearMode) return "Adding Year...";
      if (editingYear) return "Updating Year...";
      return "Creating...";
    }
    if (editingCompanyInfo) return "Update Company Info";
    if (addingYearMode) return "Add Year";
    if (editingYear) return "Update Year Data";
    return "Create Company";
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h2 className={styles.title}>{getFormTitle()}</h2>

        {message.text && (
          <div className={`${styles.message} ${styles[message.type]}`}>
            {message.text}
          </div>
        )}

        {(editingCompanyInfo || editingYear || addingYearMode) && (
          <div className={styles.editNotice}>
            <span>
              {editingCompanyInfo
                ? "Editing company info only"
                : addingYearMode
                  ? `Adding new year entry to ${formData.company}`
                  : `Editing year ${editingYear?.from}-${editingYear?.to}`}
            </span>
            <button
              type="button"
              onClick={handleCancelEdit}
              className={styles.cancelEditButton}
            >
              Cancel
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Company Info - Always shown but disabled when editing year */}
          <div className={styles.companySection}>
            <h3 className={styles.sectionTitle}>Company Information</h3>

            <div className={styles.companyRow}>
              <div className={styles.formGroup}>
                <label htmlFor="company" className={styles.label}>
                  Company Name <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="e.g., Tesco, Sainsbury's"
                  required
                  disabled={editingYear || addingYearMode}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="color" className={styles.label}>
                  Chart Color <span className={styles.required}>*</span>
                </label>
                <div className={styles.colorInputWrapper}>
                  <input
                    type="color"
                    id="color"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    className={styles.colorInput}
                    required
                    disabled={editingYear || addingYearMode}
                  />
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) =>
                      setFormData({ ...formData, color: e.target.value })
                    }
                    className={styles.colorTextInput}
                    placeholder="#3498db"
                    disabled={editingYear || addingYearMode}
                  />
                </div>
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
                  disabled={editingYear || addingYearMode}
                >
                  {SECTOR_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Data Entries - Only show when NOT editing company info */}
          {!editingCompanyInfo && (
            <div className={styles.dataEntriesSection}>
              <div className={styles.dataEntriesHeader}>
                <h3 className={styles.sectionTitle}>
                  {editingYear
                    ? "Year Data"
                    : addingYearMode
                      ? "New Year Entry"
                      : "Data Entries by Year"}
                </h3>
                {!editingYear && !addingYearMode && (
                  <button
                    type="button"
                    onClick={addDataEntry}
                    className={styles.addButton}
                  >
                    + Add Year Entry
                  </button>
                )}
              </div>

              {dataEntries.map((entry, index) => (
                <div key={index} className={styles.dataEntryCard}>
                  <div className={styles.dataEntryHeader}>
                    <span className={styles.entryNumber}>
                      {editingYear
                        ? "Year Data"
                        : addingYearMode
                          ? "New Year Entry"
                          : `Entry #${index + 1}`}
                    </span>
                    {!editingYear &&
                      !addingYearMode &&
                      dataEntries.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeDataEntry(index)}
                          className={styles.removeButton}
                        >
                          × Remove Entry
                        </button>
                      )}
                  </div>

                  {/* Year Range */}
                  <div className={styles.yearRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.labelSmall}>
                        From Year <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="number"
                        value={entry.from}
                        onChange={(e) =>
                          handleDataEntryChange(index, "from", e.target.value)
                        }
                        className={styles.input}
                        placeholder="2020"
                        required
                        disabled={editingYear}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.labelSmall}>
                        To Year <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="number"
                        value={entry.to}
                        onChange={(e) =>
                          handleDataEntryChange(index, "to", e.target.value)
                        }
                        className={styles.input}
                        placeholder="2021"
                        required
                        disabled={editingYear}
                      />
                    </div>
                  </div>

                  {/* Food Metrics Grid */}
                  <div className={styles.metricsGrid}>
                    <div className={styles.formGroup}>
                      <label className={styles.labelSmall}>Food Handled</label>
                      <input
                        type="number"
                        step="any"
                        value={entry.foodHandled}
                        onChange={(e) =>
                          handleDataEntryChange(
                            index,
                            "foodHandled",
                            e.target.value,
                          )
                        }
                        className={styles.input}
                        placeholder="0"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.labelSmall}>Unsold Food</label>
                      <input
                        type="number"
                        step="any"
                        value={entry.unsoldFood}
                        onChange={(e) =>
                          handleDataEntryChange(
                            index,
                            "unsoldFood",
                            e.target.value,
                          )
                        }
                        className={styles.input}
                        placeholder="0"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.labelSmall}>Food Surplus</label>
                      <input
                        type="number"
                        step="any"
                        value={entry.foodSurplus}
                        onChange={(e) =>
                          handleDataEntryChange(
                            index,
                            "foodSurplus",
                            e.target.value,
                          )
                        }
                        className={styles.input}
                        placeholder="0"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.labelSmall}>Food Waste</label>
                      <input
                        type="number"
                        step="any"
                        value={entry.foodWaste}
                        onChange={(e) =>
                          handleDataEntryChange(
                            index,
                            "foodWaste",
                            e.target.value,
                          )
                        }
                        className={styles.input}
                        placeholder="0"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.labelSmall}>
                        Food Waste Per Handled
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={entry.foodWastePerHandled}
                        onChange={(e) =>
                          handleDataEntryChange(
                            index,
                            "foodWastePerHandled",
                            e.target.value,
                          )
                        }
                        className={styles.input}
                        placeholder="0"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.labelSmall}>
                        Unsold Food Per Handled
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={entry.unsoldFoodPerHandled}
                        onChange={(e) =>
                          handleDataEntryChange(
                            index,
                            "unsoldFoodPerHandled",
                            e.target.value,
                          )
                        }
                        className={styles.input}
                        placeholder="0"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.labelSmall}>
                        Food Waste To Animal Feed
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={entry.foodWasteToAnimalFeed}
                        onChange={(e) =>
                          handleDataEntryChange(
                            index,
                            "foodWasteToAnimalFeed",
                            e.target.value,
                          )
                        }
                        className={styles.input}
                        placeholder="0"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.labelSmall}>
                        Human Redistribution
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={entry.humanRedistribution}
                        onChange={(e) =>
                          handleDataEntryChange(
                            index,
                            "humanRedistribution",
                            e.target.value,
                          )
                        }
                        className={styles.input}
                        placeholder="0"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.labelSmall}>
                        Food Waste Reduction Rate
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={entry.foodWasteReductionRate}
                        onChange={(e) =>
                          handleDataEntryChange(
                            index,
                            "foodWasteReductionRate",
                            e.target.value,
                          )
                        }
                        className={styles.input}
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {getSubmitButtonText()}
          </button>
        </form>
      </div>

      {/* Existing Companies Table */}
      <div className={styles.dataTableWrapper}>
        <h2 className={styles.title}>Existing Supermarket Companies</h2>

        {fetchLoading ? (
          <div className={styles.loadingState}>Loading data...</div>
        ) : existingData.length === 0 ? (
          <div className={styles.emptyState}>
            No companies found. Add one using the form above.
          </div>
        ) : (
          <div className={styles.companiesList}>
            {existingData.map((company) => (
              <div key={company._id} className={styles.companyCard}>
                <div className={styles.companyCardHeader}>
                  <div className={styles.companyInfo}>
                    <div
                      className={styles.colorIndicator}
                      style={{ backgroundColor: company.color }}
                    ></div>
                    <h3 className={styles.companyName}>{company.company}</h3>
                    <span className={styles.dataCount}>
                      {company.data?.length || 0} year entries
                    </span>
                  </div>
                  <div className={styles.actionButtons}>
                    <button
                      onClick={() => handleEditCompanyInfo(company)}
                      className={styles.editButton}
                      title="Edit company name and color"
                    >
                      Edit Info
                    </button>
                    <button
                      onClick={() => handleAddYearToCompany(company)}
                      className={styles.addYearButton}
                      title="Add new year entry"
                    >
                      + Add Year
                    </button>
                    <button
                      onClick={() => handleDeleteCompany(company._id)}
                      className={styles.deleteButton}
                    >
                      Delete
                    </button>
                    <button
                      onClick={() =>
                        setExpandedCompany(
                          expandedCompany === company._id ? null : company._id,
                        )
                      }
                      className={styles.expandButton}
                    >
                      {expandedCompany === company._id ? "▲ Hide" : "▼ Show"}{" "}
                      Data
                    </button>
                  </div>
                </div>

                {expandedCompany === company._id && company.data && (
                  <div className={styles.expandedData}>
                    <table className={styles.dataTable}>
                      <thead>
                        <tr>
                          <th>Period</th>
                          <th>Food Handled</th>
                          <th>Unsold Food</th>
                          <th>Food Surplus</th>
                          <th>Food Waste</th>
                          <th>Waste/Handled</th>
                          <th>Animal Feed</th>
                          <th>Redistribution</th>
                          <th>Reduction Rate</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {company.data.map((entry, idx) => (
                          <tr key={idx}>
                            <td className={styles.periodCell}>
                              {entry.from} - {entry.to}
                            </td>
                            <td>{entry.foodHandled || 0}</td>
                            <td>{entry.unsoldFood || 0}</td>
                            <td>{entry.foodSurplus || 0}</td>
                            <td>{entry.foodWaste || 0}</td>
                            <td>{entry.foodWastePerHandled || 0}</td>
                            <td>{entry.foodWasteToAnimalFeed || 0}</td>
                            <td>{entry.humanRedistribution || 0}</td>
                            <td>{entry.foodWasteReductionRate || 0}</td>
                            <td>
                              <div className={styles.yearActionButtons}>
                                <button
                                  onClick={() =>
                                    handleEditYear(company._id, entry)
                                  }
                                  className={styles.editYearButton}
                                  title="Edit this year"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteYear(
                                      company._id,
                                      entry.from,
                                      entry.to,
                                    )
                                  }
                                  className={styles.deleteYearButton}
                                  title="Delete this year"
                                >
                                  Del
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
