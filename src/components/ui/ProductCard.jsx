'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ShoppingCart, Tag, Building2 } from 'lucide-react';
import styles from './ProductCard.module.css';

export default function ProductCard({ product, onAddToQuote, inCart }) {
  const cardRef = useRef(null);
  const imageRef = useRef(null);
  const overlayRef = useRef(null);
  const isOutOfStock = product.inStock === false;

  useEffect(() => {
    const card = cardRef.current;
    const image = imageRef.current;
    const overlay = overlayRef.current;

    const onEnter = () => {
      gsap.to(image, { scale: 1.07, duration: 0.4, ease: 'power2.out' });
      gsap.to(overlay, { opacity: 1, duration: 0.3 });
    };
    const onLeave = () => {
      gsap.to(image, { scale: 1, duration: 0.4, ease: 'power2.out' });
      gsap.to(overlay, { opacity: 0, duration: 0.3 });
    };

    card.addEventListener('mouseenter', onEnter);
    card.addEventListener('mouseleave', onLeave);
    return () => {
      card.removeEventListener('mouseenter', onEnter);
      card.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  const displayPrice = product.price
    ? `₹${product.price.toLocaleString('en-IN')}`
    : 'Request Quote';

  return (
    <div ref={cardRef} className={styles.card}>
      {/* Image container */}
      <div className={styles.imageWrapper}>
        <img
          ref={imageRef}
          src={product.image}
          alt={product.name}
          className={styles.image}
        />
        <div ref={overlayRef} className={styles.imageOverlay} />
        <span className={styles.categoryBadge}>{product.category}</span>
        {product.featured && <span className={styles.featuredBadge}>Featured</span>}
        {isOutOfStock && (
          <div className={styles.outOfStockOverlay}>
            <span>OUT OF STOCK</span>
          </div>
        )}
      </div>

      {/* Card body */}
      <div className={styles.body}>
        <h3 className={styles.name}>{product.name}</h3>

        {product.manufacturer && (
          <p className={styles.manufacturer}>
            <Building2 size={13} />
            {product.manufacturer}
          </p>
        )}

        <p className={styles.description}>{product.description}</p>

        {product.tags?.length > 0 && (
          <ul className={styles.tags}>
            {product.tags.slice(0, 3).map((tag) => (
              <li key={tag} className={styles.tag}>
                <Tag size={11} />
                {tag}
              </li>
            ))}
          </ul>
        )}

        <div className={styles.footer}>
          <span className={styles.price}>{displayPrice}</span>
          <button
            className={`${styles.quoteBtn} ${inCart ? styles.inCart : ''} ${isOutOfStock ? styles.disabled : ''}`}
            onClick={() => !isOutOfStock && onAddToQuote(product)}
            disabled={isOutOfStock}
          >
            <ShoppingCart size={15} />
            {isOutOfStock ? 'Unavailable' : (inCart ? 'Added' : 'Add to Quote')}
          </button>
        </div>
      </div>
    </div>
  );
}
