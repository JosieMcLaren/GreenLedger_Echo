"use client";
import styles from "./Privacy.module.css";
import Navbar from "../ComponentHome/Navbar";
import Footer from "../ComponentHome/Footer";

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>Privacy Notice</h1>
          <p className={styles.lastUpdated}>Last updated: December 2025</p>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Introduction</h2>
            <p className={styles.text}>
              This Privacy Notice explains how we collect, use, and protect your
              personal information when you use the Corporate Food Waste
              Reporting Research platform. We process personal data in
              accordance with the UK General Data Protection Regulation (UK
              GDPR) and the Data Protection Act 2018, as amended.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Contact Form Data</h2>
            <p className={styles.text}>
              When you submit an enquiry through our contact form, we collect
              the following information:
            </p>
            <ul className={styles.list}>
              <li>Your name</li>
              <li>Your email address</li>
              <li>The subject of your enquiry</li>
              <li>Your message</li>
            </ul>
            <p className={styles.text}>
              <strong>How we use this information:</strong> The information you
              provide is used solely to respond to your enquiry. Your details
              are not stored long-term, added to any mailing lists, or used for
              any other purpose.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Research Data</h2>
            <p className={styles.text}>
              The food waste data displayed on this platform is compiled from
              publicly available corporate reports and does not contain any
              personal information. This research data is used for academic and
              research purposes to track corporate food waste reporting
              transparency.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Your Rights</h2>
            <p className={styles.text}>
              Under data protection law, you have rights including:
            </p>
            <ul className={styles.list}>
              <li>
                <strong>Right of access:</strong> You can ask for copies of your
                personal information.
              </li>
              <li>
                <strong>Right to rectification:</strong> You can ask us to
                correct inaccurate information.
              </li>
              <li>
                <strong>Right to erasure:</strong> You can ask us to delete your
                personal information in certain circumstances.
              </li>
              <li>
                <strong>Right to restrict processing:</strong> You can ask us to
                limit how we use your information.
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Contact Us</h2>
            <p className={styles.text}>
              If you have any questions about this Privacy Notice or how we
              handle your personal information, please contact us through our{" "}
              <a href="/contactus" className={styles.link}>
                contact form
              </a>
              .
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}
