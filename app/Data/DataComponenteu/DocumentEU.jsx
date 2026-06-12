"use client";

import { useEffect } from "react";
import { useState } from "react";
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

export default function DocumentEU() {
  const [documentsData, setDocumentsData] = useState([]);
  const [totalReports, setTotalReports] = useState(0);
  const [totalAnnual, setTotalAnnual] = useState(0);
  const [totalSustainability, setTotalSustainability] = useState(0);
  const [totalIntegrated, setTotalIntegrated] = useState(0);
  const [totalOther, setTotalOther] = useState(0);

  useEffect(() => {
    const fetcheudocuments = async () => {
      try {
        const response = await fetch("/api/EU/eudoc", {
          method: "GET",
        });
        const data = await response.json();
        console.log("Fetched EU documents data:", data);
        setDocumentsData(data.data);
        setTotalReports(data.totals.totalReports);
        setTotalAnnual(data.totals.totalAnnual);
        setTotalSustainability(data.totals.totalSustainability);
        setTotalIntegrated(data.totals.totalIntegrated);
        setTotalOther(data.totals.totalOther);
      } catch (error) {
        console.error("Error fetching EU documents data:", error);
      }
    };
    fetcheudocuments();
  }, []);

  return (
    <section className={styles.charts}>
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

        <div className={styles.chartWrapper}>
          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>Documents by Type Over Time</h3>
            <ResponsiveContainer width="100%" height={450}>
              <BarChart
                data={documentsData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                barSize={45}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="from"
                  stroke="#6b7280"
                  style={{ fontSize: "0.875rem", fontWeight: 600 }}
                  tickFormatter={(value, index) => {
                    const item = documentsData[index];
                    return item
                      ? `${item.from}/${item.to.toString().slice(-2)}`
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
                {/* <Bar
                  dataKey="integratedReport"
                  stackId="a"
                  fill="#8b5cf6"
                  name="Integrated Report"
                  radius={[0, 0, 0, 0]}
                /> */}
                <Bar
                  dataKey="other"
                  stackId="a"
                  fill="#f59e0b"
                  name="Other"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={styles.stats}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{totalReports}</div>
            <div className={styles.statLabel}>Total Documents</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{totalAnnual}</div>
            <div className={styles.statLabel}>Annual Reports</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{totalSustainability}</div>
            <div className={styles.statLabel}>Sustainability Reports</div>
          </div>
          {/* <div className={styles.statCard}>
            <div className={styles.statValue}>{totalIntegrated}</div>
            <div className={styles.statLabel}>Integrated Reports</div>
          </div> */}
          <div className={styles.statCard}>
            <div className={styles.statValue}>{totalOther}</div>
            <div className={styles.statLabel}>Other Documents</div>
          </div>
        </div>
      </div>
    </section>
  );
}
