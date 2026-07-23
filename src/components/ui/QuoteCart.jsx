'use client';

import { useState } from 'react';
import { X, ShoppingCart, Trash2, Send } from 'lucide-react';
import styles from './QuoteCart.module.css';

export default function QuoteCart({ cartItems, onRemove, onClose }) {
  const [form, setForm] = useState({
    customer_name: '',
    customer_email: '',
    company: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.customer_name.trim() || !form.customer_email.trim()) {
      setError('Name and email are required.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/quotations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          products: cartItems.map((p) => ({ id: p._id, name: p.name })),
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.panel}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <ShoppingCart size={20} />
            <span>Quote Cart ({cartItems.length})</span>
          </div>
          <button onClick={onClose} className={styles.closeBtn} aria-label="Close cart">
            <X size={20} />
          </button>
        </div>

        {/* Cart items */}
        <div className={styles.itemsList}>
          {cartItems.length === 0 ? (
            <p className={styles.emptyMsg}>No products added yet.</p>
          ) : (
            cartItems.map((item) => (
              <div key={item._id} className={styles.item}>
                <img src={item.image} alt={item.name} className={styles.itemImage} />
                <div className={styles.itemInfo}>
                  <span className={styles.itemName}>{item.name}</span>
                  <span className={styles.itemCategory}>{item.category}</span>
                </div>
                <button
                  onClick={() => onRemove(item._id)}
                  className={styles.removeBtn}
                  aria-label="Remove"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Form */}
        {!submitted ? (
          <form onSubmit={handleSubmit} className={styles.form}>
            <h3 className={styles.formTitle}>Your Details</h3>

            <input
              name="customer_name"
              type="text"
              placeholder="Your Name *"
              value={form.customer_name}
              onChange={handleChange}
              className={styles.input}
              required
            />
            <input
              name="customer_email"
              type="email"
              placeholder="Email Address *"
              value={form.customer_email}
              onChange={handleChange}
              className={styles.input}
              required
            />
            <input
              name="company"
              type="text"
              placeholder="Company (optional)"
              value={form.company}
              onChange={handleChange}
              className={styles.input}
            />
            <textarea
              name="message"
              placeholder="Any specific requirements..."
              value={form.message}
              onChange={handleChange}
              className={styles.textarea}
              rows={3}
            />

            {error && <p className={styles.errorMsg}>{error}</p>}

            <button
              type="submit"
              disabled={submitting || cartItems.length === 0}
              className={styles.submitBtn}
            >
              <Send size={15} />
              {submitting ? 'Submitting...' : 'Submit Quote Request'}
            </button>
          </form>
        ) : (
          <div className={styles.successMsg}>
            <span className={styles.successIcon}>✓</span>
            <h3>Quote Request Sent!</h3>
            <p>We'll get back to you within 24 hours.</p>
            <button onClick={onClose} className={styles.submitBtn}>
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
