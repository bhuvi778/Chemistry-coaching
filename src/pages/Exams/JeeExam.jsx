import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const YEAR = 2027;

// ── Sidebar sections ────────────────────────────────────────────────────────
const SECTIONS = [
    { id: 'overview', label: `JEE Exam ${YEAR}`, icon: 'fa-home' },
    { id: 'registration', label: 'JEE Registration', icon: 'fa-edit' },
    { id: 'application-form', label: 'JEE Application Form', icon: 'fa-file-signature' },
    { id: 'eligibility-criteria', label: 'JEE Eligibility Criteria', icon: 'fa-user-check' },
    { id: 'exam-pattern', label: 'JEE Exam Pattern', icon: 'fa-th' },
    { id: 'exam-date', label: 'JEE Exam Date', icon: 'fa-calendar-alt' },
    { id: 'jee-syllabus', label: 'JEE Syllabus', icon: 'fa-list-alt' },
    { id: 'chapter-wise-weightage', label: 'Chapter-wise Weightage', icon: 'fa-chart-bar' },
    { id: 'admit-card', label: 'JEE Admit Card', icon: 'fa-id-card' },
    { id: 'exam-centre', label: 'JEE Exam Centre', icon: 'fa-map-marker-alt' },
    { id: 'videos', label: 'JEE Videos', icon: 'fa-play-circle' },
    { id: 'courses', label: 'Courses', icon: 'fa-graduation-cap' },
    { id: 'study-material', label: 'Study Material', icon: 'fa-book' },
    { id: 'practice-tools', label: 'Practice Tools', icon: 'fa-dumbbell' },
    { id: 'ncert-resources', label: 'NCERT Resources', icon: 'fa-tools' },
];

// ── Filter tabs ─────────────────────────────────────────────────────────────
const FILTER_TABS = [
    { id: 'overview', label: 'Exam Info', icon: 'fa-info-circle' },
    { id: 'jee-syllabus', label: 'JEE Syllabus', icon: 'fa-list-alt' },
    { id: 'study-material', label: 'Study Material', icon: 'fa-book' },
    { id: 'practice-tools', label: 'Question Papers', icon: 'fa-file-alt' },
    { id: 'courses', label: 'Courses', icon: 'fa-graduation-cap' },
    { id: 'videos', label: 'Videos', icon: 'fa-play-circle' },
    { id: 'ncert-resources', label: 'NCERT Tools', icon: 'fa-tools' },
];

// ── JEE Videos ──────────────────────────────────────────────────────────────
const JEE_VIDEOS = [
    { title: 'JEE Main Chemistry 2026 – Full Revision', duration: '48 min', views: '1.4L', tag: 'Chemistry', url: 'https://www.youtube.com/@ace2examz' },
    { title: 'JEE Physics – Mechanics Complete Lecture', duration: '55 min', views: '1.1L', tag: 'Physics', url: 'https://www.youtube.com/@ace2examz' },
    { title: 'JEE Maths – Calculus Master Class', duration: '60 min', views: '85K', tag: 'Maths', url: 'https://www.youtube.com/@ace2examz' },
    { title: 'JEE 2026 – Exam Strategy & Time Management', duration: '35 min', views: '2.8L', tag: 'Strategy', url: 'https://www.youtube.com/@ace2examz' },
    { title: 'Organic Chemistry – JEE Special Lecture', duration: '62 min', views: '1.6L', tag: 'Chemistry', url: 'https://www.youtube.com/@ace2examz' },
    { title: 'JEE Advanced – Electrostatics Deep Dive', duration: '50 min', views: '92K', tag: 'Physics', url: 'https://www.youtube.com/@ace2examz' },
];

