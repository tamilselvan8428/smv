import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

/* ─── Style Injection ─── */
const injectStyles = () => {
  if (document.getElementById('rs-contact-styles')) return;
  const style = document.createElement('style');
  style.id = 'rs-contact-styles';
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
    :root {
      --saffron: #D97706; /* Golden Amber Accent */
      --saffron-light: #F59E0B; /* Honey Gold Accent */
      --saffron-dark: #78350F; /* Jaggery Copper Dark Accent */
      --gold: #F59E0B;
      --cream: var(--bg-main);
      --deep: var(--text-main);
    }
    *,*::before,*::after{box-sizing:border-box;}

    @keyframes fadeUp   {from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
    @keyframes fadeIn   {from{opacity:0}to{opacity:1}}
    @keyframes popIn    {from{opacity:0;transform:scale(0.88)}to{opacity:1;transform:scale(1)}}
    @keyframes shimmer  {0%{background-position:-500px 0}100%{background-position:500px 0}}
    @keyframes floatY   {0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
    @keyframes spin     {to{transform:rotate(360deg)}}
    @keyframes checkDraw{from{stroke-dashoffset:60}to{stroke-dashoffset:0}}
    @keyframes ripple   {0%{transform:scale(0);opacity:0.5}100%{transform:scale(2.5);opacity:0}}
    @keyframes slideDown{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}
    @keyframes pulse    {0%,100%{opacity:1}50%{opacity:0.55}}

    .rsc-body  {font-family:'DM Sans',sans-serif;}
    .rsc-title {font-family:'Playfair Display',serif;}

    /* ── Inputs ── */
    .rsc-input {
      width:100%; border:1.5px solid var(--border-color); border-radius:12px;
      padding:13px 16px; font-size:15px; color:var(--text-main);
      background:var(--bg-main); outline:none; transition:border-color 0.2s,box-shadow 0.2s,background 0.2s;
      font-family:'DM Sans',sans-serif;
    }
    .rsc-input:focus {
      border-color:var(--saffron); background:var(--bg-card-solid);
      box-shadow:0 0 0 3px rgba(217, 119, 6, 0.12);
    }
    .rsc-input.error {border-color:#EF4444;box-shadow:0 0 0 3px rgba(239,68,68,0.1);}
    .rsc-input.valid {border-color:#22C55E;}
    .rsc-textarea {resize:none; min-height:130px; line-height:1.6;}

    /* ── Label float ── */
    .rsc-field {position:relative; margin-bottom:20px;}
    .rsc-label {
      display:block; font-size:13px; font-weight:600; color:var(--text-sub);
      margin-bottom:6px; letter-spacing:0.02em;
      transition:color 0.2s;
    }
    .rsc-field:focus-within .rsc-label {color:var(--saffron);}

    /* ── Field icon ── */
    .rsc-field-icon {
      position:absolute; right:14px; top:42px;
      font-size:16px; pointer-events:none;
      transition:opacity 0.2s;
    }

    /* ── Submit button ── */
    .rsc-submit {
      width:100%; position:relative; overflow:hidden;
      background:linear-gradient(135deg,var(--saffron-light),var(--saffron-dark));
      color:#fff; border:none; border-radius:14px;
      padding:15px; font-size:16px; font-weight:700;
      cursor:pointer; font-family:'DM Sans',sans-serif;
      box-shadow:0 4px 20px rgba(217,119,6,0.35);
      transition:transform 0.18s,box-shadow 0.18s;
      display:flex; align-items:center; justify-content:center; gap:8px;
    }
    .rsc-submit:hover:not(:disabled) {transform:translateY(-2px);box-shadow:0 8px 28px rgba(217,119,6,0.45);}
    .rsc-submit:active:not(:disabled) {transform:scale(0.98);}
    .rsc-submit:disabled {opacity:0.7;cursor:not-allowed;}
    .rsc-submit .ripple-circle {
      position:absolute; border-radius:50%;
      width:60px; height:60px;
      background:rgba(255,255,255,0.3);
      transform:scale(0); animation:ripple 0.6s ease-out forwards;
    }

    /* ── Info card row ── */
    .rsc-info-row {
      display:flex; align-items:flex-start; gap:16px;
      padding:16px 18px; border-radius:14px;
      transition:background 0.2s; cursor:default;
    }
    .rsc-info-row:hover {background:rgba(255,255,255,0.12);}
    .rsc-info-icon {
      width:46px; height:46px; border-radius:13px;
      background:rgba(255,255,255,0.18);
      display:flex; align-items:center; justify-content:center;
      font-size:20px; flex-shrink:0;
      border:1px solid rgba(255,255,255,0.25);
      backdrop-filter:blur(4px);
    }

    /* ── Social button ── */
    .rsc-social {
      display:flex; align-items:center; justify-content:center;
      width:40px; height:40px; border-radius:10px;
      background:rgba(255,255,255,0.15); border:1px solid rgba(255,255,255,0.25);
      color:#fff; font-size:18px; cursor:pointer; text-decoration:none;
      transition:background 0.2s,transform 0.18s;
    }
    .rsc-social:hover {background:rgba(255,255,255,0.28);transform:translateY(-2px);}

    /* ── Map pin bounce ── */
    .rsc-map-pin {animation:floatY 2.5s ease-in-out infinite;}

    /* ── FAQ accordion ── */
    .rsc-faq-item {
      border:1.5px solid var(--border-color); border-radius:14px;
      overflow:hidden; margin-bottom:10px; background:var(--bg-card-solid);
      transition:box-shadow 0.2s;
    }
    .rsc-faq-item:hover {box-shadow:0 4px 16px rgba(217,119,6,0.08);}
    .rsc-faq-q {
      width:100%; background:none; border:none; cursor:pointer;
      padding:16px 20px; text-align:left;
      display:flex; align-items:center; justify-content:space-between; gap:12px;
      font-size:14px; font-weight:600; color:#1A0A00;
      font-family:'DM Sans',sans-serif; transition:color 0.2s;
    }
    .rsc-faq-q:hover {color:var(--saffron);}
    .rsc-faq-chevron {
      font-size:18px; color:var(--saffron); flex-shrink:0;
      transition:transform 0.28s cubic-bezier(0.34,1.56,0.64,1);
    }
    .rsc-faq-chevron.open {transform:rotate(180deg);}
    .rsc-faq-a {
      overflow:hidden; max-height:0; transition:max-height 0.32s ease, padding 0.2s;
      font-size:13px; color:#7A6358; line-height:1.7; padding:0 20px;
    }
    .rsc-faq-a.open {max-height:200px; padding:0 20px 16px;}

    /* ── Success animation ── */
    .rsc-success-check {
      stroke-dasharray:60; stroke-dashoffset:60;
      animation:checkDraw 0.5s ease 0.2s forwards;
    }

    /* ── Char counter ── */
    .rsc-char-counter {font-size:12px;color:#C8B8A8;text-align:right;margin-top:4px;}
    .rsc-char-counter.warn {color:#F97C35;}
    .rsc-char-counter.over {color:#EF4444;}

    .reveal {opacity:0;}
    .reveal.visible {animation:fadeUp 0.55s ease forwards;}
  `;
  document.head.appendChild(style);
};

/* ─── Reveal hook ─── */
function useReveal(threshold = 0.08) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) { el.classList.add('visible'); return; }
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add('visible'); obs.disconnect(); }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return ref;
}

/* ─── FAQ data ─── */
const FAQS = [
  { q: 'What is the minimum order quantity?', a: 'Our minimum wholesale order is ₹500. For bulk or corporate custom orders above ₹5,000, we offer special tiered discounts.' },
  { q: 'Do you offer pan-India and international delivery?', a: 'Yes! We dispatch fresh batches pan-India daily with express shipping (taking 2–4 business days). We also cater to bulk exports for traditional celebrations and corporates globally.' },
  { q: 'Can I get product samples before ordering?', a: "Absolutely. Contact us via phone or this form, and we'll arrange a fresh sampler pack of our signature varieties at a nominal shipping cost." },
  { q: 'How do you ensure the freshness and quality?', a: "Our peanut chikkis are prepared in small batches, immediately vacuum-sealed to lock in crunchiness, and carry a natural shelf life of 90 days without any preservatives." },
];

/* ─── FAQ Accordion ─── */
function FAQ() {
  const [open, setOpen] = useState(null);
  const ref = useReveal(0.1);
  return (
    <section ref={ref} className="reveal" style={{ padding:'64px 24px', background:'var(--bg-main)', color:'var(--text-main)' }}>
      <div style={{ maxWidth:760, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <span style={{ display:'inline-block', background:'rgba(232,98,26,0.1)', color:'var(--saffron)', borderRadius:50, padding:'4px 14px', fontSize:12, fontWeight:700, letterSpacing:'0.05em', textTransform:'uppercase', marginBottom:12 }}>FAQ</span>
          <h2 className="rsc-title" style={{ fontSize:'clamp(24px,3vw,36px)', color:'var(--text-main)' }}>Frequently Asked Questions</h2>
        </div>
        {FAQS.map((f, i) => (
          <div key={i} className="rsc-faq-item" style={{ background:'var(--bg-card-solid)', border:'1.5px solid var(--border-color)' }}>
            <button className="rsc-faq-q" onClick={() => setOpen(open === i ? null : i)} style={{ color:'var(--text-main)' }}>
              <span>{f.q}</span>
              <span className={`rsc-faq-chevron ${open === i ? 'open' : ''}`}>⌄</span>
            </button>
            <div className={`rsc-faq-a ${open === i ? 'open' : ''}`} style={{ color:'var(--text-sub)' }}>{f.a}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ══════════════════════ MAIN ══════════════════════ */
const Contact = () => {
  const [searchParams] = useSearchParams();
  const prepopulatedProduct = searchParams.get('product') || '';

  const [form, setForm]       = useState({ name:'', email:'', phone:'', subject:'', message:'' });
  const [errors, setErrors]   = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus]   = useState('idle'); // idle | sending | success | error
  const [ripple, setRipple]   = useState(null);

  const heroRef  = useReveal(0.05);
  const formRef  = useReveal(0.08);
  const infoRef  = useReveal(0.08);

  useEffect(() => { injectStyles(); }, []);

  useEffect(() => {
    if (prepopulatedProduct) {
      setForm(prev => ({
        ...prev,
        subject: 'wholesale',
        message: `Hello SMV team,\n\nI would like to enquire about wholesale pricing and availability for "${prepopulatedProduct}". Please provide details on minimum order quantities and shipping.\n\nThank you!`
      }));
    }
  }, [prepopulatedProduct]);

  /* ── Validation ── */
  const validate = (data) => {
    const e = {};
    if (!data.name.trim())          e.name    = 'Name is required';
    if (!data.email.trim())         e.email   = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = 'Invalid email address';
    if (data.phone && !/^[+\d\s\-()]{7,15}$/.test(data.phone)) e.phone = 'Invalid phone number';
    if (!data.message.trim())       e.message = 'Message is required';
    else if (data.message.length < 10) e.message = 'Message too short (min 10 chars)';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...form, [name]: value };
    setForm(updated);
    if (touched[name]) {
      const errs = validate(updated);
      setErrors(prev => ({ ...prev, [name]: errs[name] }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const errs = validate(form);
    setErrors(prev => ({ ...prev, [name]: errs[name] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allTouched = { name:true, email:true, phone:true, subject:true, message:true };
    setTouched(allTouched);
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setStatus('sending');
    try {
      const res = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          subject: form.subject,
          message: form.message,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus('success');
        setForm({ name:'', email:'', phone:'', subject:'', message:'' });
        setTouched({});
        setErrors({});
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 4000);
      }
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  const handleRipple = (e) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    setRipple({ x: e.clientX - rect.left - 30, y: e.clientY - rect.top - 30 });
    setTimeout(() => setRipple(null), 700);
  };

  const fieldState = (name) => {
    if (errors[name] && touched[name]) return 'error';
    if (touched[name] && !errors[name] && form[name]) return 'valid';
    return '';
  };

  const msgLen = form.message.length;

  return (
    <div className="rsc-body" style={{ minHeight:'100vh', background:'var(--bg-main)', color:'var(--text-main)', overflowX:'hidden', transition:'colors 0.3s' }}>

      {/* ── Hero Banner ── */}
      <div style={{
        background:'linear-gradient(145deg,#BF4E0C,#E8621A,#F97C35)',
        padding:'64px 24px 88px', position:'relative', overflow:'hidden',
      }}>
        {[{s:200,t:'-15%',r:'-4%'},{s:100,b:'5%',l:'2%'},{s:60,t:'30%',l:'30%'}].map((d,i) => (
          <div key={i} style={{
            position:'absolute', width:d.s, height:d.s, borderRadius:'50%',
            background:'rgba(255,255,255,0.07)', top:d.t, right:d.r, bottom:d.b, left:d.l,
            animation:`floatY ${4+i*1.5}s ease-in-out infinite`,
          }} />
        ))}
        <div ref={heroRef} className="reveal" style={{ maxWidth:700, margin:'0 auto', textAlign:'center', position:'relative', zIndex:2 }}>
          <span style={{
            display:'inline-block', background:'rgba(255,255,255,0.15)', backdropFilter:'blur(8px)',
            borderRadius:50, padding:'5px 18px', fontSize:12, fontWeight:600, color:'#fff',
            letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:18,
            border:'1px solid rgba(255,255,255,0.25)',
          }}>Get In Touch</span>
          <h1 className="rsc-title" style={{ fontSize:'clamp(36px,5vw,60px)', color:'#fff', marginBottom:14, textShadow:'0 2px 16px rgba(0,0,0,0.18)' }}>
            Let's Talk Business
          </h1>
          <p style={{ color:'rgba(255,255,255,0.87)', fontSize:17, lineHeight:1.7, maxWidth:480, margin:'0 auto' }}>
            Wholesale enquiries, custom orders, or just a question — we're here every step of the way.
          </p>
          {/* Quick contact pills */}
          <div style={{ display:'flex', gap:12, justifyContent:'center', marginTop:28, flexWrap:'wrap' }}>
            {[
              { icon:'📞', label:'+91 9842263860', href:'tel:+919842263860' },
              { icon:'✉️', label:'info@smvkadalaimittai.com', href:'mailto:info@smvkadalaimittai.com' },
            ].map(c => (
              <a key={c.label} href={c.href} style={{
                display:'inline-flex', alignItems:'center', gap:8,
                background:'rgba(255,255,255,0.15)', backdropFilter:'blur(10px)',
                borderRadius:50, padding:'9px 20px', color:'#fff', textDecoration:'none',
                fontSize:13, fontWeight:500, border:'1px solid rgba(255,255,255,0.25)',
                transition:'background 0.2s',
              }}
              onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,0.25)'}
              onMouseOut={e=>e.currentTarget.style.background='rgba(255,255,255,0.15)'}>
                {c.icon} {c.label}
              </a>
            ))}
          </div>
        </div>
        {/* Wave */}
        <div style={{ position:'absolute', bottom:0, left:0, right:0, lineHeight:0 }}>
          <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" style={{ display:'block' }}>
            <path d="M0 60L48 50C96 40 192 24 288 20C384 16 480 20 576 26C672 32 768 38 864 38C960 38 1056 32 1152 28C1248 24 1344 24 1392 24L1440 24V60H0Z" fill="var(--bg-main)"/>
          </svg>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div style={{ maxWidth:1160, margin:'0 auto', padding:'60px 24px 40px', display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:48, alignItems:'start' }}>

        {/* ── LEFT: Contact Form ── */}
        <div ref={formRef} className="reveal" style={{
          background:'var(--bg-card-solid)', borderRadius:24, padding:40,
          boxShadow:'0 4px 40px rgba(217,119,6,0.08)',
          border:'1.5px solid var(--border-color)',
        }}>
          <div style={{ marginBottom:28 }}>
            <span style={{ display:'inline-block', background:'rgba(217,119,6,0.1)', color:'var(--saffron)', borderRadius:50, padding:'3px 12px', fontSize:11, fontWeight:700, letterSpacing:'0.05em', textTransform:'uppercase', marginBottom:10 }}>Message Us</span>
            <h2 className="rsc-title" style={{ fontSize:28, color:'var(--text-main)' }}>Send a Message</h2>
            <p style={{ color:'var(--text-sub)', fontSize:14, marginTop:6 }}>We reply within 24 hours on business days.</p>
          </div>

          {/* ── Success State ── */}
          {status === 'success' && (
            <div style={{
              background:'#F0FDF4', border:'1.5px solid #86EFAC', borderRadius:16,
              padding:28, textAlign:'center', marginBottom:24,
              animation:'popIn 0.4s ease',
            }}>
              <svg width="56" height="56" viewBox="0 0 56 56" style={{ margin:'0 auto 12px', display:'block' }}>
                <circle cx="28" cy="28" r="26" fill="#DCFCE7" />
                <polyline points="16,28 24,36 40,20" fill="none" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="rsc-success-check" />
              </svg>
              <p style={{ fontWeight:700, color:'#15803D', fontSize:17, marginBottom:4 }}>Message Sent! 🎉</p>
              <p style={{ color:'#16A34A', fontSize:13 }}>We'll get back to you within 24 hours.</p>
            </div>
          )}

          {/* ── Error banner ── */}
          {status === 'error' && (
            <div style={{ background:'#FEF2F2', border:'1.5px solid #FECACA', borderRadius:12, padding:'12px 16px', marginBottom:20, color:'#DC2626', fontSize:13, display:'flex', alignItems:'center', gap:8 }}>
              ⚠️ Something went wrong. Please try again.
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Name + Email row */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:0 }}>
              <div className="rsc-field">
                <label className="rsc-label" style={{ color: 'var(--text-sub)' }}>Full Name *</label>
                <input className={`rsc-input ${fieldState('name')}`} name="name" placeholder="Ramesh Patel"
                  style={{ background: 'var(--bg-main)', color: 'var(--text-main)', border: '1.5px solid var(--border-color)' }}
                  value={form.name} onChange={handleChange} onBlur={handleBlur} />
                {fieldState('name') === 'valid'  && <span className="rsc-field-icon">✅</span>}
                {fieldState('name') === 'error'  && <span className="rsc-field-icon">⚠️</span>}
                {errors.name && touched.name && <p style={{ fontSize:12, color:'#EF4444', marginTop:4 }}>{errors.name}</p>}
              </div>
              <div className="rsc-field">
                <label className="rsc-label" style={{ color: 'var(--text-sub)' }}>Email Address *</label>
                <input className={`rsc-input ${fieldState('email')}`} name="email" type="email" placeholder="you@email.com"
                  style={{ background: 'var(--bg-main)', color: 'var(--text-main)', border: '1.5px solid var(--border-color)' }}
                  value={form.email} onChange={handleChange} onBlur={handleBlur} />
                {fieldState('email') === 'valid'  && <span className="rsc-field-icon">✅</span>}
                {fieldState('email') === 'error'  && <span className="rsc-field-icon">⚠️</span>}
                {errors.email && touched.email && <p style={{ fontSize:12, color:'#EF4444', marginTop:4 }}>{errors.email}</p>}
              </div>
            </div>

            {/* Phone + Subject row */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
              <div className="rsc-field">
                <label className="rsc-label" style={{ color: 'var(--text-sub)' }}>Phone Number</label>
                <input className={`rsc-input ${fieldState('phone')}`} name="phone" type="tel" placeholder="+91 9842263860"
                  style={{ background: 'var(--bg-main)', color: 'var(--text-main)', border: '1.5px solid var(--border-color)' }}
                  value={form.phone} onChange={handleChange} onBlur={handleBlur} />
                {errors.phone && touched.phone && <p style={{ fontSize:12, color:'#EF4444', marginTop:4 }}>{errors.phone}</p>}
              </div>
              <div className="rsc-field">
                <label className="rsc-label" style={{ color: 'var(--text-sub)' }}>Subject</label>
                <select className="rsc-input" name="subject" value={form.subject} onChange={handleChange}
                  style={{ background: 'var(--bg-main)', color: 'var(--text-main)', border: '1.5px solid var(--border-color)', cursor:'pointer', WebkitAppearance:'none', backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23D97706' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E\")", backgroundRepeat:'no-repeat', backgroundPosition:'right 14px center' }}>
                  <option value="">Select a topic</option>
                  <option value="wholesale">Wholesale Enquiry</option>
                  <option value="order">Place an Order</option>
                  <option value="sample">Request Samples</option>
                  <option value="pricing">Pricing Query</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Message */}
            <div className="rsc-field">
              <label className="rsc-label" style={{ color: 'var(--text-sub)' }}>Your Message *</label>
              <textarea className={`rsc-input rsc-textarea ${fieldState('message')}`}
                style={{ background: 'var(--bg-main)', color: 'var(--text-main)', border: '1.5px solid var(--border-color)' }}
                name="message" placeholder="Tell us about your requirements, quantities, or any questions..."
                value={form.message} onChange={handleChange} onBlur={handleBlur} rows={5} />
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:4 }}>
                {errors.message && touched.message
                  ? <p style={{ fontSize:12, color:'#EF4444' }}>{errors.message}</p>
                  : <span />}
                <span className={`rsc-char-counter ${msgLen > 450 ? 'over' : msgLen > 350 ? 'warn' : ''}`}>
                  {msgLen}/500
                </span>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" className="rsc-submit" disabled={status === 'sending'} onClick={handleRipple}
              style={{ marginTop:4 }}>
              {ripple && <span className="ripple-circle" style={{ left:ripple.x, top:ripple.y }} />}
              {status === 'sending'
                ? <><span style={{ width:18,height:18,borderRadius:'50%',border:'2px solid rgba(255,255,255,0.4)',borderTopColor:'#fff',animation:'spin 0.7s linear infinite',display:'inline-block' }} /> Sending...</>
                : <> Send Message →</>}
            </button>
          </form>
        </div>

        {/* ── RIGHT: Info Card ── */}
        <div ref={infoRef} className="reveal" style={{ display:'flex', flexDirection:'column', gap:24 }}>
          {/* Info card */}
          <div style={{
            background:'linear-gradient(145deg,#BF4E0C,#E8621A,#F5A623)',
            borderRadius:24, padding:36, color:'#fff',
            boxShadow:'0 8px 40px rgba(232,98,26,0.3)', position:'relative', overflow:'hidden',
          }}>
            {/* bg blob */}
            <div style={{ position:'absolute', width:200, height:200, borderRadius:'50%', background:'rgba(255,255,255,0.06)', top:'-40px', right:'-40px', pointerEvents:'none' }} />
            <span style={{ display:'inline-block', background:'rgba(255,255,255,0.15)', borderRadius:50, padding:'3px 14px', fontSize:11, fontWeight:700, letterSpacing:'0.06em', textTransform:'uppercase', marginBottom:16, border:'1px solid rgba(255,255,255,0.2)' }}>Contact Info</span>
            <h2 className="rsc-title" style={{ fontSize:26, marginBottom:24 }}>Reach Us Anytime</h2>

            {[
              { icon:'📍', title:'Address',        lines:['KSC School Road, Kuppusamypuram, Kuppusamypuram East, Tiruppur, Tamil Nadu 641604'] },
              { icon:'📞', title:'Phone',          lines:['+91 9842263860', '+91 8428863860'] },
              { icon:'✉️', title:'Email',          lines:['info@smvkadalaimittai.com'] },
              { icon:'🕐', title:'Business Hours', lines:['Mon – Sun: 7:00 AM – 9:00 PM'] },
            ].map(row => (
              <div key={row.title} className="rsc-info-row">
                <div className="rsc-info-icon">{row.icon}</div>
                <div>
                  <div style={{ fontWeight:700, fontSize:14, marginBottom:4 }}>{row.title}</div>
                  {row.lines.map((l, i) => (
                    <div key={i} style={{ fontSize:13, opacity:0.88, lineHeight:1.6 }}>{l}</div>
                  ))}
                </div>
              </div>
            ))}

            {/* Social row */}
            <div style={{ marginTop:24, paddingTop:20, borderTop:'1px solid rgba(255,255,255,0.2)' }}>
              <p style={{ fontSize:12, fontWeight:600, opacity:0.7, letterSpacing:'0.06em', textTransform:'uppercase', marginBottom:12 }}>Follow Us</p>
              <div style={{ display:'flex', gap:10 }}>
                {[
                  { icon:'📘', label:'Facebook',  href:'#' },
                  { icon:'📸', label:'Instagram', href:'#' },
                  { icon:'🐦', label:'Twitter',   href:'#' },
                  { icon:'▶️', label:'YouTube',   href:'#' },
                ].map(s => (
                  <a key={s.label} href={s.href} className="rsc-social" title={s.label}>{s.icon}</a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
            {[
              { icon:'⚡', n:'< 2hr', label:'Response Time' },
              { icon:'📦', n:'500+',  label:'Cities Served' },
              { icon:'⭐', n:'4.9',   label:'Google Rating' },
            ].map(s => (
              <div key={s.label} style={{
                background:'var(--bg-card-solid)', borderRadius:16, padding:'18px 14px', textAlign:'center',
                border:'1.5px solid var(--border-color)', boxShadow:'0 2px 12px rgba(217,119,6,0.05)',
              }}>
                <div style={{ fontSize:22, marginBottom:6 }}>{s.icon}</div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:800, color:'var(--saffron)', lineHeight:1 }}>{s.n}</div>
                <div style={{ fontSize:12, color:'var(--text-sub)', marginTop:4, fontWeight:500 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAP: Full Width Section below side-by-side components ── */}
      <div style={{ maxWidth:1160, margin:'0 auto 60px', padding:'0 24px' }}>
        <div style={{ background:'var(--bg-card-solid)', borderRadius:24, overflow:'hidden', border:'1.5px solid var(--border-color)', boxShadow:'0 4px 24px rgba(217,119,6,0.07)' }}>
          <div style={{ padding:'18px 24px 0', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
            <div>
              <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:18, color:'var(--text-main)', marginBottom:2 }}>Find Us</h3>
              <p style={{ fontSize:12, color:'var(--text-sub)' }}>KSC School Road, Kuppusamypuram, Kuppusamypuram East, Tiruppur, Tamil Nadu 641604</p>
            </div>
            <a href="https://www.google.com/maps/place/Raja+Snacks/@11.0980999,77.3491688,855m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3ba907cfe5b911c3:0x84a05c5114aa08e9!8m2!3d11.0980999!4d77.3517437!16s%2Fg%2F11kjy9ps7v?entry=ttu&g_ep=EgoyMDI2MDUyNy4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noreferrer" style={{
              background:'var(--saffron)', color:'#fff', borderRadius:50, padding:'7px 16px',
              fontSize:12, fontWeight:700, textDecoration:'none',
              boxShadow:'0 3px 12px rgba(217,119,6,0.3)',
            }}>Open in Maps →</a>
          </div>
          {/* Embedded Google Map */}
          <div style={{ margin:16, borderRadius:16, overflow:'hidden' }}>
            <div style={{ borderRadius:12, overflow:'hidden', minHeight:200, border:'1px solid var(--border-color)' }}>
              <div style={{ padding:10, fontSize:13, fontWeight:700, color:'var(--text-main)', background:'var(--bg-main)' }}>Location Map (SMV Kadalai Mittai)</div>
              <iframe
                title="SMV Kadalai Mittai Location"
                src="https://maps.google.com/maps?q=11.0980999,77.3517437&z=17&output=embed"
                width="100%" height="340" style={{ border:0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
            </div>
          </div>
        </div>
      </div>

      {/* ── WhatsApp floating button ── */}
      <a href="https://wa.me/919842263860" target="_blank" rel="noreferrer" style={{
        position:'fixed', bottom:28, right:28, zIndex:99,
        width:56, height:56, borderRadius:'50%',
        background:'#25D366', color:'#fff',
        display:'flex', alignItems:'center', justifyContent:'center',
        fontSize:26, textDecoration:'none',
        boxShadow:'0 4px 20px rgba(37,211,102,0.45)',
        animation:'floatY 3s ease-in-out infinite',
        transition:'transform 0.2s',
      }}
      onMouseOver={e=>e.currentTarget.style.transform='scale(1.12)'}
      onMouseOut={e=>e.currentTarget.style.transform='scale(1)'}
      title="Chat on WhatsApp">
        💬
      </a>

      {/* ── FAQ ── */}
      <FAQ />

      {/* ── Bottom CTA strip ── */}
      <div style={{
        background:'linear-gradient(135deg,#1C0C02,#3A1602)',
        padding:'48px 24px', textAlign:'center',
      }}>
        <h3 className="rsc-title" style={{ fontSize:28, color:'#fff', marginBottom:12 }}>Ready to place a bulk order?</h3>
        <p style={{ color:'rgba(255,255,255,0.6)', fontSize:15, marginBottom:24 }}>Call us directly or browse our full product catalogue.</p>
        <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
          <a href="tel:+919842263860" style={{
            background:'var(--saffron)', color:'#fff', borderRadius:50,
            padding:'12px 28px', fontWeight:700, fontSize:15, textDecoration:'none',
            boxShadow:'0 4px 18px rgba(217,119,6,0.4)', fontFamily:"'DM Sans',sans-serif",
          }}>📞 Call Now</a>
          <a href="/products" style={{
            background:'rgba(255,255,255,0.1)', color:'#fff', borderRadius:50,
            padding:'12px 28px', fontWeight:600, fontSize:15, textDecoration:'none',
            border:'1px solid rgba(255,255,255,0.2)', fontFamily:"'DM Sans',sans-serif",
          }}>Browse Products →</a>
        </div>
      </div>
    </div>
  );
};

export default Contact;