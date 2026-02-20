const Enquiry = require('../models/Enquiry');
const Admin = require('../models/Admin');

let clearCache = () => {};
const setClearCacheFunction = (fn) => { clearCache = fn; };

const getEnquiries = async (req, res) => {
  try {
    const { username } = req.query; // Get username from query params
    
    if (!username) {
      return res.status(400).json({ message: 'Username required' });
    }

    // Get admin details to check permissions
    const admin = await Admin.findOne({ username });
    
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    let query = {};

    // Superadmin and users with canViewAllEnquiries permission can see all
    if (admin.role === 'superadmin' || admin.permissions?.canViewAllEnquiries) {
      // No filter - return all enquiries
      query = {};
    } else {
      // Regular users can only see enquiries assigned to them or unassigned
      query = {
        $or: [
          { assignedTo: username },
          { assignedTo: null },
          { assignedTo: { $exists: false } }
        ]
      };
    }

    const enquiries = await Enquiry.find(query)
      .sort({ date: -1 })
      .limit(100)
      .lean()
      .exec();
      
    res.json(enquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createEnquiry = async (req, res) => {
  try {
    const enquiry = new Enquiry(req.body);
    await enquiry.save();
    clearCache('enquiries');
    res.json(enquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteEnquiry = async (req, res) => {
  try {
    await Enquiry.findByIdAndDelete(req.params.id);
    clearCache('enquiries');
    res.json({ message: 'Enquiry deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getEnquiries, createEnquiry, deleteEnquiry, setClearCacheFunction };
