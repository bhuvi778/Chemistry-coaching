export const ncertQuestionTypes = [
    {
        id: 'intext',
        name: 'Intext Questions',
        description: 'Questions asked within the chapter text for immediate practice',
        icon: 'fa-bookmark',
        color: 'cyan',
        totalQuestions: 180,
        chapters: 16,
        avgTime: '3-5 min'
    },
    {
        id: 'exercise',
        name: 'Exercise Questions',
        description: 'End-of-chapter comprehensive questions covering all topics',
        icon: 'fa-tasks',
        color: 'blue',
        totalQuestions: 250,
        chapters: 16,
        avgTime: '5-8 min'
    },
    {
        id: 'mcq',
        name: 'MCQ Based',
        description: 'Multiple choice questions for competitive exam practice',
        icon: 'fa-check-circle',
        color: 'green',
        totalQuestions: 120,
        chapters: 16,
        avgTime: '2-3 min'
    },
    {
        id: 'numerical',
        name: 'Numerical Problems',
        description: 'Calculation-based questions with step-by-step solutions',
        icon: 'fa-calculator',
        color: 'purple',
        totalQuestions: 95,
        chapters: 16,
        avgTime: '6-10 min'
    },
    {
        id: 'assertion',
        name: 'Assertion Reason',
        description: 'Critical thinking questions in assertion-reason format',
        icon: 'fa-balance-scale',
        color: 'pink',
        totalQuestions: 85,
        chapters: 16,
        avgTime: '3-4 min'
    },
    {
        id: 'pyq',
        name: 'Previous Year NCERT Based',
        description: 'Previous year NEET/JEE questions based on NCERT',
        icon: 'fa-history',
        color: 'yellow',
        totalQuestions: 150,
        chapters: 16,
        avgTime: '4-6 min'
    }
];

export const ncertExemplarTypes = [
    {
        id: 'exemplar-mcq',
        name: 'Exemplar MCQs',
        description: 'High-quality multiple choice questions from NCERT Exemplar',
        icon: 'fa-star',
        color: 'cyan',
        totalQuestions: 200,
        chapters: 16,
        difficulty: 'Medium to Hard'
    },
    {
        id: 'exemplar-saq',
        name: 'Exemplar Short Answer Questions',
        description: 'SAQs from NCERT Exemplar with detailed explanations',
        icon: 'fa-edit',
        color: 'blue',
        totalQuestions: 140,
        chapters: 16,
        difficulty: 'Medium'
    },
    {
        id: 'exemplar-laq',
        name: 'Exemplar Long Answer Questions',
        description: 'LAQs requiring detailed conceptual understanding',
        icon: 'fa-file-alt',
        color: 'purple',
        totalQuestions: 80,
        chapters: 16,
        difficulty: 'Hard'
    },
    {
        id: 'diagram',
        name: 'Diagram Based Questions',
        description: 'Questions based on diagrams, flowcharts, and visual representations',
        icon: 'fa-image',
        color: 'pink',
        totalQuestions: 110,
        chapters: 16,
        difficulty: 'Medium'
    },
    {
        id: 'graph',
        name: 'Graph Based Questions',
        description: 'Questions involving graph plotting, interpretation, and analysis',
        icon: 'fa-chart-line',
        color: 'green',
        totalQuestions: 65,
        chapters: 12,
        difficulty: 'Medium to Hard'
    },
    {
        id: 'structure',
        name: 'Structure Based Questions',
        description: 'Organic chemistry structure identification and naming questions',
        icon: 'fa-project-diagram',
        color: 'yellow',
        totalQuestions: 90,
        chapters: 8,
        difficulty: 'Hard'
    }
];
