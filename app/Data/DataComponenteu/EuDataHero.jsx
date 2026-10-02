"use client";

import { useEffect, useState } from "react";
import styles from "./EuDataHero.module.css";
import { FaGlobeEurope, FaChartLine, FaHandshake } from "react-icons/fa";
import { IoStatsChart } from "react-icons/io5";

export default function EuDataHero({ externalSector }) {
  const [stats, setStats] = useState({
    companiesCount: 12,
    commitmentsCount: 23,
    countriesCount: 6,
    targetYear: 2030,
  });

  useEffect(() => {
    let isMounted = true;
    async function fetchStats() {
      try {
        const res = await fetch("/api/EU/eucompany", { cache: "no-store" });
        if (!res.ok) return;
        const json = await res.json();
        const list = Array.isArray(json?.data) ? json.data : [];
        if (list.length > 0 && isMounted) {
          const filteredList =
            !externalSector || externalSector === "all"
              ? list
              : list.filter((c) => {
                  const s = (c?.sector || "supermarkets").toLowerCase().trim();
                  return s === externalSector.toLowerCase().trim();
                });

          const totalCommitments = filteredList.reduce(
            (sum, c) =>
              sum + (Array.isArray(c?.Commitment) ? c.Commitment.length : 0),
            0,
          );

          const allYears = filteredList.flatMap((c) =>
            Array.isArray(c?.targetDate) ? c.targetDate : [],
          );
          const maxYear = allYears.length > 0 ? Math.max(...allYears) : 2030;

          const countryMap = {
            "aldi nord (north)": "Germany",
            "aldi sud (south)": "Germany",
            "aldi süd": "Germany",
            carrefour: "France",
            colruyt: "Belgium",
            "colruyt group": "Belgium",
            delhaize: "Belgium",
            dia: "Spain",
            kesko: "Finland",
            "lidl (ireland)": "Ireland",
            "lidl (schwarz)": "Germany",
            mercadona: "Spain",
            "les mousquetaires": "France",
            norgesgruppen: "Norway",
          };

          const countrySet = new Set();
          filteredList.forEach((c) => {
            const key = (c?.companyName || "").toLowerCase().trim();
            if (countryMap[key]) countrySet.add(countryMap[key]);
          });

          setStats({
            companiesCount: filteredList.length,
            commitmentsCount: totalCommitments,
            countriesCount: countrySet.size > 0 ? countrySet.size : 6,
            targetYear: maxYear,
          });
        }
      } catch (e) {
        console.error("Error fetching EU hero stats:", e);
      }
    }
    fetchStats();
    return () => {
      isMounted = false;
    };
  }, [externalSector]);

  return (
    <section id="eu-hero" className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          <span className={styles.badge}>European Union Data</span>
          <h1 className={styles.title}>
            EU Food Waste{" "}
            <span className={styles.highlight}>Reduction Targets</span>
          </h1>
          <p className={styles.description}>
            Comprehensive overview of major EU food companies' commitments to
            reducing food waste
          </p>

          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <FaGlobeEurope />
              </div>
              <div className={styles.statInfo}>
                <div className={styles.statValue}>{stats.companiesCount}</div>
                <div className={styles.statLabel}>EU Companies</div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <FaChartLine />
              </div>
              <div className={styles.statInfo}>
                <div className={styles.statValue}>
                  {stats.commitmentsCount}
                </div>
                <div className={styles.statLabel}>Active Commitments</div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <IoStatsChart />
              </div>
              <div className={styles.statInfo}>
                <div className={styles.statValue}>{stats.countriesCount}</div>
                <div className={styles.statLabel}>Countries</div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <FaHandshake />
              </div>
              <div className={styles.statInfo}>
                <div className={styles.statValue}>{stats.targetYear}</div>
                <div className={styles.statLabel}>Target Year</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