// ── Resource groups ─────────────────────────────────────────────────────────
const RESOURCE_GROUPS = [
    {
        section: 'courses',
        title: 'Courses',
        subtitle: 'JEE-specific courses and batch programs',
        icon: 'fa-graduation-cap',
        color: 'text-orange-400',
        links: [
            { label: 'JEE Courses', href: '/courses?exam=jee', desc: 'Enroll in structured JEE Main & Advanced preparation courses', icon: 'fa-graduation-cap', color: 'text-orange-400' },
            { label: 'Score Max Batches', href: '/score-max-batches?exam=jee', desc: 'Intensive batches designed for JEE score maximisation', icon: 'fa-trophy', color: 'text-amber-400' },
            { label: 'Book Your Session', href: '/book-your-session?exam=jee', desc: 'One-on-one doubt-clearing sessions for JEE', icon: 'fa-calendar-alt', color: 'text-green-400' },
        ],
    },
    {
        section: 'study-material',
        title: 'Study Material',
        subtitle: 'Free notes, audio books, magazines and quick-revision tools',
        icon: 'fa-book',
        color: 'text-purple-400',
        links: [
            { label: 'Audio Books', href: '/audiobooks?exam=jee', desc: 'Listen to JEE chapter summaries on the go', icon: 'fa-headphones', color: 'text-purple-400' },
            { label: 'Free Study Materials', href: '/study-materials?exam=jee', desc: 'Download free PDFs for JEE preparation', icon: 'fa-file-pdf', color: 'text-green-400' },
            { label: 'Chemistry Magazines', href: '/magazines?exam=jee', desc: 'Monthly chemistry magazines for JEE students', icon: 'fa-book-open', color: 'text-pink-400' },
            { label: 'Chemistry Puzzles', href: '/puzzles?exam=jee', desc: 'Fun puzzles to strengthen JEE chemistry concepts', icon: 'fa-puzzle-piece', color: 'text-orange-400' },
            { label: 'ChemSnaps', href: '/chemsnaps?exam=jee', desc: 'Quick snapshot revision for JEE chemistry', icon: 'fa-bolt', color: 'text-sky-400' },
            { label: 'Concept Wise Notes', href: '/concept-wise-notes?exam=jee', desc: 'Chapter-wise detailed notes for JEE', icon: 'fa-sticky-note', color: 'text-teal-400' },
            { label: 'Flash Cards', href: '/flash-cards?exam=jee', desc: 'Memorise JEE terms and reactions with flash cards', icon: 'fa-layer-group', color: 'text-indigo-400' },
            { label: 'Free Quiz', href: '/free-quiz?exam=jee', desc: 'Test your JEE preparation with free quizzes', icon: 'fa-clipboard-list', color: 'text-yellow-400' },
        ],
    },
    {
        section: 'practice-tools',
        title: 'Practice Tools',
        subtitle: 'Practice questions, previous year papers and tests',
        icon: 'fa-dumbbell',
        color: 'text-red-400',
        links: [
            { label: 'Assertion & Reasons', href: '/assertion-reason?exam=jee', desc: 'A&R practice questions as per JEE pattern', icon: 'fa-question-circle', color: 'text-red-400' },
            { label: 'Chapter wise PYQs', href: '/pyq?exam=jee', desc: 'JEE previous year questions chapter-wise', icon: 'fa-history', color: 'text-violet-400' },
            { label: 'Infinite Practice', href: '/infinite-practice?exam=jee', desc: 'Unlimited random JEE practice sets', icon: 'fa-infinity', color: 'text-rose-400' },
            { label: 'DPPs', href: '/dpps?exam=jee', desc: 'Daily practice problems tailored for JEE', icon: 'fa-clipboard-check', color: 'text-blue-400' },
            { label: 'Self Learn', href: '/self-learn?exam=jee', desc: 'Self-paced adaptive learning modules for JEE', icon: 'fa-user-graduate', color: 'text-lime-400' },
            { label: 'Video Lectures', href: '/lectures?exam=jee', desc: 'Watch JEE-focused video lectures', icon: 'fa-play-circle', color: 'text-red-400' },
        ],
    },
    {
        section: 'ncert-resources',
        title: 'NCERT Resources',
        subtitle: 'NCERT-based tools covering the full JEE syllabus',
        icon: 'fa-tools',
        color: 'text-amber-400',
        links: [
            { label: 'NCERT Toolbox', href: '/ncert-toolbox?exam=jee', desc: 'Complete NCERT resource hub for JEE', icon: 'fa-tools', color: 'text-amber-400' },
            { label: 'NCERT Line By Line', href: '/ncert-toolbox/line-by-line?exam=jee', desc: 'Line-by-line NCERT reading for JEE', icon: 'fa-align-left', color: 'text-yellow-400' },
            { label: 'NCERT Questions', href: '/ncert-toolbox/questions?exam=jee', desc: 'NCERT in-text & exercise questions for JEE', icon: 'fa-question', color: 'text-green-400' },
            { label: 'NCERT Exemplars', href: '/ncert-toolbox/exemplars?exam=jee', desc: 'NCERT exemplar problems targeted for JEE', icon: 'fa-star', color: 'text-pink-400' },
            { label: 'NCERT Diagrams', href: '/ncert-toolbox/diagrams?exam=jee', desc: 'Important NCERT diagrams for JEE Chemistry', icon: 'fa-image', color: 'text-sky-400' },
            { label: 'NTA Abhyas', href: '/ncert-toolbox/nta-abhyas?exam=jee', desc: 'NTA Abhyas app questions for JEE practice', icon: 'fa-mobile-alt', color: 'text-purple-400' },
        ],
    },
];

// ── JEE FAQs ────────────────────────────────────────────────────────────────
const JEE_FAQS = [
    {
        q: `When will JEE Main ${YEAR} be conducted?`,
        a: `JEE Main ${YEAR} is conducted in two sessions — Session 1 in January and Session 2 in April. Exact dates are announced by NTA on jeemain.nta.nic.in. Candidates should keep checking the official site for updates.`,
    },
    {
        q: 'What is the difference between JEE Main and JEE Advanced?',
        a: 'JEE Main is the first stage of the JEE examination conducted by NTA for admission to NITs, IIITs and GFTIs. Top 2.5 lakh qualifiers of JEE Main are eligible to appear for JEE Advanced, which is conducted by IITs for admission to the prestigious IIT undergraduate programs.',
    },
    {
        q: 'What is the exam pattern of JEE Main?',
        a: 'JEE Main Paper 1 (B.Tech) consists of 90 questions (30 each from Physics, Chemistry, Mathematics). Each subject has 20 MCQs and 10 Numerical Value questions (attempt any 5). Total marks: 300. Each correct MCQ: +4, wrong MCQ: -1. Numerical questions: +4 for correct, 0 for incorrect.',
    },
    {
        q: 'What is the eligibility criteria for JEE Main?',
        a: `Candidates must have passed Class 12 (or equivalent) with Physics, Chemistry, and Mathematics. There is no age limit for JEE Main as per the latest NTA guidelines. Candidates can appear in JEE Main for up to 3 consecutive years after passing Class 12.`,
    },
    {
        q: 'Is JEE Main conducted online or offline?',
        a: 'JEE Main is a Computer Based Test (CBT) conducted online. However, the Drawing test for Paper 2A (B.Arch) is conducted in offline (pen & paper) mode. JEE Advanced is also completely CBT.',
    },
    {
        q: 'What is the JEE Main syllabus?',
        a: 'The JEE Main syllabus covers Class 11 and 12 topics for Physics, Chemistry, and Mathematics as prescribed by NTA. Chemistry includes Physical, Organic, and Inorganic Chemistry. Physics covers Mechanics, Electrodynamics, Heat, Optics, and Modern Physics. Maths covers Algebra, Calculus, Coordinate Geometry, Trigonometry, and more.',
    },
    {
        q: 'How many attempts are allowed for JEE Main?',
        a: 'A candidate can attempt JEE Main for a maximum of 3 consecutive years after passing Class 12. Since JEE Main is now conducted twice a year, a candidate effectively gets up to 6 attempts in 3 years. The best score from all attempts is considered.',
    },
    {
        q: 'What is the JEE Main cut-off for IITs?',
        a: 'JEE Main cut-off (qualifying for JEE Advanced) varies every year. For General category, the cut-off is typically around 85–95 percentile. Only the top 2.5 lakh candidates are eligible for JEE Advanced. For NIT admissions through JoSAA, the cut-off depends on branch and category.',
    },
    {
        q: 'Which are the best books for JEE preparation?',
        a: 'For Physics: HC Verma (Concepts of Physics), DC Pandey. For Chemistry: NCERT (must), OP Tandon (Physical), MS Chauhan (Organic). For Maths: RD Sharma, Cengage Series, Arihant. Always start with NCERT for Chemistry before moving to reference books.',
    },
    {
        q: 'How to download JEE Admit Card?',
        a: 'The JEE Main Admit Card is released on jeemain.nta.nic.in. Candidates must log in using their Application Number and Date of Birth / Password to download it. Carry a printed copy along with a valid photo ID on the exam day.',
    },
];

