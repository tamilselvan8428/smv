import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';

/* ─── Rotating Peanuts Loader Component ─── */
export const RotatingPeanutsLoader = ({ message = "Roasting Peanuts..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="relative w-28 h-28 flex items-center justify-center">
        {/* Outer glow aura */}
        <div className="absolute inset-0 bg-amber-500/10 rounded-full blur-xl animate-pulse"></div>
        {/* Orbit track */}
        <div className="absolute w-20 h-20 border border-dashed border-amber-300/40 rounded-full"></div>
        {/* Peanut Emojis rotating around each other */}
        <motion.div
          className="absolute w-full h-full"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 3.5, ease: "linear" }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 text-4xl select-none filter drop-shadow-[0_4px_8px_rgba(217,119,6,0.3)]">🥜</div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-4xl select-none filter drop-shadow-[0_4px_8px_rgba(217,119,6,0.3)]">🥜</div>
        </motion.div>
      </div>
      <p className="mt-8 text-lg font-semibold tracking-wider bg-gradient-to-r from-amber-800 to-amber-600 dark:from-amber-200 dark:to-amber-400 bg-clip-text text-transparent animate-pulse">
        {message}
      </p>
    </div>
  );
};

/* ─── Three.js Golden 3D Peanut Visual ─── */
const GoldenPeanut3D = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 6;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    const size = Math.min(containerRef.current.clientWidth, 400);
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Clear double-canvas build up in Strict Mode
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);

    // Peanut Group
    const peanutGroup = new THREE.Group();

    // Golden Phong Material for beautiful shiny gold color independent of environment maps
    const goldMaterial = new THREE.MeshPhongMaterial({
      color: 0xF2B33D,
      shininess: 110,
      specular: 0x553311,
      flatShading: false,
    });

    // Top sphere
    const sphereGeo1 = new THREE.SphereGeometry(1.0, 32, 32);
    const topSphere = new THREE.Mesh(sphereGeo1, goldMaterial);
    topSphere.position.y = 0.75;
    topSphere.scale.set(1.0, 0.9, 0.9);
    peanutGroup.add(topSphere);

    // Bottom sphere
    const sphereGeo2 = new THREE.SphereGeometry(1.15, 32, 32);
    const bottomSphere = new THREE.Mesh(sphereGeo2, goldMaterial);
    bottomSphere.position.y = -0.75;
    bottomSphere.scale.set(1.1, 0.9, 1.1);
    peanutGroup.add(bottomSphere);

    // Connector
    const cylinderGeo = new THREE.CylinderGeometry(0.7, 0.7, 1.5, 32);
    const connector = new THREE.Mesh(cylinderGeo, goldMaterial);
    connector.position.y = 0;
    peanutGroup.add(connector);

    scene.add(peanutGroup);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xfff3e0, 1.8);
    dirLight1.position.set(5, 5, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xc18c3f, 1.0);
    dirLight2.position.set(-5, -5, 2);
    scene.add(dirLight2);

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouseX = (event.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      mouseY = (event.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Spin slowly
      peanutGroup.rotation.y += 0.008;
      peanutGroup.rotation.x += 0.004;

      // Mouse interactive tilt
      targetX = mouseX * 0.6;
      targetY = mouseY * 0.6;
      peanutGroup.rotation.y += (targetX - peanutGroup.rotation.y) * 0.05;
      peanutGroup.rotation.x += (targetY - peanutGroup.rotation.x) * 0.05;

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const size = Math.min(containerRef.current.clientWidth, 400);
      renderer.setSize(size, size);
      camera.aspect = 1;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && renderer.domElement.parentNode) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="w-full flex justify-center items-center select-none" />;
};

