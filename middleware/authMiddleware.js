require('dotenv').config();
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.log("🧪 Raw Authorization Header:", authHeader); // will show null if missing

  // ✅ Handle missing header completely
  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header missing' });
  }

  // ✅ Now safely split
  const tokenParts = authHeader.split(' ');

  // Must be ["Bearer", "token"]
  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Malformed Authorization header' });
  }

  const token = tokenParts[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.user = decoded.userId;    next();
  } catch (err) {
    console.error("❌ JWT Verification Failed:", err.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;
