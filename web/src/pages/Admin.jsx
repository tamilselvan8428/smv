import { useState, useEffect, useRef } from 'react';
import { RotatingPeanutsLoader } from './Home';

const imgSrc = (image) => {
  if (!image) return null;
  if (image.startsWith('http') || image.startsWith('/')) return image;
  return `http://localhost:5000/uploads/${image}`;
};

const Toast = ({ msg, type }) => {
  if (!msg) return null;
  return (
    <div
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full text-sm font-semibold shadow-lg z-50 flex items-center gap-2 animate-bounce ${
        type === 'success'
          ? 'bg-[#1A0A00] dark:bg-[#FAF5EB] text-white dark:text-[#1A0A00]'
          : 'bg-red-600 text-white'
      }`}
    >
      {type === 'success' ? '✅' : '⚠️'} {msg}
    </div>
  );
};

/* ─── Confirm Delete Dialog ─── */
const ConfirmDialog = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1D1710] border border-amber-500/10 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="text-5xl mb-4 select-none">🗑️</div>
        <h3 className="font-playfair font-extrabold text-2xl mb-2 text-amber-950 dark:text-amber-100">
          Delete Product?
        </h3>
        <p className="text-sm text-amber-800/60 dark:text-amber-200/60 leading-relaxed mb-6">
          {message}
        </p>
        <div className="flex gap-4">
          <button
            className="flex-1 py-3 rounded-xl font-bold text-sm bg-amber-500/10 text-amber-900 dark:text-amber-200 hover:bg-amber-500/20 transition-colors"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="flex-1 py-3 rounded-xl font-bold text-sm bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-600/20 transition-colors"
            onClick={onConfirm}
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Drag and Drop Image Dropzone ─── */
const Dropzone = ({ value, onChange }) => {
  const [drag, setDrag] = useState(false);
  const [preview, setPreview] = useState(null);
  const inputRef = useRef();

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    onChange(file);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <div
      className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-colors duration-200 bg-[#FDFAF7] dark:bg-[#16120B] ${
        drag
          ? 'border-amber-500 bg-amber-500/5'
          : value
          ? 'border-green-500 bg-green-500/5'
          : 'border-amber-500/20 dark:border-white/10 hover:border-amber-500'
      }`}
      onClick={() => inputRef.current.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        handleFile(e.dataTransfer.files[0]);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => handleFile(e.target.files[0])}
      />
      {preview ? (
        <div className="flex flex-col items-center">
          <img
            src={preview}
            alt="Preview"
            className="w-20 h-20 object-cover rounded-xl border border-amber-500/10 mb-3"
          />
          <p className="text-xs font-bold text-green-600 dark:text-green-400">
            ✓ {value.name}
          </p>
          <p className="text-[10px] text-amber-800/40 dark:text-amber-200/40 mt-1">
            Click to change image
          </p>
        </div>
      ) : (
        <div>
          <div className="text-4xl mb-2 select-none">📸</div>
          <p className="text-sm font-semibold text-amber-900/70 dark:text-amber-100/70 mb-1">
            Drop image here or click to browse
          </p>
          <p className="text-xs text-amber-800/40 dark:text-amber-200/40">
            Supports PNG, JPG, WEBP
          </p>
        </div>
      )}
    </div>
  );
};

