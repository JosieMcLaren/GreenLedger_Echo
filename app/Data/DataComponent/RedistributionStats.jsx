"use client";

import styles from "./RedistributionStats.module.css";
import { FaLeaf, FaCheckCircle } from "react-icons/fa";
import { IoTrendingUp } from "react-icons/io5";

export default function RedistributionStats() {
  const redistributionData = [
    {
      year: "2016/17",
      Tesco: "",
      Sainsbury: "",
      Asda: "",
      Morrisons: "",
      Aldi: "1.10%",
      MS: "",
      Lidl: "",
      Waitrose: "",
      Iceland: "",
      Coop: "",
    },
    {
      year: "2017/18",
      Tesco: "",
      Sainsbury: "73%",
      Asda: "",
      Morrisons: "",
      Aldi: "1.60%",
      MS: "",
      Lidl: "",
      Waitrose: "",
      Iceland: "",
      Coop: "",
    },
    {
      year: "2018/19",
      Tesco: "",
      Sainsbury: "87%",
      Asda: "",
      Morrisons: "",
      Aldi: "3.10%",
      MS: "",
      Lidl: "",
      Waitrose: "",
      Iceland: "",
      Coop: "",
    },
    {
      year: "2019/20",
      Tesco: "77%",
      Sainsbury: "92%",
      Asda: "",
      Morrisons: "",
      Aldi: "",
      MS: "",
      Lidl: "",
      Waitrose: "",
      Iceland: "",
      Coop: "",
    },
    {
      year: "2020/21",
      Tesco: "82%",
      Sainsbury: "N/A",
      Asda: "",
      Morrisons: "",
      Aldi: "",
      MS: "",
      Lidl: "",
      Waitrose: "",
      Iceland: "",
      Coop: "",
    },
  ];

  const getPerformanceClass = (value) => {
    if (!value || value === "N/A") return "";
    const numValue = parseFloat(value);
    if (numValue >= 80) return styles.excellent;
    if (numValue >= 50) return styles.good;
    if (numValue >= 20) return styles.moderate;
    return styles.low;
  };

  const getPerformanceBadge = (value) => {
    if (!value || value === "N/A") return null;
    const numValue = parseFloat(value);
    if (numValue >= 80) return { text: "Excellent", icon: "🌟" };
    if (numValue >= 50) return { text: "Good", icon: "✓" };
    if (numValue >= 20) return { text: "Moderate", icon: "→" };
    return { text: "Developing", icon: "↗" };
  };

  return (
    <section className={styles.redistribution}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.badge}>Redistribution Performance</span>
          <h2 className={styles.title}>
            <span className={styles.highlight}>Redistributed Surplus</span>
            <br />
            Percentage of Unsold Food Distributed to Humans or Animals
          </h2>
          <p className={styles.subtitle}>
            Tracking the percentage of unsold food safe for human consumption
            that is successfully redistributed across major UK food companies
          </p>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.yearHeader}>Year</th>
                <th>Tesco (UK)</th>
                <th>Sainsbury</th>
                <th>Asda</th>
                <th>Morrisons</th>
                <th>Aldi</th>
                <th>M&S</th>
                <th>Lidl</th>
                <th>Waitrose</th>
                <th>Iceland</th>
                <th>Co-op</th>
              </tr>
            </thead>
            <tbody>
              {redistributionData.map((row, index) => (
                <tr key={index} className={styles.dataRow}>
                  <td className={styles.yearCell}>
                    <FaLeaf className={styles.yearIcon} />
                    {row.year}
                  </td>
                  <td className={getPerformanceClass(row.Tesco)}>
                    {row.Tesco && (
                      <div className={styles.cellContent}>
                        <span className={styles.percentage}>{row.Tesco}</span>
                        {getPerformanceBadge(row.Tesco) && (
                          <span className={styles.badge2}>
                            {getPerformanceBadge(row.Tesco).icon}
                          </span>
                        )}
                      </div>
                    )}
                    {!row.Tesco && <span className={styles.noData}>—</span>}
                  </td>
                  <td className={getPerformanceClass(row.Sainsbury)}>
                    {row.Sainsbury && row.Sainsbury !== "N/A" && (
                      <div className={styles.cellContent}>
                        <span className={styles.percentage}>
                          {row.Sainsbury}
                        </span>
                        {getPerformanceBadge(row.Sainsbury) && (
                          <span className={styles.badge2}>
                            {getPerformanceBadge(row.Sainsbury).icon}
                          </span>
                        )}
                      </div>
                    )}
                    {row.Sainsbury === "N/A" && (
                      <span className={styles.naData}>N/A</span>
                    )}
                    {!row.Sainsbury && <span className={styles.noData}>—</span>}
                  </td>
                  <td className={getPerformanceClass(row.Asda)}>
                    {row.Asda ? (
                      row.Asda
                    ) : (
                      <span className={styles.noData}>—</span>
                    )}
                  </td>
                  <td className={getPerformanceClass(row.Morrisons)}>
                    {row.Morrisons ? (
                      row.Morrisons
                    ) : (
                      <span className={styles.noData}>—</span>
                    )}
                  </td>
                  <td className={getPerformanceClass(row.Aldi)}>
                    {row.Aldi ? (
                      row.Aldi
                    ) : (
                      <span className={styles.noData}>—</span>
                    )}
                  </td>
                  <td className={getPerformanceClass(row.MS)}>
                    {row.MS ? row.MS : <span className={styles.noData}>—</span>}
                  </td>
                  <td className={getPerformanceClass(row.Lidl)}>
                    {row.Lidl ? (
                      row.Lidl
                    ) : (
                      <span className={styles.noData}>—</span>
                    )}
                  </td>
                  <td className={getPerformanceClass(row.Waitrose)}>
                    {row.Waitrose ? (
                      row.Waitrose
                    ) : (
                      <span className={styles.noData}>—</span>
                    )}
                  </td>
                  <td className={getPerformanceClass(row.Iceland)}>
                    {row.Iceland ? (
                      row.Iceland
                    ) : (
                      <span className={styles.noData}>—</span>
                    )}
                  </td>
                  <td className={getPerformanceClass(row.Coop)}>
                    {row.Coop ? (
                      row.Coop
                    ) : (
                      <span className={styles.noData}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.legend}>
          <h4 className={styles.legendTitle}>Performance Indicators</h4>
          <div className={styles.legendItems}>
            <div className={styles.legendItem}>
              <span
                className={`${styles.legendBadge} ${styles.excellentBadge}`}
              >
                🌟 Excellent
              </span>
              <span className={styles.legendText}>80% or above</span>
            </div>
            <div className={styles.legendItem}>
              <span className={`${styles.legendBadge} ${styles.goodBadge}`}>
                ✓ Good
              </span>
              <span className={styles.legendText}>50% - 79%</span>
            </div>
            <div className={styles.legendItem}>
              <span className={`${styles.legendBadge} ${styles.moderateBadge}`}>
                → Moderate
              </span>
              <span className={styles.legendText}>20% - 49%</span>
            </div>
            <div className={styles.legendItem}>
              <span
                className={`${styles.legendBadge} ${styles.developingBadge}`}
              >
                ↗ Developing
              </span>
              <span className={styles.legendText}>Below 20%</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
