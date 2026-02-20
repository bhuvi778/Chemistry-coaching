const mongoose = require('mongoose');
const Admin = require('./models/Admin');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/reaction-lab';

async function migrateAdminRoles() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Get all admins
        const admins = await Admin.find({});
        console.log(`Found ${admins.length} admin users`);

        for (const admin of admins) {
            // Set default role if not exists
            if (!admin.role) {
                admin.role = 'superadmin'; // Set first admin as superadmin
                console.log(`Setting ${admin.username} as superadmin`);
            }

            // Set default permissions if not exists
            if (!admin.permissions) {
                admin.permissions = {
                    canViewAllEnquiries: admin.role === 'superadmin',
                    canEditEnquiries: true,
                    canDeleteEnquiries: admin.role === 'superadmin',
                    canManageUsers: admin.role === 'superadmin'
                };
                console.log(`Setting permissions for ${admin.username}`);
            }

            await admin.save();
            console.log(`✅ Updated ${admin.username}`);
        }

        console.log('\n✅ Migration completed successfully!');
        console.log('\nAdmin Users:');
        const updatedAdmins = await Admin.find({});
        updatedAdmins.forEach(admin => {
            console.log(`- ${admin.username}: ${admin.role} (Can view all: ${admin.permissions.canViewAllEnquiries})`);
        });

    } catch (error) {
        console.error('❌ Migration failed:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\nDatabase connection closed');
    }
}

migrateAdminRoles();
