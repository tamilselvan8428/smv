import { Link } from 'react-router-dom';
import { useEffect } from 'react';

const injectStyles = () => {
  if (document.getElementById('smv-footer-styles')) return;
  const style = document.createElement('style');
  style.id = 'smv-footer-styles';
  style.textContent = `
    @keyframes smvf-floatY  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }

    .smvf-body { font-family:'Outfit',sans-serif; }
    .smvf-title { font-family:'Playfair Display',serif; }

    /* ── Links ── */
    .smvf-link {
      color: var(--text-sub); text-decoration:none; font-size:14px;
      transition:color 0.18s,padding-left 0.18s; display:flex; align-items:center; gap:8px;
    }
    .smvf-link:hover { color: var(--saffron); padding-left:4px; }

    /* ── Social ── */
    .smvf-social {
      width:38px; height:38px; border-radius:10px;
      background: rgba(217, 119, 6, 0.1); border: 1px solid var(--border-color);
      display:flex; align-items:center; justify-content:center; font-size:17px;
      cursor:pointer; transition:all 0.18s; text-decoration:none;
      color: var(--text-main);
    }
    .smvf-social:hover { background: var(--saffron); color:#fff; transform:translateY(-2px); }

    /* ── Back to top ── */
    .smvf-top-btn {
      width:42px; height:42px; border-radius:12px; border: 1px solid var(--border-color); cursor:pointer;
      background: var(--bg-card-solid); color: var(--text-main); font-size:18px;
      display:flex; align-items:center; justify-content:center;
      transition:all 0.18s; box-shadow: var(--shadow);
    }
    .smvf-top-btn:hover { background: var(--saffron); color:#fff; transform:translateY(-3px); }

    /* ── Bottom bar ── */
    .smvf-bottom-bar {
      border-top:1.5px solid var(--border-color);
      padding:24px 32px; display:flex; align-items:center;
      justify-content:space-between; flex-wrap:wrap; gap:12px;
    }

    .smvf-dot { color: var(--saffron); margin:0 6px; }

    .smvf-badge {
      display:inline-flex; align-items:center; gap:5px;
      background: rgba(217, 119, 6, 0.1); border: 1px solid var(--border-color);
      border-radius:50px; padding:4px 12px; font-size:12px;
      color: var(--text-sub); font-weight:500;
    }

    .smvf-col-title {
      font-size:11px; font-weight:700; letter-spacing:0.1em;
      text-transform:uppercase; color: var(--saffron);
      margin-bottom:16px; display:flex; align-items:center; gap:8px;
    }
    .smvf-col-title::after {
      content:''; flex:1; height:1px; background: var(--border-color);
    }

    @media(max-width:768px) {
      .smvf-grid { grid-template-columns:1fr !important; }
      .smvf-bottom-bar { justify-content:center; text-align:center; }
    }
  `;
  document.head.appendChild(style);
};

