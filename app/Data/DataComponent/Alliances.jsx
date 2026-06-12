"use client";

import { useState } from "react";
import styles from "./Alliances.module.css";
import { FaHandshake, FaHeart, FaSearch } from "react-icons/fa";
import { IoCheckmarkCircle } from "react-icons/io5";
import { useEffect } from "react";

export default function Alliances() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("alliances"); // "alliances" or "companies"
  const [ukAlliances, setukAlliances] = useState([]);
  const [charities, setCharities] = useState([]);

  useEffect(() => {
    const fetchAlliances = async () => {
      try {
        const response = await fetch("/api/ukalliances");
        const result = await response.json();
        setukAlliances(result.data);
      } catch (error) {
        console.error("Error fetching alliances:", error);
      }
    };
    fetchAlliances();
  }, []);

  useEffect(() => {
    const fetchCharities = async () => {
      try {
        const response = await fetch("/api/getUkcharity");
        const result = await response.json();
        setCharities(result.data);
      } catch (error) {
        console.error("Error fetching charities:", error);
      }
    };
    fetchCharities();
  }, []);

  // const charities = [
  //   {
  //     name: "FareShare",
  //     companies: ["Aldi", "Asda", "Co-op", "M&S", "Morrisons", "Sainsbury"],
  //   },
  //   {
  //     name: "Hubbub",
  //     companies: ["Asda", "Co-op", "M&S", "Morrisons", "Sainsbury", "Waitrose"],
  //   },
  //   {
  //     name: "The Trussell Trust",
  //     companies: ["Asda", "Tesco", "Waitrose"],
  //   },
  //   {
  //     name: "OLIO",
  //     companies: ["Asda", "Morrisons", "Tesco", "Waitrose"],
  //   },
  //   {
  //     name: "Neighbourly",
  //     companies: ["Aldi", "Asda", "Co-op", "Waitrose"],
  //   },
  //   {
  //     name: "WWF",
  //     companies: ["Co-op", "M&S", "Sainsbury", "Tesco"],
  //   },
  // ];

  // Get unique companies and their alliances
  const getCompaniesFromAlliances = () => {
    const companiesMap = {};
    ukAlliances.forEach((alliance) => {
      alliance.companies.forEach((company) => {
        if (!companiesMap[company]) {
          companiesMap[company] = { alliances: [], charities: [] };
        }
        companiesMap[company].alliances.push(alliance.name);
      });
    });
    charities.forEach((charity) => {
      charity.companies.forEach((company) => {
        if (!companiesMap[company]) {
          companiesMap[company] = { alliances: [], charities: [] };
        }
        companiesMap[company].charities.push(charity.name);
      });
    });
    return Object.entries(companiesMap).map(([company, data]) => ({
      name: company,
      alliances: data.alliances,
      charities: data.charities,
    }));
  };

  const companiesList = getCompaniesFromAlliances();

  // Filter based on search term
  const filteredAlliances = ukAlliances.filter(
    (alliance) =>
      alliance.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alliance.companies.some((company) =>
        company.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
  );

  const filteredCharities = charities.filter(
    (charity) =>
      charity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      charity.companies.some((company) =>
        company.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
  );

  const filteredCompanies = companiesList.filter(
    (company) =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.alliances.some((alliance) =>
        alliance.toLowerCase().includes(searchTerm.toLowerCase()),
      ) ||
      company.charities.some((charity) =>
        charity.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
  );

  return (
    <section className={styles.alliances}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.badge}>Partnerships</span>
          <h2 className={styles.title}>
            UK <span className={styles.highlight}>Alliances & Charities</span>
          </h2>
          <p className={styles.subtitle}>
            Key non-profit organisations and charities working with our sample
            of UK food companies to combat food waste
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
            By Alliance/Charity
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

        {/* Search Bar */}
        <div className={styles.searchWrapper}>
          <div className={styles.searchBox}>
            <FaSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder={
                viewMode === "alliances"
                  ? "Search by alliance/charity name or company..."
                  : "Search by company name or alliance/charity..."
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

        {viewMode === "alliances" ? (
          // Alliance/Charity View
          <div className={styles.sectionsGrid}>
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <FaHandshake className={styles.sectionIcon} />
                <h3 className={styles.sectionTitle}>UK Alliances</h3>
                <div className={styles.totalCount}>
                  {filteredAlliances.length} of {ukAlliances.length}
                </div>
              </div>

              {filteredAlliances.length > 0 ? (
                <div className={styles.alliancesList}>
                  {filteredAlliances.map((alliance, index) => (
                    <div key={index} className={styles.allianceCard}>
                      <h4 className={styles.allianceName}>{alliance.name}</h4>
                      <div className={styles.companiesList}>
                        {alliance.companies.map((company, idx) => (
                          <span key={idx} className={styles.companyTag}>
                            <IoCheckmarkCircle className={styles.checkIcon} />
                            {company}
                          </span>
                        ))}
                      </div>
                      {/* <div className={styles.companyCount}>
                        {alliance.companies.length}{" "}
                        {alliance.companies.length === 1
                          ? "Company"
                          : "Companies"}
                      </div> */}
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <p className={styles.emptyText}>
                    No alliances found matching "{searchTerm}"
                  </p>
                </div>
              )}
            </div>

            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <FaHeart className={styles.sectionIcon} />
                <h3 className={styles.sectionTitle}>Charity Partners</h3>
                <div className={styles.totalCount}>
                  {filteredCharities.length} of {charities.length}
                </div>
              </div>

              {filteredCharities.length > 0 ? (
                <div className={styles.alliancesList}>
                  {filteredCharities.map((charity, index) => (
                    <div key={index} className={styles.allianceCard}>
                      <h4 className={styles.allianceName}>{charity.name}</h4>
                      <div className={styles.companiesList}>
                        {charity.companies.map((company, idx) => (
                          <span key={idx} className={styles.companyTag}>
                            <IoCheckmarkCircle className={styles.checkIcon} />
                            {company}
                          </span>
                        ))}
                      </div>
                      {/* <div className={styles.companyCount}>
                        {charity.companies.length}{" "}
                        {charity.companies.length === 1
                          ? "Partner"
                          : "Partners"}
                      </div> */}
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <p className={styles.emptyText}>
                    No charities found matching "{searchTerm}"
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Company View - Separate Alliances and Charities
          <div className={styles.sectionsGrid}>
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <FaHandshake className={styles.sectionIcon} />
                <h3 className={styles.sectionTitle}>Alliances by Company</h3>
                <div className={styles.totalCount}>
                  {
                    filteredCompanies.filter((c) => c.alliances.length > 0)
                      .length
                  }{" "}
                  Companies
                </div>
              </div>

              {filteredCompanies.filter((c) => c.alliances.length > 0).length >
              0 ? (
                <div className={styles.alliancesList}>
                  {filteredCompanies
                    .filter((company) => company.alliances.length > 0)
                    .map((company, index) => (
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
                      </div>
                    ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <p className={styles.emptyText}>
                    No companies with alliances found matching "{searchTerm}"
                  </p>
                </div>
              )}
            </div>

            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <FaHeart className={styles.sectionIcon} />
                <h3 className={styles.sectionTitle}>Charities by Company</h3>
                <div className={styles.totalCount}>
                  {
                    filteredCompanies.filter((c) => c.charities.length > 0)
                      .length
                  }{" "}
                  Companies
                </div>
              </div>

              {filteredCompanies.filter((c) => c.charities.length > 0).length >
              0 ? (
                <div className={styles.alliancesList}>
                  {filteredCompanies
                    .filter((company) => company.charities.length > 0)
                    .map((company, index) => (
                      <div key={index} className={styles.allianceCard}>
                        <h4 className={styles.allianceName}>{company.name}</h4>
                        <div className={styles.companiesList}>
                          {company.charities.map((charity, idx) => (
                            <span key={idx} className={styles.companyTag}>
                              <IoCheckmarkCircle className={styles.checkIcon} />
                              {charity}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <p className={styles.emptyText}>
                    No companies with charities found matching "{searchTerm}"
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className={styles.disclaimer}>
          <p className={styles.disclaimerText}>
            <strong>Note:</strong> As reported by the food retail companies in
            our sample. Food companies may have other alliances and charity partners.
          </p>
        </div>
      </div>
    </section>
  );
}
