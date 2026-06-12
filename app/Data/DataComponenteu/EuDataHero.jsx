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
            EU Sustainability <span className={styles.highlight}>Data Hub</span>
          </h1>
          <p className={styles.description}>
            Explore comprehensive sustainability commitments and environmental
            targets from leading European retailers across multiple countries,
            driving collaborative action toward a greener future.
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
