const Contact = require('../models/Contact');

let clearCache = () => {};
const setClearCacheFunction = (fn) => { clearCache = fn; };

const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(100)
      .lean()
      .exec();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createContact = async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    clearCache('contacts');
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteContact = async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    clearCache('contacts');
    res.json({ message: 'Contact deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getContacts, createContact, deleteContact, setClearCacheFunction };
