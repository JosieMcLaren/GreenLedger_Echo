"use client";

import { useState, useEffect, useMemo } from "react";
import styles from "./Charity.module.css";
import { FaHeart, FaSearch } from "react-icons/fa";
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

export default function Charity({ externalSector, onSectorChange }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSector, setSelectedSector] = useState(externalSector || "all");
  const [viewMode, setViewMode] = useState("charities"); // "charities" or "companies"
  const [charityData, setCharityData] = useState([]);

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
    const fetchCharityData = async () => {
      try {
        const response = await fetch("/api/EU/eucharity");
        const result = await response.json();
        setCharityData(result.data || []);
      } catch (error) {
        console.error("Error fetching charity data:", error);
      }
    };
    fetchCharityData();
  }, []);

  // Compute available sectors
  const availableSectors = useMemo(() => {
    const set = new Set();
    charityData.forEach((c) => {
      if (c.sector && c.sector.trim()) set.add(c.sector.toLowerCase().trim());
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
  }, [charityData]);

  // Sector filtering
  const sectorFilteredCharities = useMemo(() => {
    if (selectedSector === "all") return charityData;
    return charityData.filter(
      (c) => (c.sector || "").toLowerCase().trim() === selectedSector.toLowerCase().trim()
    );
  }, [charityData, selectedSector]);

  // Unique companies from sector-filtered charities
  const companiesList = useMemo(() => {
    const companiesMap = {};
    sectorFilteredCharities.forEach((charity) => {
      charity.companies?.forEach((company) => {
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
  }, [sectorFilteredCharities]);

  // Filter charities based on search term
  const filteredCharities = useMemo(() => {
    return sectorFilteredCharities.filter(
      (charity) =>
        charity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        charity.companies?.some((company) =>
          company.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
  }, [sectorFilteredCharities, searchTerm]);

  // Filter companies based on search term
  const filteredCompanies = useMemo(() => {
    return companiesList.filter(
      (company) =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.charities.some((charity) =>
          charity.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
  }, [companiesList, searchTerm]);

  return (
    <section id="eu-charity-partners" className={styles.charities}>
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
            <span className={styles.sectorPillCount}>{charityData.length}</span>
          </button>
          {availableSectors.map((sector) => {
            const count = charityData.filter(
              (c) => (c.sector || "").toLowerCase().trim() === sector.value
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
            <FaHeart className={styles.sectionIcon} />
            <h3 className={styles.sectionTitle}>
              {viewMode === "charities" ? "Charity Organizations" : "Companies"}
            </h3>
            <div className={styles.totalCount}>
              {viewMode === "charities"
                ? `${filteredCharities.length} of ${sectorFilteredCharities.length} Charities`
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
                    <h4 className={styles.charityName}>
                      {charity.name}
                      {charity.sector && (
                        <span className={styles.sectorBadge}>
                          {getSectorLabel(charity.sector)}
                        </span>
                      )}
                    </h4>
                    <div className={styles.companiesList}>
                      {charity.companies?.map((company, idx) => (
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
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <p className={styles.emptyText}>
                  {searchTerm
                    ? `No charities found matching "${searchTerm}"`
                    : "No charities found for the selected sector."}
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
            <div className={styles.charitiesList}>
              {filteredCompanies.map((company, index) => (
                <div key={index} className={styles.charityCard}>
                  <h4 className={styles.charityName}>{company.name}</h4>
                  <div className={styles.companiesList}>
                    {company.charities?.map((charity, idx) => (
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
            Food companies may have other charities.
          </p>
        </div>
      </div>
    </section>
  );
}
