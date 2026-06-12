"use client";

import Image from "next/image";
import styles from "./Footer.module.css";
import logo from "../Images/Logowaste.png";

import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerTop}>
          <div className={styles.footerColumn}>
            <div className={styles.brand}>
              <Image src={logo} alt="WasteWatch Logo" width={45} height={45} />
              <span className={styles.brandName}>Waste food report</span>
            </div>
            <p className={styles.brandDescription}>
              Empowering companies across UK and EU to track, report, and reduce
              food waste through data-driven insights and sustainable action.
            </p>
          </div>

          <div className={styles.footerColumn}>
            <h3 className={styles.columnTitle}>Quick Links</h3>
            <ul className={styles.linkList}>
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/Data">Data</a>
              </li>
              <li>
                <a href="/About">About Us</a>
              </li>
              <li>
                <a href="/contactus">Contact us</a>
              </li>
            </ul>
          </div>

          <div className={styles.footerColumn}>
            <h3 className={styles.columnTitle}>Resources</h3>
            <ul className={styles.linkList}>
              <li>
                <Link href="/Login">Admin</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p className={styles.copyright}>
            © {currentYear} Waste food reporting. All rights reserved.
            <br />
            Design and Developed By{" "}
            <a
              href="https://mysiteee.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.developerLink}
            >
              Bansi Dobariya
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
