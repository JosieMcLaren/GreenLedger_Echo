"use client";

import React, { useState, useEffect } from "react";
import styles from "./DataSectionNav.module.css";
import {
  FaChartLine,
  FaBullseye,
  FaFileAlt,
  FaChartBar,
  FaHandshake,
  FaHeart,
  FaCompass,
} from "react-icons/fa";

const UK_SECTIONS = [
  { id: "uk-hero", label: "Overview", icon: FaChartLine },
  { id: "uk-waste-dashboard", label: "Waste Dashboard", icon: FaChartBar },
  { id: "uk-company-targets", label: "Company Targets", icon: FaBullseye },
  { id: "uk-documents", label: "Documents by Year", icon: FaFileAlt },
  { id: "uk-alliances", label: "Alliances & Charities", icon: FaHandshake },
];

const EU_SECTIONS = [
  { id: "eu-hero", label: "Overview", icon: FaChartLine },
  { id: "eu-company-targets", label: "Company Targets", icon: FaBullseye },
  { id: "eu-documents", label: "Documents by Year", icon: FaFileAlt },
  { id: "eu-alliances", label: "Alliances & Networks", icon: FaHandshake },
  { id: "eu-charity-partners", label: "Charity Partners", icon: FaHeart },
];

export default function DataSectionNav({ activeRegion }) {
  const sections = activeRegion === "UK" ? UK_SECTIONS : EU_SECTIONS;
  const [activeSectionId, setActiveSectionId] = useState(sections[0]?.id || "");

  // Update active section on region change
  useEffect(() => {
    setActiveSectionId(sections[0]?.id || "");
  }, [activeRegion]);

  // Set up IntersectionObserver to detect which section is currently in view
  useEffect(() => {
    const handleObserver = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.target && entry.target.id) {
          setActiveSectionId(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0,
    });

    const elementsObserved = [];
    sections.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) {
        observer.observe(el);
        elementsObserved.push(el);
      }
    });

    return () => {
      elementsObserved.forEach((el) => {
        if (el) observer.unobserve(el);
      });
      observer.disconnect();
    };
  }, [sections]);

  const scrollToSection = (id) => {
    setActiveSectionId(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -140; // Navbar + Nav offset
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <nav className={styles.stickyNav} aria-label="Data Sections Navigation">
      <div className={styles.container}>
        <div className={styles.labelGroup}>
          <FaCompass className={styles.compassIcon} />
          <span className={styles.navTitle}>Quick Jump:</span>
        </div>
        <div className={styles.buttonsWrapper}>
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSectionId === section.id;
            return (
              <button
                key={section.id}
                type="button"
                className={`${styles.navButton} ${isActive ? styles.active : ""}`}
                onClick={() => scrollToSection(section.id)}
              >
                <Icon className={styles.buttonIcon} />
                <span>{section.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
