const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Username and password are required' 
            });
        }

        // Find admin by username
        const admin = await Admin.findOne({ username });
        
        if (!admin) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }

        // Compare password
        const isMatch = await admin.comparePassword(password);
        
        if (!isMatch) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }

        res.json({ 
            success: true, 
            message: 'Login successful',
            admin: {
                id: admin._id,
                username: admin.username
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error during login' 
        });
    }
});

// Change Password
router.post('/change-password', async (req, res) => {
    try {
        const { username, currentPassword, newPassword } = req.body;

        if (!username || !currentPassword || !newPassword) {
            return res.status(400).json({ 
                success: false, 
                message: 'All fields are required' 
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ 
                success: false, 
                message: 'New password must be at least 6 characters' 
            });
        }

        // Find admin
        const admin = await Admin.findOne({ username });
        
        if (!admin) {
            return res.status(404).json({ 
                success: false, 
                message: 'Admin not found' 
            });
        }

        // Verify current password
        const isMatch = await admin.comparePassword(currentPassword);
        
        if (!isMatch) {
            return res.status(401).json({ 
                success: false, 
                message: 'Current password is incorrect' 
            });
        }

        // Update password
        admin.password = newPassword;
        await admin.save();

        res.json({ 
            success: true, 
            message: 'Password updated successfully' 
        });

    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error while changing password' 
        });
    }
});

// Update username and/or password
router.put('/update-credentials', async (req, res) => {
    try {
        const { currentUsername, currentPassword, newUsername, newPassword } = req.body;

        if (!currentUsername || !currentPassword) {
            return res.status(400).json({ 
                success: false, 
                message: 'Current username and password are required' 
            });
        }

        if (!newUsername && !newPassword) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide new username or new password' 
            });
        }

        if (newPassword && newPassword.length < 6) {
            return res.status(400).json({ 
                success: false, 
                message: 'New password must be at least 6 characters' 
            });
        }

        // Find admin
        const admin = await Admin.findOne({ username: currentUsername });
        
        if (!admin) {
            return res.status(404).json({ 
                success: false, 
                message: 'Admin not found' 
            });
        }

        // Verify current password
        const isMatch = await admin.comparePassword(currentPassword);
        
        if (!isMatch) {
            return res.status(401).json({ 
                success: false, 
                message: 'Current password is incorrect' 
            });
        }

        // Check if new username already exists (if changing username)
        if (newUsername && newUsername !== currentUsername) {
            const existingAdmin = await Admin.findOne({ username: newUsername });
            if (existingAdmin) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Username already exists' 
                });
            }
            admin.username = newUsername;
        }

        // Update password if provided
        if (newPassword) {
            admin.password = newPassword;
        }

        admin.updatedAt = Date.now();
        await admin.save();

        res.json({ 
            success: true, 
            message: 'Credentials updated successfully',
            admin: {
                id: admin._id,
                username: admin.username
            }
        });

    } catch (error) {
        console.error('Update credentials error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error while updating credentials' 
        });
    }
});

// Initialize default admin (run once)
router.post('/initialize', async (req, res) => {
    try {
        const adminCount = await Admin.countDocuments();
        
        if (adminCount > 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Admin already exists' 
            });
        }

        const defaultAdmin = new Admin({
            username: 'admin',
            password: 'admin123'
        });

        await defaultAdmin.save();

        res.json({ 
            success: true, 
            message: 'Default admin created successfully' 
        });

    } catch (error) {
        console.error('Initialize admin error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error while initializing admin' 
        });
    }
});

module.exports = router;
