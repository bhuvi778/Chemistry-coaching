import { useState } from 'react';
import { useData } from '../../context/DataContext';

const ManageCourses = () => {
  const { courses, addCourse, updateCourse, deleteCourse } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  
  const initialFormState = {
    title: '',
    subtitle: '',
    desc: '',
    features: '',
    color: 'cyan',
    icon: 'fa-flask',
    badge: '',
    categories: []
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleEdit = (course) => {
    setIsEditing(true);
    setCurrentCourse(course);
    setFormData({
      ...course,
      features: course.features.join(', '),
      categories: course.categories || []
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      deleteCourse(id);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const courseData = {
      ...formData,
      features: formData.features.split(',').map(f => f.trim()),
      categories: Array.isArray(formData.categories) ? formData.categories : []
    };

    if (isEditing) {
      updateCourse(currentCourse._id, courseData);
    } else {
      addCourse(courseData);
    }

    setIsEditing(false);
    setCurrentCourse(null);
    setFormData(initialFormState);
  };

  const toggleCategory = (cat) => {
    const cats = formData.categories || [];
    if (cats.includes(cat)) {
      setFormData({ ...formData, categories: cats.filter(c => c !== cat) });
    } else {
      setFormData({ ...formData, categories: [...cats, cat] });
    }
  };

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
            <input
              type="text"
              placeholder="Badge Text (Optional)"
              value={formData.badge}
              onChange={e => setFormData({...formData, badge: e.target.value})}
              className="bg-gray-900 border border-gray-700 rounded p-3 text-white w-full"
            />
          </div>
          
          <div>
            <label className="block text-gray-400 mb-2">Categories:</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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

      <div className="grid grid-cols-1 gap-4">
        {courses.map(course => (
          <div key={course._id} className="glass-panel p-4 rounded-xl flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-white">{course.title}</h3>
              <p className="text-sm text-gray-400">{course.subtitle}</p>
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
    </div>
  );
};

export default ManageCourses;