/* ─── Add/Edit Product Modal ─── */
const ProductModal = ({ product, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: product?.name || '',
    price: product?.price || '',
    image: null,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Product name is required';
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) {
      e.price = 'Valid price is required';
    }
    if (!product && !form.image) {
      e.image = 'Product image is required';
    }
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);

    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('price', form.price);
    if (form.image) fd.append('image', form.image);

    try {
      const url = product
        ? `http://localhost:5000/api/products/${product._id}`
        : 'http://localhost:5000/api/products';
      const method = product ? 'PUT' : 'POST';
      const res = await fetch(url, { method, body: fd });
      if (res.ok) {
        onSave(product ? 'updated' : 'added');
      } else {
        const errorData = await res.json();
        onSave(null, errorData.message || 'Failed to save product');
      }
    } catch {
      onSave(null, 'Network error. Make sure the backend server is running.');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1D1710] border border-amber-500/10 rounded-3xl max-w-md w-full p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-playfair font-extrabold text-2xl text-amber-950 dark:text-amber-100">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-200 flex items-center justify-center font-bold text-sm transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Product Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-800/70 dark:text-amber-200/70 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Special Kadalai Mittai"
              value={form.name}
              onChange={(e) => {
                setForm({ ...form, name: e.target.value });
                setErrors({ ...errors, name: null });
              }}
              className={`w-full px-4 py-3 rounded-xl border outline-none bg-[#FDFAF7] dark:bg-[#16120B] text-sm ${
                errors.name
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-amber-500/20 dark:border-white/10 focus:border-amber-500 dark:focus:border-amber-400'
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1 font-semibold">
                {errors.name}
              </p>
            )}
          </div>

          {/* Product Price */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-800/70 dark:text-amber-200/70 mb-2">
              Price (₹) *
            </label>
            <input
              type="number"
              placeholder="e.g. 100"
              min="0"
              value={form.price}
              onChange={(e) => {
                setForm({ ...form, price: e.target.value });
                setErrors({ ...errors, price: null });
              }}
              className={`w-full px-4 py-3 rounded-xl border outline-none bg-[#FDFAF7] dark:bg-[#16120B] text-sm ${
                errors.price
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-amber-500/20 dark:border-white/10 focus:border-amber-500 dark:focus:border-amber-400'
              }`}
            />
            {errors.price && (
              <p className="text-red-500 text-xs mt-1 font-semibold">
                {errors.price}
              </p>
            )}
          </div>

          {/* Product Image Dropzone */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-800/70 dark:text-amber-200/70 mb-2">
              Product Image *
            </label>
            <Dropzone
              value={form.image}
              onChange={(img) => {
                setForm({ ...form, image: img });
                setErrors({ ...errors, image: null });
              }}
            />
            {product && (
              <p className="text-[10px] text-amber-800/40 dark:text-amber-200/40 mt-2">
                Leave empty to preserve the current image.
              </p>
            )}
            {errors.image && (
              <p className="text-red-500 text-xs mt-1 font-semibold">
                {errors.image}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              className="flex-1 py-3 rounded-xl font-bold text-sm bg-amber-500/10 text-amber-900 dark:text-amber-200 hover:bg-amber-500/20 transition-colors"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-amber-700 text-white shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-amber-600 disabled:opacity-50 transition-all duration-200"
              disabled={loading}
            >
              {loading ? 'Saving...' : product ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ─── Main Admin Panel Component ─── */
const Admin = () => {
  const [auth, setAuth] = useState(false);
  const [creds, setCreds] = useState({ username: '', password: '' });
  const [loginErr, setLoginErr] = useState('');
  const [loginLoad, setLoginLoad] = useState(false);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const [modal, setModal] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [toast, setToast] = useState(null);
  const [imgErrors, setImgErrors] = useState({});

  useEffect(() => {
    if (localStorage.getItem('adminToken')) {
      setAuth(true);
      loadProducts();
    }
  }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginErr('');
    setLoginLoad(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(creds),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('adminToken', data.token);
        setAuth(true);
        loadProducts();
      } else {
        setLoginErr('Invalid username or password');
      }
    } catch {
      setLoginErr('Connection failed. Make sure the backend server is running.');
    }
    setLoginLoad(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setAuth(false);
    setProducts([]);
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/products');
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      showToast('Failed to load products from database.', 'error');
    }
    setLoading(false);
  };

  const handleSave = async (result, errMsg) => {
    setModal(null);
    if (result) {
      await loadProducts();
      showToast(`Product ${result} successfully!`);
    } else {
      showToast(errMsg || 'Failed to save product.', 'error');
    }
  };

  const handleDelete = async () => {
    if (!confirm) return;
    try {
      const res = await fetch(
        `http://localhost:5000/api/products/${confirm.id}`,
        { method: 'DELETE' }
      );
      if (res.ok) {
        await loadProducts();
        showToast('Product deleted successfully.');
      } else {
        showToast('Failed to delete product.', 'error');
      }
    } catch {
      showToast('Network error while deleting.', 'error');
    }
    setConfirm(null);
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  /* ══ LOGIN PANEL SCREEN ══ */
  if (!auth) {
    return (
      <div className="fixed inset-0 z-[1001] flex items-center justify-center px-6 overflow-y-auto transition-colors duration-300 bg-gradient-to-br from-[var(--bg-main)] to-[var(--bg-card-solid)] text-[var(--text-main)]">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="bg-white/40 dark:bg-[#1D1710]/40 backdrop-blur-xl border border-amber-500/10 dark:border-white/10 rounded-3xl p-8 max-w-sm w-full shadow-2xl relative z-10 text-center animate-in fade-in zoom-in-95 duration-200">
          <div className="width-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg shadow-amber-500/20">
            🥜
          </div>
          <h1 className="font-playfair font-extrabold text-3xl text-amber-950 dark:text-amber-100 mb-2">
            SMV Admin
          </h1>
          <p className="text-xs text-amber-800/50 dark:text-amber-200/50 tracking-wider uppercase font-semibold mb-8">
            Product Management Panel
          </p>

          {loginErr && (
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-xl p-3 text-red-600 dark:text-red-400 text-xs text-left mb-6 font-semibold flex items-start gap-2">
              <span>⚠️</span> {loginErr}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-amber-800/70 dark:text-amber-200/70 mb-1.5">
                Username
              </label>
              <input
                type="text"
                placeholder="admin"
                value={creds.username}
                onChange={(e) =>
                  setCreds({ ...creds, username: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border border-amber-500/20 dark:border-white/10 bg-white/50 dark:bg-black/20 outline-none text-sm focus:border-amber-500 dark:focus:border-amber-400"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-amber-800/70 dark:text-amber-200/70 mb-1.5">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={creds.password}
                onChange={(e) =>
                  setCreds({ ...creds, password: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border border-amber-500/20 dark:border-white/10 bg-white/50 dark:bg-black/20 outline-none text-sm focus:border-amber-500 dark:focus:border-amber-400"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loginLoad}
              className="w-full py-3 mt-4 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-amber-700 text-white shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-amber-600 disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loginLoad ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  /* ══ ADMIN DASHBOARD SCREEN ══ */
  return (
    <div className="min-h-screen py-16 px-6 relative transition-colors duration-300 bg-gradient-to-b from-[var(--bg-main)] to-[var(--bg-card-solid)] text-[var(--text-main)]">
      <div className="max-w-6xl w-full mx-auto">
        {/* Top Header & Logout */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-6 mb-12">
          <div>
            <h1 className="font-playfair font-extrabold text-3xl sm:text-4xl text-amber-950 dark:text-amber-100">
              Product Management
            </h1>
            <p className="text-amber-800/60 dark:text-amber-200/60 text-sm mt-1">
              Add, update, or remove snacks in the live catalogue.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 self-start sm:self-center transition-colors"
          >
            Logout Panel
          </button>
        </div>

        {/* Toolbar: Search & Add button */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/40 dark:bg-white/[0.03] backdrop-blur-md border border-amber-500/10 dark:border-white/10 rounded-2xl p-4 mb-8">
          <div className="relative w-full sm:max-w-xs">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-amber-600">🔍</span>
            <input
              type="text"
              placeholder="Search snacks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-amber-500/10 dark:border-white/5 bg-[#FDFAF7] dark:bg-black/20 outline-none text-xs text-amber-950 dark:text-amber-100 placeholder-amber-800/40 dark:placeholder-amber-200/40 focus:border-amber-500"
            />
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-xs font-bold text-amber-800/60 dark:text-amber-200/60">
              {filteredProducts.length} Snack{filteredProducts.length !== 1 ? 's' : ''}
            </span>
            <button
              onClick={() => setModal({ mode: 'add' })}
              className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-white shadow-lg shadow-amber-500/20 transition-all duration-200"
            >
              + Add Product
            </button>
          </div>
        </div>

        {/* Products Management List */}
        {loading ? (
          <RotatingPeanutsLoader message="Loading panel details..." />
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white/20 dark:bg-white/[0.01] rounded-3xl border border-amber-500/10 backdrop-blur-md max-w-xl mx-auto">
            <div className="text-5xl mb-4 select-none">📦</div>
            <h3 className="text-xl font-bold text-amber-950 dark:text-amber-100 mb-1">
              No Snacks Registered
            </h3>
            <p className="text-xs text-amber-800/50 dark:text-amber-200/50 mb-6">
              Create your first product using the Add Product button above.
            </p>
            <button
              onClick={() => setModal({ mode: 'add' })}
              className="px-6 py-3 rounded-xl font-bold text-xs uppercase bg-amber-500 text-white shadow-md hover:bg-amber-600 transition-colors"
            >
              Add First Item
            </button>
          </div>
        ) : (
          <div className="bg-white/40 dark:bg-[#1D1710]/40 backdrop-blur-md border border-amber-500/10 dark:border-white/10 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-amber-500/10 bg-amber-500/5 text-amber-950 dark:text-amber-200">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider w-1/2">Product</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider w-1/4">Price (₹)</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-right w-1/4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-500/5">
                  {filteredProducts.map((p) => (
                    <tr
                      key={p._id}
                      className="hover:bg-amber-500/[0.02] dark:hover:bg-amber-500/[0.01] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-12 rounded-xl overflow-hidden bg-amber-100/50 dark:bg-black/30 flex items-center justify-center text-2xl flex-shrink-0">
                            {imgErrors[p._id] || !p.image ? (
                              '🥜'
                            ) : (
                              <img
                                src={imgSrc(p.image)}
                                alt={p.name}
                                className="w-full h-full object-cover"
                                onError={() =>
                                  setImgErrors((e) => ({ ...e, [p._id]: true }))
                                }
                              />
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-amber-950 dark:text-amber-100 text-sm">
                              {p.name}
                            </div>
                            <div className="text-[10px] text-amber-800/40 dark:text-amber-200/40 font-mono mt-0.5">
                              ID: {p._id?.slice(-8)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-extrabold text-amber-600 dark:text-amber-400 text-base">
                          ₹{p.price}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex gap-2">
                          <button
                            onClick={() => setModal({ mode: 'edit', product: p })}
                            className="px-4 py-2 rounded-lg font-bold text-xs bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setConfirm({ id: p._id, name: p.name })}
                            className="px-4 py-2 rounded-lg font-bold text-xs bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Product Add/Edit Modal */}
      {modal && (
        <ProductModal
          product={modal.product}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}

      {/* Confirm Delete Dialog */}
      {confirm && (
        <ConfirmDialog
          message={`"${confirm.name}" will be permanently deleted from the database and disappear from the Products catalogue.`}
          onConfirm={handleDelete}
          onCancel={() => setConfirm(null)}
        />
      )}

      {/* Toast Alert */}
      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </div>
  );
};

export default Admin;