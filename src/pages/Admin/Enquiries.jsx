import { useState } from 'react';
import { useData } from '../../context/DataContext';
import Pagination from '../../components/UI/Pagination';

const Enquiries = () => {
  const { enquiries, contacts, deleteEnquiry } = useData();
  const [currentPage, setCurrentPage] = useState(1);
  const [contactsPage, setContactsPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate pagination for enquiries
  const indexOfLastEnquiry = currentPage * itemsPerPage;
  const indexOfFirstEnquiry = indexOfLastEnquiry - itemsPerPage;
  const currentEnquiries = enquiries.slice(indexOfFirstEnquiry, indexOfLastEnquiry);
  const totalEnquiryPages = Math.ceil(enquiries.length / itemsPerPage);

  // Calculate pagination for contacts
  const indexOfLastContact = contactsPage * itemsPerPage;
  const indexOfFirstContact = indexOfLastContact - itemsPerPage;
  const currentContacts = contacts.slice(indexOfFirstContact, indexOfLastContact);
  const totalContactPages = Math.ceil(contacts.length / itemsPerPage);

  const handleDeleteEnquiry = async (id) => {
    if (window.confirm('Are you sure you want to delete this enquiry?')) {
      await deleteEnquiry(id);
    }
  };

  return (
    <div className="space-y-8">
      {/* Callback Requests */}
      <div className="glass-panel p-6 rounded-xl">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <i className="fas fa-phone-alt text-cyan-400"></i> Callback Requests
          <span className="text-sm font-normal text-gray-400 ml-auto">
            Showing {currentEnquiries.length} of {enquiries.length} enquiries
          </span>
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-gray-300">
            <thead className="text-xs uppercase bg-gray-800/50 text-gray-400">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Course</th>
                <th className="px-4 py-3">Message</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {currentEnquiries.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-4 text-center text-gray-500">No enquiries yet</td>
                </tr>
              ) : (
                currentEnquiries.map(enq => (
                  <tr key={enq._id} className="hover:bg-gray-800/30">
                    <td className="px-4 py-3 text-sm">{new Date(enq.date).toLocaleString()}</td>
                    <td className="px-4 py-3 font-bold text-white">{enq.name}</td>
                    <td className="px-4 py-3 text-cyan-400">{enq.phone}</td>
                    <td className="px-4 py-3 text-sm">{enq.email || '-'}</td>
                    <td className="px-4 py-3 text-sm">{enq.course}</td>
                    <td className="px-4 py-3 text-sm text-gray-400 max-w-xs truncate">{enq.message || '-'}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleDeleteEnquiry(enq._id)}
                        className="px-3 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500 hover:text-white transition text-sm"
                        title="Delete enquiry"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {totalEnquiryPages > 1 && (
          <div className="mt-6">
            <Pagination 
              currentPage={currentPage}
              totalPages={totalEnquiryPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* Contact Form Submissions */}
      <div className="glass-panel p-6 rounded-xl">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <i className="fas fa-envelope text-pink-400"></i> Contact Form Submissions
          <span className="text-sm font-normal text-gray-400 ml-auto">
            Showing {currentContacts.length} of {contacts.length} contacts
          </span>
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
              {currentContacts.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-4 py-4 text-center text-gray-500">No contact submissions yet</td>
                </tr>
              ) : (
                currentContacts.map(contact => (
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
        {totalContactPages > 1 && (
          <div className="mt-6">
            <Pagination 
              currentPage={contactsPage}
              totalPages={totalContactPages}
              onPageChange={setContactsPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Enquiries;