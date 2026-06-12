"use client";

import { useEffect } from "react";
import { useState } from "react";
import styles from "./DocumentsChart.module.css";
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

export default function DocumentsChart() {
  const [documentsData, setDocumentsData] = useState([]);
  const [totalReports, setTotalReports] = useState(0);
  const [totalAnnual, setTotalAnnual] = useState(0);
  const [totalESG, setTotalESG] = useState(0);
  const [totalSustainability, setTotalSustainability] = useState(0);
  const [totalOther, setTotalOther] = useState(0);

  useEffect(() => {
    const fetchukdocuments = async () => {
      try {
        const response = await fetch("/api/ukdoc", {
          method: "GET",
        });
        const data = await response.json();
        console.log("Fetched UK documents data:", data);
        setDocumentsData(data.data);
        setTotalReports(data.totals.totalReports);
        setTotalAnnual(data.totals.totalAnnual);
        setTotalSustainability(data.totals.totalSustainability);
        setTotalOther(data.totals.totalOther);
        setTotalESG(data.totals.totalESG);
      } catch (error) {
        console.error("Error fetching UK documents data:", error);
      }
    };
    fetchukdocuments();
  }, []);

  // const documentsData = [
  //   {
  //     from: 2016,
  //     to: 2017,
  //     annualReport: 3,
  //     sustainability: 3,
  //     other: 2,
  //     total: 8,
  //   },
  //   {
  //     from: 2017,
  //     to: 2018,
  //     annualReport: 4,
  //     sustainability: 2,
  //     other: 2,
  //     total: 8,
  //   },
  //   {
  //     from: 2018,
  //     to: 2019,
  //     annualReport: 4,
  //     sustainability: 2,
  //     other: 2,
  //     total: 8,
  //   },

  //   {
  //     from: 2019,
  //     to: 2020,
  //     annualReport: 6,
  //     sustainability: 4,
  //     other: 3,
  //     total: 13,
  //   },
  //   {
  //     from: 2020,
  //     to: 2021,
  //     sustainability: 6,
  //     other: 4,
  //     total: 14,
  //   },
  //   {
  //     from: 2021,
  //     to: 2022,
  //     annualReport: 6,
  //     sustainability: 5,
  //     other: 5,
  //     total: 16,
  //   },
  //   {
  //     from: 2022,
  //     to: 2023,
  //     annualReport: 6,
  //     sustainability: 5,
  //     other: 5,
  //     total: 16,
  //   },
  // ];

  return (
    <section className={styles.charts}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.badge}>Documentation Trends</span>
          <h2 className={styles.title}>
            UK <span className={styles.highlight}>Documents by Year</span>
          </h2>
          <p className={styles.subtitle}>
            Evolution of food waste reporting documentation across UK food companies
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
                    return item ? `${item.from}-${item.to}` : value;
                  }}
                />
                <YAxis stroke="#6b7280" style={{ fontSize: "0.875rem" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "none",
                    borderRadius: "12px",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                    color: "#ffffff",
                  }}
                  cursor={{ fill: "rgba(34, 197, 94, 0.1)" }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: "20px" }}
                  iconType="circle"
                />
                <Bar
                  dataKey="annualReport"
                  stackId="a"
                  fill="#22c55e"
                  name="Annual Report"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="sustainability"
                  stackId="a"
                  fill="#3b82f6"
                  name="Sustainability Reports"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="ESG"
                  stackId="a"
                  fill="#8b5cf6"
                  name="ESG Reports"
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
          <div className={styles.statCard}>
            <div className={styles.statValue}>{totalESG}</div>
            <div className={styles.statLabel}>ESG Reports</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{totalOther}</div>
            <div className={styles.statLabel}>Other Documents</div>
          </div>
        </div>
      </div>
    </section>
  );
}