/* ─── Shared TiltCard Component ─── */
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
      <div
        className="aspect-[4/3] w-full rounded-2xl overflow-hidden bg-gradient-to-br from-amber-100 to-amber-200/50 dark:from-amber-900/20 dark:to-amber-900/5 relative mb-5"
        style={{ transform: 'translateZ(20px)' }}
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-6xl">
            🥜
          </div>
        )}
      </div>

      <h3
        className="font-playfair font-extrabold text-xl mb-3 text-amber-950 dark:text-amber-100 tracking-tight line-clamp-1"
        style={{ transform: 'translateZ(30px)' }}
      >
        {product.name}
      </h3>

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

/* ─── Fallback Demo Products ─── */
const GALLERY_ITEMS = [
  { src: '/WhatsApp Image 2026-07-05 at 11.13.27 PM.jpeg', title: 'Crispy Kadalai Mittai Bar', category: 'Products' },
  { src: '/WhatsApp Image 2026-07-05 at 11.13.27 PM (1).jpeg', title: 'Traditional Kadalai Urundai (Balls)', category: 'Products' },
  { src: '/WhatsApp Image 2026-07-05 at 11.13.26 PM.jpeg', title: 'Nice Groundnut Chikki Cakes', category: 'Products' },
  { src: '/WhatsApp Image 2026-07-05 at 11.13.26 PM (2).jpeg', title: 'Groundnut Nice Chikki (Single Pack)', category: 'Products' },
  { src: '/WhatsApp Image 2026-07-05 at 11.13.07 PM.jpeg', title: 'SMV Chikki in Premium Jar', category: 'Retail Packaging' },
  { src: '/WhatsApp Image 2026-07-05 at 11.13.21 PM.jpeg', title: 'Sturdy Retail Product Jars', category: 'Retail Packaging' },
  { src: '/WhatsApp Image 2026-07-05 at 11.13.26 PM (1).jpeg', title: 'Retail Shelf Merchandising', category: 'Retail Packaging' },
  { src: '/WhatsApp Image 2026-07-05 at 11.24.20 PM.jpeg', title: 'Storefront Hanging Display', category: 'Retail Packaging' },
  { src: '/WhatsApp Image 2026-07-05 at 11.13.24 PM.jpeg', title: 'Iron-Rich Jaggery Formulation', category: 'Kitchen & Bulk' },
  { src: '/WhatsApp Image 2026-07-05 at 11.13.25 PM.jpeg', title: 'Wholesale Bundle Packaging', category: 'Kitchen & Bulk' },
];

