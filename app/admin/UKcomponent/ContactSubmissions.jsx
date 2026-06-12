"use client";
import { useState, useEffect } from "react";
import styles from "./ContactSubmissions.module.css";

export default function ContactSubmissions() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedContact, setExpandedContact] = useState(null);
  const [filterEmail, setFilterEmail] = useState("");

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/getcontact");
      if (response.ok) {
        const data = await response.json();
        // Sort by newest first (assuming _id or createdAt field)
        const sortedData = data.sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt) - new Date(a.createdAt);
          }
          return 0;
        });
        setContacts(sortedData);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (contactId) => {
    if (!window.confirm("Are you sure you want to delete this submission?")) {
      return;
    }

    try {
      const response = await fetch(`/api/delcontact/${contactId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Contact submission deleted successfully!");
        // Remove the deleted contact from the state
        setContacts(contacts.filter((contact) => contact._id !== contactId));
        // If the deleted contact was expanded, close it
        if (expandedContact === contactId) {
          setExpandedContact(null);
        }
      } else {
        const data = await response.json();
        alert(data.message || "Failed to delete contact submission");
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
      alert("An error occurred while deleting the submission");
    }
  };

  const filteredContacts = contacts.filter((contact) =>
    filterEmail
      ? contact.email.toLowerCase().includes(filterEmail.toLowerCase()) ||
        contact.name.toLowerCase().includes(filterEmail.toLowerCase())
      : true
  );

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>Contact Form Submissions</h2>
          <p className={styles.subtitle}>
            Total submissions: <strong>{contacts.length}</strong>
          </p>
        </div>

        <div className={styles.filterSection}>
          <input
            type="text"
            placeholder="🔍 Search by name or email..."
            value={filterEmail}
            onChange={(e) => setFilterEmail(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {loading ? (
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>Loading submissions...</p>
        </div>
      ) : filteredContacts.length === 0 ? (
        <div className={styles.emptyState}>
          {filterEmail ? (
            <>
              <p>No submissions found matching "{filterEmail}"</p>
              <button
                onClick={() => setFilterEmail("")}
                className={styles.clearButton}
              >
                Clear Search
              </button>
            </>
          ) : (
            <p>No contact submissions yet.</p>
          )}
        </div>
      ) : (
        <div className={styles.contactsList}>
          {filteredContacts.map((contact) => (
            <div key={contact._id} className={styles.contactCard}>
              <div className={styles.contactHeader}>
                <div className={styles.contactInfo}>
                  <h3 className={styles.contactName}>{contact.name}</h3>
                  <a
                    href={`mailto:${contact.email}`}
                    className={styles.contactEmail}
                  >
                    📧 {contact.email}
                  </a>
                  {contact.createdAt && (
                    <span className={styles.contactDate}>
                      📅 {formatDate(contact.createdAt)}
                    </span>
                  )}
                </div>
                <button
                  onClick={() =>
                    setExpandedContact(
                      expandedContact === contact._id ? null : contact._id
                    )
                  }
                  className={styles.expandButton}
                >
                  {expandedContact === contact._id ? "▲ Hide" : "▼ Show"}{" "}
                  Details
                </button>
              </div>

              <div className={styles.subjectSection}>
                <strong>Subject:</strong> {contact.subject}
              </div>

              {expandedContact === contact._id && (
                <div className={styles.expandedContent}>
                  <div className={styles.messageSection}>
                    <h4 className={styles.messageTitle}>Message:</h4>
                    <p className={styles.messageText}>{contact.message}</p>
                  </div>

                  <div className={styles.contactActions}>
                    <a
                      href={`mailto:${contact.email}?subject=Re: ${contact.subject}`}
                      className={styles.replyButton}
                    >
                      ✉️ Reply via Email
                    </a>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(contact.email);
                        alert("Email copied to clipboard!");
                      }}
                      className={styles.copyButton}
                    >
                      📋 Copy Email
                    </button>
                    <button
                      onClick={() => handleDelete(contact._id)}
                      className={styles.deleteButton}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
