"use client";

import { useState } from "react";
import styles from "./DataTabs.module.css";
import { FaFlag, FaEuroSign } from "react-icons/fa";
import { PiCurrencyGbpBold } from "react-icons/pi";

import { IoGlobeOutline } from "react-icons/io5";

export default function DataTabs({ onTabChange }) {
  const [activeTab, setActiveTab] = useState("UK");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    onTabChange(tab);
  };

  return (
    <div className={styles.tabsWrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <IoGlobeOutline className={styles.globeIcon} />
          <h3 className={styles.title}>Select Region</h3>
        </div>

        <div className={styles.tabsContainer}>
          <button
            className={`${styles.tab} ${
              activeTab === "UK" ? styles.active : ""
            }`}
            onClick={() => handleTabClick("UK")}
          >
            <div className={styles.tabIcon}>
              <PiCurrencyGbpBold />
            </div>
            <div className={styles.tabContent}>
              <span className={styles.tabLabel}>United Kingdom</span>
              <span className={styles.tabSubtext}>UK food company data</span>
            </div>
            {activeTab === "UK" && (
              <div className={styles.activeIndicator}></div>
            )}
          </button>

          <button
            className={`${styles.tab} ${
              activeTab === "EU" ? styles.active : ""
            }`}
            onClick={() => handleTabClick("EU")}
          >
            <div className={styles.tabIcon}>
              <FaEuroSign />
            </div>
            <div className={styles.tabContent}>
              <span className={styles.tabLabel}>European Union</span>
              <span className={styles.tabSubtext}>EU company data</span>
            </div>
            {activeTab === "EU" && (
              <div className={styles.activeIndicator}></div>
            )}
          </button>
        </div>

        <div className={styles.tabInfo}>
          <span className={styles.infoText}>
            {activeTab === "UK"
              ? "Viewing data from UK-based food companies"
              : "Viewing data from EU food companies"}
          </span>
        </div>
      </div>
    </div>
  );
}
