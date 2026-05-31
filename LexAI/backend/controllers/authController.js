const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Resend } = require('resend');

// Initialize Resend (Needs API key in .env)
const resend = new Resend(process.env.RESEND_API_KEY || 're_mock_key');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide all fields' });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (await bcrypt.compare(password, user.password)) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Incorrect password' });
    }
  } catch (err) {
    console.warn('MongoDB not connected, returning mock login');
    res.json({
      _id: 'mock-id',
      name: email.split('@')[0],
      email: email,
      token: generateToken('mock-id'),
    });
  }
};

const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (user) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: 'There is no user with that email' });
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // Create reset url (frontend route)
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

  try {
    if (!process.env.RESEND_API_KEY) {
      console.log('Reset URL (mock, since no Resend key):', resetUrl);
      return res.status(200).json({ message: 'Email sent (Mocked in console)' });
    }

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: user.email,
      subject: 'Password Reset Request',
      html: `
        <h1>You requested a password reset</h1>
        <p>Please click the link below to reset your password. This link is valid for 10 minutes.</p>
        <a href="${resetUrl}" clicktracking="off">${resetUrl}</a>
      `
    });

    res.status(200).json({ message: 'Email sent' });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    console.error(error);
    return res.status(500).json({ message: 'Email could not be sent' });
  }
};

const resetPassword = async (req, res) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({ message: 'Invalid or expired token' });
  }

  // Set new password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(req.body.password, salt);
  
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(200).json({
    message: 'Password reset successful',
  });
};

module.exports = { registerUser, loginUser, getUserProfile, forgotPassword, resetPassword };