// ── Tag color helper ─────────────────────────────────────────────────────────
const tagColor = (tag) => {
    if (tag === 'Chemistry') return 'bg-green-900/60 text-green-300';
    if (tag === 'Physics') return 'bg-blue-900/60 text-blue-300';
    if (tag === 'Maths') return 'bg-orange-900/60 text-orange-300';
    return 'bg-gray-700 text-gray-300';
};

// ════════════════════════════════════════════════════════════════════════════
const JeeExam = () => {
    const [openFaq, setOpenFaq] = React.useState(null);
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('overview');
    const sectionRefs = useRef({});
    const observerRef = useRef(null);

    const setRef = useCallback((id) => (el) => {
        sectionRefs.current[id] = el;
    }, []);

    const scrollTo = (id) => {
        const el = sectionRefs.current[id];
        if (el) {
            const offset = 135;
            const top = el.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.dataset.sectionId);
                    }
                });
            },
            { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
        );
        SECTIONS.forEach(({ id }) => {
            const el = sectionRefs.current[id];
            if (el) observerRef.current.observe(el);
        });
        return () => observerRef.current && observerRef.current.disconnect();
    }, []);

    // ── Section renderers ─────────────────────────────────────────────────────

    const renderOverview = () => (
        <div className="space-y-6">
            <p className="text-gray-300 leading-relaxed text-base">
                <strong className="text-white">JEE (Main + Advanced) {YEAR} Overview:</strong> The Joint Entrance Examination (JEE) is the premier engineering entrance test in India. JEE Main is conducted by the <span className="text-orange-400 font-semibold">National Testing Agency (NTA)</span> for admission to NITs, IIITs, and GFTIs, while <span className="text-orange-400 font-semibold">JEE Advanced</span> is conducted by IITs for admission to IIT undergraduate programs.
            </p>
            <div className="rounded-xl border border-orange-800/50 bg-orange-950/30 p-5">
                <h3 className="font-bold text-white mb-3 flex items-center gap-2 text-sm">
                    <i className="fas fa-bell text-orange-400"></i> Latest Notification
                </h3>
                <ul className="space-y-2 text-gray-300 text-sm list-disc pl-5">
                    <li><strong className="text-white">JEE Main {YEAR} Session 1:</strong> January {YEAR}</li>
                    <li><strong className="text-white">JEE Main {YEAR} Session 2:</strong> April {YEAR}</li>
                    <li>Exam conducted online (CBT) across multiple shifts.</li>
                    <li>Official sites: <a href="https://jeemain.nta.nic.in" target="_blank" rel="noreferrer" className="text-orange-400 hover:underline">jeemain.nta.nic.in</a> &amp; <a href="https://jeeadv.ac.in" target="_blank" rel="noreferrer" className="text-orange-400 hover:underline">jeeadv.ac.in</a></li>
                </ul>
            </div>
            <div className="overflow-x-auto rounded-xl border border-gray-700">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-800 border-b border-gray-700">
                            <th className="p-4 font-bold text-white text-sm w-1/3">Particulars</th>
                            <th className="p-4 font-bold text-white text-sm">Details</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700 bg-gray-800/20">
                        {[
                            ['Exam Name', 'Joint Entrance Examination (Main + Advanced)'],
                            ['Conducting Body', 'NTA (Main) / IITs (Advanced)'],
                            ['Exam Mode', 'Online – Computer Based Test (CBT)'],
                            ['Sessions', '2 Sessions per year (January & April)'],
                            ['Eligibility', '12th with Physics, Chemistry, Mathematics'],
                            ['Age Limit', 'No upper age limit (as per latest NTA guidelines)'],
                            ['JEE Main Date', `January & April ${YEAR}`],
                            ['JEE Advanced Date', `May ${YEAR} (Tentative)`],
                        ].map(([p, d]) => (
                            <tr key={p} className="hover:bg-gray-800/50 transition">
                                <td className="p-4 text-gray-400 text-sm">{p}</td>
                                <td className="p-4 text-white text-sm">{d}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderRegistration = () => (
        <div className="space-y-4 text-gray-300 text-sm leading-relaxed">
            <p>JEE Main registration is done exclusively online by NTA. Candidates must apply separately for each session they wish to appear in.</p>
            <h3 className="text-base font-bold text-white mt-4">Steps to Apply:</h3>
            <ol className="list-decimal pl-6 space-y-3">
                {[
                    ['New Registration', 'Visit jeemain.nta.nic.in and click "New Registration" to generate your Application Number.'],
                    ['Fill Application Form', 'Enter personal, academic, and communication details accurately.'],
                    ['Upload Documents', 'Upload scanned passport-size photograph, signature, and Class 10 certificate.'],
                    ['Fee Payment', 'Pay via debit card, credit card, net banking, or UPI (non-refundable).'],
                    ['Download Confirmation', 'Save and print the confirmation page for future reference.'],
                ].map(([title, desc]) => (
                    <li key={title}><strong className="text-white">{title}:</strong> {desc}</li>
                ))}
            </ol>
        </div>
    );

    const renderApplicationForm = () => (
        <div className="space-y-4 text-gray-300 text-sm leading-relaxed">
            <p>Keep the following documents ready before starting the JEE application:</p>
            <ul className="list-disc pl-6 space-y-2">
                {[
                    'Valid mobile number and email address (active throughout the process)',
                    'Class 10th marksheet / pass certificate',
                    'Class 12th marksheet / certificate (or Roll Number if awaiting results)',
                    'Aadhaar card / Passport / Bank Account Number',
                    'Scanned photograph (JPEG, 10 KB – 200 KB)',
                    'Scanned signature (JPEG, 4 KB – 30 KB)',
                    'Category certificate (SC/ST/PwD/EWS) if applicable',
                ].map((item) => <li key={item}>{item}</li>)}
            </ul>
        </div>
    );

    const renderEligibility = () => (
        <div className="space-y-4 text-gray-300 text-sm">
            <p>Ensure you fulfil all criteria before applying for JEE:</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                {[
                    { icon: 'fa-birthday-cake', color: 'text-pink-400', border: 'border-pink-800/50 bg-pink-950/20', title: 'Age Limit', desc: 'No upper age limit as per latest NTA guidelines. Minimum age requirement may vary by institution.' },
                    { icon: 'fa-book', color: 'text-orange-400', border: 'border-orange-800/50 bg-orange-950/20', title: 'Education', desc: '10+2 with Physics, Chemistry, and Mathematics from a recognised board. Students appearing in Class 12 can also apply.' },
                    { icon: 'fa-redo', color: 'text-green-400', border: 'border-green-800/50 bg-green-950/20', title: 'Attempts', desc: 'Maximum 3 consecutive years after passing Class 12. Two sessions per year = up to 6 total attempts.' },
                ].map(({ icon, color, border, title, desc }) => (
                    <div key={title} className={`rounded-xl border ${border} p-5`}>
                        <i className={`fas ${icon} ${color} text-2xl mb-3`}></i>
                        <h4 className="font-bold text-white mb-2 text-sm">{title}</h4>
                        <p className="text-gray-400 text-xs leading-relaxed">{desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderExamPattern = () => (
        <div className="space-y-6 text-gray-300 text-sm">
            <div>
                <h3 className="font-bold text-white mb-3 text-base flex items-center gap-2">
                    <i className="fas fa-laptop text-orange-400"></i> JEE Main — Paper 1 (B.Tech)
                </h3>
                <div className="overflow-x-auto rounded-xl border border-gray-700">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-800 border-b border-gray-700">
                                {['Subject', 'MCQs (Sec A)', 'Numerical (Sec B)', 'Total Marks'].map((h) => (
                                    <th key={h} className="p-4 font-bold text-white text-sm">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700 bg-gray-800/20">
                            {[
                                ['Physics', '20 Qs', '10 Qs (attempt 5)', '100'],
                                ['Chemistry', '20 Qs', '10 Qs (attempt 5)', '100'],
                                ['Mathematics', '20 Qs', '10 Qs (attempt 5)', '100'],
                                ['Total', '60 Qs', '15 Qs', '300'],
                            ].map(([sub, a, b, m]) => (
                                <tr key={sub} className={`hover:bg-gray-800/50 transition ${sub === 'Total' ? 'bg-orange-900/10 font-bold' : ''}`}>
                                    <td className="p-4 text-white text-sm">{sub}</td>
                                    <td className="p-4 text-gray-300 text-sm">{a}</td>
                                    <td className="p-4 text-gray-300 text-sm">{b}</td>
                                    <td className="p-4 text-orange-400 font-bold text-sm">{m}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p className="text-orange-300 text-xs font-semibold mt-3">
                    <i className="fas fa-info-circle mr-2"></i>MCQ Marking: +4 correct · −1 wrong · 0 unattempted &nbsp;|&nbsp; Numerical: +4 correct · 0 wrong
                </p>
            </div>
            <div>
                <h3 className="font-bold text-white mb-3 text-base flex items-center gap-2">
                    <i className="fas fa-university text-amber-400"></i> JEE Advanced — Pattern
                </h3>
                <div className="rounded-xl border border-amber-800/40 bg-amber-950/20 p-4 text-xs text-amber-200 space-y-2">
                    <p><strong>Two Papers:</strong> Paper 1 and Paper 2, each of 3 hours duration (both mandatory)</p>
                    <p><strong>Subjects:</strong> Physics, Chemistry, Mathematics in each paper</p>
                    <p><strong>Question Types:</strong> MCQ (single/multiple correct), Numerical Value, Match the Column, Paragraph based</p>
                    <p><strong>Marking Scheme:</strong> Varies by question type — partial marks available for multi-correct MCQs</p>
                    <p><strong>Total Marks:</strong> Typically 360 marks across both papers combined</p>
                </div>
            </div>
        </div>
    );

    const renderExamDate = () => (
        <div className="space-y-3 text-sm">
            {[
                { period: `November – December ${YEAR - 1}`, event: 'JEE Main Session 1 — Online Registration Opens', dot: 'bg-orange-500' },
                { period: `January ${YEAR}`, event: 'JEE Main Session 1 — Examination', dot: 'bg-blue-500' },
                { period: `February ${YEAR}`, event: 'JEE Main Session 1 — Results & Scorecard', dot: 'bg-purple-500' },
                { period: `February – March ${YEAR}`, event: 'JEE Main Session 2 — Registration Window', dot: 'bg-cyan-500' },
                { period: `April ${YEAR}`, event: 'JEE Main Session 2 — Examination', dot: 'bg-green-500' },
                { period: `April ${YEAR}`, event: 'JEE Main Final Results & Merit List', dot: 'bg-amber-500' },
                { period: `May ${YEAR}`, event: 'JEE Advanced — Examination (Top 2.5 Lakh Qualifiers)', dot: 'bg-red-500' },
                { period: `June ${YEAR}`, event: 'JEE Advanced Results & Rank List', dot: 'bg-pink-500' },
            ].map(({ period, event, dot }) => (
                <div key={event} className="flex items-start gap-4 p-4 rounded-xl border border-gray-700/60 bg-gray-800/20">
                    <div className={`w-3 h-3 rounded-full ${dot} flex-shrink-0 mt-0.5`}></div>
                    <div>
                        <p className="font-bold text-white">{period}</p>
                        <p className="text-gray-400 text-xs">{event}</p>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderSyllabus = () => (
        <div className="space-y-6 text-sm">
            <p className="text-gray-300">JEE syllabus covers Class 11 &amp; 12 Physics, Chemistry, and Mathematics. Download the official PDFs below.</p>
            <div className="overflow-x-auto rounded-xl border border-gray-700">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-800 border-b border-gray-700">
                            {['Subject', 'Class 11 Key Topics', 'Class 12 Key Topics', 'PDF'].map((h) => (
                                <th key={h} className="p-4 font-bold text-white text-sm">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700 bg-gray-800/20">
                        {[
                            ['Physics', 'Mechanics, Thermodynamics, Waves, Kinetic Theory, SHM', 'Electrodynamics, Optics, Modern Physics, Semiconductors, Dual Nature', 'https://jeemain.nta.nic.in'],
                            ['Chemistry', 'Atomic Structure, Chemical Bonding, Equilibrium, Thermochemistry', 'Electrochemistry, p & d Block, Coordination Compounds, Organic Chemistry', 'https://jeemain.nta.nic.in'],
                            ['Mathematics', 'Sets, Relations, Sequences, Trigonometry, Permutations, Binomial', 'Calculus, 3D Geometry, Vectors, Probability, Matrices, Differential Equations', 'https://jeemain.nta.nic.in'],
                        ].map(([sub, c11, c12, pdf]) => (
                            <tr key={sub} className="hover:bg-gray-800/50 transition align-top">
                                <td className="p-4 text-white font-semibold text-sm">{sub}</td>
                                <td className="p-4 text-gray-300 text-xs leading-relaxed">{c11}</td>
                                <td className="p-4 text-gray-300 text-xs leading-relaxed">{c12}</td>
                                <td className="p-4">
                                    <a href={pdf} target="_blank" rel="noreferrer"
                                        className="inline-flex items-center gap-1 text-xs bg-red-700/80 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg font-semibold transition">
                                        <i className="fas fa-file-pdf"></i> PDF
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="space-y-3 mt-2">
                {[
                    { title: 'Official NTA JEE Main Syllabus PDF', href: 'https://jeemain.nta.nic.in', icon: 'fa-file-pdf', desc: 'Download directly from the official NTA JEE Main portal', color: 'border-red-700/50 bg-red-950/20' },
                    { title: 'JEE Advanced Syllabus PDF', href: 'https://jeeadv.ac.in', icon: 'fa-file-pdf', desc: 'Official JEE Advanced syllabus from IIT website', color: 'border-amber-700/50 bg-amber-950/20' },
                    { title: 'NCERT Full Syllabus Reference', href: 'https://ncert.nic.in', icon: 'fa-book', desc: 'Complete NCERT curriculum aligned to JEE pattern', color: 'border-blue-700/50 bg-blue-950/20' },
                ].map(({ title, href, icon, desc, color }) => (
                    <a key={title} href={href} target="_blank" rel="noreferrer"
                        className={`flex items-center gap-4 p-4 rounded-xl border ${color} hover:opacity-90 transition`}>
                        <i className={`fas ${icon} text-2xl text-orange-400`}></i>
                        <div className="flex-1">
                            <p className="font-bold text-white text-sm">{title}</p>
                            <p className="text-gray-400 text-xs">{desc}</p>
                        </div>
                        <i className="fas fa-external-link-alt text-gray-500 text-xs"></i>
                    </a>
                ))}
            </div>
        </div>
    );

    const renderChapterWeightage = () => (
        <div className="space-y-4 text-sm">
            <p className="text-gray-300">Focus on high-weightage chapters to maximise your JEE score:</p>
            {[
                { subject: 'Physics', color: 'text-blue-400', border: 'border-blue-800/50 bg-blue-950/10', topics: ['Mechanics (~30%)', 'Electrostatics & Current Electricity', 'Optics', 'Modern Physics', 'Thermodynamics', 'SHM & Waves'] },
                { subject: 'Chemistry', color: 'text-green-400', border: 'border-green-800/50 bg-green-950/10', topics: ['Organic Chemistry (~35%)', 'Electrochemistry', 'Chemical Equilibrium', 'Coordination Compounds', 'p-Block Elements', 'Thermodynamics'] },
                { subject: 'Mathematics', color: 'text-orange-400', border: 'border-orange-800/50 bg-orange-950/10', topics: ['Calculus (Limits, Derivatives, Integration >30%)', 'Coordinate Geometry', 'Algebra (Complex Numbers, Matrices)', 'Probability', '3D Geometry & Vectors', 'Differential Equations'] },
            ].map(({ subject, color, border, topics }) => (
                <div key={subject} className={`rounded-xl border ${border} p-5`}>
                    <h3 className={`font-bold text-lg ${color} mb-3`}>{subject}</h3>
                    <div className="flex flex-wrap gap-2">
                        {topics.map((t) => (
                            <span key={t} className="text-xs bg-gray-700/60 text-gray-300 px-3 py-1.5 rounded-full">{t}</span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );

    const renderAdmitCard = () => (
        <div className="space-y-4 text-gray-300 text-sm">
            <p>The JEE Main Admit Card is released on jeemain.nta.nic.in. It contains your Roll Number, Exam Centre, Reporting Time, and exam-day instructions.</p>
            <ol className="list-decimal pl-6 space-y-3">
                {[
                    'Visit the official JEE Main website (jeemain.nta.nic.in).',
                    'Click the Admit Card download link on the homepage.',
                    'Log in with your Application Number and Date of Birth / Password.',
                    'Download and take a clear, legible coloured printout.',
                    'Verify all details — name, photo, centre, date — before exam day.',
                ].map((s, i) => <li key={i}>{s}</li>)}
            </ol>
            <div className="bg-amber-950/30 border border-amber-700/40 rounded-xl p-4 text-xs text-amber-300">
                <i className="fas fa-exclamation-triangle mr-2"></i>
                <strong>Important:</strong> Carry a printed admit card with a valid government-issued photo ID. No digital copy is accepted at the exam centre.
            </div>
        </div>
    );

    const renderExamCentre = () => (
        <div className="space-y-4 text-gray-300 text-sm">
            <p>JEE Main is conducted at 500+ cities across India and select international locations. Centre is allotted based on preferences in the application form.</p>
            <ul className="space-y-3">
                {[
                    { icon: 'fa-clock', color: 'text-orange-400', text: 'Reach the examination centre at least 2 hours before the exam starts.' },
                    { icon: 'fa-id-card', color: 'text-blue-400', text: 'Carry a printed admit card with your original photo ID (Aadhaar / Passport / Voter ID).' },
                    { icon: 'fa-ban', color: 'text-red-400', text: 'Prohibited: mobile phones, calculators, smartwatches, Bluetooth devices, and printed materials.' },
                    { icon: 'fa-door-closed', color: 'text-amber-400', text: 'No late entry is permitted after the gate closing time specified on the admit card.' },
                    { icon: 'fa-laptop', color: 'text-green-400', text: 'Computers and equipment at the centre are provided by NTA — no personal devices allowed inside.' },
                ].map(({ icon, color, text }) => (
                    <li key={text} className="flex items-start gap-3 list-none">
                        <i className={`fas ${icon} ${color} mt-0.5 flex-shrink-0`}></i>
                        <span>{text}</span>
                    </li>
                ))}
            </ul>
        </div>
    );

    const renderVideos = () => (
        <div className="space-y-3">
            <p className="text-gray-400 text-sm">JEE-specific lectures from our YouTube channel:</p>
            <div className="space-y-2">
                {JEE_VIDEOS.map((v, i) => (
                    <a key={i} href={v.url} target="_blank" rel="noreferrer"
                        className="flex items-center gap-4 p-4 rounded-xl border border-gray-700/60 bg-gray-800/20 hover:bg-gray-800/50 hover:border-gray-600 transition group">
                        <div className="w-20 h-12 rounded-lg bg-gray-900 border border-gray-700 flex items-center justify-center flex-shrink-0 group-hover:border-red-600 transition">
                            <i className="fab fa-youtube text-red-500 text-xl group-hover:scale-110 transition-transform"></i>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-white font-semibold text-sm leading-tight">{v.title}</p>
                            <div className="flex items-center gap-3 mt-1">
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${tagColor(v.tag)}`}>{v.tag}</span>
                                <span className="text-gray-500 text-xs"><i className="fas fa-clock mr-1"></i>{v.duration}</span>
                                <span className="text-gray-500 text-xs"><i className="fas fa-eye mr-1"></i>{v.views} views</span>
                            </div>
                        </div>
                        <i className="fas fa-external-link-alt text-gray-600 group-hover:text-gray-400 transition text-xs flex-shrink-0"></i>
                    </a>
                ))}
            </div>
            <div className="mt-4 text-center">
                <a href="https://www.youtube.com/@ace2examz" target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-full font-semibold text-sm transition">
                    <i className="fab fa-youtube"></i> View All JEE Videos on YouTube
                </a>
            </div>
        </div>
    );

    const renderResourceGroup = (group) => (
        <div className="space-y-2">
            <p className="text-gray-400 text-sm mb-4">{group.subtitle}</p>
            <div className="divide-y divide-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                {group.links.map(({ label, href, desc, icon, color }) => (
                    <Link
                        key={label}
                        to={href}
                        className="flex items-center gap-4 px-5 py-3.5 bg-gray-900/60 hover:bg-gray-800/70 transition group"
                    >
                        <i className={`fas ${icon} ${color} text-base w-5 text-center flex-shrink-0`}></i>
                        <div className="flex-1 min-w-0">
                            <p className="text-white font-semibold text-sm">{label}</p>
                            <p className="text-gray-500 text-xs">{desc}</p>
                        </div>
                        <i className="fas fa-arrow-right text-gray-700 group-hover:text-gray-400 group-hover:translate-x-0.5 transition text-xs flex-shrink-0"></i>
                    </Link>
                ))}
            </div>
        </div>
    );

    const renderers = {
        'overview': renderOverview,
        'registration': renderRegistration,
        'application-form': renderApplicationForm,
        'eligibility-criteria': renderEligibility,
        'exam-pattern': renderExamPattern,
        'exam-date': renderExamDate,
        'jee-syllabus': renderSyllabus,
        'chapter-wise-weightage': renderChapterWeightage,
        'admit-card': renderAdmitCard,
        'exam-centre': renderExamCentre,
        'videos': renderVideos,
        'courses': () => renderResourceGroup(RESOURCE_GROUPS[0]),
        'study-material': () => renderResourceGroup(RESOURCE_GROUPS[1]),
        'practice-tools': () => renderResourceGroup(RESOURCE_GROUPS[2]),
        'ncert-resources': () => renderResourceGroup(RESOURCE_GROUPS[3]),
    };

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-gray-950 text-gray-200 pb-28">

            {/* ── Hero Header ── */}
            <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-950 to-black pt-8 pb-8 border-b border-gray-800">
                <div className="absolute inset-0 pointer-events-none" style={{
                    backgroundImage: 'radial-gradient(circle at 15% 50%, rgba(249,115,22,0.08) 0%, transparent 50%), radial-gradient(circle at 85% 20%, rgba(234,179,8,0.08) 0%, transparent 50%)',
                }} />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                        <Link to="/" className="hover:text-orange-400 transition">Home</Link>
                        <i className="fas fa-chevron-right text-gray-700 text-xs"></i>
                        <span className="hover:text-orange-400 cursor-pointer" onClick={() => scrollTo('overview')}>Exams</span>
                        <i className="fas fa-chevron-right text-gray-700 text-xs"></i>
                        <span className="text-orange-400">JEE</span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-10">
                        <div className="flex-1">
                            <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold px-3 py-1.5 rounded-full mb-4">
                                <i className="fas fa-calculator"></i> JEE Main + Advanced {YEAR}
                            </div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-3 leading-tight">
                                JEE {YEAR} — Exam Date,{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">
                                    Important Information
                                </span>
                                , Latest Notification &amp; Complete Schedule
                            </h1>
                            <p className="text-gray-400 text-sm md:text-base max-w-3xl">
                                One-stop hub for JEE {YEAR} — syllabus, exam dates, admit card, eligibility criteria, videos, and all study resources.
                            </p>
                            <div className="flex flex-wrap gap-3 mt-5">
                                {[
                                    { label: 'JEE Main', value: `Jan & Apr ${YEAR}`, icon: 'fa-calendar-alt', color: 'text-orange-400' },
                                    { label: 'JEE Advanced', value: `May ${YEAR}`, icon: 'fa-calendar-alt', color: 'text-amber-400' },
                                    { label: 'Mode', value: 'Online CBT', icon: 'fa-laptop', color: 'text-green-400' },
                                    { label: 'Total Marks', value: '300 (Main)', icon: 'fa-star', color: 'text-yellow-400' },
                                ].map(({ label, value, icon, color }) => (
                                    <div key={label} className="flex items-center gap-2 bg-gray-800/60 border border-gray-700 rounded-xl px-4 py-2">
                                        <i className={`fas ${icon} ${color} text-xs`}></i>
                                        <div>
                                            <p className="text-xs text-gray-500">{label}</p>
                                            <p className="text-white font-bold text-sm">{value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Right card */}
                        <div className="flex-shrink-0 bg-gradient-to-br from-orange-900/40 to-amber-900/40 border border-orange-700/40 rounded-2xl p-6 text-center min-w-[180px]">
                            <p className="text-xs text-gray-400 mb-1">JEE Main {YEAR}</p>
                            <p className="text-5xl font-extrabold text-orange-400 leading-none">Jan</p>
                            <p className="text-3xl font-extrabold text-white">{YEAR}</p>
                            <p className="text-xs text-gray-500 mt-2 border-t border-gray-700 pt-2">Session 1 — Exam Date</p>
                            <a href="https://jeemain.nta.nic.in" target="_blank" rel="noreferrer"
                                className="mt-4 flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition w-full">
                                <i className="fas fa-external-link-alt"></i> Official JEE Site
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Filter Tab Bar ── */}
            <div className="sticky top-20 z-30 bg-gray-950/95 backdrop-blur-md border-b border-gray-800 shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2 py-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
                        <a href="https://jeemain.nta.nic.in" target="_blank" rel="noreferrer"
                            className="flex-shrink-0 flex items-center gap-2 border border-orange-500 text-orange-400 hover:bg-orange-500/10 text-xs font-bold px-4 py-2 rounded-lg transition whitespace-nowrap">
                            <i className="fas fa-external-link-alt"></i> Official Site
                        </a>
                        {FILTER_TABS.map((tab) => (
                            <button key={tab.id}
                                onClick={() => scrollTo(tab.id)}
                                className={`flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg transition whitespace-nowrap border ${activeSection === tab.id
                                    ? 'bg-orange-600/20 border-orange-500 text-orange-300'
                                    : 'border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200'
                                    }`}>
                                <i className={`fas ${tab.icon}`}></i>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Main Layout ── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Scrollable Content */}
                    <div className="w-full lg:w-3/4 order-2 lg:order-1 space-y-14">
                        {SECTIONS.map(({ id, label, icon }) => {
                            const renderer = renderers[id];
                            return (
                                <div
                                    key={id}
                                    id={`section-${id}`}
                                    ref={setRef(id)}
                                    data-section-id={id}
                                    className="scroll-mt-40"
                                >
                                    <div className="flex items-center gap-3 mb-5">
                                        <div className="w-1 h-8 rounded-full bg-gradient-to-b from-orange-400 to-amber-600 flex-shrink-0"></div>
                                        <i className={`fas ${icon} text-orange-500 text-sm`}></i>
                                        <h2 className="text-lg md:text-xl font-extrabold text-white">{label}</h2>
                                    </div>
                                    <div className="bg-gray-900/50 border border-gray-800/80 rounded-2xl p-5 md:p-7">
                                        {renderer ? renderer() : <p className="text-gray-500 text-sm">Content coming soon…</p>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Sticky Sidebar */}
                    <div className="w-full lg:w-1/4 order-1 lg:order-2">
                        <div className="sticky top-[136px]">
                            <div className="rounded-2xl border border-gray-700 overflow-hidden shadow-xl bg-gray-900">
                                <div className="bg-gradient-to-r from-orange-900/70 to-amber-900/70 px-5 py-4 border-b border-gray-700">
                                    <h3 className="font-bold text-white flex items-center gap-2 text-sm">
                                        <i className="fas fa-list-ul text-orange-400"></i>
                                        JEE {YEAR} — Exam Info
                                    </h3>
                                </div>
                                <div className="flex flex-col divide-y divide-gray-800/70 max-h-[72vh] overflow-y-auto"
                                    style={{ scrollbarWidth: 'thin' }}>
                                    {SECTIONS.map(({ id, label, icon }) => (
                                        <button
                                            key={id}
                                            onClick={() => scrollTo(id)}
                                            className={`w-full text-left px-4 py-3 transition-all duration-200 flex items-center gap-3 text-sm ${activeSection === id
                                                ? 'text-orange-400 bg-gray-800/80 border-l-4 border-orange-400 pl-3'
                                                : 'text-gray-400 hover:bg-gray-800/40 hover:text-gray-200 border-l-4 border-transparent'
                                                }`}
                                        >
                                            <i className={`fas ${icon} text-xs flex-shrink-0 ${activeSection === id ? 'text-orange-400' : 'text-gray-600'}`}></i>
                                            <span className="flex-1 leading-tight font-medium">{label}</span>
                                            {activeSection === id && (
                                                <i className="fas fa-chevron-right text-orange-500 text-xs flex-shrink-0"></i>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-4 rounded-2xl border border-gray-700 bg-gray-900 p-4">
                                <p className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-widest">Official Links</p>
                                <div className="space-y-2.5">
                                    {[
                                        { label: 'JEE Main Official Site', href: 'https://jeemain.nta.nic.in', icon: 'fa-external-link-alt', color: 'text-orange-400' },
                                        { label: 'JEE Advanced Official Site', href: 'https://jeeadv.ac.in', icon: 'fa-external-link-alt', color: 'text-amber-400' },
                                        { label: 'NTA Website', href: 'https://nta.ac.in', icon: 'fa-external-link-alt', color: 'text-blue-400' },
                                        { label: 'NCERT Books', href: 'https://ncert.nic.in', icon: 'fa-book', color: 'text-green-400' },
                                    ].map(({ label, href, icon, color }) => (
                                        <a key={label} href={href} target="_blank" rel="noreferrer"
                                            className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition">
                                            <i className={`fas ${icon} ${color} text-xs`}></i>
                                            {label}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* ── FAQ Section ── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 mb-10">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-1 h-8 rounded-full bg-gradient-to-b from-orange-400 to-amber-600 flex-shrink-0"></div>
                    <i className="fas fa-question-circle text-orange-500 text-sm"></i>
                    <h2 className="text-xl md:text-2xl font-extrabold text-white">JEE {YEAR} — Frequently Asked Questions</h2>
                </div>
                <div className="space-y-3">
                    {JEE_FAQS.map((faq, idx) => (
                        <div
                            key={idx}
                            className={`rounded-2xl border transition-all duration-300 overflow-hidden ${openFaq === idx
                                ? 'border-orange-600/60 bg-orange-950/20'
                                : 'border-gray-700/70 bg-gray-900/50 hover:border-gray-600'
                                }`}
                        >
                            <button
                                className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left"
                                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                            >
                                <span className={`font-semibold text-sm md:text-base leading-snug ${openFaq === idx ? 'text-orange-300' : 'text-white'}`}>
                                    <span className="inline-block text-orange-500 font-bold mr-2">Q{idx + 1}.</span>
                                    {faq.q}
                                </span>
                                <i className={`fas fa-chevron-down text-xs flex-shrink-0 transition-transform duration-300 ${openFaq === idx ? 'rotate-180 text-orange-400' : 'text-gray-500'}`}></i>
                            </button>
                            {openFaq === idx && (
                                <div className="px-6 pb-5">
                                    <div className="border-t border-gray-700/50 pt-4">
                                        <p className="text-gray-300 text-sm leading-relaxed">
                                            <i className="fas fa-circle-check text-green-400 mr-2 text-xs"></i>
                                            {faq.a}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `.scroll-mt-40 { scroll-margin-top: 160px; }` }} />
        </div>
    );
};

export default JeeExam;
