require('dotenv').config();
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  if (!process.env.JWT_SECRET) {
    console.warn("⚠️ JWT_SECRET is not defined in .env file.");
    return res.status(500).json({ error: 'Server config error' });
  }

  try {
    console.log("🔐 Received Token:", token);
    console.log("🔑 JWT_SECRET in middleware:", process.env.JWT_SECRET);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Decoded Token Payload:", decoded);

    req.user = decoded; // Attach decoded user payload to the request
    next();
  } catch (err) {
    console.error("❌ Token verification failed:", err.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;
