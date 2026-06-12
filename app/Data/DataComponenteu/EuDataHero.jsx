"use client";

import styles from "./EuDataHero.module.css";
import { FaGlobeEurope, FaChartLine, FaHandshake } from "react-icons/fa";
import { IoStatsChart } from "react-icons/io5";

export default function EuDataHero() {
  return (
    <section className={styles.hero}>
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
                <div className={styles.statValue}>4</div>
                <div className={styles.statLabel}>EU Companies</div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <FaChartLine />
              </div>
              <div className={styles.statInfo}>
                <div className={styles.statValue}>12</div>
                <div className={styles.statLabel}>Active Commitments</div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <IoStatsChart />
              </div>
              <div className={styles.statInfo}>
                <div className={styles.statValue}>3</div>
                <div className={styles.statLabel}>Countries</div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <FaHandshake />
              </div>
              <div className={styles.statInfo}>
                <div className={styles.statValue}>2030</div>
                <div className={styles.statLabel}>Target Year</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
