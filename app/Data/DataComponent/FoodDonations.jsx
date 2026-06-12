"use client";

import styles from "./FoodDonations.module.css";
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

export default function FoodDonations() {
  const donationsData = [
    {
      year: "2016/17",
      Tesco: 5700,
      Morrisons: 796,
      Aldi: 533,
      Iceland: 512,
    },
    {
      year: "2017/18",
      Tesco: 2063,
      Asda: 645,
      Morrisons: 840,
      Sainsbury: 1850,
      Iceland: 442,
    },
    {
      year: "2018/19",
      Tesco: 10946,
      Sainsbury: 1000,
      Asda: 1134,
      Morrisons: 1460,
      Aldi: 1177,
      MS: 1447,
      Iceland: 840,
    },
    {
      year: "2019/20",
      Tesco: 10686,
      Asda: 1562,
      Morrisons: 1730,
      Aldi: 792,
      MS: 2209,
      Lidl: 1540,
      Iceland: 2532,
    },
    {
      year: "2020/21",
      Tesco: 12195,
      Asda: 1861,
      Morrisons: 2491,
      MS: 4991,
      Iceland: 4045,
    },
    {
      year: "2021/22",
      Tesco: 11671,
      Sainsbury: 4072,
      Morrisons: 2778,
      MS: 6231,
      Lidl: 1841,
      Iceland: 6954,
    },
    {
      year: "2022/23",
      Tesco: 10688,
    },
  ];

  const mealsData = [
    { year: "2016/17", Tesco: 1.8, MS: 1.3 },
    { year: "2017/18", Tesco: 1.5, Asda: 2.0, Sainsbury: 4.4, Iceland: 0.05 },
    {
      year: "2018/19",
      Tesco: 26.0,
      Sainsbury: 3.4,
      Asda: 2.8,
      Morrisons: 3.8,
      Aldi: 0.5,
      Lidl: 2,
    },
    {
      year: "2019/20",
      Tesco: 25.4,
      Asda: 5.2,
      Morrisons: 4.7,
      MS: 2,
      Iceland: 0.4,
    },
    {
      year: "2020/21",
      Tesco: 29.0,
      Sainsbury: 3.4,
      MS: 11.8,
      Lidl: 4.5,
      Iceland: 0.6,
    },
    {
      year: "2021/22",
      Tesco: 27.8,
      Asda: 14.8,
      Morrisons: 6.9,
      Aldi: 0.9,
      Coop: 2.8,
    },
    { year: "2022/23", Tesco: 25.5 },
  ];

  return (
    <section className={styles.donations}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.badge}>Food Redistribution</span>
          <h2 className={styles.title}>
            <span className={styles.highlight}>Food Donations</span> & Surplus
            Redistribution
          </h2>
          <p className={styles.subtitle}>
            Tracking donated food to charity and community groups across UK
            food companies
          </p>
        </div>

        <div className={styles.chartsGrid}>
          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>
              Food Donations to Charity (Tonnes)
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={donationsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="year" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#141414ff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar dataKey="Tesco" fill="#22c55e" />
                <Bar dataKey="Sainsbury" fill="#3b82f6" />
                <Bar dataKey="Asda" fill="#f59e0b" />
                <Bar dataKey="Morrisons" fill="#8b5cf6" />
                <Bar dataKey="Aldi" fill="#ec4899" />
                <Bar dataKey="MS" fill="#be22c4ff" />
                <Bar dataKey="Lidl" fill="#f97316" />
                <Bar dataKey="Iceland" fill="#06b6d4" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>
              Equivalent Meals Donated (Millions)
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={mealsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="year" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#141313ff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "20px",
                  }}
                />
                <Legend />
                <Bar dataKey="Tesco" fill="#22c55e" />
                <Bar dataKey="Sainsbury" fill="#3b82f6" />
                <Bar dataKey="Asda" fill="#f59e0b" />
                <Bar dataKey="Morrisons" fill="#8b5cf6" />
                <Bar dataKey="Aldi" fill="#ec4899" />
                <Bar dataKey="MS" fill="#10b981" />
                <Bar dataKey="Lidl" fill="#f97316" />
                <Bar dataKey="Iceland" fill="#06b6d4" />
                <Bar dataKey="Coop" fill="#14b8a6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
}
