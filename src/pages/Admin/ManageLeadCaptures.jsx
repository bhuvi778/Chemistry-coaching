import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'https://ace2examz.com/api';

const ManageLeadCaptures = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popupSettings, setPopupSettings] = useState({ isActive: true, delaySeconds: 45 });
  const [savingSettings, setSavingSettings] = useState(false);
  const [search, setSearch] = useState('');
  const [delayInput, setDelayInput] = useState(45);

  useEffect(() => {
    fetchLeads();
    fetchSettings();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/lead-capture/leads`);
      setLeads(res.data || []);
    } catch {
      toast.error('Failed to fetch student information');
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await axios.get(`${API_URL}/lead-capture/settings`);
      setPopupSettings(res.data);
      setDelayInput(res.data.delaySeconds || 45);
    } catch {
      // ignore
    }
  };

  const handleTogglePopup = async (active) => {
    setSavingSettings(true);
    try {
      const res = await axios.put(`${API_URL}/lead-capture/settings`, {
        isActive: active,
        delaySeconds: delayInput
      });
      setPopupSettings(res.data);
      toast.success(active ? 'Popup activated' : 'Popup deactivated');
    } catch {
      toast.error('Failed to update popup settings');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleSaveDelay = async () => {
    const d = parseInt(delayInput, 10);
    if (isNaN(d) || d < 5) {
      toast.error('Delay must be at least 5 seconds');
      return;
    }
    setSavingSettings(true);
    try {
      const res = await axios.put(`${API_URL}/lead-capture/settings`, {
        isActive: popupSettings.isActive,
        delaySeconds: d
      });
      setPopupSettings(res.data);
      toast.success('Delay saved');
    } catch {
      toast.error('Failed to save delay');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this entry?')) return;
    try {
      await axios.delete(`${API_URL}/lead-capture/leads/${id}`);
      setLeads(prev => prev.filter(l => l._id !== id));
      toast.success('Deleted');
    } catch {
      toast.error('Delete failed');
    }
  };

  const filtered = leads.filter(l =>
    l.name?.toLowerCase().includes(search.toLowerCase()) ||
    l.whatsapp?.includes(search) ||
    l.email?.toLowerCase().includes(search.toLowerCase()) ||
    l.exam?.toLowerCase().includes(search.toLowerCase()) ||
    l.classLevel?.toLowerCase().includes(search.toLowerCase())
  );

  const exportCSV = () => {
    const header = ['Name', 'WhatsApp', 'Email', 'Class', 'Exam', 'Date'];
    const rows = filtered.map(l => [
      l.name, l.whatsapp, l.email || '', l.classLevel, l.exam,
      new Date(l.createdAt).toLocaleDateString('en-IN')
    ]);
    const csv = [header, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `student-leads-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Student Information</h2>
        <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm font-medium">
          {leads.length} submissions
        </span>
      </div>

      {/* Popup Settings Card */}
      <div className="glass-panel rounded-xl p-5 border border-gray-700/50">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <i className="fas fa-sliders-h text-cyan-400" />
          Popup Settings
        </h3>

        <div className="flex flex-wrap gap-6 items-end">
          {/* Active / Inactive Toggle */}
          <div>
            <p className="text-xs text-gray-400 mb-2">Popup Status</p>
            <div className="flex gap-3">
              <button
                onClick={() => handleTogglePopup(true)}
                disabled={savingSettings}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                  popupSettings.isActive
                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/20'
                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                }`}
              >
                <i className="fas fa-check-circle mr-1" /> Active
              </button>
              <button
                onClick={() => handleTogglePopup(false)}
                disabled={savingSettings}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                  !popupSettings.isActive
                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/20'
                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                }`}
              >
                <i className="fas fa-times-circle mr-1" /> Inactive
              </button>
            </div>
          </div>

          {/* Delay setting */}
          <div>
            <p className="text-xs text-gray-400 mb-2">Show After (seconds)</p>
            <div className="flex gap-2">
              <input
                type="number"
                min={5}
                max={300}
                value={delayInput}
                onChange={e => setDelayInput(e.target.value)}
                className="w-24 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-400"
              />
              <button
                onClick={handleSaveDelay}
                disabled={savingSettings}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold rounded-lg text-sm transition disabled:opacity-50"
              >
                Save
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Current: {popupSettings.delaySeconds}s</p>
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="glass-panel rounded-xl p-5 border border-gray-700/50">
        <div className="flex flex-wrap gap-3 items-center justify-between mb-4">
          <input
            type="text"
            placeholder="Search by name, number, exam..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 min-w-[200px] px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-cyan-400"
          />
          <button
            onClick={exportCSV}
            className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-semibold transition flex items-center gap-2"
          >
            <i className="fas fa-download" /> Export CSV
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <i className="fas fa-inbox text-4xl mb-3 block opacity-40" />
            {search ? 'No matching results' : 'No submissions yet'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-3 text-gray-400 font-medium">#</th>
                  <th className="text-left py-3 px-3 text-gray-400 font-medium">Name</th>
                  <th className="text-left py-3 px-3 text-gray-400 font-medium">WhatsApp</th>
                  <th className="text-left py-3 px-3 text-gray-400 font-medium">Email</th>
                  <th className="text-left py-3 px-3 text-gray-400 font-medium">Class</th>
                  <th className="text-left py-3 px-3 text-gray-400 font-medium">Exam</th>
                  <th className="text-left py-3 px-3 text-gray-400 font-medium">Date</th>
                  <th className="text-left py-3 px-3 text-gray-400 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((lead, idx) => (
                  <tr key={lead._id} className="border-b border-gray-800 hover:bg-gray-800/40 transition">
                    <td className="py-3 px-3 text-gray-500">{idx + 1}</td>
                    <td className="py-3 px-3 text-white font-medium">{lead.name}</td>
                    <td className="py-3 px-3">
                      <a
                        href={`https://wa.me/91${lead.whatsapp}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-green-400 hover:text-green-300 font-mono"
                      >
                        {lead.whatsapp}
                      </a>
                    </td>
                    <td className="py-3 px-3 text-gray-300">{lead.email || '—'}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded text-xs">
                        {lead.classLevel}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded text-xs">
                        {lead.exam}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-gray-400 text-xs whitespace-nowrap">
                      {new Date(lead.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric'
                      })}
                    </td>
                    <td className="py-3 px-3">
                      <button
                        onClick={() => handleDelete(lead._id)}
                        className="px-3 py-1 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded text-xs transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageLeadCaptures;
