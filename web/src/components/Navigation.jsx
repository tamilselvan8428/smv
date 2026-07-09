import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

/* ─── Style Injection with Light/Dark Mode variables ─── */
const injectStyles = () => {
  if (document.getElementById('smv-nav-styles')) return;
  const style = document.createElement('style');
  style.id = 'smv-nav-styles';
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600&display=swap');

    :root {
      --saffron: #D97706; /* Golden Amber Accent */
      --saffron-light: #F59E0B; /* Bright Honey Gold Accent */
      --saffron-dark: #78350F; /* Jaggery Copper Dark Accent */
      --cream: #FCF9F2; /* Warm Cream background */
      --bg-main: #FCF9F2; /* Warm Cream background */
      --bg-card: rgba(255, 255, 255, 0.7);
      --bg-card-solid: #FFFFFF; /* High-contrast card */
      --text-main: #2A1604; /* Espresso dark brown text */
      --text-sub: #6B5A49; /* Warm clay text */
      --border-color: #EFE9DF; /* Warm white-clay borders */
      --shadow: rgba(120, 53, 15, 0.06);
      --glass-bg: rgba(252, 249, 242, 0.7);
      --glass-border: rgba(217, 119, 6, 0.12);
      --card-shadow: 0 10px 30px -10px rgba(120, 53, 15, 0.08);
    }

    .dark {
      --saffron: #F59E0B; /* Brilliant Honey for Dark Mode */
      --saffron-light: #FBBF24; /* Sun Gold highlight */
      --saffron-dark: #B45309; /* Burnt Copper */
      --cream: #0B0805; /* Obsidian Jaggery */
      --bg-main: #0B0805; /* Obsidian Jaggery */
      --bg-card: rgba(20, 15, 10, 0.7);
      --bg-card-solid: #140F0A; /* Espresso cocoa card */
      --text-main: #F6EFEA; /* Warm vanilla text */
      --text-sub: #A29182; /* Warm clay/cocoa text */
      --border-color: #201812; /* Roasted shell borders */
      --shadow: rgba(0, 0, 0, 0.6);
      --glass-bg: rgba(11, 8, 5, 0.7);
      --glass-border: rgba(245, 158, 11, 0.12);
      --card-shadow: 0 15px 35px -10px rgba(0, 0, 0, 0.7);
    }

    *, *::before, *::after {
      box-sizing: border-box;
    }

    body {
      background-color: var(--bg-main);
      color: var(--text-main);
      transition: background-color 0.35s ease, color 0.35s ease;
      font-family: 'Outfit', sans-serif;
    }

    @keyframes navSlideDown { from{opacity:0;transform:translateY(-100%)} to{opacity:1;transform:translateY(0)} }
    @keyframes mobileSlideIn { from{opacity:0;transform:translateX(100%)} to{opacity:1;transform:translateX(0)} }
    @keyframes fadeInDown    { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }

    .smv-nav {
      position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
      transition: background 0.35s, box-shadow 0.35s, padding 0.3s;
      background: var(--glass-bg);
      backdrop-filter: blur(20px);
      border-bottom: 1.5px solid var(--glass-border);
      box-shadow: 0 4px 30px rgba(120, 53, 15, 0.03);
    }

    .smv-nav-inner {
      max-width: 1200px; margin: 0 auto;
      padding: 0 24px;
      display: flex; align-items: center; justify-content: space-between;
      height: 72px;
    }

    /* Logo */
    .smv-logo {
      display: flex; align-items: center; gap: 12px;
      text-decoration: none; transition: transform 0.2s;
    }
    .smv-logo:hover { transform: scale(1.02); }
    .smv-logo-icon {
      width: 44px; height: 44px; border-radius: 14px;
      background: linear-gradient(135deg, var(--saffron-light), var(--saffron-dark));
      display: flex; align-items: center; justify-content: center;
      font-size: 22px; box-shadow: 0 4px 15px var(--shadow);
      flex-shrink: 0;
    }
    .smv-logo-text {
      font-family: 'Playfair Display', serif;
      font-size: 20px; font-weight: 800; line-height: 1.1;
      color: var(--text-main);
    }
    .smv-logo-sub {
      font-family: 'Outfit', sans-serif;
      font-size: 10px; font-weight: 600; letter-spacing: 0.12em;
      text-transform: uppercase; color: var(--saffron); display: block;
      margin-top: 2px;
    }

    /* Desktop links */
    .smv-nav-links {
      display: flex; align-items: center; gap: 6px;
    }
    .smv-nav-link {
      position: relative; text-decoration: none;
      padding: 8px 18px; border-radius: 50px; font-size: 14px; font-weight: 500;
      color: var(--text-sub); transition: all 0.25s ease;
      display: flex; align-items: center; gap: 6px;
    }
    .smv-nav-link:hover { color: var(--saffron); background: rgba(217, 119, 6, 0.08); }
    .smv-nav-link.active { color: var(--text-main); background: rgba(217, 119, 6, 0.12); font-weight: 600; }

    /* Theme Toggle */
    .smv-theme-btn {
      width: 40px; height: 40px; border-radius: 50%;
      border: 1px solid var(--border-color); background: var(--bg-card-solid);
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      font-size: 18px; color: var(--text-main); transition: all 0.2s;
      box-shadow: var(--shadow);
    }
    .smv-theme-btn:hover {
      transform: scale(1.05);
      border-color: var(--saffron);
      color: var(--saffron);
    }

    /* CTA button */
    .smv-nav-cta {
      background: linear-gradient(135deg, var(--saffron-light), var(--saffron-dark));
      color: #fff !important; border-radius: 50px;
      padding: 9px 24px; font-weight: 600; font-size: 14px;
      box-shadow: 0 4px 15px rgba(217, 119, 6, 0.3);
      transition: transform 0.2s, box-shadow 0.2s;
      text-decoration: none; display: inline-flex; align-items: center; gap: 6px;
    }
    .smv-nav-cta:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(217, 119, 6, 0.45); }

    /* Hamburger */
    .smv-hamburger {
      width: 40px; height: 40px; border-radius: 12px; border: 1px solid var(--border-color); cursor: pointer;
      display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px;
      background: var(--bg-card-solid); transition: all 0.2s;
    }
    .smv-hamburger:hover { border-color: var(--saffron); }
    .smv-hamburger-bar {
      width: 20px; height: 2px; border-radius: 2px;
      background: var(--text-main);
      transition: transform 0.3s, opacity 0.3s, width 0.3s;
    }
    .smv-hamburger.open .smv-hamburger-bar:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
    .smv-hamburger.open .smv-hamburger-bar:nth-child(2) { opacity: 0; width: 0; }
    .smv-hamburger.open .smv-hamburger-bar:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }

    /* Mobile drawer */
    .smv-mobile-backdrop {
      position: fixed; inset: 0; background: rgba(0,0,0,0.5);
      backdrop-filter: blur(4px); z-index: 998;
      animation: fadeInDown 0.2s ease;
    }
    .smv-mobile-drawer {
      position: fixed; top: 0; right: 0; bottom: 0; width: 300px; max-width: 85vw;
      background: var(--bg-card-solid); z-index: 999; display: flex; flex-direction: column;
      box-shadow: -8px 0 40px rgba(0,0,0,0.2);
      animation: mobileSlideIn 0.3s cubic-bezier(0.34,1.56,0.64,1);
      border-left: 1px solid var(--border-color);
    }
    .smv-drawer-header {
      padding: 24px; display: flex; align-items: center; justify-content: space-between;
      border-bottom: 1px solid var(--border-color);
    }
    .smv-drawer-close {
      width: 36px; height: 36px; border-radius: 10px; background: rgba(217, 119, 6, 0.1);
      border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;
      font-size: 16px; color: var(--saffron-dark); transition: background 0.2s;
    }
    .smv-drawer-close:hover { background: rgba(217, 119, 6, 0.2); }
    .smv-drawer-link {
      display: flex; align-items: center; gap: 14px; padding: 14px 24px;
      text-decoration: none; color: var(--text-main); font-size: 16px; font-weight: 500;
      transition: background 0.18s, color 0.18s;
    }
    .smv-drawer-link:hover { background: rgba(217, 119, 6, 0.05); color: var(--saffron); }
    .smv-drawer-link.active { background: rgba(217, 119, 6, 0.1); color: var(--saffron); font-weight: 700; }
    .smv-drawer-link-icon {
      width: 38px; height: 38px; border-radius: 10px;
      display: flex; align-items: center; justify-content: center; font-size: 18px;
      background: rgba(217, 119, 6, 0.1); flex-shrink: 0;
    }

    .smv-nav-spacer { height: 72px; }

    @media(max-width: 768px) {
      .smv-nav-links, .smv-nav-cta-wrapper { display: none !important; }
      .smv-hamburger { display: flex !important; }
    }
    @media(min-width: 769px) {
      .smv-hamburger { display: none; }
    }
  `;
  document.head.appendChild(style);
};

const NAV_LINKS = [
  { to: '/',         label: 'Home',     icon: '🏠' },
  { to: '/products', label: 'Products', icon: '🍿' },
  { to: '/contact',  label: 'Contact',  icon: '✉️' },
];

const Navigation = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => { injectStyles(); }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  const isActive = (to) => to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  return (
    <>
      <nav className="smv-nav" style={{ animation: 'navSlideDown 0.4s ease' }}>
        <div className="smv-nav-inner">
          {/* Logo */}
          <Link to="/" className="smv-logo">
            <div className="smv-logo-icon">🥜</div>
            <div>
              <span className="smv-logo-text">SMV Kadalai Mittai</span>
              <span className="smv-logo-sub">Traditional Taste & Quality</span>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="smv-nav-links">
            {NAV_LINKS.map(l => (
              <Link key={l.to} to={l.to} className={`smv-nav-link ${isActive(l.to) ? 'active' : ''}`}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* Actions: Theme Toggle + Contact CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="smv-theme-btn" onClick={toggleTheme} aria-label="Toggle Theme" title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}>
              {theme === 'light' ? '🌙' : '☀️'}
            </button>

            <div className="smv-nav-cta-wrapper" style={{ display: 'flex', alignItems: 'center' }}>
              <Link to="/contact" className="smv-nav-cta">
                Contact Us
              </Link>
            </div>

            {/* Hamburger for mobile */}
            <button
              className={`smv-hamburger ${mobileOpen ? 'open' : ''}`}
              onClick={() => setMobileOpen(o => !o)}
              aria-label="Toggle menu"
            >
              <span className="smv-hamburger-bar" />
              <span className="smv-hamburger-bar" />
              <span className="smv-hamburger-bar" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <>
          <div className="smv-mobile-backdrop" onClick={() => setMobileOpen(false)} />
          <div className="smv-mobile-drawer">
            <div className="smv-drawer-header">
              <Link to="/" className="smv-logo" onClick={() => setMobileOpen(false)}>
                <div className="smv-logo-icon">🥜</div>
                <div>
                  <span className="smv-logo-text" style={{ fontSize: '18px' }}>SMV Kadalai Mittai</span>
                  <span className="smv-logo-sub" style={{ fontSize: '9px' }}>Traditional Taste</span>
                </div>
              </Link>
              <button className="smv-drawer-close" onClick={() => setMobileOpen(false)}>✕</button>
            </div>

            {/* Nav links */}
            <div style={{ flex: 1, paddingTop: 12, paddingBottom: 16 }}>
              {NAV_LINKS.map((l, i) => (
                <Link
                  key={l.to} to={l.to}
                  className={`smv-drawer-link ${isActive(l.to) ? 'active' : ''}`}
                  style={{ animationDelay: `${i * 60}ms`, animation: 'fadeInDown 0.3s ease both' }}
                >
                  <span className="smv-drawer-link-icon">{l.icon}</span>
                  <span>{l.label}</span>
                  {isActive(l.to) && <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--saffron)', fontWeight: 700 }}>●</span>}
                </Link>
              ))}
            </div>

            {/* Drawer footer */}
            <div style={{ padding: '16px 20px 28px', borderTop: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', gap: 12, marginBottom: 16, width: '100%' }}>
                <button className="smv-theme-btn" onClick={toggleTheme} style={{ flexShrink: 0, width: '48px', height: '48px', borderRadius: '12px' }}>
                  {theme === 'light' ? '🌙' : '☀️'}
                </button>
                <Link to="/contact" onClick={() => setMobileOpen(false)} className="smv-nav-cta" style={{ flex: 1, height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', padding: 0 }}>
                  Contact Us
                </Link>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
                {[
                  { icon: '📞', href: 'tel:+919876543210', label: 'Call' },
                  { icon: '💬', href: 'https://wa.me/919876543210', label: 'WhatsApp' },
                  { icon: '✉️', href: 'mailto:info@smvkadalaimittai.com', label: 'Email' },
                ].map(c => (
                  <a key={c.label} href={c.href} style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                    color: 'var(--text-sub)', textDecoration: 'none', fontSize: 11, fontWeight: 500,
                  }}>
                    <span style={{ fontSize: 20, background: 'rgba(193, 140, 63, 0.1)', width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justify: 'center' }}>{c.icon}</span>
                    {c.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Spacer */}
      <div className="smv-nav-spacer" />
    </>
  );
};

export default Navigation;