const DEMO_PRODUCTS = [
  { _id: 'd1', name: 'Special Kadalai Mittai', price: 90, image: 'WhatsApp Image 2026-07-05 at 11.13.27 PM.jpeg' },
  { _id: 'd2', name: 'Golden Peanut Chikki', price: 100, image: 'WhatsApp Image 2026-07-05 at 11.13.26 PM.jpeg' },
  { _id: 'd3', name: 'SMV Groundnut Balls', price: 120, image: 'WhatsApp Image 2026-07-05 at 11.13.27 PM (1).jpeg' },
  { _id: 'd4', name: 'Premium Kadalai Mittai Pack', price: 150, image: 'WhatsApp Image 2026-07-05 at 11.13.26 PM (2).jpeg' },
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const filteredGallery = activeFilter === 'All' 
    ? GALLERY_ITEMS 
    : GALLERY_ITEMS.filter(item => item.category === activeFilter);

  const handlePrev = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev === 0 ? filteredGallery.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev === filteredGallery.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data.slice(0, 4));
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

  return (
    <div className="min-h-screen overflow-x-hidden transition-colors duration-300 bg-gradient-to-b from-[var(--bg-main)] to-[var(--bg-card-solid)] text-[var(--text-main)]">
      {/* ── HERO BANNER ── */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden flex items-center justify-center">
        {/* Soft radial ambient glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-amber-500/10 to-amber-600/5 dark:from-amber-500/5 dark:to-amber-600/0 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10 py-16">
          {/* Copy Column */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-start text-left"
          >
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/20 backdrop-blur-md mb-6">
              <span className="text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">Est. 1996 • Handcrafted Heritage</span>
            </div>

            {/* Shop Name with Premium 3D Glow styling */}
            <h1 className="font-playfair font-extrabold text-5xl sm:text-6xl lg:text-7xl leading-tight tracking-tight mb-4">
              <span className="bg-gradient-to-r from-amber-700 to-amber-900 dark:from-amber-300 dark:to-amber-100 bg-clip-text text-transparent">SMV</span> <br />
              <span className="bg-gradient-to-r from-amber-500 to-amber-700 dark:from-amber-400 dark:to-amber-200 bg-clip-text text-transparent filter drop-shadow-[0_2px_8px_rgba(217,119,6,0.15)]">Artisanal Jaggery Confections</span>
            </h1>

            <p className="text-lg sm:text-xl font-medium italic text-amber-800/80 dark:text-amber-200/80 mb-6 font-playfair">
              "Pure native sweetness, roasted to golden perfection."
            </p>

            <p className="text-base text-amber-900/60 dark:text-amber-100/60 max-w-lg mb-10 leading-relaxed">
              We slow-roast premium hand-selected peanuts, blending them in optimal ratios with iron-rich organic jaggery in traditional brass cauldrons. Free from refined sugar, artificial colorants, and preservatives.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-5 items-center">
              <Link
                to="/products"
                className="px-10 py-5 rounded-full font-extrabold text-base tracking-wide bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-white shadow-xl shadow-amber-500/30 dark:shadow-amber-500/10 transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 inline-flex items-center justify-center gap-3 group"
              >
                View Products <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
              <Link
                to="/contact"
                className="px-10 py-5 rounded-full font-extrabold text-base tracking-wide bg-white/70 dark:bg-white/5 hover:bg-white/90 dark:hover:bg-white/10 text-amber-900 dark:text-amber-200 border-2 border-amber-500/30 backdrop-blur-md transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 inline-flex items-center justify-center"
              >
                Get in Touch
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 sm:gap-12 mt-12 pt-8 border-t border-amber-500/10 w-full">
              {[
                { count: "100%", label: "Organic Jaggery" },
                { count: "28+ Years", label: "Culinary Legacy" },
                { count: "5★ Rated", label: "Premium Quality" },
              ].map((s, idx) => (
                <div key={idx}>
                  <div className="text-xl sm:text-2xl font-black text-amber-700 dark:text-amber-400 font-playfair">{s.count}</div>
                  <div className="text-xs text-amber-800/50 dark:text-amber-200/50 uppercase tracking-wider font-semibold mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Interactive 3D Peanut Visual Column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="flex justify-center items-center relative aspect-square"
          >
            {/* Rotating halo background */}
            <div className="absolute inset-4 rounded-full border border-dashed border-amber-400/25 animate-[spin_40s_linear_infinite]" />
            <div className="absolute inset-16 rounded-full border border-dashed border-amber-500/15 animate-[spin_25s_linear_infinite_reverse]" />
            <div className="absolute w-[320px] h-[320px] bg-amber-500/5 dark:bg-amber-500/3 rounded-full blur-2xl" />

            <div className="w-full max-w-[360px] relative z-10 flex flex-col items-center">
              <GoldenPeanut3D />
              <div className="text-center mt-2 pointer-events-none">
                <span className="text-xs text-amber-500/60 uppercase tracking-widest font-bold">Interactive 3D Peanut</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Transition wave at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-[0]">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full fill-current text-[var(--bg-main)] transition-colors duration-300" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,48 C280,68 480,28 720,40 C960,52 1160,32 1440,48 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      {/* Spacer between Hero and Featured Products */}
      <div className="h-12 md:h-16" />

      {/* ── FEATURED PRODUCTS ── */}
      <section className="py-24 px-6 relative">
        <div className="max-w-6xl w-full mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-widest">Selected Sweets</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-playfair mt-2">Bestselling Varieties</h2>
            </motion.div>
            <Link to="/products" className="text-amber-600 dark:text-amber-400 hover:text-amber-500 font-bold transition mt-4 md:mt-0 flex items-center gap-1">
              Browse Entire Shop <span>→</span>
            </Link>
          </div>

          {loading ? (
            <RotatingPeanutsLoader />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-center">
              {products.map((p, idx) => (
                <TiltCard key={p._id} product={p} index={idx} isDemo={isDemo} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Spacer between Featured Products and Our Legacy */}
      <div className="h-16 md:h-24" />

      {/* ── ABOUT THE LEGACY ── */}
      <section className="py-24 px-6 bg-amber-500/[0.03] dark:bg-amber-500/[0.01] border-y border-amber-500/10">
        <div className="max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="aspect-[4/3] w-full max-w-lg self-center rounded-3xl overflow-hidden relative shadow-2xl border border-amber-500/20 group"
          >
            <img
              src="/WhatsApp Image 2026-07-05 at 11.13.26 PM (1).jpeg"
              alt="SMV Kadalai Mittai Jars Stack"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-amber-950/80 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
            <div className="absolute bottom-6 left-6 right-6 p-5 bg-white/80 dark:bg-black/60 backdrop-blur-md rounded-2xl border border-amber-500/15 text-center transition-all duration-300 group-hover:-translate-y-1">
              <span className="text-xs uppercase font-bold tracking-widest text-amber-600 dark:text-amber-400">Purity Guarantee</span>
              <p className="text-sm font-semibold mt-1 text-amber-950 dark:text-amber-50">Made with Organic Palm & Cane Jaggery</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-widest">Our Legacy</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-playfair mt-2 mb-6">A Legacy of Pure Ingredients & Time-Honored Craftsmanship</h2>
            <p className="text-amber-950/60 dark:text-amber-100/60 leading-relaxed mb-6">
              For nearly three decades, our family has remained dedicated to preserving the authentic, rich flavors of South India's traditional confections. Sourcing native peanuts directly from local farms, we ensure uniform double-roasting to lock in maximum crunchiness and rich nuttiness.
            </p>
            <p className="text-amber-950/60 dark:text-[#D0B48F] leading-relaxed mb-8">
              We combine them with organic palm and cane jaggery, boiled to the perfect soft-ball consistency, creating a crispy, melt-in-the-mouth brittle that is as nutritious as it is delicious. Zero refined sugars, zero artificial colors.
            </p>

            <div className="grid grid-cols-2 gap-6">
              {[
                { title: "Preservative-Free", desc: "Naturally cured shelf life of up to 90 days" },
                { title: "Rich in Minerals", desc: "Sweetened with iron-dense organic jaggery" },
              ].map((f, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white/30 dark:bg-white/[0.02] border border-amber-500/10">
                  <h4 className="font-bold text-base text-amber-950 dark:text-amber-100 mb-1">{f.title}</h4>
                  <p className="text-xs text-amber-800/50 dark:text-amber-200/50 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Spacer between Our Legacy and Gallery */}
      <div className="h-16 md:h-24" />

      {/* ── ARTISANAL KITCHEN & PRODUCT GALLERY ── */}
      <section className="py-24 px-6 bg-gradient-to-b from-amber-500/[0.01] to-amber-500/[0.04]">
        <div className="max-w-6xl w-full mx-auto relative z-10">
          
          <div className="text-center mb-16">
            <span className="text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 backdrop-blur-md mb-4 inline-block">
              Visual Journey
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-playfair tracking-tight mt-3 mb-4">
              Our Kitchen & Product Gallery
            </h2>
            <p className="text-amber-800/60 dark:text-amber-200/60 max-w-xl mx-auto">
              Get an insider look at our traditional preparation, packaging craftsmanship, and premium retail presentations.
            </p>
            
            {/* Filter Buttons */}
            <div className="flex flex-wrap justify-center gap-3 mt-10">
              {['All', 'Products', 'Retail Packaging', 'Kitchen & Bulk'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-300 border ${
                    activeFilter === cat
                      ? 'bg-amber-600 border-amber-600 text-white shadow-lg shadow-amber-500/20'
                      : 'bg-white/40 dark:bg-white/[0.03] border-amber-500/10 text-amber-950 dark:text-amber-200 hover:border-amber-500/30'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredGallery.map((item, idx) => (
              <motion.div
                key={item.src}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="aspect-square rounded-2xl overflow-hidden relative cursor-pointer group shadow-md hover:shadow-xl transition-all duration-300 border border-amber-500/10 bg-white/10"
                onClick={() => setLightboxIndex(idx)}
              >
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-amber-950/90 via-amber-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-left">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 mb-1">
                    {item.category}
                  </span>
                  <h4 className="font-playfair text-lg font-bold text-white mb-2 leading-snug">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-1 text-xs text-amber-300/80 font-semibold">
                    <span>View Photo</span>
                    <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div 
          className="fixed inset-0 bg-black/95 backdrop-blur-md z-[2000] flex flex-col items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Close button */}
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors z-[2010]"
            onClick={() => setLightboxIndex(null)}
            aria-label="Close Lightbox"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Prev button */}
          <button 
            className="absolute left-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-4 rounded-full transition-colors z-[2010] max-sm:bottom-6 max-sm:left-1/4"
            onClick={handlePrev}
            aria-label="Previous Image"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Image display container */}
          <div 
            className="relative max-w-4xl max-h-[75vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={filteredGallery[lightboxIndex].src} 
              alt={filteredGallery[lightboxIndex].title}
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl select-none"
            />
          </div>

          {/* Title & Caption */}
          <div className="mt-6 text-center text-white/90 z-[2010]" onClick={(e) => e.stopPropagation()}>
            <span className="text-[11px] uppercase tracking-widest text-amber-400 font-bold bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
              {filteredGallery[lightboxIndex].category}
            </span>
            <h3 className="font-playfair text-2xl sm:text-3xl font-extrabold mt-3 mb-1">
              {filteredGallery[lightboxIndex].title}
            </h3>
            <p className="text-xs text-white/50 tracking-wider">
              Image {lightboxIndex + 1} of {filteredGallery.length}
            </p>
          </div>

          {/* Next button */}
          <button 
            className="absolute right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-4 rounded-full transition-colors z-[2010] max-sm:bottom-6 max-sm:right-1/4"
            onClick={handleNext}
            aria-label="Next Image"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      {/* Spacer between Our Legacy and CTA */}
      <div className="h-16 md:h-24" />

      {/* ── CALL TO ACTION ── */}
      <section className="py-24 px-6 text-center relative overflow-hidden flex flex-col items-center justify-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-amber-500/10 dark:bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-2xl w-full mx-auto relative z-10 flex flex-col items-center text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-playfair mb-4 w-full">Taste the Legacy of Real Kadalai Mittai</h2>
          <p className="text-amber-900/60 dark:text-amber-100/60 mb-8 max-w-lg mx-auto w-full">
            Whether you are stocking up for festive celebrations, planning custom wedding favors, or simply craving healthy snacking, we deliver fresh batches pan-India.
          </p>
          <div className="flex flex-wrap justify-center gap-5 w-full items-center">
            <Link 
              to="/products" 
              className="px-10 py-5 rounded-full font-extrabold text-base tracking-wide bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-white shadow-xl shadow-amber-500/30 transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 inline-flex items-center justify-center"
            >
              Explore Our Snacks
            </Link>
            <Link 
              to="/contact" 
              className="px-10 py-5 rounded-full font-extrabold text-base tracking-wide bg-white/70 dark:bg-white/5 hover:bg-white/90 dark:hover:bg-white/10 text-amber-900 dark:text-amber-200 border-2 border-amber-500/30 backdrop-blur-md transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 inline-flex items-center justify-center"
            >
              Connect with Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;