const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const sendEmail = require('../utils/email');

const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  });
};

router.post('/login', async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email/employee ID and password'
    });
  }

  try {
    const user = await User.findOne({
      $or: [
        { email: username.toLowerCase() },
        { employeeId: username.toUpperCase() }
      ]
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    if (user.status === 'Inactive') {
      return res.status(403).json({
        success: false,
        message: 'Your account is deactivated'
      });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const populatedUser = await User.findById(user._id).populate('department', 'name code');

    res.status(200).json({
      success: true,
      accessToken,
      user: {
        id: populatedUser._id,
        fullName: populatedUser.fullName,
        employeeId: populatedUser.employeeId,
        email: populatedUser.email,
        phone: populatedUser.phone,
        role: populatedUser.role,
        department: populatedUser.department,
        designation: populatedUser.designation,
        joiningDate: populatedUser.joiningDate,
        status: populatedUser.status,
        address: populatedUser.address || '',
        profilePhoto: populatedUser.profilePhoto,
        hasBiometrics: populatedUser.faceEmbeddings && populatedUser.faceEmbeddings.length > 0,
        faceEmbeddingsCount: populatedUser.faceEmbeddings ? populatedUser.faceEmbeddings.length : 0
      }
    });
  } catch (error) {
    next(error);
  }
});

router.post('/refresh', async (req, res, next) => {
  let refreshToken = req.cookies.refreshToken;

  if (!refreshToken && req.body.refreshToken) {
    refreshToken = req.body.refreshToken;
  }

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: 'Refresh token is missing'
    });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token user'
      });
    }

    if (user.status === 'Inactive') {
      return res.status(403).json({
        success: false,
        message: 'Your account is deactivated'
      });
    }

    const newAccessToken = generateAccessToken(user._id);

    res.status(200).json({
      success: true,
      accessToken: newAccessToken
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired refresh token'
    });
  }
});

router.get('/me', protect, async (req, res, next) => {
  try {
    const user = req.user;
    if (user.department && typeof user.populate === 'function') {
      await user.populate('department', 'name code');
    }
      
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        fullName: user.fullName,
        employeeId: user.employeeId,
        email: user.email,
        phone: user.phone,
        role: user.role,
        department: user.department,
        designation: user.designation,
        joiningDate: user.joiningDate,
        status: user.status,
        address: user.address || '',
        profilePhoto: user.profilePhoto,
        hasBiometrics: user.faceEmbeddings && user.faceEmbeddings.length > 0,
        faceEmbeddingsCount: user.faceEmbeddings ? user.faceEmbeddings.length : 0
      }
    });
  } catch (error) {
    next(error);
  }
});

router.post('/logout', protect, (req, res) => {
  res.clearCookie('refreshToken');
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});

// @route   POST /api/auth/forgot-password
// @desc    Generate OTP and send it via email for forgot password
// @access  Public
router.post('/forgot-password', async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a registered email address'
    });
  }

  try {
    const user = await User.findOne({
      email: email.toLowerCase()
    }).select('+resetPasswordOTP +resetPasswordOTPExpires');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No registered user found with this email address'
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash OTP using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp, salt);

    // Set hashed OTP and expiry (5 minutes)
    user.resetPasswordOTP = hashedOtp;
    user.resetPasswordOTPExpires = Date.now() + 5 * 60 * 1000;

    await user.save();

    // Send email with OTP
    const emailResult = await sendEmail({
      to: user.email,
      from: process.env.SMTP_FROM,
      subject: '[AttendanceHub] Password Reset Verification Code',
      text: `Your password reset verification code is ${otp}. This code is valid for 5 minutes.`,
      html: `<div style="font-family: Arial, sans-serif; padding: 24px; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
        <h2 style="color: #4f46e5; margin-top: 0; font-size: 20px;">Verification Code</h2>
        <p style="font-size: 14px; color: #334155; line-height: 1.6;">
          You requested to reset your password. Use the following 6-digit verification code to proceed:
        </p>
        <div style="background-color: #f1f5f9; padding: 16px; border-radius: 12px; text-align: center; margin: 24px 0;">
          <span style="font-size: 28px; font-weight: 800; letter-spacing: 6px; color: #1e1b4b;">${otp}</span>
        </div>
        <p style="font-size: 12px; color: #64748b;">
          This code is valid for 5 minutes. If you did not request a password reset, please ignore this email.
        </p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;"/>
        <p style="font-size: 11px; color: #94a3b8; margin: 0;">Sent by Support Team (support@gmail.com) • AttendanceHub</p>
      </div>`
    });

    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: `Failed to send verification email: ${emailResult.error}`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Verification code sent to registered email address.'
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/auth/verify-otp
// @desc    Verify OTP code
// @access  Public
router.post('/verify-otp', async (req, res, next) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email and verification code'
    });
  }

  try {
    const user = await User.findOne({
      email: email.toLowerCase()
    }).select('+resetPasswordOTP +resetPasswordOTPExpires');

    if (!user || !user.resetPasswordOTP || !user.resetPasswordOTPExpires) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification code'
      });
    }

    // Check expiry
    if (user.resetPasswordOTPExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'Verification code has expired'
      });
    }

    // Compare hashed OTP
    const isMatch = await bcrypt.compare(otp, user.resetPasswordOTP);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Code verified successfully.'
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/auth/reset-password
// @desc    Reset password using OTP code
// @access  Public
router.post('/reset-password', async (req, res, next) => {
  const { email, otp, password } = req.body;

  if (!email || !otp || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email, verification code, and new password'
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters'
    });
  }

  try {
    const user = await User.findOne({
      email: email.toLowerCase()
    }).select('+password +resetPasswordOTP +resetPasswordOTPExpires');

    if (!user || !user.resetPasswordOTP || !user.resetPasswordOTPExpires) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification code'
      });
    }

    // Check expiry
    if (user.resetPasswordOTPExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'Verification code has expired'
      });
    }

    // Compare hashed OTP
    const isMatch = await bcrypt.compare(otp, user.resetPasswordOTP);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code'
      });
    }

    // Set new password (pre-save hook will hash it)
    user.password = password;
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpires = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully. You can now login.'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
