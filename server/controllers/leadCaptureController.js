const LeadCapture = require('../models/LeadCapture');
const PopupSettings = require('../models/PopupSettings');

// ── Lead Captures ────────────────────────────────────────────────────────────

const getLeads = async (req, res) => {
  try {
    const leads = await LeadCapture.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    console.error('getLeads error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const createLead = async (req, res) => {
  try {
    const { name, whatsapp, email, classLevel, exam } = req.body;
    if (!name || !whatsapp || !classLevel || !exam) {
      return res.status(400).json({ message: 'name, whatsapp, classLevel and exam are required' });
    }
    const lead = await LeadCapture.create({ name, whatsapp, email, classLevel, exam });
    res.status(201).json(lead);
  } catch (err) {
    console.error('createLead error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteLead = async (req, res) => {
  try {
    await LeadCapture.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('deleteLead error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ── Popup Settings ───────────────────────────────────────────────────────────

const getPopupSettings = async (req, res) => {
  try {
    let settings = await PopupSettings.findOne();
    if (!settings) {
      settings = await PopupSettings.create({});
    }
    res.json(settings);
  } catch (err) {
    console.error('getPopupSettings error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updatePopupSettings = async (req, res) => {
  try {
    const { isActive, delaySeconds } = req.body;
    let settings = await PopupSettings.findOne();
    if (!settings) {
      settings = new PopupSettings({});
    }
    if (typeof isActive === 'boolean') settings.isActive = isActive;
    if (typeof delaySeconds === 'number' && delaySeconds > 0) settings.delaySeconds = delaySeconds;
    settings.updatedAt = new Date();
    await settings.save();
    res.json(settings);
  } catch (err) {
    console.error('updatePopupSettings error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getLeads, createLead, deleteLead, getPopupSettings, updatePopupSettings };
