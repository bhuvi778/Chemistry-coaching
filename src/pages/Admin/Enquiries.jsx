import { useData } from '../../context/DataContext';

const Enquiries = () => {
  const { enquiries, contacts } = useData();

  return (
    <div className="space-y-8">
      {/* Callback Requests */}
      <div className="glass-panel p-6 rounded-xl">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <i className="fas fa-phone-alt text-cyan-400"></i> Callback Requests
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-gray-300">
            <thead className="text-xs uppercase bg-gray-800/50 text-gray-400">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Interest</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {enquiries.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-4 py-4 text-center text-gray-500">No enquiries yet</td>
                </tr>
              ) : (
                enquiries.map(enq => (
                  <tr key={enq._id} className="hover:bg-gray-800/30">
                    <td className="px-4 py-3 text-sm">{new Date(enq.date).toLocaleString()}</td>
                    <td className="px-4 py-3 font-bold text-white">{enq.name}</td>
                    <td className="px-4 py-3 text-cyan-400">{enq.phone}</td>
                    <td className="px-4 py-3 text-sm">{enq.course}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Contact Form Submissions */}
      <div className="glass-panel p-6 rounded-xl">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <i className="fas fa-envelope text-pink-400"></i> Contact Form Submissions
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-gray-300">
            <thead className="text-xs uppercase bg-gray-800/50 text-gray-400">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Target Exam</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {contacts.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-4 py-4 text-center text-gray-500">No contact submissions yet</td>
                </tr>
              ) : (
                contacts.map(contact => (
                  <tr key={contact._id} className="hover:bg-gray-800/30">
                    <td className="px-4 py-3 text-sm">{new Date(contact.date).toLocaleString()}</td>
                    <td className="px-4 py-3 font-bold text-white">{contact.name}</td>
                    <td className="px-4 py-3 text-cyan-400">{contact.phone}</td>
                    <td className="px-4 py-3 text-sm">{contact.exam}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Enquiries;