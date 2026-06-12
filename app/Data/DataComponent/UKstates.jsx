"use client";

import { useState, useRef, useEffect } from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import html2canvas from "html2canvas";
import styles from "./UKstates.module.css";
import { useYearRangeStore } from "../../store/yearRangeStore.js";

export default function UKStates() {
  const { minFrom, maxTo, fetchYearRange } = useYearRangeStore();
  useEffect(() => {
    fetchYearRange();
  }, [fetchYearRange]);
  // State management
  const [selectedMetric, setSelectedMetric] = useState(
    "foodWasteReductionRate",
  );
  const [selectedCompanies, setSelectedCompanies] = useState([
    "Sainsbury",
    "Asda",
    "Morrisons",
    "Aldi",
    "M&S",
  ]);
  const [Ukdata, setUkdata] = useState([]);

  const chartRef = useRef(null);

  // All available metrics
  const metrics = [
    { value: "foodHandled", label: "Food Handled (in Tonnes)" },
    { value: "unsoldFood", label: "Unsold Food (in Tonnes)" },
    { value: "foodSurplus", label: "Food Surplus (in Tonnes)" },
    { value: "foodWaste", label: "Food Waste (in Tonnes)" },
    {
      value: "foodWastePerHandled",
      label: "Food Waste Per Handled (in %)",
    },
    {
      value: "unsoldFoodPerHandled",
      label: "Unsold Food to Food Handled (in %).",
    },
    {
      value: "foodWasteToAnimalFeed",
      label: "Food Waste To Animal Feed (in Tonnes)",
    },
    { value: "humanRedistribution", label: "Human Redistribution (in Tonnes)" },
    {
      value: "foodWasteReductionRate",
      label: "Food Waste Reduction Rate (in %)",
    },
  ];

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await fetch("/api/ukcom", {
          method: "GET",
        });
        const data = await response.json();
        setUkdata(data.data);
        console.log("Fetched data:", data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchdata();
  }, []);

  // All companies
  const companies = Ukdata.map((item) => item.company);

  // Helper function to get company color
  const getCompanyColor = (companyName) => {
    const company = Ukdata.find((item) => item.company === companyName);
    return company?.color || "#3b82f6"; // Default color if not found
  };

  // Toggle company selection
  const toggleCompany = (company) => {
    if (selectedCompanies.includes(company)) {
      setSelectedCompanies(selectedCompanies.filter((c) => c !== company));
    } else {
      setSelectedCompanies([...selectedCompanies, company]);
    }
  };

  // Select all companies
  const selectAllCompanies = () => {
    setSelectedCompanies(companies);
  };

  // Clear all companies
  const clearAllCompanies = () => {
    setSelectedCompanies([]);
  };

  // Prepare data for radar chart
  const prepareChartData = () => {
    // Get all unique year ranges from all companies
    const allYearRanges = new Set();
    Ukdata.forEach((companyData) => {
      companyData.data.forEach((yearData) => {
        const yearRange = `${yearData.from}/${yearData.to}`;
        allYearRanges.add(yearRange);
      });
    });

    const yearRanges = Array.from(allYearRanges).sort();

    // For each year range, create an object with the metric value for each selected company
    return yearRanges.map((yearRange) => {
      const [from, to] = yearRange.split("/").map(Number);
      const dataPoint = { yearRange, from, to };

      selectedCompanies.forEach((company) => {
        const companyData = Ukdata.find((c) => c.company === company);
        if (companyData) {
          const yearData = companyData.data.find(
            (d) => d.from === from && d.to === to,
          );
          if (yearData) {
            let value = yearData[selectedMetric];
            // Handle string values like "1,000+"
            if (typeof value === "string") {
              value = parseFloat(value.replace(/,/g, "").replace("+", "")) || 0;
            }
            dataPoint[company] = value;
          }
        }
      });

      return dataPoint;
    });
  };

  const chartData = prepareChartData();

  // Animation state for chart entrance
  const [chartVisible, setChartVisible] = useState(false);

  // Trigger chart animation on mount or when companies change
  useState(() => {
    if (selectedCompanies.length > 0) {
      setChartVisible(false);
      const timer = setTimeout(() => setChartVisible(true), 100);
      return () => clearTimeout(timer);
    }
  }, [selectedCompanies]);

  // Download chart as PNG
  const downloadChart = async () => {
    if (chartRef.current) {
      try {
        const canvas = await html2canvas(chartRef.current, {
          backgroundColor: "#ffffffff",
          scale: 2,
          useCORS: true,
          logging: false,
        });
        const ctx = canvas.getContext("2d");

        // ✅ Apply a tint or color overlay to the image
        ctx.globalCompositeOperation = "source-atop";
        ctx.fillStyle = "rgba(255, 255, 255, 0.7)"; // dark overlay
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Download directly with high quality
        const link = document.createElement("a");
        link.download = "supermarket_chart.png";
        link.href = canvas.toDataURL("image/png", 1.0);
        link.click();
      } catch (error) {
        console.error("Error downloading chart:", error);
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>UK Supermarket Food Waste Dashboard</h1>
          <p className={styles.subtitle}>
            Interactive analysis of food waste metrics across major UK retailers
          </p>
        </div>

        {/* Main Card */}
        <div className={styles.mainCard}>
          {/* Blue Header */}
          <div className={styles.cardHeader}>
            <h2 className={styles.cardHeaderTitle}>Radar Chart Analysis</h2>
          </div>

          {/* Controls */}
          <div className={styles.controls}>
            <div className={styles.controlsTop}>
              {/* Metric Selector */}
              <div className={styles.metricSelector}>
                <label className={styles.label}>Select Metric</label>
                <select
                  value={selectedMetric}
                  onChange={(e) => setSelectedMetric(e.target.value)}
                  className={styles.select}
                >
                  {metrics.map((metric) => (
                    <option key={metric.value} value={metric.value}>
                      {metric.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Download Button */}
              <div className={styles.downloadButtonWrapper}>
                <button
                  onClick={downloadChart}
                  className={styles.downloadButton}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={styles.downloadIcon}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Download as PNG
                </button>
              </div>
            </div>

            {/* Company Selector */}
            <div className={styles.companySelector}>
              <div className={styles.companySelectorHeader}>
                <label className={styles.label}>Select Companies</label>
                <div className={styles.bulkActions}>
                  <button
                    onClick={selectAllCompanies}
                    className={styles.bulkButton}
                    type="button"
                  >
                    Select All
                  </button>
                  <button
                    onClick={clearAllCompanies}
                    className={styles.bulkButton}
                    type="button"
                  >
                    Clear All
                  </button>
                </div>
              </div>
              <div className={styles.companyGrid}>
                {companies.map((company) => (
                  <label key={company} className={styles.companyLabel}>
                    <input
                      type="checkbox"
                      checked={selectedCompanies.includes(company)}
                      onChange={() => toggleCompany(company)}
                      className={styles.checkbox}
                    />
                    <span className={styles.companyName}>
                      <span
                        className={styles.colorDot}
                        style={{ backgroundColor: getCompanyColor(company) }}
                      ></span>
                      {company}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Chart Area */}
          <div className={styles.chartContainer} ref={chartRef}>
            <div className={`${styles.chartWrapper} ${styles.chart3D}`}>
              {selectedCompanies.length === 0 ? (
                <div className={styles.emptyState}>
                  <p className={styles.emptyStateText}>
                    Please select at least one company to display the chart
                  </p>
                </div>
              ) : (
                <div
                  className={`${styles.chartInner} ${
                    chartVisible ? styles.chartAnimate : ""
                  }`}
                >
                  <ResponsiveContainer width="100%" height={700}>
                    <RadarChart
                      data={chartData}
                      margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
                    >
                      <defs>
                        {selectedCompanies.map((company) => (
                          <filter
                            key={`shadow-${company}`}
                            id={`shadow-${company}`}
                            height="200%"
                          >
                            <feDropShadow
                              dx="2"
                              dy="3"
                              stdDeviation="3"
                              floodColor={getCompanyColor(company)}
                              floodOpacity="0.4"
                            />
                          </filter>
                        ))}
                        {selectedCompanies.map((company) => (
                          <linearGradient
                            key={`gradient-${company}`}
                            id={`gradient-${company}`}
                            x1="0%"
                            y1="0%"
                            x2="0%"
                            y2="100%"
                          >
                            <stop
                              offset="0%"
                              stopColor={getCompanyColor(company)}
                              stopOpacity={0.4}
                            />
                            <stop
                              offset="100%"
                              stopColor={getCompanyColor(company)}
                              stopOpacity={0.1}
                            />
                          </linearGradient>
                        ))}
                      </defs>

                      <PolarGrid
                        stroke="#cbd5e1"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                      />
                      <PolarAngleAxis
                        dataKey="yearRange"
                        tick={{
                          fill: "#151516ff",
                          fontSize: 14,
                          fontWeight: 700,
                        }}
                      />
                      <PolarRadiusAxis
                        angle={90}
                        domain={[0, "auto"]}
                        tick={{
                          fill: "#080808ff",
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                        stroke="#94a3b8"
                        strokeWidth={2}
                      />
                      {selectedCompanies.map((company, index) => (
                        <Radar
                          key={company}
                          name={company}
                          dataKey={company}
                          stroke={getCompanyColor(company)}
                          fill={`url(#gradient-${company})`}
                          fillOpacity={0.6}
                          strokeWidth={4}
                          dot={{
                            r: 6,
                            fill: getCompanyColor(company),
                            strokeWidth: 3,
                            stroke: "#ffffff",
                            filter: `url(#shadow-${company})`,
                          }}
                          activeDot={{
                            r: 8,
                            fill: getCompanyColor(company),
                            stroke: "#ffffff",
                            strokeWidth: 3,
                          }}
                          isAnimationActive={true}
                          animationBegin={index * 150}
                          animationDuration={1800}
                          animationEasing="ease-in-out"
                        />
                      ))}
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(8, 8, 8, 0.98)",
                          border: "4px solid #10396eff",
                          borderRadius: "12px",
                          boxShadow:
                            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                          padding: "16px",
                          backdropFilter: "blur(10px)",
                        }}
                        labelStyle={{
                          fontWeight: "700",
                          marginBottom: "12px",
                          fontSize: "14px",
                          color: "#aeb2b8ff",
                        }}
                        itemStyle={{
                          fontSize: "13px",
                          fontWeight: "600",
                          padding: "4px 0",
                        }}
                      />
                      <Legend
                        wrapperStyle={{
                          paddingTop: "40px",
                          fontSize: "14px",
                          fontWeight: "600",
                        }}
                        iconType="circle"
                        iconSize={14}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>

          {/* Info Footer */}
          <div className={styles.infoFooter}>
            <div className={styles.infoText}>
              <p>
                <strong>Selected Metric:</strong>{" "}
                {metrics.find((m) => m.value === selectedMetric)?.label}
              </p>
              <p>
                <strong>Companies Displayed:</strong>{" "}
                {selectedCompanies.length > 0
                  ? selectedCompanies.join(", ")
                  : "None"}
              </p>
            </div>
          </div>
        </div>

        {/* Additional Info Cards */}
        <div className={styles.infoCardsGrid}>
          <div className={styles.infoCard}>
            <div className={styles.infoCardHeader}>
              <div className={`${styles.iconCircle} ${styles.iconCircleBlue}`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`${styles.icon} ${styles.iconBlue}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className={styles.infoCardTitle}>Total Companies</h3>
            </div>
            <p className={`${styles.infoCardValue} ${styles.valueBlue}`}>
              {companies.length}
            </p>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.infoCardHeader}>
              <div className={`${styles.iconCircle} ${styles.iconCircleGreen}`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`${styles.icon} ${styles.iconGreen}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className={styles.infoCardTitle}>Available Metrics</h3>
            </div>
            <p className={`${styles.infoCardValue} ${styles.valueGreen}`}>
              {metrics.length}
            </p>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.infoCardHeader}>
              <div
                className={`${styles.iconCircle} ${styles.iconCirclePurple}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`${styles.icon} ${styles.iconPurple}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className={styles.infoCardTitle}>Years Tracked</h3>
            </div>
            <p className={`${styles.infoCardValue} ${styles.valuePurple}`}>
              {minFrom}-{maxTo}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
