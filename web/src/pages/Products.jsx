import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RotatingPeanutsLoader } from './Home';

/* ─── Premium 3D Tilt Card Component ─── */
const TiltCard = ({ product, index, isDemo }) => {
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [imgError, setImgError] = useState(false);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;

    // Rotate up to 15 degrees
    const rX = -(mouseY / height) * 15;
    const rY = (mouseX / width) * 15;

    setRotate({ x: rX, y: rY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  const imageSrc = imgError || !product.image
    ? null
    : product.image.startsWith('WhatsApp') || product.image.startsWith('/')
      ? `/${product.image}`
      : `http://localhost:5000/uploads/${product.image}`;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="relative flex flex-col rounded-3xl overflow-hidden cursor-pointer select-none bg-white/40 dark:bg-white/[0.04] backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-lg hover:shadow-2xl hover:shadow-amber-500/10 dark:hover:shadow-black/50 transition-shadow duration-300 p-4 w-full"
      style={{
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        transformStyle: 'preserve-3d',
        transition: 'transform 0.15s ease-out, shadow 0.3s ease',
      }}
    >
      {/* Product Image */}
      <div
        className="aspect-[4/3] w-full rounded-2xl overflow-hidden bg-gradient-to-br from-amber-100 to-amber-200/50 dark:from-amber-900/20 dark:to-amber-900/5 relative mb-5"
        style={{ transform: 'translateZ(20px)' }}
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-6xl">
            🥜
          </div>
        )}
      </div>

      {/* Product Name */}
      <h3
        className="font-playfair font-extrabold text-xl mb-3 text-amber-950 dark:text-amber-100 tracking-tight line-clamp-1"
        style={{ transform: 'translateZ(30px)' }}
      >
        {product.name}
      </h3>

      {/* Product Price */}
      {/* Product Price & Enquiry */}
      <div
        className="mt-auto pb-1 flex items-center justify-between gap-4"
        style={{ transform: 'translateZ(25px)' }}
      >
        <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
          ₹{product.price}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/contact?product=${encodeURIComponent(product.name)}`);
          }}
          className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-white shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
        >
          Enquire
        </button>
      </div>
    </motion.div>
  );
};

/* ─── Demo Products fallback ─── */
const DEMO_PRODUCTS = [
  { _id: 'd1', name: 'Special Kadalai Mittai', price: 90, image: 'WhatsApp Image 2026-07-05 at 11.13.27 PM.jpeg' },
  { _id: 'd2', name: 'SMV Groundnut Balls', price: 120, image: 'WhatsApp Image 2026-07-05 at 11.13.27 PM (1).jpeg' },
  { _id: 'd3', name: 'Wholesale Groundnut Nice Chikki', price: 80, image: 'WhatsApp Image 2026-07-05 at 11.13.24 PM.jpeg' },
  { _id: 'd4', name: 'Golden Peanut Chikki (Jar Pack)', price: 100, image: 'WhatsApp Image 2026-07-05 at 11.13.07 PM.jpeg' },
  { _id: 'd5', name: 'Premium Jars Stack (Retail)', price: 150, image: 'WhatsApp Image 2026-07-05 at 11.13.21 PM.jpeg' },
  { _id: 'd6', name: 'Nice Groundnut Chikki Cakes', price: 110, image: 'WhatsApp Image 2026-07-05 at 11.13.26 PM.jpeg' },
  { _id: 'd7', name: 'Hanging Retail Packs', price: 95, image: 'WhatsApp Image 2026-07-05 at 11.24.20 PM.jpeg' },
  { _id: 'd8', name: 'SMV Peanut Candy (Pack of 30)', price: 180, image: 'WhatsApp Image 2026-07-05 at 11.13.26 PM (2).jpeg' },
];

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
          setIsDemo(false);
        } else {
          setProducts(DEMO_PRODUCTS);
          setIsDemo(true);
        }
        setLoading(false);
      })
      .catch(() => {
        setProducts(DEMO_PRODUCTS);
        setIsDemo(true);
        setLoading(false);
      });
  }, []);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen py-16 px-6 transition-colors duration-300 bg-gradient-to-b from-[var(--bg-main)] to-[var(--bg-card-solid)] text-[var(--text-main)]">
      <div className="max-w-6xl w-full mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <span className="text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 backdrop-blur-md mb-4 inline-block">
            Heritage Confections
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-playfair tracking-tight mt-3 mb-4">
            Our Freshly Roasted Snacks
          </h1>
          <p className="text-amber-800/60 dark:text-amber-200/60 max-w-md mx-auto mb-8">
            Every batch is prepared fresh daily, combining select double-roasted crunchy peanuts with native jaggery following time-tested family recipes.
          </p>

          {/* Search bar wrapper with glassmorphism */}
          <div className="relative max-w-md mx-auto">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-amber-600">🔍</span>
            <input
              type="text"
              placeholder="Search our kitchen..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-6 py-4 rounded-full border border-amber-500/20 dark:border-white/10 bg-white/40 dark:bg-white/[0.03] backdrop-blur-md outline-none text-sm text-amber-950 dark:text-amber-100 placeholder-amber-800/40 dark:placeholder-amber-200/40 focus:border-amber-500 dark:focus:border-amber-400 transition-colors shadow-md shadow-amber-500/5 focus:shadow-lg focus:shadow-amber-500/10"
            />
          </div>
        </div>

        {/* Products Display Grid */}
        {loading ? (
          <RotatingPeanutsLoader message="Fetching delicious snacks..." />
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white/20 dark:bg-white/[0.01] rounded-3xl border border-amber-500/10 backdrop-blur-md max-w-xl mx-auto">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold font-playfair text-amber-950 dark:text-amber-100 mb-2">No Snacks Found</h3>
            <p className="text-sm text-amber-800/50 dark:text-amber-200/50">Try typing another snack or clear the search field.</p>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {filteredProducts.map((p, idx) => (
                <TiltCard key={p._id} product={p} index={idx} isDemo={isDemo} />
              ))}
            </div>
            
            {isDemo && (
              <div className="text-center mt-12">
                <span className="text-xs text-amber-500/50 uppercase tracking-widest font-semibold px-4 py-2 bg-amber-500/5 rounded-full border border-amber-500/10">
                  Artisanal Kitchen Catalogue • Showing our signature varieties
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;