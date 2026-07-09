import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

// SMTP Transporter Helper
async function createTransporter() {
  const ports = [587, 2525, 465, 25];
  for (const port of ports) {
    try {
      const t = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port,
        secure: port === 465,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
        tls: { rejectUnauthorized: false },
        connectionTimeout: 8000,
        greetingTimeout: 8000,
        socketTimeout: 8000,
      });
      await t.verify();
      console.log(`✅ SMTP connected on port ${port}`);
      return t;
    } catch (err) {
      console.log(`❌ Port ${port} failed: ${err.message}`);
    }
  }
  return null;
}

// POST /api/contact
router.post('/', async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'Name, email and message are required.' });
  }

  try {
    const transporter = await createTransporter();

    if (!transporter) {
      // All SMTP ports blocked — save to DB and notify via alternative
      console.error('All SMTP ports blocked. Saving enquiry to DB instead.');
      // Still return success to user — you'll see it in MongoDB
      await saveEnquiryToDB({ name, email, phone, subject, message });
      return res.json({
        success: true,
        message: 'Enquiry saved. Email delivery unavailable on this network.',
        savedToDB: true,
      });
    }

    const ownerHtml = buildOwnerEmail({ name, email, phone, subject, message });
    const replyHtml = buildReplyEmail({ name, email, phone, message });

    await transporter.sendMail({
      from: `"Raja Snacks Contact" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_RECEIVER,
      replyTo: email,
      subject: `📬 New Enquiry: ${subject || 'General'} — ${name}`,
      html: ownerHtml,
    });

    await transporter.sendMail({
      from: `"Raja Snacks" <${process.env.MAIL_USER}>`,
      to: email,
      subject: `✅ We received your message, ${name.split(' ')[0]}!`,
      html: replyHtml,
    });

    res.json({ success: true, message: 'Email sent successfully.' });

  } catch (err) {
    console.error('Mail error:', err);
    res.status(500).json({ success: false, error: 'Failed to send email.' });
  }
});

// POST /api/contact/enquiry
router.post('/enquiry', async (req, res) => {
  const { name, phone, qty, message, productName } = req.body;

  if (!name || !phone || !productName) {
    return res.status(400).json({ success: false, error: 'Name, phone and product name are required.' });
  }

  try {
    const transporter = await createTransporter();
    const ownerHtml = buildOwnerEnquiryEmail({ name, phone, qty, message, productName });

    if (!transporter) {
      console.error('All SMTP ports blocked. Saving product enquiry to DB instead.');
      await saveEnquiryToDB({
        name,
        phone,
        email: 'N/A',
        subject: `🛍️ Product Enquiry: ${productName}`,
        message: `Qty: ${qty || 'N/A'}\nRequirements: ${message || 'N/A'}`
      });
      return res.json({
        success: true,
        message: 'Enquiry saved. Email delivery unavailable on this network.',
        savedToDB: true,
      });
    }

    await transporter.sendMail({
      from: `"Raja Snacks Product Enquiry" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_RECEIVER,
      subject: `🛍️ New Product Enquiry: ${productName} — ${name}`,
      html: ownerHtml,
    });

    res.json({ success: true, message: 'Enquiry sent successfully.' });

  } catch (err) {
    console.error('Mail error:', err);
    res.status(500).json({ success: false, error: 'Failed to send enquiry email.' });
  }
});

/* ─── Save to MongoDB when SMTP is unavailable ─── */
async function saveEnquiryToDB({ name, email, phone, subject, message }) {
  try {
    const { default: mongoose } = await import('mongoose');
    const schema = new mongoose.Schema({
      name: String, email: String, phone: String,
      subject: String, message: String, createdAt: { type: Date, default: Date.now },
    });
    const Enquiry = mongoose.models.Enquiry || mongoose.model('Enquiry', schema);
    await Enquiry.create({ name, email, phone, subject, message });
    console.log('✅ Enquiry saved to MongoDB');
  } catch (e) {
    console.error('DB save failed:', e.message);
  }
}

