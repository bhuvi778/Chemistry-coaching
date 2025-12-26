const mongoose = require('mongoose');
const Admin = require('./models/Admin');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/test';

async function initializeAdmin() {
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('✅ Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ username: 'admin' });
        
        if (existingAdmin) {
            console.log('⚠️  Admin already exists');
            console.log('Username:', existingAdmin.username);
            process.exit(0);
        }

        // Create default admin
        const defaultAdmin = new Admin({
            username: 'admin',
            password: 'admin123'  // Will be hashed automatically by the model
        });

        await defaultAdmin.save();

        console.log('✅ Default admin created successfully');
        console.log('Username: admin');
        console.log('Password: admin123');
        console.log('⚠️  Please change these credentials after first login!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error initializing admin:', error);
        process.exit(1);
    }
}

initializeAdmin();
