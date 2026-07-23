'use client';

import { Search, SlidersHorizontal, X } from 'lucide-react';
import styles from './ProductFilter.module.css';

const CATEGORIES = [
  'All',
  'Construction',
  'Steel',
  'Machinery',
  'Electrical',
  'Safety',
  'Industrial Equipment',
];

export default function ProductFilter({
  activeCategory,
  onCategoryChange,
  search,
  onSearchChange,
  sortBy,
  onSortChange,
  totalCount,
}) {
  return (
    <div className={styles.filterBar}>
      {/* Search */}
      <div className={styles.searchWrapper}>
        <Search size={16} className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className={styles.searchInput}
        />
        {search && (
          <button
            className={styles.clearBtn}
            onClick={() => onSearchChange('')}
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Category chips */}
      <div className={styles.chipsRow}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`${styles.chip} ${activeCategory === cat ? styles.activeChip : ''}`}
            onClick={() => onCategoryChange(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Sort + count */}
      <div className={styles.metaRow}>
        <span className={styles.count}>{totalCount} product{totalCount !== 1 ? 's' : ''}</span>
        <div className={styles.sortWrapper}>
          <SlidersHorizontal size={14} />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className={styles.sortSelect}
          >
            <option value="newest">Newest</option>
            <option value="name-asc">Name A–Z</option>
            <option value="name-desc">Name Z–A</option>
          </select>
        </div>
      </div>
    </div>
  );
}
