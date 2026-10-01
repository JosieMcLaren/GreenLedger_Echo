"use client";

import { useState, useEffect, useMemo } from "react";
import styles from "./Aliance.module.css";
import { FaHandshake, FaSearch } from "react-icons/fa";
import { IoCheckmarkCircle } from "react-icons/io5";

const PREDEFINED_SECTOR_OPTIONS = [
  { value: "supermarkets", label: "Supermarkets" },
  { value: "manufacturers", label: "Manufacturers" },
  { value: "distributors", label: "Distributors" },
  { value: "restaurants", label: "Restaurants" },
  { value: "contract-caterers", label: "Contract Caterers" },
];

const getSectorLabel = (sector) => {
  if (!sector || !sector.trim()) return "";
  const match = PREDEFINED_SECTOR_OPTIONS.find(
    (opt) => opt.value === sector.toLowerCase().trim()
  );
  if (match) return match.label;
  return sector
    .split(/[\s-_]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
};

export default function Aliance({ externalSector, onSectorChange }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSector, setSelectedSector] = useState(externalSector || "all");
  const [viewMode, setViewMode] = useState("alliances");
  const [euAlliances, setAlliancesData] = useState([]);

  useEffect(() => {
    if (externalSector !== undefined) {
      setSelectedSector(externalSector);
    }
  }, [externalSector]);

  const handleSectorChange = (sec) => {
    setSelectedSector(sec);
    if (onSectorChange) onSectorChange(sec);
  };

  useEffect(() => {
    const fetchAlliances = async () => {
      try {
        const response = await fetch("/api/EU/eualiance");
        const data = await response.json();
        setAlliancesData(data.data || []);
      } catch (error) {
        console.error("Error fetching EU alliances data:", error);
      }
    };
    fetchAlliances();
  }, []);

  // Compute available sectors
  const availableSectors = useMemo(() => {
    const set = new Set();
    euAlliances.forEach((a) => {
      if (a.sector && a.sector.trim()) set.add(a.sector.toLowerCase().trim());
    });

    const list = [];
    PREDEFINED_SECTOR_OPTIONS.forEach((ps) => {
      if (set.has(ps.value)) {
        list.push(ps);
        set.delete(ps.value);
      }
    });

    set.forEach((sec) => {
      list.push({
        value: sec,
        label: sec
          .split(/[\s-_]+/)
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(" "),
      });
    });

    return list;
  }, [euAlliances]);

  // Filter alliances by sector
  const sectorFilteredAlliances = useMemo(() => {
    if (selectedSector === "all") return euAlliances;
    return euAlliances.filter(
      (a) => (a.sector || "").toLowerCase().trim() === selectedSector.toLowerCase().trim()
    );
  }, [euAlliances, selectedSector]);

  // Get unique companies from sector-filtered alliances
  const companiesList = useMemo(() => {
    const companiesMap = {};
    sectorFilteredAlliances.forEach((alliance) => {
      alliance.companies?.forEach((company) => {
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
  }, [sectorFilteredAlliances]);

  // Filter alliances based on search term
  const filteredAlliances = useMemo(() => {
    return sectorFilteredAlliances.filter(
      (alliance) =>
        alliance.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alliance.companies?.some((company) =>
          company.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
  }, [sectorFilteredAlliances, searchTerm]);

  // Filter companies based on search term
  const filteredCompanies = useMemo(() => {
    return companiesList.filter(
      (company) =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.alliances.some((alliance) =>
          alliance.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
  }, [companiesList, searchTerm]);

  return (
    <section id="eu-alliances" className={styles.alliances}>
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

        {/* Sector Filter */}
        <div className={styles.sectorFilterWrapper}>
          <span className={styles.sectorFilterLabel}>Filter by Sector:</span>
          <button
            type="button"
            onClick={() => handleSectorChange("all")}
            className={`${styles.sectorPill} ${
              selectedSector === "all" ? styles.sectorPillActive : ""
            }`}
          >
            All Sectors
            <span className={styles.sectorPillCount}>{euAlliances.length}</span>
          </button>
          {availableSectors.map((sector) => {
            const count = euAlliances.filter(
              (a) => (a.sector || "").toLowerCase().trim() === sector.value
            ).length;
            return (
              <button
                key={sector.value}
                type="button"
                onClick={() => handleSectorChange(sector.value)}
                className={`${styles.sectorPill} ${
                  selectedSector === sector.value ? styles.sectorPillActive : ""
                }`}
              >
                {sector.label}
                <span className={styles.sectorPillCount}>{count}</span>
              </button>
            );
          })}
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <FaHandshake className={styles.sectionIcon} />
            <h3 className={styles.sectionTitle}>
              {viewMode === "alliances" ? "European Alliances" : "Companies"}
            </h3>
            <div className={styles.totalCount}>
              {viewMode === "alliances"
                ? `${filteredAlliances.length} of ${sectorFilteredAlliances.length} Organizations`
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
                    <h4 className={styles.allianceName}>
                      {alliance.name}
                      {alliance.sector && (
                        <span className={styles.sectorBadge}>
                          {getSectorLabel(alliance.sector)}
                        </span>
                      )}
                    </h4>
                    <div className={styles.companiesList}>
                      {alliance.companies?.map((company, idx) => (
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
                  {searchTerm
                    ? `No alliances found matching "${searchTerm}"`
                    : "No alliances found for the selected sector."}
                </p>
                {searchTerm && (
                  <button
                    className={styles.resetBtn}
                    onClick={() => setSearchTerm("")}
                  >
                    Clear Search
                  </button>
                )}
              </div>
            )
          ) : // Company View
          filteredCompanies.length > 0 ? (
            <div className={styles.alliancesList}>
              {filteredCompanies.map((company, index) => (
                <div key={index} className={styles.allianceCard}>
                  <h4 className={styles.allianceName}>{company.name}</h4>
                  <div className={styles.companiesList}>
                    {company.alliances?.map((alliance, idx) => (
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
                {searchTerm
                  ? `No companies found matching "${searchTerm}"`
                  : "No companies found for the selected sector."}
              </p>
              {searchTerm && (
                <button
                  className={styles.resetBtn}
                  onClick={() => setSearchTerm("")}
                >
                  Clear Search
                </button>
              )}
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
