const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const ADMIN_FILE = path.join(__dirname, '../data/admin.json');

// Helper function to read admin data
const readAdminData = () => {
    try {
        if (!fs.existsSync(ADMIN_FILE)) {
            // Create default admin if file doesn't exist
            const defaultAdmin = {
                username: 'admin',
                password: bcrypt.hashSync('admin123', 10)
            };
            const dir = path.dirname(ADMIN_FILE);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(ADMIN_FILE, JSON.stringify(defaultAdmin, null, 2));
            return defaultAdmin;
        }
        const data = fs.readFileSync(ADMIN_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading admin data:', error);
        return null;
    }
};

// Helper function to write admin data
const writeAdminData = (data) => {
    try {
        const dir = path.dirname(ADMIN_FILE);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(ADMIN_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing admin data:', error);
        return false;
    }
};

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

        // Read admin from file
        const admin = readAdminData();
        
        if (!admin || admin.username !== username) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, admin.password);
        
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

        // Read admin from file
        const admin = readAdminData();
        
        if (!admin || admin.username !== currentUsername) {
            return res.status(404).json({ 
                success: false, 
                message: 'Admin not found' 
            });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, admin.password);
        
        if (!isMatch) {
            return res.status(401).json({ 
                success: false, 
                message: 'Current password is incorrect' 
            });
        }

        // Update username if provided
        if (newUsername) {
            admin.username = newUsername;
        }

        // Update password if provided
        if (newPassword) {
            admin.password = await bcrypt.hash(newPassword, 10);
        }

        // Save to file
        const saved = writeAdminData(admin);
        
        if (!saved) {
            return res.status(500).json({ 
                success: false, 
                message: 'Failed to save credentials' 
            });
        }

        res.json({ 
            success: true, 
            message: 'Credentials updated successfully',
            admin: {
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

module.exports = router;
