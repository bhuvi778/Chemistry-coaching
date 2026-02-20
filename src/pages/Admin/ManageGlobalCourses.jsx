import { useState, useEffect } from 'react';
import axios from 'axios';
import Pagination from '../../components/UI/Pagination';

const ManageGlobalCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const coursesPerPage = 4; // 4 rows? User asked for "after 4 rows". Assuming user means 4 items per row, or maybe just a limit.
    // User quote: "after after 4 rows the apgination will satrt" -> likely means X items that fit in 4 rows.
    // If grid is 3 cols, 4 rows = 12 items.
    // If grid is responsive, rows vary. Let's assume standard 12 items per page for now as a safe bet for "4 rows" visually on desktop (3x4).
    // Wait, user said "after 4 rows". If visual rows, let's target roughly 12 items.

    // User request clarification: "after after 4 rows the apgination will satrt"
    // Let's interpret this as restricting the number of items shown.
    // Default grid is: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
    // 4 visual rows on lg (3 cols) = 12 items.
    // 4 visual rows on md (2 cols) = 8 items.
    // Let's go with 12 items to be safe and efficient.
    const itemsPerPage = 12;

    const [courseForm, setCourseForm] = useState({
        title: '',
        description: '',
        thumbnail: '',
        exam: 'All',
        category: 'All Chemistry',
        instructor: '',
        duration: '',
        language: 'English',
        level: 'All Levels',
        price: '',
        originalPrice: '',
        enrollmentLink: '',
        features: [],
        badge: '',
        icon: 'fa-globe',
        color: 'cyan',
        isActive: true,
        order: 0,
        courseType: 'Recorded'
    });

    const [featureInput, setFeatureInput] = useState('');
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL || 'https://ace2examz.com/api';

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const timestamp = Date.now();
            const response = await axios.get(`${API_URL}/global-courses/admin/all?_t=${timestamp}`);
            setCourses(response.data);
        } catch (error) {
            console.error('Error fetching courses:', error);
            alert('Failed to fetch courses');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setCourseForm({
            title: '',
            description: '',
            thumbnail: '',
            exam: 'All',
            category: 'All Chemistry',
            instructor: '',
            duration: '',
            language: 'English',
            level: 'All Levels',
            price: '',
            originalPrice: '',
            enrollmentLink: '',
            features: [],
            badge: '',
            icon: 'fa-globe',
            color: 'cyan',
            isActive: true,
            order: 0,
            courseType: 'Recorded'
        });
        setFeatureInput('');
        setThumbnailFile(null);
        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axios.put(`${API_URL}/global-courses/admin/${editingId}`, courseForm);
                alert('Course updated successfully!');
            } else {
                await axios.post(`${API_URL}/global-courses/admin`, courseForm);
                alert('Course created successfully!');
            }
            setShowModal(false);
            resetForm();
            fetchCourses();
        } catch (error) {
            console.error('Error saving course:', error);
            alert('Failed to save course: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleEdit = (course) => {
        setCourseForm(course);
        setEditingId(course._id);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this course?')) return;
        try {
            await axios.delete(`${API_URL}/global-courses/admin/${id}`);
            alert('Course deleted successfully!');
            fetchCourses();
        } catch (error) {
            console.error('Error deleting course:', error);
            alert('Failed to delete course');
        }
    };

    const handleThumbnailUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            setUploading(true);
            const response = await axios.post(`${API_URL}/upload`, formData);
            setCourseForm({ ...courseForm, thumbnail: response.data.fileUrl });
            setThumbnailFile(file.name);
        } catch (error) {
            console.error('Error uploading thumbnail:', error);
            alert('Failed to upload thumbnail');
        } finally {
            setUploading(false);
        }
    };

    const addFeature = () => {
        if (featureInput.trim()) {
            setCourseForm({
                ...courseForm,
                features: [...courseForm.features, featureInput.trim()]
            });
            setFeatureInput('');
        }
    };

    const removeFeature = (index) => {
        setCourseForm({
            ...courseForm,
            features: courseForm.features.filter((_, i) => i !== index)
        });
    };

    const examOptions = [
        'All',
        'CBSE', 'IB', 'IGCSE', 'A-Level'
    ];



    const iconOptions = [
        { value: 'fa-globe', label: 'Globe' },
        { value: 'fa-graduation-cap', label: 'Graduation Cap' },
        { value: 'fa-book', label: 'Book' },
        { value: 'fa-flask', label: 'Flask' },
        { value: 'fa-atom', label: 'Atom' },
        { value: 'fa-certificate', label: 'Certificate' },
        { value: 'fa-trophy', label: 'Trophy' },
        { value: 'fa-star', label: 'Star' }
    ];

    const colorOptions = [
        'cyan', 'purple', 'blue', 'green', 'amber', 'red', 'pink', 'indigo', 'teal'
    ];

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div>
            </div>
        );
    }

    // Pagination Calculation
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCourses = courses.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(courses.length / itemsPerPage);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <i className="fas fa-globe text-cyan-400"></i>
                    Manage UAE Courses
                </h2>
                <button
                    onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg transition"
                >
                    <i className="fas fa-plus mr-2"></i>
                    Add New Course
                </button>
            </div>

            {/* Courses List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentCourses.map(course => (
                    <div key={course._id} className="glass-panel rounded-xl p-6 border border-gray-700/50 hover:border-cyan-500/50 transition">
                        {course.thumbnail && (
                            <img
                                src={course.thumbnail}
                                alt={course.title}
                                className="w-full h-40 object-cover rounded-lg mb-4"
                            />
                        )}
                        {course.badge && (
                            <span className="inline-block px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full mb-2">
                                {course.badge}
                            </span>
                        )}
                        <div className={`w-12 h-12 bg-gradient-to-r from-${course.color}-500 to-${course.color}-600 rounded-lg flex items-center justify-center mb-3`}>
                            <i className={`fas ${course.icon} text-xl text-white`}></i>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">{course.title}</h3>
                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{course.description}</p>

                        <div className="space-y-1 mb-4 text-sm">
                            <div className="flex items-center gap-2 text-gray-400">
                                <i className="fas fa-graduation-cap text-cyan-400"></i>
                                <span>{course.exam}</span>
                            </div>

                            {course.instructor && (
                                <div className="flex items-center gap-2 text-gray-400">
                                    <i className="fas fa-user text-green-400"></i>
                                    <span>{course.instructor}</span>
                                </div>
                            )}
                            {course.price && (
                                <div className="flex items-center gap-2 text-amber-400 font-bold">
                                    <i className="fas fa-dollar-sign"></i>
                                    <span>{course.price}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => handleEdit(course)}
                                className="flex-1 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition"
                            >
                                <i className="fas fa-edit mr-1"></i>
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(course._id)}
                                className="flex-1 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition"
                            >
                                <i className="fas fa-trash mr-1"></i>
                                Delete
                            </button>
                        </div>

                        {!course.isActive && (
                            <div className="mt-2 text-center text-xs text-gray-500">
                                <i className="fas fa-eye-slash mr-1"></i>
                                Inactive
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {courses.length === 0 && (
                <div className="text-center py-12">
                    <i className="fas fa-globe text-6xl text-gray-600 mb-4"></i>
                    <h3 className="text-xl font-bold text-white mb-2">No UAE Courses Yet</h3>
                    <p className="text-gray-400">Click "Add New Course" to create your first international course</p>
                </div>
            )}

            {/* Pagination */}
            {courses.length > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="glass-panel rounded-xl p-8 max-w-4xl w-full my-8 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-white">
                                {editingId ? 'Edit Course' : 'Add New Course'}
                            </h3>
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    resetForm();
                                }}
                                className="text-gray-400 hover:text-white transition"
                            >
                                <i className="fas fa-times text-2xl"></i>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Basic Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-gray-300 mb-2 font-semibold">Course Title *</label>
                                    <input
                                        type="text"
                                        value={courseForm.title}
                                        onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                        required
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-gray-300 mb-2 font-semibold">Description *</label>
                                    <textarea
                                        value={courseForm.description}
                                        onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                        rows="4"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-300 mb-2 font-semibold">Exam *</label>
                                    <select
                                        value={courseForm.exam}
                                        onChange={(e) => setCourseForm({ ...courseForm, exam: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                        required
                                    >
                                        {examOptions.map(exam => (
                                            <option key={exam} value={exam}>{exam}</option>
                                        ))}
                                    </select>
                                </div>



                                <div>
                                    <label className="block text-gray-300 mb-2 font-semibold">Instructor</label>
                                    <input
                                        type="text"
                                        value={courseForm.instructor}
                                        onChange={(e) => setCourseForm({ ...courseForm, instructor: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                        placeholder="e.g., Dr. John Doe"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-300 mb-2 font-semibold">Course Type</label>
                                    <select
                                        value={courseForm.courseType}
                                        onChange={(e) => setCourseForm({ ...courseForm, courseType: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                    >
                                        <option value="Recorded">Recorded</option>
                                        <option value="Live">Live</option>
                                        <option value="Hybrid">Hybrid</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-gray-300 mb-2 font-semibold">Duration</label>
                                    <input
                                        type="text"
                                        value={courseForm.duration}
                                        onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                        placeholder="e.g., 6 months"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-300 mb-2 font-semibold">Language</label>
                                    <input
                                        type="text"
                                        value={courseForm.language}
                                        onChange={(e) => setCourseForm({ ...courseForm, language: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-300 mb-2 font-semibold">Level</label>
                                    <select
                                        value={courseForm.level}
                                        onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                    >
                                        <option value="All Levels">All Levels</option>
                                        <option value="Beginner">Beginner</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Advanced">Advanced</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-gray-300 mb-2 font-semibold">Price</label>
                                    <input
                                        type="text"
                                        value={courseForm.price}
                                        onChange={(e) => setCourseForm({ ...courseForm, price: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                        placeholder="e.g., $99.99"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-300 mb-2 font-semibold">Original Price</label>
                                    <input
                                        type="text"
                                        value={courseForm.originalPrice}
                                        onChange={(e) => setCourseForm({ ...courseForm, originalPrice: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                        placeholder="e.g., $199.99"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-gray-300 mb-2 font-semibold">Enrollment Link</label>
                                    <input
                                        type="url"
                                        value={courseForm.enrollmentLink}
                                        onChange={(e) => setCourseForm({ ...courseForm, enrollmentLink: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                        placeholder="https://..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-300 mb-2 font-semibold">Badge</label>
                                    <input
                                        type="text"
                                        value={courseForm.badge}
                                        onChange={(e) => setCourseForm({ ...courseForm, badge: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                        placeholder="e.g., NEW, POPULAR"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-300 mb-2 font-semibold">Order</label>
                                    <input
                                        type="number"
                                        value={courseForm.order}
                                        onChange={(e) => setCourseForm({ ...courseForm, order: parseInt(e.target.value) })}
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-300 mb-2 font-semibold">Icon</label>
                                    <select
                                        value={courseForm.icon}
                                        onChange={(e) => setCourseForm({ ...courseForm, icon: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                    >
                                        {iconOptions.map(icon => (
                                            <option key={icon.value} value={icon.value}>
                                                {icon.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-gray-300 mb-2 font-semibold">Color</label>
                                    <select
                                        value={courseForm.color}
                                        onChange={(e) => setCourseForm({ ...courseForm, color: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                    >
                                        {colorOptions.map(color => (
                                            <option key={color} value={color}>{color}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Thumbnail Upload */}
                            <div>
                                <label className="block text-gray-300 mb-2 font-semibold">Thumbnail Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleThumbnailUpload}
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                />
                                {uploading && <p className="text-cyan-400 mt-2">Uploading...</p>}
                                {courseForm.thumbnail && (
                                    <img src={courseForm.thumbnail} alt="Thumbnail" className="mt-2 w-32 h-32 object-cover rounded-lg" />
                                )}
                            </div>

                            {/* Features */}
                            <div>
                                <label className="block text-gray-300 mb-2 font-semibold">Features</label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={featureInput}
                                        onChange={(e) => setFeatureInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                                        className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                        placeholder="Add a feature..."
                                    />
                                    <button
                                        type="button"
                                        onClick={addFeature}
                                        className="px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition"
                                    >
                                        <i className="fas fa-plus"></i>
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {courseForm.features.map((feature, index) => (
                                        <div key={index} className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg">
                                            <i className="fas fa-check-circle text-green-400"></i>
                                            <span className="flex-1 text-white">{feature}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeFeature(index)}
                                                className="text-red-400 hover:text-red-300"
                                            >
                                                <i className="fas fa-times"></i>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Active Status */}
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={courseForm.isActive}
                                    onChange={(e) => setCourseForm({ ...courseForm, isActive: e.target.checked })}
                                    className="w-5 h-5 rounded"
                                />
                                <label htmlFor="isActive" className="text-white">Active (visible to users)</label>
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg transition"
                                >
                                    <i className="fas fa-save mr-2"></i>
                                    {editingId ? 'Update Course' : 'Create Course'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        resetForm();
                                    }}
                                    className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageGlobalCourses;
