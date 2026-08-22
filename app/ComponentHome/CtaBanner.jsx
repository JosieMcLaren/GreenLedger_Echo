"use client";

import React from "react";
import Link from "next/link";
import styles from "./CtaBanner.module.css";
import { PiCurrencyGbpBold } from "react-icons/pi";
import { FaEuroSign, FaArrowRight, FaLeaf } from "react-icons/fa";

export default function CtaBanner() {
  return (
    <section className={styles.ctaSection}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.glowOverlay}></div>
          <div className={styles.badge}>
            <FaLeaf className={styles.badgeIcon} />
            <span>Empowering Sustainability</span>
          </div>

          <h2 className={styles.title}>
            Ready to Explore <span className={styles.highlight}>Corporate Transparency?</span>
          </h2>

          <p className={styles.subtitle}>
            Dive into comprehensive data, food donation metrics, and annual waste reduction targets across UK and European food companies.
          </p>

          <div className={styles.buttonGroup}>
            <Link href="/Data?region=UK" passHref>
              <button className={styles.btnUk}>
                <PiCurrencyGbpBold className={styles.btnIcon} />
                <span>Explore UK Data</span>
                <FaArrowRight className={styles.arrowIcon} />
              </button>
            </Link>

            <Link href="/Data?region=EU" passHref>
              <button className={styles.btnEu}>
                <FaEuroSign className={styles.btnIcon} />
                <span>Explore EU Data</span>
                <FaArrowRight className={styles.arrowIcon} />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
