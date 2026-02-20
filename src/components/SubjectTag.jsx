import PropTypes from 'prop-types';

/**
 * SubjectTag Component
 * Displays a subject badge/tag in flash card style
 * 
 * @param {string} subject - Full subject name (e.g., "Physical Chemistry")
 * @param {string} size - Size variant: 'sm', 'md', 'lg'
 * @param {boolean} showIcon - Whether to show icon
 */
const SubjectTag = ({ subject, size = 'md', showIcon = true }) => {
    const subjectConfig = {
        'Physical Chemistry': {
            label: 'Physical',
            color: 'purple',
            bgClass: 'bg-purple-500/20',
            textClass: 'text-purple-400',
            borderClass: 'border-purple-500/30',
            icon: 'fa-atom'
        },
        'Inorganic Chemistry': {
            label: 'Inorganic',
            color: 'green',
            bgClass: 'bg-green-500/20',
            textClass: 'text-green-400',
            borderClass: 'border-green-500/30',
            icon: 'fa-flask'
        },
        'Organic Chemistry': {
            label: 'Organic',
            color: 'orange',
            bgClass: 'bg-orange-500/20',
            textClass: 'text-orange-400',
            borderClass: 'border-orange-500/30',
            icon: 'fa-leaf'
        },
        'Practical': {
            label: 'Practical',
            color: 'blue',
            bgClass: 'bg-blue-500/20',
            textClass: 'text-blue-400',
            borderClass: 'border-blue-500/30',
            icon: 'fa-microscope'
        }
    };

    const config = subjectConfig[subject] || {
        label: subject || 'Unknown',
        color: 'gray',
        bgClass: 'bg-gray-500/20',
        textClass: 'text-gray-400',
        borderClass: 'border-gray-500/30',
        icon: 'fa-tag'
    };

    const sizeClasses = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-xs',
        lg: 'px-3 py-1.5 text-sm'
    };

    return (
        <span
            className={`
                inline-flex items-center gap-1.5
                ${sizeClasses[size]}
                ${config.bgClass}
                ${config.textClass}
                border ${config.borderClass}
                rounded-md font-bold
                whitespace-nowrap
                transition-all duration-200
                hover:scale-105
            `}
            title={subject}
        >
            {showIcon && <i className={`fas ${config.icon}`}></i>}
            <span>{config.label}</span>
        </span>
    );
};

SubjectTag.propTypes = {
    subject: PropTypes.string.isRequired,
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    showIcon: PropTypes.bool
};

export default SubjectTag;
