"use client";

import { useState } from "react";
import { useEffect } from "react";
import styles from "./Charity.module.css";
import { FaHeart, FaSearch } from "react-icons/fa";
import { IoCheckmarkCircle } from "react-icons/io5";

export default function Charity() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("charities"); // "charities" or "companies"
  const [charityData, setCharityData] = useState([]);

  useEffect(() => {
    const fetchCharityData = async () => {
      try {
        const response = await fetch("/api/EU/eucharity");
        const result = await response.json();
        setCharityData(result.data);
      } catch (error) {
        console.error("Error fetching charity data:", error);
      }
    };
    fetchCharityData();
  }, []);

  const getCompaniesList = () => {
    const companiesMap = {};
    charityData.forEach((charity) => {
      charity.companies.forEach((company) => {
        if (!companiesMap[company]) {
          companiesMap[company] = [];
        }
        companiesMap[company].push(charity.name);
      });
    });
    return Object.entries(companiesMap).map(([company, charities]) => ({
      name: company,
      charities: charities,
    }));
  };

  const companiesList = getCompaniesList();

  // Filter charities based on search term
  const filteredCharities = charityData.filter(
    (charity) =>
      charity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      charity.companies.some((company) =>
        company.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
  );

  // Filter companies based on search term
  const filteredCompanies = companiesList.filter(
    (company) =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.charities.some((charity) =>
        charity.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
  );

  return (
    <section className={styles.charities}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.badge}>Charitable Partnerships</span>
          <h2 className={styles.title}>
            EU <span className={styles.highlight}>Charity Partners</span>
          </h2>
          <p className={styles.subtitle}>
            Key non-profit organisations and charities working with our sample
            of EU food companies to combat food waste
          </p>
        </div>

        {/* View Toggle Tabs */}
        <div className={styles.viewTabs}>
          <button
            className={`${styles.tab} ${
              viewMode === "charities" ? styles.activeTab : ""
            }`}
            onClick={() => {
              setViewMode("charities");
              setSearchTerm("");
            }}
          >
            <FaHeart className={styles.tabIcon} />
            By Charity
          </button>
          <button
            className={`${styles.tab} ${
              viewMode === "companies" ? styles.activeTab : ""
            }`}
            onClick={() => {
              setViewMode("companies");
              setSearchTerm("");
            }}
          >
            <FaHeart className={styles.tabIcon} />
            By Company
          </button>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <FaHeart className={styles.sectionIcon} />
            <h3 className={styles.sectionTitle}>
              {viewMode === "charities" ? "Charity Organizations" : "Companies"}
            </h3>
            <div className={styles.totalCount}>
              {viewMode === "charities"
                ? `${filteredCharities.length} of ${charityData.length} Charities`
                : `${filteredCompanies.length} of ${companiesList.length} Companies`}
            </div>
          </div>

          {/* Search Filter */}
          <div className={styles.searchWrapper}>
            <div className={styles.searchBox}>
              <FaSearch className={styles.searchIcon} />
              <input
                type="text"
                placeholder={
                  viewMode === "charities"
                    ? "Search by charity name or company..."
                    : "Search by company name or charity..."
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
              {searchTerm && (
                <button
                  className={styles.clearBtn}
                  onClick={() => setSearchTerm("")}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Results or Empty State */}
          {viewMode === "charities" ? (
            // Charity View
            filteredCharities.length > 0 ? (
              <div className={styles.charitiesList}>
                {filteredCharities.map((charity, index) => (
                  <div key={index} className={styles.charityCard}>
                    <h4 className={styles.charityName}>{charity.name}</h4>
                    <div className={styles.companiesList}>
                      {charity.companies.map((company, idx) => (
                        <span key={idx} className={styles.companyTag}>
                          <IoCheckmarkCircle className={styles.checkIcon} />
                          {company}
                        </span>
                      ))}
                    </div>
                    {charity.Url && (
                      <a
                        href={charity.Url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.visitButton}
                      >
                        Visit Charity →
                      </a>
                    )}
                    {/* <div className={styles.companyCount}>
                      {charity.companies.length}{" "}
                      {charity.companies.length === 1 ? "Partner" : "Partners"}
                    </div> */}
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <p className={styles.emptyText}>
                  No charities found matching "{searchTerm}"
                </p>
                <button
                  className={styles.resetBtn}
                  onClick={() => setSearchTerm("")}
                >
                  Clear Search
                </button>
              </div>
            )
          ) : // Company View
          filteredCompanies.length > 0 ? (
            <div className={styles.charitiesList}>
              {filteredCompanies.map((company, index) => (
                <div key={index} className={styles.charityCard}>
                  <h4 className={styles.charityName}>{company.name}</h4>
                  <div className={styles.companiesList}>
                    {company.charities.map((charity, idx) => (
                      <span key={idx} className={styles.companyTag}>
                        <IoCheckmarkCircle className={styles.checkIcon} />
                        {charity}
                      </span>
                    ))}
                  </div>
                  {company.url && (
                    <a
                      href={company.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.visitButton}
                    >
                      Visit Company →
                    </a>
                  )}
                  {/* <div className={styles.companyCount}>
                    {company.charities.length}{" "}
                    {company.charities.length === 1 ? "Charity" : "Charities"}
                  </div> */}
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p className={styles.emptyText}>
                No companies found matching "{searchTerm}"
              </p>
              <button
                className={styles.resetBtn}
                onClick={() => setSearchTerm("")}
              >
                Clear Search
              </button>
            </div>
          )}
        </div>

        <div className={styles.disclaimer}>
          <p className={styles.disclaimerText}>
            <strong>Note:</strong> As reported by the retail companies in our
            sample. Food companies may have other charities.
          </p>
        </div>
      </div>
    </section>
  );
}
