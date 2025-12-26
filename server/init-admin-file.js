const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const hash = bcrypt.hashSync('admin123', 10);
const admin = { username: 'admin', password: hash };
const dir = path.join(__dirname, 'data');

if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(path.join(dir, 'admin.json'), JSON.stringify(admin, null, 2));
console.log('✅ Admin file created with default credentials');
console.log('Username: admin');
console.log('Password: admin123');