const Footer = () => {
  useEffect(() => { injectStyles(); }, []);

  const year = new Date().getFullYear();

  const quickLinks = [
    { to:'/',         label:'Home'     },
    { to:'/products', label:'Products' },
    { to:'/contact',  label:'Contact'  },
  ];

  return (
    <footer className="smvf-body" style={{ background: 'var(--bg-card-solid)', borderTop: '1.5px solid var(--border-color)', position:'relative', overflow:'hidden' }}>
      
      {/* Decorative blobs */}
      {[
        { w:250, h:250, t:'-10%', r:'-5%', op:0.03, dur:'9s' },
        { w:150, h:150, b:'5%',   l:'-3%', op:0.02, dur:'7s' },
      ].map((d, i) => (
        <div key={i} style={{
          position:'absolute', width:d.w, height:d.h, borderRadius:'50%',
          background: `rgba(217, 119, 6, ${d.op})`,
          top:d.t, right:d.r, bottom:d.b, left:d.l,
          animation:`smvf-floatY ${d.dur} ease-in-out infinite`,
          animationDelay:`${i*0.8}s`, pointerEvents:'none',
        }} />
      ))}

      {/* Main footer grid */}
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'56px 32px 40px' }}>
        <div className="smvf-grid" style={{ display:'grid', gridTemplateColumns:'1.5fr 1fr 1.5fr', gap:40 }}>

          {/* Brand col */}
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
              <div style={{
                width:46, height:46, borderRadius:14,
                background:'linear-gradient(135deg, var(--saffron-light), var(--saffron-dark))',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:22, boxShadow:'0 4px 16px var(--shadow)',
              }}>🥜</div>
              <div>
                <div className="smvf-title" style={{ fontSize:20, fontWeight:800, color:'var(--text-main)' }}>SMV Kadalai Mittai</div>
                <div style={{ fontSize:10, color:'var(--text-sub)', letterSpacing:'0.1em', textTransform:'uppercase', fontWeight:600 }}>Traditional Taste & Legacy</div>
              </div>
            </div>
            <p style={{ color:'var(--text-sub)', fontSize:14, lineHeight:1.8, marginBottom:20, maxWidth:280 }}>
              Savor Tiruppur's legendary double-roasted peanut chikkis and traditional snacks, handcrafted in small batches using native organic jaggery since 1996.
            </p>

            {/* Trust badges */}
            <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:24 }}>
              {[
                { icon:'✓', label:'100% Homemade Quality' },
                { icon:'⭐', label:'Traditional Recipe' },
              ].map(b => (
                <span key={b.label} className="smvf-badge">
                  <span style={{ color:'var(--saffron)' }}>{b.icon}</span> {b.label}
                </span>
              ))}
            </div>

            {/* Social icons */}
            <div style={{ display:'flex', gap:8 }}>
              {[
                { icon: '📞', href: 'tel:+919876543210', label: 'Call' },
                { icon: '💬', href: 'https://wa.me/919876543210', label: 'WhatsApp' },
                { icon: '✉️', href: 'mailto:info@smvkadalaimittai.com', label: 'Email' }
              ].map(s => (
                <a key={s.label} href={s.href} className="smvf-social" title={s.label} target="_blank" rel="noreferrer">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <p className="smvf-col-title">Quick Links</p>
            <ul style={{ listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:12 }}>
              {quickLinks.map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="smvf-link">
                    <span style={{ color:'var(--saffron)', fontSize:10 }}>▸</span> {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="smvf-col-title">Contact Details</p>
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              {[
                { icon:'📍', lines:['SMV Kadalai Mittai, KSC School Road, Kuppusamypuram, Renganatha Puram, Tiruppur, Tamil Nadu 641604'] },
                { icon:'📞', lines:['+91 9842263860', '+91 8428863860'] },
                { icon:'✉️', lines:['info@smvkadalaimittai.com'] },
                { icon:'🕐', lines:['Mon–Sun: 8AM – 8PM'] },
              ].map(row => (
                <div key={row.icon} style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
                  <span style={{ fontSize:15, marginTop:1, flexShrink:0 }}>{row.icon}</span>
                  <div>
                    {row.lines.map((l, i) => (
                      <div key={i} style={{ fontSize:13, color:'var(--text-sub)', lineHeight:1.7 }}>{l}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="smvf-bottom-bar">
        <p style={{ color:'var(--text-sub)', fontSize:13, margin:0 }}>
          © {year} SMV Kadalai Mittai. All rights reserved.
          <span className="smvf-dot">•</span>
          <a href="#" style={{ color:'var(--text-sub)', textDecoration:'none', transition:'color 0.18s' }}
            onMouseOver={e=>e.target.style.color='var(--saffron)'} onMouseOut={e=>e.target.style.color='var(--text-sub)'}>
            Privacy Policy
          </a>
          <span className="smvf-dot">•</span>
          <a href="#" style={{ color:'var(--text-sub)', textDecoration:'none', transition:'color 0.18s' }}
            onMouseOver={e=>e.target.style.color='var(--saffron)'} onMouseOut={e=>e.target.style.color='var(--text-sub)'}>
            Terms of Use
          </a>
        </p>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <button className="smvf-top-btn" onClick={() => window.scrollTo({ top:0, behavior:'smooth' })} title="Back to top">
            ↑
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;