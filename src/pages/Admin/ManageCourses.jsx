import { useState } from 'react';
import { useData } from '../../context/DataContext';
import Pagination from '../../components/UI/Pagination';

const ManageCourses = () => {
  const { courses, addCourse, updateCourse, deleteCourse } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  
  const initialFormState = {
    title: '',
    subtitle: '',
    desc: '',
    price: '',
    duration: '',
    schedule: '',
    features: '',
    color: 'cyan',
    icon: 'fa-flask',
    badge: '',
    category: 'JEE', // Exam category
    categories: [] // Program type categories
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleEdit = (course) => {
    setIsEditing(true);
    setCurrentCourse(course);
    setFormData({
      ...course,
      features: course.features.join(', '),
      category: course.category || 'JEE',
      categories: course.categories || [],
      price: course.price || '',
      duration: course.duration || '',
      schedule: course.schedule || ''
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      deleteCourse(id);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const courseData = {
      ...formData,
      features: formData.features.split(',').map(f => f.trim()),
      categories: Array.isArray(formData.categories) ? formData.categories : []
    };

    try {
      if (isEditing) {
        await updateCourse(currentCourse._id, courseData);
        alert('Course updated successfully!');
      } else {
        await addCourse(courseData);
        alert('Course added successfully!');
      }

      setIsEditing(false);
      setCurrentCourse(null);
      setFormData(initialFormState);
    } catch (error) {
      console.error('Error submitting course:', error);
    }
  };

  const toggleCategory = (cat) => {
    const cats = formData.categories || [];
    if (cats.includes(cat)) {
      setFormData({ ...formData, categories: cats.filter(c => c !== cat) });
    } else {
      setFormData({ ...formData, categories: [...cats, cat] });
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(courses.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCourses = courses.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="space-y-8">
      <div className="glass-panel p-6 rounded-xl">
        <h2 className="text-xl font-bold text-white mb-4">{isEditing ? 'Edit Course' : 'Add New Course'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Course Title"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
              required
            />
            <input
              type="text"
              placeholder="Subtitle"
              value={formData.subtitle}
              onChange={e => setFormData({...formData, subtitle: e.target.value})}
              className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
              required
            />
          </div>
          <textarea
            placeholder="Description"
            value={formData.desc}
            onChange={e => setFormData({...formData, desc: e.target.value})}
            className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full h-24"
            required
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Price (e.g., ₹45,000)"
              value={formData.price}
              onChange={e => setFormData({...formData, price: e.target.value})}
              className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
              required
            />
            <input
              type="text"
              placeholder="Duration (e.g., 1 Year)"
              value={formData.duration}
              onChange={e => setFormData({...formData, duration: e.target.value})}
              className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
            />
            <input
              type="text"
              placeholder="Schedule (e.g., Mon-Fri)"
              value={formData.schedule}
              onChange={e => setFormData({...formData, schedule: e.target.value})}
              className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
            />
          </div>
          <input
            type="text"
            placeholder="Features (comma separated)"
            value={formData.features}
            onChange={e => setFormData({...formData, features: e.target.value})}
            className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
            required
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
              className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
            >
              <option value="">Select Exam Category</option>
              <option value="JEE">JEE</option>
              <option value="NEET">NEET</option>
              <option value="IAT">IAT</option>
              <option value="NEST">NEST</option>
              <option value="CSIR NET">CSIR NET</option>
              <option value="GATE">GATE</option>
              <option value="IIT JAM">IIT JAM</option>
              <option value="TIFR">TIFR</option>
            </select>
            <select
              value={formData.color}
              onChange={e => setFormData({...formData, color: e.target.value})}
              className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
            >
              <option value="cyan">Cyan</option>
              <option value="pink">Pink</option>
              <option value="purple">Purple</option>
              <option value="green">Green</option>
              <option value="yellow">Yellow</option>
              <option value="blue">Blue</option>
              <option value="red">Red</option>
              <option value="indigo">Indigo</option>
            </select>
            <input
              type="text"
              placeholder="Icon Class (e.g., fa-flask)"
              value={formData.icon}
              onChange={e => setFormData({...formData, icon: e.target.value})}
              className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
            />
          </div>
          <input
            type="text"
            placeholder="Badge Text (Optional)"
            value={formData.badge}
            onChange={e => setFormData({...formData, badge: e.target.value})}
            className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
          />
          
          <div>
            <label className="block text-gray-400 mb-2 font-semibold">
              <i className="fas fa-graduation-cap mr-2 text-cyan-400"></i>
              Exam Category:
            </label>
            <div className="bg-gray-800/50 rounded-lg p-3 mb-4">
              <span className="text-white font-semibold">
                {formData.category || 'Not Selected'}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-gray-400 mb-2 font-semibold">
              <i className="fas fa-filter mr-2 text-cyan-400"></i>
              Program Type Categories (Select all that apply):
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {['live-batch', 'recorded', '1-1-tutoring', 'mentorship', 'doubt-solver', 'test-series'].map(cat => (
                <label key={cat} className="flex items-center gap-2 text-white cursor-pointer hover:text-cyan-400 transition">
                  <input
                    type="checkbox"
                    checked={(formData.categories || []).includes(cat)}
                    onChange={() => toggleCategory(cat)}
                    className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-cyan-500 focus:ring-cyan-400"
                  />
                  <span className="text-sm">
                    {cat === 'live-batch' && 'Live Batch'}
                    {cat === 'recorded' && 'Recorded'}
                    {cat === '1-1-tutoring' && '1-1 Tutoring'}
                    {cat === 'mentorship' && 'Mentorship'}
                    {cat === 'doubt-solver' && 'Doubt Solver'}
                    {cat === 'test-series' && 'Test Series'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <button type="submit" className="bg-cyan-500 text-black font-bold py-2 px-6 rounded hover:bg-cyan-400 transition">
              {isEditing ? 'Update Course' : 'Add Course'}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setCurrentCourse(null);
                  setFormData(initialFormState);
                }}
                className="bg-gray-700 text-white font-bold py-2 px-6 rounded hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {courses.length > 0 && (
        <div className="mb-4 text-gray-400">
          Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, courses.length)} of {courses.length} courses
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {currentCourses.map(course => (
          <div key={course._id} className="glass-panel p-4 rounded-xl flex justify-between items-center">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white">{course.title}</h3>
              <p className="text-sm text-gray-400">{course.subtitle}</p>
              <div className="flex gap-2 mt-2 flex-wrap">
                {course.category && (
                  <span className="px-3 py-1 bg-pink-900/50 border border-pink-500 text-pink-400 rounded-full text-xs font-semibold">
                    <i className="fas fa-graduation-cap mr-1"></i>
                    {course.category}
                  </span>
                )}
                {course.categories && course.categories.map(cat => (
                  <span key={cat} className="px-3 py-1 bg-cyan-900/50 border border-cyan-500 text-cyan-400 rounded-full text-xs font-semibold">
                    {cat}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(course)} className="p-2 text-cyan-400 hover:bg-gray-800 rounded">
                <i className="fas fa-edit"></i>
              </button>
              <button onClick={() => handleDelete(course._id)} className="p-2 text-red-400 hover:bg-gray-800 rounded">
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ManageCourses;