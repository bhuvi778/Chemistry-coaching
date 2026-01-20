// Exam Categories Configuration
// This file contains the centralized exam category options for dropdowns

export const examOptions = [
    { value: 'all', label: 'All Exams', group: null },
    // UG Entrance Exams
    { value: 'NEET', label: 'NEET', group: 'UG Entrance Exams' },
    { value: 'JEE', label: 'JEE', group: 'UG Entrance Exams' },
    { value: 'IAT', label: 'IAT', group: 'UG Entrance Exams' },
    { value: 'NEST', label: 'NEST', group: 'UG Entrance Exams' },
    { value: 'CUET UG', label: 'CUET UG', group: 'UG Entrance Exams' },
    { value: 'BITSAT', label: 'BITSAT', group: 'UG Entrance Exams' },
    // PG Entrance Exams
    { value: 'IIT JAM', label: 'IIT JAM', group: 'PG Entrance Exams' },
    { value: 'CUET PG', label: 'CUET PG', group: 'PG Entrance Exams' },
    // Research Level Exams
    { value: 'CSIR NET', label: 'CSIR NET', group: 'Research Level Exams' },
    { value: 'GATE', label: 'GATE', group: 'Research Level Exams' },
    { value: 'TIFR', label: 'TIFR', group: 'Research Level Exams' },
    // Competitive Exams (Govt. Job)
    { value: 'PSTET', label: 'PSTET', group: 'Competitive Exams (Govt. Job)' },
    { value: 'Master Cadre', label: 'Master Cadre', group: 'Competitive Exams (Govt. Job)' },
    { value: 'UPSC - Mains (Chemistry)', label: 'UPSC - Mains (Chemistry)', group: 'Competitive Exams (Govt. Job)' },
];

// Group the options for optgroup rendering
export const examOptionsGrouped = () => {
    const groups = {};

    examOptions.forEach(option => {
        if (!option.group) {
            if (!groups['_ungrouped']) groups['_ungrouped'] = [];
            groups['_ungrouped'].push(option);
        } else {
            if (!groups[option.group]) groups[option.group] = [];
            groups[option.group].push(option);
        }
    });

    return groups;
};

// Render function for select dropdown with optgroups
export const renderExamOptions = () => {
    const groups = examOptionsGrouped();
    const elements = [];

    // Add ungrouped options first (like "All Exams")
    if (groups['_ungrouped']) {
        groups['_ungrouped'].forEach(option => {
            elements.push(
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            );
        });
    }

    // Add grouped options
    const groupOrder = [
        'UG Entrance Exams',
        'PG Entrance Exams',
        'Research Level Exams',
        'Competitive Exams (Govt. Job)'
    ];

    groupOrder.forEach(groupName => {
        if (groups[groupName]) {
            elements.push(
                <optgroup key={groupName} label={groupName}>
                    {groups[groupName].map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </optgroup>
            );
        }
    });

    return elements;
};
