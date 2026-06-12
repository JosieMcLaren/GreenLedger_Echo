"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import styles from "./Hero.module.css";
import { useEUFigStore } from "../store/herocom";
//import heroImg from "../Images/img2.png";
import heroImg from "../Images/img4.png";
import { IoLeafSharp } from "react-icons/io5";
import { BiSolidLeaf } from "react-icons/bi";
import { FaSeedling } from "react-icons/fa";
import { useEffect } from "react";

export default function Hero() {
  const { eucom, ukcom, fetchTotalCompanies } = useEUFigStore();
  useEffect(() => {
    fetchTotalCompanies();
  }, [fetchTotalCompanies]);

  return (
    <section className={styles.hero} id="home">
      <div className={styles.backgroundImage}>
        <Image
          src={heroImg}
          alt="Food Waste Management"
          fill
          priority
          className={styles.bgImage}
          quality={100}
        />
        <div className={styles.overlay}></div>
      </div>

      {/* Three.js 3D Scene */}

      <div className={styles.floatingCards}>
        <div className={styles.floatingCard1}>
          <span className={styles.cardEmoji}>♻️</span>
          <span className={styles.cardText}>Eco-Friendly</span>
        </div>
        <div className={styles.floatingCard2}>
          <span className={styles.cardEmoji}>📊</span>
          <span className={styles.cardText}>Real-time Data</span>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.heroContent}>
          <div className={styles.floatingEmoji}>
            <IoLeafSharp className={styles.leaf1} />
            <BiSolidLeaf className={styles.leaf2} />
            <FaSeedling className={styles.leaf3} />
          </div>

          <h1 className={styles.heroTitle}>
            Corporate <span className={styles.highlight}>Food Waste</span>
            <br />
            Reporting Research
          </h1>

          <p className={styles.heroDescription}>
            A research platform tracking how UK and EU food retailers publicly
            report food waste data. Exploring corporate transparency in line
            with UN SDG 12.3 targets.
          </p>

          <div className={styles.heroButtons}>
            <Link href="/Data">
              <button className={styles.btnPrimary}>
                Explore Data
                <span className={styles.arrow}>→</span>
              </button>
            </Link>
          </div>

          <div className={styles.heroStats}>
            <div className={styles.statItem}>
              <h3 className={styles.statNumber}>{eucom}</h3>
              <p className={styles.statLabel}>EU supermarkets</p>
            </div>
            <div className={styles.statDivider}></div>
            <div className={styles.statItem}>
              <h3 className={styles.statNumber}>{ukcom}</h3>
              <p className={styles.statLabel}>UK supermarkets </p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.scrollIndicator}>
        <div className={styles.mouse}></div>
      </div>
    </section>
  );
}
