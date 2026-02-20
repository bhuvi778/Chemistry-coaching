# Enquiry/Lead Permissions System - Setup Guide

## Issue Fixed
सभी users को सभी leads दिख रही थीं। अब permissions system implement किया गया है।
(All users could see all leads. Now permissions system is implemented.)

## What Changed

### 1. **Admin Model** - Role & Permissions Added
```javascript
role: 'superadmin' | 'admin' | 'user'
permissions: {
  canViewAllEnquiries: Boolean
  canEditEnquiries: Boolean
  canDeleteEnquiries: Boolean
  canManageUsers: Boolean
}
```

### 2. **Enquiry Model** - Assignment & Status Added
```javascript
assignedTo: String  // Username of assigned admin
status: 'new' | 'contacted' | 'follow-up' | 'converted' | 'closed'
```

### 3. **Controller Logic** - Filtering Based on Permissions
- **Superadmin**: Can see ALL enquiries
- **Admin with canViewAllEnquiries**: Can see ALL enquiries
- **Regular users**: Can only see:
  - Unassigned enquiries
  - Enquiries assigned to them

## Setup Instructions

### Step 1: Run Migration Script
This will add roles and permissions to existing admin users:

```bash
cd /www/wwwroot/reaction-lab/server
node migrate-admin-roles.js
```

This script will:
- Set the first admin as `superadmin` with full permissions
- Other admins will be set as `user` with limited permissions
- You can manually update roles later in the database

### Step 2: Verify Migration
Check the output to see all admin users and their roles:
```
Admin Users:
- admin: superadmin (Can view all: true)
- user1: user (Can view all: false)
```

### Step 3: Hard Refresh Browser
Clear cache and reload:
- Press `Ctrl + Shift + R` (Windows/Linux)
- Press `Cmd + Shift + R` (Mac)

## How It Works Now

### For Superadmins (role: 'superadmin')
✅ Can view ALL enquiries from all users
✅ Can manage all leads
✅ Full access to everything

### For Regular Users (role: 'user')
✅ Can view unassigned enquiries
✅ Can view enquiries assigned to them
❌ Cannot see enquiries assigned to other users

### Visual Indicators in UI
- **Status Badge**: Shows enquiry status (new, contacted, etc.)
- **Assigned To Badge**: Shows who the enquiry is assigned to
- **Permission Banner**: Explains current permission level

## Managing User Roles

### Update Admin Role Manually in Database

```javascript
// Connect to MongoDB
mongo

// Use database
use reaction-lab

// Update user to superadmin
db.admins.updateOne(
  { username: "username_here" },
  { 
    $set: { 
      role: "superadmin",
      "permissions.canViewAllEnquiries": true,
      "permissions.canEditEnquiries": true,
      "permissions.canDeleteEnquiries": true,
      "permissions.canManageUsers": true
    }
  }
)

// Update user to regular user
db.admins.updateOne(
  { username: "username_here" },
  { 
    $set: { 
      role: "user",
      "permissions.canViewAllEnquiries": false,
      "permissions.canEditEnquiries": true,
      "permissions.canDeleteEnquiries": false,
      "permissions.canManageUsers": false
    }
  }
)

// View all admins with roles
db.admins.find({}, { username: 1, role: 1, permissions: 1 })
```

## Assigning Enquiries to Users

### Option 1: Direct Database Update
```javascript
db.enquiries.updateOne(
  { _id: ObjectId("enquiry_id_here") },
  { 
    $set: { 
      assignedTo: "username",
      status: "contacted"
    }
  }
)
```

### Option 2: API Enhancement (Future)
Add an API endpoint to assign enquiries:
```javascript
// PUT /api/enquiries/:id/assign
{
  "assignedTo": "username",
  "status": "contacted"
}
```

## Testing the Permissions

### Test Case 1: Superadmin Login
1. Login as superadmin
2. Navigate to Enquiries page
3. Should see ALL enquiries from all users

### Test Case 2: Regular User Login
1. Login as regular user (not superadmin)
2. Navigate to Enquiries page
3. Should only see:
   - Unassigned enquiries
   - Enquiries assigned to this user

### Test Case 3: Assignment
1. Assign an enquiry to user1
2. Login as user2
3. User2 should NOT see that enquiry
4. Login as user1
5. User1 SHOULD see that enquiry

## Troubleshooting

### Issue: Still seeing all enquiries
**Solution**: 
1. Check browser localStorage for `admin_username`
2. Clear browser cache completely
3. Verify migration ran successfully
4. Check database: `db.admins.find({}, {username:1, role:1, permissions:1})`

### Issue: "Username required" error
**Solution**:
1. Logout and login again
2. Check if `localStorage.getItem('admin_username')` exists
3. May need to re-login to set username properly

### Issue: No enquiries showing
**Solution**:
1. Check if enquiries exist: `db.enquiries.countDocuments()`
2. Check user role and permissions
3. Verify API endpoint is being called with username parameter
4. Check browser console for errors

## Files Modified

### Backend
- ✅ `server/models/Admin.js` - Added role & permissions
- ✅ `server/models/Enquiry.js` - Added assignedTo & status
- ✅ `server/controllers/enquiryController.js` - Added filtering logic
- ✅ `server/migrate-admin-roles.js` - Migration script (NEW)

### Frontend
- ✅ `src/context/DataContext.jsx` - Pass username in API call
- ✅ `src/pages/Admin/Enquiries.jsx` - Show status & assignment

## Next Steps (Optional Enhancements)

1. **Add Assignment UI**: Allow superadmins to assign enquiries from the UI
2. **Status Management**: Add buttons to change enquiry status
3. **User Management Page**: UI to manage admin roles and permissions
4. **Activity Log**: Track who viewed/modified each enquiry
5. **Notifications**: Notify users when enquiries are assigned to them

## Support

किसी भी problem के लिए:
1. Check browser console for errors
2. Check server logs
3. Verify migration was successful
4. Test with different user roles
