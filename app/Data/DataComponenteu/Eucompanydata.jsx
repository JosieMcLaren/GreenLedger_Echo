"use client";

import React from "react";
import { useEffect, useState } from "react";
import styles from "./Eucompanydata.module.css";
import { FaLeaf, FaCalendarAlt, FaGlobeEurope } from "react-icons/fa";
import { TbFilterFilled } from "react-icons/tb";
import Loading from "../../components/Loading/Loading";

const SECTOR_OPTIONS = [
  { value: "supermarkets", label: "Supermarkets" },
  { value: "manufacturers", label: "Manufacturers" },
  { value: "distributors", label: "Distributors" },
  { value: "restaurants", label: "Restaurants" },
  { value: "contract-caterers", label: "Contract Caterers" },
];

export default function EuCompanyData() {
  const [eudata, setEudata] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [selectedSector, setSelectedSector] = useState("supermarkets");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setFetchError(null);
        const response = await fetch("/api/EU/eucompany");
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload?.message || "Failed to load EU companies.");
        }
        const list = Array.isArray(payload.data) ? payload.data : [];
        setEudata(list);
      } catch (error) {
        console.error("Error fetching EU company data:", error);
        setFetchError(
          error?.message ||
            "Failed to load data. Please try again in a moment.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredCompanies = eudata.filter((company) => {
    const itemSector = company?.sector || "supermarkets";
    return itemSector === selectedSector;
  });

  if (loading) {
    return (
      <section className={styles.targets}>
        <div className={styles.container}>
          <div className={styles.header}>
            <span className={styles.badge}>
              <FaGlobeEurope className={styles.badgeIcon} />
              Company Targets
            </span>
            <h2 className={styles.title}>
              EU Retailers&apos;{" "}
              <span className={styles.highlight}>
                Food Waste Reduction Targets
              </span>{" "}
            </h2>
            <p className={styles.subtitle}>
              Comprehensive overview of major EU supermarkets&apos; commitments
              to reducing food waste
            </p>
          </div>
          <Loading size="large" text="Loading company targets..." />
        </div>
      </section>
    );
  }

  if (fetchError) {
    return (
      <section className={styles.targets}>
        <div className={styles.container}>
          <div className={styles.header}>
            <span className={styles.badge}>
              <FaGlobeEurope className={styles.badgeIcon} />
              Company Targets
            </span>
            <h2 className={styles.title}>
              EU Retailers&apos;{" "}
              <span className={styles.highlight}>
                Food Waste Reduction Targets
              </span>
            </h2>
          </div>
          <div className={styles.errorContainer}>
            <p className={styles.errorMessage}>{fetchError}</p>
            <button
              type="button"
              className={styles.retryButton}
              onClick={() => window.location.reload()}
            >
              Try again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.targets}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.badge}>
            <FaGlobeEurope className={styles.badgeIcon} />
            Company Targets
          </span>
          <h2 className={styles.title}>
            EU Retailers&apos;{" "}
            <span className={styles.highlight}>
              Food Waste Reduction Targets
            </span>{" "}
          </h2>
          <p className={styles.subtitle}>
            Comprehensive overview of major EU supermarkets&apos; commitments to
            reducing food waste
          </p>
        </div>

        <div className={styles.sectorToolbar}>
          <div className={styles.sectorToolbarInner}>
            <span className={styles.sectorIconWrap} aria-hidden>
              <TbFilterFilled />
            </span>
            <div className={styles.sectorToolbarText}>
              <span className={styles.sectorEyebrow}>Dataset</span>
              <label
                htmlFor="eu-target-sector"
                className={styles.sectorPrompt}
              >
                Choose a sector
              </label>
            </div>
            <div className={styles.selectWrap}>
              <select
                id="eu-target-sector"
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className={styles.sectorSelect}
                aria-label="Filter EU company targets by sector"
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

        {filteredCompanies.length === 0 ? (
          <div className={styles.emptyState} role="status">
            <div className={styles.emptyStateIconRing} aria-hidden>
              🌍
            </div>
            <h3 className={styles.emptyStateTitle}>No companies here yet</h3>
            <p className={styles.emptyStateHint}>
              We don&apos;t have EU targets on record for this sector right now.
              Pick another sector, or revisit after new data has been published.
            </p>
            <span className={styles.emptyStateAccent}>Nothing to display</span>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Commitments</th>
                  <th>Target Dates</th>
                  <th>Target Metric</th>
                  <th>Standardised Metric</th>
                  <th>Baseline</th>
                </tr>
              </thead>
              <tbody>
                {filteredCompanies.map((company, index) => (
                  <tr key={company._id ?? index} className={styles.row}>
                    <td className={styles.companyCell}>
                      <div className={styles.companyName}>
                        <FaLeaf className={styles.companyIcon} />
                        {company.companyName}
                      </div>
                    </td>
                    <td className={styles.commitmentsCell}>
                      <ul className={styles.commitmentsList}>
                        {(company.Commitment || []).map((commitment, idx) => (
                          <li key={idx} className={styles.commitmentItem}>
                            {commitment}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className={styles.dateCell}>
                      <div className={styles.milestonesWrapper}>
                        {company.targetDate &&
                        company.targetDate.length > 0 ? (
                          <>
                            <div className={styles.milestoneContainer}>
                              {company.targetDate.map((year, idx) => (
                                <React.Fragment key={idx}>
                                  <span
                                    className={`${styles.milestone} ${
                                      company.targetDate.length === 1
                                        ? styles.milestoneSingle
                                        : idx === 0
                                          ? styles.milestone1
                                          : idx ===
                                              company.targetDate.length - 1
                                            ? styles.milestone2
                                            : styles.milestoneIntermediate
                                    }`}
                                  >
                                    {company.targetDate.length === 1 ? (
                                      <FaCalendarAlt
                                        className={styles.calendarIcon}
                                      />
                                    ) : (
                                      <span className={styles.milestoneIcon}>
                                        {idx + 1}
                                      </span>
                                    )}
                                    <span className={styles.milestoneYear}>
                                      {year}
                                    </span>
                                  </span>
                                  {idx < company.targetDate.length - 1 && (
                                    <div className={styles.connector}></div>
                                  )}
                                </React.Fragment>
                              ))}
                            </div>
                            <div className={styles.milestoneLabel}>
                              {company.targetDate.length === 1
                                ? "Single Target"
                                : `${company.targetDate.length} Milestones`}
                            </div>
                          </>
                        ) : (
                          <div className={styles.noDate}>
                            <span className={styles.noDateText}>
                              No Date Set
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className={styles.metricCell}>
                      <ul className={styles.commitmentsList}>
                        {(company.TargetMetric || []).map((metric, idx) => (
                          <li key={idx} className={styles.commitmentItem}>
                            {metric}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className={styles.metricCell}>
                      <ul className={styles.commitmentsList}>
                        {(company.Standardised || []).map((metric, idx) => (
                          <li key={idx} className={styles.commitmentItem}>
                            {metric}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className={styles.baselineCell}>
                      <span className={styles.baseline}>
                        {company.fromBaseline === 0 && company.toBaseline === 0
                          ? "N/A"
                          : company.fromBaseline !== null &&
                              company.toBaseline !== null
                            ? `${company.fromBaseline}/${company.toBaseline}`
                            : company.fromBaseline !== null ||
                                company.toBaseline !== null
                              ? company.fromBaseline !== null
                                ? company.fromBaseline
                                : company.toBaseline
                              : "N/A"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
