"use client";

import { useState } from "react";
import { useEffect } from "react";
import styles from "./Aliance.module.css";
import { FaHandshake, FaSearch } from "react-icons/fa";
import { IoCheckmarkCircle } from "react-icons/io5";

export default function Aliance() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("alliances");
  const [euAlliances, setAlliancesData] = useState([]);

  useEffect(() => {
    const fetchAlliances = async () => {
      try {
        const response = await fetch("/api/EU/eualiance");
        const data = await response.json();
        console.log("Fetched EU alliances data:", data);
        setAlliancesData(data.data);
      } catch (error) {
        console.error("Error fetching EU alliances data:", error);
      }
    };
    fetchAlliances();
  }, []);

  // Get unique companies and their alliances
  const getCompaniesList = () => {
    const companiesMap = {};
    euAlliances.forEach((alliance) => {
      alliance.companies.forEach((company) => {
        if (!companiesMap[company]) {
          companiesMap[company] = [];
        }
        companiesMap[company].push(alliance.name);
      });
    });
    return Object.entries(companiesMap).map(([company, alliances]) => ({
      name: company,
      alliances: alliances,
    }));
  };

  const companiesList = getCompaniesList();

  // Filter alliances based on search term
  const filteredAlliances = euAlliances.filter(
    (alliance) =>
      alliance.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alliance.companies.some((company) =>
        company.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
  );

  // Filter companies based on search term
  const filteredCompanies = companiesList.filter(
    (company) =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.alliances.some((alliance) =>
        alliance.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
  );

  return (
    <section className={styles.alliances}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.badge}>Partnerships</span>
          <h2 className={styles.title}>
            EU <span className={styles.highlight}>Alliances & Networks</span>
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
              viewMode === "alliances" ? styles.activeTab : ""
            }`}
            onClick={() => {
              setViewMode("alliances");
              setSearchTerm("");
            }}
          >
            <FaHandshake className={styles.tabIcon} />
            By Alliance
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
            <FaHandshake className={styles.tabIcon} />
            By Company
          </button>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <FaHandshake className={styles.sectionIcon} />
            <h3 className={styles.sectionTitle}>
              {viewMode === "alliances" ? "European Alliances" : "Companies"}
            </h3>
            <div className={styles.totalCount}>
              {viewMode === "alliances"
                ? `${filteredAlliances.length} of ${euAlliances.length} Organizations`
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
                  viewMode === "alliances"
                    ? "Search by alliance name or company..."
                    : "Search by company name or alliance..."
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
          {viewMode === "alliances" ? (
            // Alliance View
            filteredAlliances.length > 0 ? (
              <div className={styles.alliancesList}>
                {filteredAlliances.map((alliance, index) => (
                  <div key={index} className={styles.allianceCard}>
                    <div className={styles.alliancelink}>
                      {alliance.link && (
                        <a
                          href={alliance.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.allianceLink}
                        >
                          Visit Alliance
                        </a>
                      )}
                    </div>
                    <h4 className={styles.allianceName}>{alliance.name}</h4>
                    <div className={styles.companiesList}>
                      {alliance.companies.map((company, idx) => (
                        <span key={idx} className={styles.companyTag}>
                          <IoCheckmarkCircle className={styles.checkIcon} />
                          {company}
                        </span>
                      ))}
                    </div>
                    <div></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <p className={styles.emptyText}>
                  No alliances found matching "{searchTerm}"
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
            <div className={styles.alliancesList}>
              {filteredCompanies.map((company, index) => (
                <div key={index} className={styles.allianceCard}>
                  <h4 className={styles.allianceName}>{company.name}</h4>
                  <div className={styles.companiesList}>
                    {company.alliances.map((alliance, idx) => (
                      <span key={idx} className={styles.companyTag}>
                        <IoCheckmarkCircle className={styles.checkIcon} />
                        {alliance}
                      </span>
                    ))}
                  </div>
                  {/* <div className={styles.companyCount}>
                    {company.alliances.length}{" "}
                    {company.alliances.length === 1 ? "Alliance" : "Alliances"}
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

        {/* Disclaimer */}
        <div className={styles.disclaimer}>
          <p className={styles.disclaimerText}>
            <strong>Note:</strong> As reported by the companies in our sample.
            Food companies may have other alliances.
          </p>
        </div>
      </div>
    </section>
  );
}
