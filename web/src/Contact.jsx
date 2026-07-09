import { useState } from 'react';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const handleChange = (field) => (event) => {
    setForm({ ...form, [field]: event.target.value });
    setError('');
  };

  const validate = () => {
    if (!form.name.trim()) return 'Please enter your name.';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Please enter a valid email.';
    if (!form.message.trim()) return 'Please enter a message.';
    return null;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validation = validate();
    if (validation) {
      setError(validation);
      return;
    }

    setStatus('sending');
    await new Promise((resolve) => setTimeout(resolve, 800));
    setStatus('sent');
  };

  return (
    <main className="flex-1 bg-[#fff8f0] text-[#1a0a00] px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <section className="mb-16 rounded-[30px] bg-[#fcf4ea] p-10 shadow-[0_20px_80px_rgba(0,0,0,0.08)] sm:p-14">
          <div className="mb-10 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#d4722f]">Get in touch</p>
            <h1 className="mt-4 text-4xl font-black sm:text-5xl">Contact Raja Snacks</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#6a4f3d]">
              Have a question about wholesale pricing, shipping, or our product range? Send us a message and our team will respond shortly.
            </p>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              <div className="rounded-3xl bg-white p-8 shadow-sm border border-[#f0e4d8]">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d4722f]">Customer support</p>
                <p className="mt-4 text-sm text-[#6a4f3d]">Email us at <a href="mailto:info@rajasnacks.com" className="font-semibold text-[#bf4e0c]">info@rajasnacks.com</a></p>
                <p className="mt-3 text-sm text-[#6a4f3d]">Call us at <a href="tel:+919876543210" className="font-semibold text-[#bf4e0c]">+91 98765 43210</a></p>
                <p className="mt-3 text-sm text-[#6a4f3d]">Monday to Saturday, 9:00 AM to 8:00 PM</p>
              </div>

              <div className="rounded-3xl bg-white p-8 shadow-sm border border-[#f0e4d8]">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d4722f]">Visit us</p>
                <p className="mt-4 text-sm leading-7 text-[#6a4f3d]">123 Market Street<br />Chennai – 600001</p>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6 rounded-3xl border border-[#f0e4d8] bg-white p-8 shadow-sm"
            >
              <div>
                <label className="mb-3 block text-sm font-semibold text-[#4a3728]">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={handleChange('name')}
                  placeholder="Your full name"
                  className="w-full rounded-2xl border border-[#e8d8cc] bg-[#fcf7f0] px-4 py-3 text-sm text-[#1a0a00] outline-none transition focus:border-[#e8621a] focus:ring-2 focus:ring-[#e8621a]/20"
                />
              </div>

              <div>
                <label className="mb-3 block text-sm font-semibold text-[#4a3728]">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={handleChange('email')}
                  placeholder="you@example.com"
                  className="w-full rounded-2xl border border-[#e8d8cc] bg-[#fcf7f0] px-4 py-3 text-sm text-[#1a0a00] outline-none transition focus:border-[#e8621a] focus:ring-2 focus:ring-[#e8621a]/20"
                />
              </div>

              <div>
                <label className="mb-3 block text-sm font-semibold text-[#4a3728]">Message</label>
                <textarea
                  value={form.message}
                  onChange={handleChange('message')}
                  rows={6}
                  placeholder="Tell us what you need"
                  className="w-full rounded-2xl border border-[#e8d8cc] bg-[#fcf7f0] px-4 py-3 text-sm text-[#1a0a00] outline-none transition focus:border-[#e8621a] focus:ring-2 focus:ring-[#e8621a]/20"
                />
              </div>

              {error && <p className="text-sm text-[#dc2626]">{error}</p>}
              {status === 'sent' && <p className="text-sm text-[#1f7d3f]">Your message has been sent. We will reply soon.</p>}

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-full bg-[#e8621a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#c14e0e]"
                disabled={status === 'sending' || status === 'sent'}
              >
                {status === 'sending' ? 'Sending...' : status === 'sent' ? 'Sent' : 'Send Message'}
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Contact;
