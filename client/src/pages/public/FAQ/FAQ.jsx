import React, { useState } from 'react';
import { MOCK_FAQS } from '../../../data/mockData';
import PageHeader from '../../../components/common/PageHeader/PageHeader';
import styles from '../Home/Home.module.css';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="faq-page">
      <PageHeader
        eyebrow="CLEAR ANSWERS FOR DEVOTEES"
        title="FREQUENTLY ASKED QUESTIONS"
        subtitle="Everything you need to know about Tirupati & Tirumala stays, ghat transport, dress codes, luggage, and darshan procedures."
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'FAQ' },
        ]}
      />

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