/* ─── Email templates ─── */
function buildOwnerEmail({ name, email, phone, subject, message }) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.1);">
      <div style="background:linear-gradient(135deg,#BF4E0C,#E8621A,#F97C35);padding:32px 36px;">
        <div style="font-size:22px;font-weight:800;color:#fff;">🥜 Raja Snacks</div>
        <h2 style="color:#fff;margin:8px 0 0;font-size:18px;opacity:0.9;">New Contact Form Submission</h2>
      </div>
      <div style="padding:32px 36px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:10px 0;border-bottom:1px solid #F0E4D8;width:120px;font-size:12px;font-weight:700;color:#9A8070;text-transform:uppercase;">Name</td><td style="padding:10px 0;border-bottom:1px solid #F0E4D8;font-size:15px;font-weight:600;color:#1A0A00;">${name}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #F0E4D8;font-size:12px;font-weight:700;color:#9A8070;text-transform:uppercase;">Email</td><td style="padding:10px 0;border-bottom:1px solid #F0E4D8;"><a href="mailto:${email}" style="color:#E8621A;">${email}</a></td></tr>
          ${phone ? `<tr><td style="padding:10px 0;border-bottom:1px solid #F0E4D8;font-size:12px;font-weight:700;color:#9A8070;text-transform:uppercase;">Phone</td><td style="padding:10px 0;border-bottom:1px solid #F0E4D8;"><a href="tel:${phone}" style="color:#E8621A;">${phone}</a></td></tr>` : ''}
          ${subject ? `<tr><td style="padding:10px 0;border-bottom:1px solid #F0E4D8;font-size:12px;font-weight:700;color:#9A8070;text-transform:uppercase;">Subject</td><td style="padding:10px 0;border-bottom:1px solid #F0E4D8;font-size:15px;color:#1A0A00;">${subject}</td></tr>` : ''}
          <tr><td style="padding:10px 0;vertical-align:top;font-size:12px;font-weight:700;color:#9A8070;text-transform:uppercase;">Message</td><td style="padding:10px 0;"><div style="background:#FFF8F0;border-left:3px solid #E8621A;padding:14px 16px;border-radius:0 8px 8px 0;font-size:15px;color:#4A3728;line-height:1.7;">${message.replace(/\n/g, '<br/>')}</div></td></tr>
        </table>
        <div style="margin-top:24px;padding:14px 18px;background:#FFF0E6;border-radius:10px;font-size:13px;color:#7A6358;">
          💡 Hit <strong>Reply</strong> to respond directly to ${name} at ${email}
        </div>
      </div>
      <div style="background:#F5F0EB;padding:16px 36px;text-align:center;font-size:12px;color:#C8B8A8;">© ${new Date().getFullYear()} Raja Snacks • Tiruppur, Tamil Nadu</div>
    </div>`;
}

function buildReplyEmail({ name, email, message }) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#BF4E0C,#E8621A,#F97C35);padding:32px 36px;text-align:center;">
        <div style="font-size:40px;margin-bottom:10px;">🥜</div>
        <h1 style="color:#fff;margin:0;font-size:24px;">Raja Snacks</h1>
        <p style="color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:13px;">Wholesale Snacks Supplier, Tiruppur</p>
      </div>
      <div style="padding:36px;">
        <h2 style="color:#1A0A00;margin:0 0 14px;font-size:20px;">Thanks for reaching out, ${name.split(' ')[0]}! 👋</h2>
        <p style="color:#7A6358;font-size:15px;line-height:1.7;margin:0 0 16px;">We've received your message and will get back to you within <strong>24 hours</strong>.</p>
        <div style="background:#FFF8F0;border-radius:12px;padding:16px 18px;margin:18px 0;border-left:3px solid #E8621A;">
          <p style="font-size:11px;font-weight:700;color:#9A8070;text-transform:uppercase;margin:0 0 8px;">Your message</p>
          <p style="font-size:14px;color:#4A3728;line-height:1.6;margin:0;">${message.replace(/\n/g, '<br/>')}</p>
        </div>
        <p style="color:#7A6358;font-size:14px;margin:0 0 22px;">Need urgent help? Call us: <a href="tel:+919842263860" style="color:#E8621A;font-weight:700;">+91 98422 63860</a></p>
        <a href="http://localhost:5173/products" style="display:inline-block;background:linear-gradient(135deg,#F97C35,#C14E0E);color:#fff;border-radius:50px;padding:12px 28px;font-size:14px;font-weight:700;text-decoration:none;">Browse Our Products →</a>
      </div>
      <div style="background:#F5F0EB;padding:14px 36px;text-align:center;font-size:12px;color:#C8B8A8;">© ${new Date().getFullYear()} Raja Snacks • KSC School Road, Tiruppur 641604</div>
    </div>`;
}

function buildOwnerEnquiryEmail({ name, phone, qty, message, productName }) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.1);">
      <div style="background:linear-gradient(135deg,#BF4E0C,#E8621A,#F97C35);padding:32px 36px;">
        <div style="font-size:22px;font-weight:800;color:#fff;">🥜 Raja Snacks</div>
        <h2 style="color:#fff;margin:8px 0 0;font-size:18px;opacity:0.9;">New Product Enquiry</h2>
      </div>
      <div style="padding:32px 36px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:10px 0;border-bottom:1px solid #F0E4D8;width:150px;font-size:12px;font-weight:700;color:#9A8070;text-transform:uppercase;">Product Name</td><td style="padding:10px 0;border-bottom:1px solid #F0E4D8;font-size:16px;font-weight:700;color:#E8621A;">${productName}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #F0E4D8;font-size:12px;font-weight:700;color:#9A8070;text-transform:uppercase;">Customer Name</td><td style="padding:10px 0;border-bottom:1px solid #F0E4D8;font-size:15px;font-weight:600;color:#1A0A00;">${name}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #F0E4D8;font-size:12px;font-weight:700;color:#9A8070;text-transform:uppercase;">Phone Number</td><td style="padding:10px 0;border-bottom:1px solid #F0E4D8;"><a href="tel:${phone}" style="color:#E8621A;">${phone}</a></td></tr>
          ${qty ? `<tr><td style="padding:10px 0;border-bottom:1px solid #F0E4D8;font-size:12px;font-weight:700;color:#9A8070;text-transform:uppercase;">Quantity Needed</td><td style="padding:10px 0;border-bottom:1px solid #F0E4D8;font-size:15px;color:#1A0A00;font-weight:600;">${qty}</td></tr>` : ''}
          ${message ? `<tr><td style="padding:10px 0;vertical-align:top;font-size:12px;font-weight:700;color:#9A8070;text-transform:uppercase;">Requirements</td><td style="padding:10px 0;"><div style="background:#FFF8F0;border-left:3px solid #E8621A;padding:14px 16px;border-radius:0 8px 8px 0;font-size:15px;color:#4A3728;line-height:1.7;">${message.replace(/\n/g, '<br/>')}</div></td></tr>` : ''}
        </table>
      </div>
      <div style="background:#F5F0EB;padding:16px 36px;text-align:center;font-size:12px;color:#C8B8A8;">© ${new Date().getFullYear()} Raja Snacks • Tiruppur, Tamil Nadu</div>
    </div>`;
}

export default router;