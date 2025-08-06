require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.log("🧪 Raw Authorization Header:", authHeader);

  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header missing' });
  }

  const tokenParts = authHeader.split(' ');

  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Malformed Authorization header' });
  }

  const token = tokenParts[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Optional: Verify that the user exists in the database
    const user = await User.findById(decoded.id); // Use decoded.id if you signed with { id: user._id }
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user; // Attach the full user object if needed
    next();
  } catch (err) {
    console.error("❌ JWT Verification Failed:", err.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;
