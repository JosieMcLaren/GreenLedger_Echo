"use client";

import { useEffect, useState, useMemo } from "react";
import styles from "./DocumentEU.module.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const PREDEFINED_SECTORS = [
  { value: "supermarkets", label: "Supermarkets" },
  { value: "manufacturers", label: "Manufacturers" },
  { value: "distributors", label: "Distributors" },
  { value: "restaurants", label: "Restaurants" },
  { value: "contract-caterers", label: "Contract Caterers" },
];

export default function DocumentEU({ externalSector, onSectorChange }) {
  const [rawData, setRawData] = useState([]);
  const [selectedSector, setSelectedSector] = useState(externalSector || "all");
  const [loading, setLoading] = useState(true);

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
    const fetcheudocuments = async () => {
      try {
        const response = await fetch("/api/EU/eudoc", {
          method: "GET",
        });
        const data = await response.json();
        setRawData(data.data || []);
      } catch (error) {
        console.error("Error fetching EU documents data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetcheudocuments();
  }, []);

  // Compute available sectors from raw data
  const availableSectors = useMemo(() => {
    const set = new Set();
    rawData.forEach((doc) => {
      if (doc.sector && doc.sector.trim()) {
        set.add(doc.sector.toLowerCase().trim());
      }
    });

    const list = [];
    PREDEFINED_SECTORS.forEach((ps) => {
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
  }, [rawData]);

  // Filter rawData according to selectedSector
  const filteredDocs = useMemo(() => {
    if (selectedSector === "all") return rawData;
    return rawData.filter(
      (d) => (d.sector || "").toLowerCase().trim() === selectedSector.toLowerCase().trim()
    );
  }, [rawData, selectedSector]);

  // Aggregate by year range for chart
  const chartData = useMemo(() => {
    const yearMap = new Map();
    filteredDocs.forEach((item) => {
      const key = `${item.from}-${item.to}`;
      if (!yearMap.has(key)) {
        yearMap.set(key, {
          from: item.from,
          to: item.to,
          annualReport: 0,
          sustainability: 0,
          integratedReport: 0,
          other: 0,
        });
      }
      const curr = yearMap.get(key);
      curr.annualReport += item.annualReport || 0;
      curr.sustainability += item.sustainability || 0;
      curr.integratedReport += item.integratedReport || 0;
      curr.other += item.other || 0;
    });

    return Array.from(yearMap.values()).sort((a, b) => a.from - b.from);
  }, [filteredDocs]);

  // Dynamic totals
  const totals = useMemo(() => {
    const totalAnnual = filteredDocs.reduce(
      (sum, d) => sum + (d.annualReport || 0),
      0
    );
    const totalSustainability = filteredDocs.reduce(
      (sum, d) => sum + (d.sustainability || 0),
      0
    );
    const totalIntegrated = filteredDocs.reduce(
      (sum, d) => sum + (d.integratedReport || 0),
      0
    );
    const totalOther = filteredDocs.reduce(
      (sum, d) => sum + (d.other || 0),
      0
    );
    const totalReports =
      totalAnnual + totalSustainability + totalIntegrated + totalOther;

    return {
      totalAnnual,
      totalSustainability,
      totalIntegrated,
      totalOther,
      totalReports,
    };
  }, [filteredDocs]);

  return (
    <section id="eu-documents" className={styles.charts}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.badge}>Documentation Trends</span>
          <h2 className={styles.title}>
            EU <span className={styles.highlight}>Documents by Year</span>
          </h2>
          <p className={styles.subtitle}>
            Evolution of sustainability reporting documentation across European
            food companies
          </p>
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
            <span className={styles.sectorPillCount}>{rawData.length}</span>
          </button>
          {availableSectors.map((sector) => {
            const count = rawData.filter(
              (d) => (d.sector || "").toLowerCase().trim() === sector.value
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

        <div className={styles.chartWrapper}>
          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>Documents by Type Over Time</h3>
            {chartData.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "4rem 2rem",
                  color: "#6b7280",
                  fontSize: "1rem",
                }}
              >
                {loading
                  ? "Loading documents..."
                  : "No documents recorded for this sector yet."}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={450}>
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  barSize={45}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="from"
                    stroke="#6b7280"
                    style={{ fontSize: "0.875rem", fontWeight: 600 }}
                    tickFormatter={(value, index) => {
                      const item = chartData[index];
                      return item
                        ? `${item.from}/${item.to ? item.to.toString().slice(-2) : ""}`
                        : value;
                    }}
                  />
                  <YAxis stroke="#6b7280" style={{ fontSize: "0.875rem" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                      color: "#ffffff",
                    }}
                    cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: "20px" }}
                    iconType="circle"
                  />
                  <Bar
                    dataKey="annualReport"
                    stackId="a"
                    fill="#3b82f6"
                    name="Annual Report"
                    radius={[0, 0, 0, 0]}
                  />
                  <Bar
                    dataKey="sustainability"
                    stackId="a"
                    fill="#22c55e"
                    name="Sustainability Reports"
                    radius={[0, 0, 0, 0]}
                  />
                  <Bar
                    dataKey="other"
                    stackId="a"
                    fill="#f59e0b"
                    name="Other"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className={styles.stats}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{totals.totalReports}</div>
            <div className={styles.statLabel}>Total Documents</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{totals.totalAnnual}</div>
            <div className={styles.statLabel}>Annual Reports</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{totals.totalSustainability}</div>
            <div className={styles.statLabel}>Sustainability Reports</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{totals.totalOther}</div>
            <div className={styles.statLabel}>Other Documents</div>
          </div>
        </div>
      </div>
    </section>
  );
}
