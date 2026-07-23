'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { PackageSearch } from 'lucide-react';
import ProductCard from './ProductCard';
import styles from './ProductGrid.module.css';

export default function ProductGrid({ products, onAddToQuote, cartItems }) {
  const gridRef = useRef(null);

  // Stagger entrance animation whenever the products array changes
  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll('[data-card]');
    if (cards.length === 0) return;

    gsap.fromTo(
      cards,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power2.out',
        clearProps: 'transform',
      }
    );
  }, [products]);

  // Empty state
  if (products.length === 0) {
    return (
      <div className={styles.emptyState}>
        <PackageSearch size={56} className={styles.emptyIcon} />
        <h3 className={styles.emptyTitle}>No products found</h3>
        <p className={styles.emptyText}>
          Try adjusting your filters or search term.
        </p>
      </div>
    );
  }

  const cartIds = new Set(cartItems.map((p) => p._id));

  return (
    <div ref={gridRef} className={styles.grid}>
      {products.map((product) => (
        <div key={product._id} data-card>
          <ProductCard
            product={product}
            onAddToQuote={onAddToQuote}
            inCart={cartIds.has(product._id)}
          />
        </div>
      ))}
    </div>
  );
}
