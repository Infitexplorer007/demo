'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus, Pencil, Trash2, LogOut, Eye, EyeOff, Star, StarOff, X, Save, Loader2, ShieldCheck, LayoutDashboard
} from 'lucide-react';
import styles from './admin-products.module.css';

const CATEGORIES = ['Construction', 'Steel', 'Machinery', 'Electrical', 'Safety', 'Industrial Equipment'];

const EMPTY_FORM = {
  name: '', category: 'Steel', manufacturer: '', description: '',
  image: '', price: '', tags: '', featured: false, active: true, inStock: true,
};

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products?all=true');
      const data = await res.json();
      if (data.success) setProducts(data.data);
    } catch {
      // Handle silently — table will be empty
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const openAddForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setFormError('');
    setFormOpen(true);
  };

  const openEditForm = (product) => {
    setForm({
      ...product,
      price: product.price ?? '',
      tags: Array.isArray(product.tags) ? product.tags.join(', ') : '',
    });
    setEditingId(product._id);
    setFormError('');
    setFormOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const validateForm = () => {
    if (!form.name.trim()) return 'Product name is required.';
    if (!form.description.trim()) return 'Description is required.';
    if (!form.category) return 'Category is required.';
    if (!form.image.trim()) return 'Image URL is required.';
    return null;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) { setFormError(validationError); return; }

    setSaving(true);
    setFormError('');
    try {
      const url = editingId ? `/api/products/${editingId}` : '/api/products';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, price: form.price === '' ? null : Number(form.price) }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      setFormOpen(false);
      fetchProducts();
    } catch (err) {
      setFormError(err.message || 'Failed to save product.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setDeleteId(null);
      fetchProducts();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/auth');
    router.push('/admin/login');
  };

  return (
    <div className={styles.page}>
      {/* Top Navbar */}
      <header className={styles.navbar}>
        <div className={styles.navContainer}>
          <div className={styles.navBrand}>
            <ShieldCheck size={28} className={styles.brandIcon} />
            <span>BK Admin Hub</span>
          </div>
          <div className={styles.navLinks}>
            <a href="/products" target="_blank" className={styles.siteLink}>View Live Site ↗</a>
            <button onClick={handleLogout} className={styles.logoutBtn}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className={styles.main}>
        <div className={styles.mainContainer}>
          <div className={styles.topBar}>
            <div>
              <h1 className={styles.pageTitle}>Product Inventory</h1>
              <p className={styles.pageDesc}>Manage your catalog, edit details, and control visibility.</p>
            </div>
            <button onClick={openAddForm} className={styles.addBtn}>
              <Plus size={18} /> Add Product
            </button>
          </div>

          {/* Stats Bar */}
          <div className={styles.statsRow}>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{products.length}</div>
              <div className={styles.statLabel}>Total Products</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{products.filter(p => p.active).length}</div>
              <div className={styles.statLabel}>Active Publicly</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{products.filter(p => p.featured).length}</div>
              <div className={styles.statLabel}>Featured on Home</div>
            </div>
          </div>

          {/* Products table */}
          {loading ? (
            <div className={styles.loader}><Loader2 size={40} className={styles.spin} /></div>
          ) : products.length === 0 ? (
            <div className={styles.emptyState}>
              <LayoutDashboard size={64} className={styles.emptyIcon} />
              <h3>No products found</h3>
              <p>Your database is currently empty. Get started by adding a product.</p>
              <button onClick={openAddForm} className={styles.addBtn}><Plus size={16} /> Add First Product</button>
            </div>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category & Manufacturer</th>
                    <th>Pricing</th>
                    <th>Status</th>
                    <th className={styles.thActions}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p._id}>
                      <td>
                        <div className={styles.productCell}>
                          <img src={p.image} alt={p.name} className={styles.tableImg} />
                          <span className={styles.productName}>{p.name}</span>
                        </div>
                      </td>
                      <td>
                        <div className={styles.metaCell}>
                          <span className={styles.categoryTag}>{p.category}</span>
                          <span className={styles.manufacturerName}>{p.manufacturer || 'Unknown'}</span>
                        </div>
                      </td>
                      <td className={styles.priceCell}>
                        {p.price ? `₹${p.price.toLocaleString('en-IN')}` : 'Request Quote'}
                      </td>
                      <td>
                        <div className={styles.badgesCell}>
                          <span className={p.featured ? styles.badgeGreen : styles.badgeGray}>
                            {p.featured ? <Star size={12} /> : <StarOff size={12} />} Featured
                          </span>
                          <span className={p.active ? styles.badgeGreen : styles.badgeRed}>
                            {p.active ? <Eye size={12} /> : <EyeOff size={12} />} Active
                          </span>
                          <span className={p.inStock !== false ? styles.badgeGreen : styles.badgeRed}>
                            {p.inStock !== false ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </div>
                      </td>
                      <td className={styles.tdActions}>
                        <div className={styles.actions}>
                          <button onClick={() => openEditForm(p)} className={styles.editBtn} aria-label="Edit">
                            <Pencil size={15} /> Edit
                          </button>
                          <button onClick={() => setDeleteId(p._id)} className={styles.deleteBtn} aria-label="Delete">
                            <Trash2 size={15} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Modals remain the same... */}
      {/* Product form modal */}
      {formOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>{editingId ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setFormOpen(false)} className={styles.modalClose}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className={styles.form}>
              <div className={styles.formGrid}>
                <div className={styles.fieldGroup}>
                  <label>Product Name *</label>
                  <input name="name" value={form.name} onChange={handleFormChange} placeholder="e.g. Industrial Steel" required />
                </div>

                <div className={styles.fieldGroup}>
                  <label>Category *</label>
                  <select name="category" value={form.category} onChange={handleFormChange}>
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>

                <div className={styles.fieldGroup}>
                  <label>Manufacturer</label>
                  <input name="manufacturer" value={form.manufacturer} onChange={handleFormChange} placeholder="e.g. Apex Steel Corp" />
                </div>

                <div className={styles.fieldGroup}>
                  <label>Price (₹) — leave blank for "Request Quote"</label>
                  <input name="price" type="number" value={form.price} onChange={handleFormChange} placeholder="e.g. 5000" min="0" />
                </div>

                <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
                  <label>Description *</label>
                  <textarea name="description" value={form.description} onChange={handleFormChange} rows={3} placeholder="Brief product description..." required />
                </div>

                <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
                  <label>Image URL *</label>
                  <input name="image" value={form.image} onChange={handleFormChange} placeholder="https://example.com/image.jpg" required />
                  {form.image && (
                    <img src={form.image} alt="preview" className={styles.imagePreview} onError={(e) => { e.target.style.display = 'none'; }} />
                  )}
                </div>

                <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
                  <label>Tags (comma-separated)</label>
                  <input name="tags" value={form.tags} onChange={handleFormChange} placeholder="e.g. Raw Material, Bulk, Certified" />
                </div>

                <div className={styles.toggleGroup}>
                  <label className={styles.toggle}>
                    <input type="checkbox" name="featured" checked={form.featured} onChange={handleFormChange} />
                    <span>Featured on homepage</span>
                  </label>
                  <label className={styles.toggle}>
                    <input type="checkbox" name="active" checked={form.active} onChange={handleFormChange} />
                    <span>Active (visible to public)</span>
                  </label>
                  <label className={styles.toggle}>
                    <input type="checkbox" name="inStock" checked={form.inStock !== false} onChange={handleFormChange} />
                    <span>In Stock</span>
                  </label>
                </div>
              </div>

              {formError && <p className={styles.formError}>{formError}</p>}

              <div className={styles.formActions}>
                <button type="button" onClick={() => setFormOpen(false)} className={styles.cancelBtn}>Cancel</button>
                <button type="submit" disabled={saving} className={styles.saveBtn}>
                  {saving ? <Loader2 size={16} className={styles.spin} /> : <Save size={16} />}
                  {saving ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteId && (
        <div className={styles.modalOverlay}>
          <div className={styles.confirmModal}>
            <Trash2 size={42} className={styles.confirmIcon} />
            <h3>Delete this product?</h3>
            <p>This action cannot be undone.</p>
            <div className={styles.confirmActions}>
              <button onClick={() => setDeleteId(null)} className={styles.cancelBtn}>Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className={styles.dangerBtn}>
                <Trash2 size={16} /> Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
