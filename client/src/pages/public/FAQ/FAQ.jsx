import React, { useState } from 'react';
import { MOCK_FAQS } from '../../../data/mockData';
import styles from '../Home/Home.module.css';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="faq-page">
      <div className="section" style={{ background: 'linear-gradient(170deg, #FAF0F2 0%, #FBF7EF 100%)', padding: '56px 0', borderBottom: '1px solid var(--border-color)', textAlign: 'center' }}>
        <div className="container">
          <span className="eyebrow">Clear Answers for Devotees</span>
          <h1 className="text-maroon font-display" style={{ marginTop: '8px' }}>
            Frequently Asked Questions
          </h1>
          <p className="text-muted" style={{ maxWidth: '650px', margin: '8px auto 0' }}>
            Everything you need to know about Tirupati & Tirumala stays, ghat transport, dress codes, luggage, and darshan procedures.
          </p>
        </div>
      </div>

      <div className="container section">
        <div className={styles.faqContainer}>
          {MOCK_FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className={styles.faqItem}>
                <button
                  type="button"
                  className={styles.faqQuestion}
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  <span style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', fontSize: '18px' }}>
                    ▼
                  </span>
                </button>
                {isOpen && <div className={styles.faqAnswer}>{faq.a}</div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
