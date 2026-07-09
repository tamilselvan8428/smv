import express from 'express';
const router = express.Router();

// Admin login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    res.json({ 
      success: true, 
      message: 'Login successful',
      token: 'admin-token-' + Date.now() // Simple token for demo
    });
  } else {
    res.status(401).json({ 
      success: false, 
      message: 'Invalid credentials' 
    });
  }
});

export default router;
