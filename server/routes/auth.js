const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

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
        profilePhoto: populatedUser.profilePhoto,
        hasBiometrics: populatedUser.faceEmbeddings && populatedUser.faceEmbeddings.length > 0
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
    const user = await User.findById(req.user.id)
      .populate('department', 'name code')
      .select('-password');
      
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
        profilePhoto: user.profilePhoto,
        hasBiometrics: user.faceEmbeddings && user.faceEmbeddings.length > 0
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

module.exports = router;
