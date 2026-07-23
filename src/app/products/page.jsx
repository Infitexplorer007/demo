'use client';

import { useState, useEffect, useCallback } from 'react';
import { ShoppingCart } from 'lucide-react';
import ProductFilter from '@/components/ui/ProductFilter';
import ProductGrid from '@/components/ui/ProductGrid';
import QuoteCart from '@/components/ui/QuoteCart';
import Hero from '@/components/ui/Hero';
import styles from './products.module.css';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter / sort state
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Quote cart state
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  // Fetch products from API whenever category or search changes
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (activeCategory !== 'All') params.set('category', activeCategory);
      if (search.trim()) params.set('search', search.trim());

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setProducts(data.data);
    } catch (err) {
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [activeCategory, search]);

  useEffect(() => {
    const debounce = setTimeout(fetchProducts, 300);
    return () => clearTimeout(debounce);
  }, [fetchProducts]);

  // Client-side sort (avoids extra API calls)
  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
    if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
    return 0; // newest: already sorted by API (createdAt desc)
  });

  // Cart actions
  const addToQuote = (product) => {
    setCartItems((prev) =>
      prev.find((p) => p._id === product._id) ? prev : [...prev, product]
    );
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((p) => p._id !== id));
  };

  return (
    <div className={styles.page}>
      {/* Animated Hero Slider */}
      <Hero />

      {/* Filters & Products */}
      <div id="products-grid" className={styles.container}>
        <ProductFilter
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          search={search}
          onSearchChange={setSearch}
          sortBy={sortBy}
          onSortChange={setSortBy}
          totalCount={sortedProducts.length}
        />

        {/* Error state */}
        {error && (
          <div className={styles.dbError}>
            <h3>Database Connection Failed</h3>
            <p>
              It looks like your MongoDB database is not connected yet!
              To fix this:
            </p>
            <ol>
              <li>Go to <a href="https://mongodb.com" target="_blank" rel="noreferrer">MongoDB Atlas</a> and create a free cluster.</li>
              <li>Get your connection string and paste it into the <code>MONGODB_URI</code> variable in <code>.env.local</code>.</li>
              <li>Restart the dev server and run <code>node scripts/seed.js</code> in your terminal.</li>
            </ol>
            <p className={styles.errorText}>Technical detail: {error}</p>
          </div>
        )}

        {/* Loading skeleton */}
        {loading ? (
          <div className={styles.skeletonGrid}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={styles.skeleton} />
            ))}
          </div>
        ) : (
          <ProductGrid
            products={sortedProducts}
            onAddToQuote={addToQuote}
            cartItems={cartItems}
          />
        )}
      </div>

      {/* Floating Quote Cart button */}
      <button
        className={styles.cartFab}
        onClick={() => setCartOpen(true)}
        aria-label="Open quote cart"
      >
        <ShoppingCart size={22} />
        {cartItems.length > 0 && (
          <span className={styles.cartBadge}>{cartItems.length}</span>
        )}
      </button>

      {/* Quote Cart panel */}
      {cartOpen && (
        <QuoteCart
          cartItems={cartItems}
          onRemove={removeFromCart}
          onClose={() => setCartOpen(false)}
        />
      )}
    </div>
  );
}
