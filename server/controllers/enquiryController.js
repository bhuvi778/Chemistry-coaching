const Enquiry = require('../models/Enquiry');

let clearCache = () => {};
const setClearCacheFunction = (fn) => { clearCache = fn; };

const getEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find()
      .sort({ createdAt: -1 })
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
