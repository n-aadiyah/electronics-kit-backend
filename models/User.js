const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// ✅ Compare plain password with hashed password
userSchema.methods.comparePassword = function (password) {
  const bcrypt = require('bcryptjs');
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
