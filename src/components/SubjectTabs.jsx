import { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * SubjectTabs Component
 * Displays chemistry subject categories as pill-style tabs
 * 
 * @param {string} selectedSubject - Currently selected subject
 * @param {function} onSubjectChange - Callback when subject is changed
 * @param {boolean} showAll - Whether to show "All" option
 */
const SubjectTabs = ({ selectedSubject, onSubjectChange, showAll = true }) => {
    const subjects = [
        {
            id: 'Physical Chemistry',
            label: 'Physical',
            shortLabel: 'Physical',
            color: 'purple',
            icon: 'fa-atom'
        },
        {
            id: 'Inorganic Chemistry',
            label: 'Inorganic',
            shortLabel: 'Inorganic',
            color: 'green',
            icon: 'fa-flask'
        },
        {
            id: 'Organic Chemistry',
            label: 'Organic',
            shortLabel: 'Organic',
            color: 'orange',
            icon: 'fa-leaf'
        },
        {
            id: 'Practical',
            label: 'Practical',
            shortLabel: 'Practical',
            color: 'blue',
            icon: 'fa-microscope'
        }
    ];

    const handleSubjectClick = (subjectId) => {
        if (selectedSubject === subjectId) {
            // Deselect if clicking the same subject
            onSubjectChange('');
        } else {
            onSubjectChange(subjectId);
        }
    };

    const getColorClasses = (color, isActive) => {
        const colorMap = {
            purple: {
                active: 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/50',
                inactive: 'bg-purple-500/10 text-purple-400 border border-purple-500/30 hover:bg-purple-500/20'
            },
            green: {
                active: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/50',
                inactive: 'bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20'
            },
            orange: {
                active: 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/50',
                inactive: 'bg-orange-500/10 text-orange-400 border border-orange-500/30 hover:bg-orange-500/20'
            },
            blue: {
                active: 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg shadow-blue-500/50',
                inactive: 'bg-blue-500/10 text-blue-400 border border-blue-500/30 hover:bg-blue-500/20'
            },
            cyan: {
                active: 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50',
                inactive: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20'
            }
        };

        return colorMap[color]?.[isActive ? 'active' : 'inactive'] || colorMap.cyan[isActive ? 'active' : 'inactive'];
    };

    return (
        <div className="mb-6">
            <label className="block text-gray-400 text-sm font-semibold mb-3">
                <i className="fas fa-filter mr-2"></i>
                Filter by Subject:
            </label>
            <div className="flex gap-3 flex-wrap">
                {showAll && (
                    <button
                        onClick={() => onSubjectChange('')}
                        className={`px-5 py-2.5 rounded-full font-semibold transition-all duration-300 ${selectedSubject === ''
                                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700'
                            }`}
                    >
                        <i className="fas fa-th mr-2"></i>
                        All Subjects
                    </button>
                )}

                {subjects.map((subject) => (
                    <button
                        key={subject.id}
                        onClick={() => handleSubjectClick(subject.id)}
                        className={`px-5 py-2.5 rounded-full font-semibold transition-all duration-300 ${getColorClasses(subject.color, selectedSubject === subject.id)
                            }`}
                        title={subject.id}
                    >
                        <i className={`fas ${subject.icon} mr-2`}></i>
                        {subject.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

SubjectTabs.propTypes = {
    selectedSubject: PropTypes.string.isRequired,
    onSubjectChange: PropTypes.func.isRequired,
    showAll: PropTypes.bool
};

export default SubjectTabs;
