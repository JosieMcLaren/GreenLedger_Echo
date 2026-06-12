"use client";
import React, { useState } from "react";
import styles from "./ContactUs.module.css";
import Navbar from "../ComponentHome/Navbar";
import Footer from "../ComponentHome/Footer";

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage("");

    try {
      const response = await fetch("/api/getcontact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubmitting(false);
        setSubmitStatus("success");
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });

        // Clear success message after 5 seconds
        setTimeout(() => {
          setSubmitStatus(null);
        }, 5000);
      } else {
        setIsSubmitting(false);
        setSubmitStatus("error");
        setErrorMessage(
          data.message || "Something went wrong. Please try again."
        );
      }
    } catch (error) {
      setIsSubmitting(false);
      setSubmitStatus("error");
      setErrorMessage(
        "Network error. Please check your connection and try again."
      );
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.backgroundShapes}>
          <div className={styles.shape1}></div>
          <div className={styles.shape2}></div>
          <div className={styles.shape3}></div>
        </div>

        <div className={styles.contentWrapper}>
          <div className={styles.headerSection}>
            <h1 className={styles.title}>
              Get In <span className={styles.highlight}>Touch</span>
            </h1>
            <p className={styles.subtitle}>
              Have questions or feedback? We'd love to hear from you. Send us a
              message and we'll respond as soon as possible.
            </p>
          </div>

          <div className={styles.formCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label htmlFor="name" className={styles.label}>
                    Full Name
                  </label>
                  <div className={styles.inputWrapper}>
                    <svg
                      className={styles.inputIcon}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Joe Doe"
                      className={styles.input}
                    />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="email" className={styles.label}>
                    Email Address
                  </label>
                  <div className={styles.inputWrapper}>
                    <svg
                      className={styles.inputIcon}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Joe@example.com"
                      className={styles.input}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="subject" className={styles.label}>
                  Subject
                </label>
                <div className={styles.inputWrapper}>
                  <svg
                    className={styles.inputIcon}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                    />
                  </svg>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="How can we help you?"
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="message" className={styles.label}>
                  Message
                </label>
                <div className={styles.textareaWrapper}>
                  <svg
                    className={styles.textareaIcon}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    placeholder="Tell us more about your inquiry..."
                    className={styles.textarea}
                  />
                </div>
              </div>

              {submitStatus === "success" && (
                <div className={styles.successMessage}>
                  <svg
                    className={styles.successIcon}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>
                    Thank you! Your message has been sent successfully.
                  </span>
                </div>
              )}

              {submitStatus === "error" && (
                <div className={styles.errorMessage}>
                  <svg
                    className={styles.errorIcon}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={styles.submitButton}
              >
                {isSubmitting ? (
                  <>
                    <span className={styles.spinner}></span>
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <svg
                      className={styles.buttonIcon}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </>
                )}
              </button>

              <p className={styles.privacyNotice}>
                The information you provide will only be used to respond to your
                enquiry. Your details will not be stored long-term, added to any
                mailing lists, or used for any other purpose. For more
                information, please see our{" "}
                <a href="/privacy" className={styles.privacyLink}>
                  Privacy Notice
                </a>
                .
              </p>
            </form>

            <div className={styles.contactInfo}>
              <h3 className={styles.contactInfoTitle}>
                Other Ways to Reach Us
              </h3>
              <div className={styles.contactInfoItems}>
                <div className={styles.contactInfoItem}>
                  <svg
                    className={styles.contactInfoIcon}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <div>
                    <h4>Location</h4>
                    <p> United Kingdom</p>
                  </div>
                </div>

                <div className={styles.contactInfoItem}>
                  <svg
                    className={styles.contactInfoIcon}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <h4>Response Time</h4>
                    <p>
                      We'll try to respond to your message as soon as we can
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
