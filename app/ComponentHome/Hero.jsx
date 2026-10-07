"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./Hero.module.css";
import { useEUFigStore } from "../store/herocom";
import heroImg from "../Images/img4.png";
import { IoLeafSharp } from "react-icons/io5";
import { BiSolidLeaf } from "react-icons/bi";
import { FaSeedling, FaGlobeEurope, FaArrowRight } from "react-icons/fa";
import { PiCurrencyGbpBold } from "react-icons/pi";
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

      <div className={styles.floatingCards}>
        <div className={styles.floatingCard1}>
          <span className={styles.cardEmoji}>♻️</span>
          <span className={styles.cardText}>Eco Transparency</span>
        </div>
        <div className={styles.floatingCard2}>
          <span className={styles.cardEmoji}>📊</span>
          <span className={styles.cardText}>UN SDG 12.3 Metrics</span>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.heroContent}>
          <div className={styles.floatingEmoji}>
            <IoLeafSharp className={styles.leaf1} />
            <BiSolidLeaf className={styles.leaf2} />
            <FaSeedling className={styles.leaf3} />
          </div>

          <div className={styles.heroBadgeWrapper}>
            <span className={styles.heroBadge}>
              <FaSeedling className={styles.badgeIcon} />
              UN SDG 12.3 Corporate Transparency Platform
            </span>
          </div>

          <h1 className={styles.heroTitle}>
            Corporate <span className={styles.highlight}>Food Waste</span>
            <br />
            Reporting Research
          </h1>

          <p className={styles.heroDescription}>
            An interactive research platform tracking how UK and EU food companies publicly report food waste data, targets, and donations to drive corporate sustainability.
          </p>

          <div className={styles.heroButtons}>
            <Link href="/Data?region=UK">
              <button className={styles.btnPrimary}>
                <PiCurrencyGbpBold className={styles.btnIcon} />
                Explore UK Data
                <FaArrowRight className={styles.arrow} />
              </button>
            </Link>

            <Link href="/Data?region=EU">
              <button className={styles.btnSecondary}>
                <FaGlobeEurope className={styles.btnIcon} />
                Explore EU Data
                <FaArrowRight className={styles.arrow} />
              </button>
            </Link>
          </div>

          <div className={styles.heroStats}>
            <div className={styles.statItem}>
              <div className={styles.statIconWrap}>
                <PiCurrencyGbpBold className={styles.statIcon} />
              </div>
              <div>
                <h3 className={styles.statNumber}>{ukcom || 11}</h3>
                <p className={styles.statLabel}>UK Companies Tracked</p>
              </div>
            </div>

            <div className={styles.statDivider}></div>

            <div className={styles.statItem}>
              <div className={styles.statIconWrap}>
                <FaGlobeEurope className={styles.statIcon} />
              </div>
              <div>
                <h3 className={styles.statNumber}>{eucom || 4}</h3>
                <p className={styles.statLabel}>EU Companies Tracked</p>
              </div>
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
