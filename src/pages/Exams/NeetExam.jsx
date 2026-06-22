import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const YEAR = 2027;

// ── Sidebar sections (order = scroll order) ────────────────────────────────
const SECTIONS = [
    { id: 'overview', label: `NEET Exam ${YEAR}`, icon: 'fa-home' },
    { id: 'registration', label: 'NEET Registration', icon: 'fa-edit' },
    { id: 'application-form', label: 'NEET Application Form', icon: 'fa-file-signature' },
    { id: 'eligibility-criteria', label: 'NEET Eligibility Criteria', icon: 'fa-user-check' },
    { id: 'exam-pattern', label: 'NEET Exam Pattern', icon: 'fa-th' },
    { id: 'exam-date', label: 'NEET Exam Date', icon: 'fa-calendar-alt' },
    { id: 'neet-syllabus', label: 'NEET Syllabus', icon: 'fa-list-alt' },
    { id: 'chapter-wise-weightage', label: 'Chapter-wise Weightage', icon: 'fa-chart-bar' },
    { id: 'admit-card', label: 'NEET Admit Card', icon: 'fa-id-card' },
    { id: 'exam-centre', label: 'NEET Exam Centre', icon: 'fa-map-marker-alt' },
    { id: 'videos', label: 'NEET Videos', icon: 'fa-play-circle' },
    { id: 'courses', label: 'Courses', icon: 'fa-graduation-cap' },
    { id: 'study-material', label: 'Study Material', icon: 'fa-book' },
    { id: 'practice-tools', label: 'Practice Tools', icon: 'fa-dumbbell' },
    { id: 'ncert-resources', label: 'NCERT Resources', icon: 'fa-tools' },
];

// ── Filter tab bar ─────────────────────────────────────────────────────────
const FILTER_TABS = [
    { id: 'overview', label: 'Exam Info', icon: 'fa-info-circle' },
    { id: 'neet-syllabus', label: 'Neet Syllabus', icon: 'fa-list-alt' },
    { id: 'study-material', label: 'Study Material', icon: 'fa-book' },
    { id: 'practice-tools', label: 'Question Papers', icon: 'fa-file-alt' },
    { id: 'courses', label: 'Courses', icon: 'fa-graduation-cap' },
    { id: 'videos', label: 'Videos', icon: 'fa-play-circle' },
    { id: 'ncert-resources', label: 'NCERT Tools', icon: 'fa-tools' },
];

// ── NEET Videos ────────────────────────────────────────────────────────────
const NEET_VIDEOS = [
    { title: 'NEET Chemistry 2027 – Full Revision', duration: '45 min', views: '1.2L', tag: 'Chemistry', url: 'https://www.youtube.com/@ace2examz' },
    { title: 'NEET Physics – Important Chapters Covered', duration: '38 min', views: '98K', tag: 'Physics', url: 'https://www.youtube.com/@ace2examz' },
    { title: 'NEET Biology – Cell Biology Complete', duration: '52 min', views: '2.1L', tag: 'Biology', url: 'https://www.youtube.com/@ace2examz' },
    { title: 'NEET 2027 – Exam Strategy Masterclass', duration: '30 min', views: '3.4L', tag: 'Strategy', url: 'https://www.youtube.com/@ace2examz' },
    { title: 'Organic Chemistry – NEET Special Lecture', duration: '60 min', views: '1.8L', tag: 'Chemistry', url: 'https://www.youtube.com/@ace2examz' },
    { title: 'NEET Genetics & Evolution – Master Class', duration: '55 min', views: '1.1L', tag: 'Biology', url: 'https://www.youtube.com/@ace2examz' },
];

// ── Resource groups (separate sections, one link per line) ─────────────────
const RESOURCE_GROUPS = [
    {
        section: 'courses',
        title: 'Courses',
        subtitle: 'NEET-specific courses and batch programs',
        icon: 'fa-graduation-cap',
        color: 'text-cyan-400',
        links: [
            { label: 'NEET Courses', href: '/courses?exam=neet', desc: 'Enroll in structured NEET preparation courses', icon: 'fa-graduation-cap', color: 'text-cyan-400' },
            { label: 'Score Max Batches', href: '/score-max-batches?exam=neet', desc: 'Intensive batches designed for NEET score maximisation', icon: 'fa-trophy', color: 'text-amber-400' },
            { label: 'Book Your Session', href: '/book-your-session?exam=neet', desc: 'One-on-one doubt-clearing sessions for NEET', icon: 'fa-calendar-alt', color: 'text-green-400' },
        ],
    },
    {
        section: 'study-material',
        title: 'Study Material',
        subtitle: 'Free notes, audio books, magazines and quick-revision tools',
        icon: 'fa-book',
        color: 'text-purple-400',
        links: [
            { label: 'Audio Books', href: '/audiobooks?exam=neet', desc: 'Listen to NEET chapter summaries on the go', icon: 'fa-headphones', color: 'text-purple-400' },
            { label: 'Free Study Materials', href: '/study-materials?exam=neet', desc: 'Download free PDFs for NEET preparation', icon: 'fa-file-pdf', color: 'text-green-400' },
            { label: 'Chemistry Magazines', href: '/magazines?exam=neet', desc: 'Monthly chemistry magazines for NEET students', icon: 'fa-book-open', color: 'text-pink-400' },
            { label: 'Chemistry Puzzles', href: '/puzzles?exam=neet', desc: 'Fun puzzles to strengthen NEET chemistry concepts', icon: 'fa-puzzle-piece', color: 'text-orange-400' },
            { label: 'ChemSnaps', href: '/chemsnaps?exam=neet', desc: 'Quick snapshot revision for NEET chemistry', icon: 'fa-bolt', color: 'text-sky-400' },
            { label: 'Concept Wise Notes', href: '/concept-wise-notes?exam=neet', desc: 'Chapter-wise detailed notes for NEET', icon: 'fa-sticky-note', color: 'text-teal-400' },
            { label: 'Flash Cards', href: '/flash-cards?exam=neet', desc: 'Memorise NEET terms and reactions with flash cards', icon: 'fa-layer-group', color: 'text-indigo-400' },
            { label: 'Free Quiz', href: '/free-quiz?exam=neet', desc: 'Test your NEET preparation with free quizzes', icon: 'fa-clipboard-list', color: 'text-yellow-400' },
        ],
    },
    {
        section: 'practice-tools',
        title: 'Practice Tools',
        subtitle: 'Practice questions, previous year papers and tests',
        icon: 'fa-dumbbell',
        color: 'text-red-400',
        links: [
            { label: 'Assertion & Reasons', href: '/assertion-reason?exam=neet', desc: 'A&R practice questions as per NEET pattern', icon: 'fa-question-circle', color: 'text-red-400' },
            { label: 'Chapter wise PYQs', href: '/pyq?exam=neet', desc: 'NEET previous year questions chapter-wise', icon: 'fa-history', color: 'text-violet-400' },
            { label: 'Infinite Practice', href: '/infinite-practice?exam=neet', desc: 'Unlimited random NEET practice sets', icon: 'fa-infinity', color: 'text-rose-400' },
            { label: 'DPPs', href: '/dpps?exam=neet', desc: 'Daily practice problems tailored for NEET', icon: 'fa-clipboard-check', color: 'text-blue-400' },
            { label: 'Self Learn', href: '/self-learn?exam=neet', desc: 'Self-paced adaptive learning modules for NEET', icon: 'fa-user-graduate', color: 'text-lime-400' },
            { label: 'Video Lectures', href: '/lectures?exam=neet', desc: 'Watch NEET-focused video lectures', icon: 'fa-play-circle', color: 'text-red-400' },
        ],
    },
    {
        section: 'ncert-resources',
        title: 'NCERT Resources',
        subtitle: 'NCERT-based tools covering the full NEET syllabus',
        icon: 'fa-tools',
        color: 'text-amber-400',
        links: [
            { label: 'NCERT Toolbox', href: '/ncert-toolbox?exam=neet', desc: 'Complete NCERT resource hub for NEET', icon: 'fa-tools', color: 'text-amber-400' },
            { label: 'NCERT Line By Line', href: '/ncert-toolbox/line-by-line?exam=neet', desc: 'Line-by-line NCERT reading for NEET', icon: 'fa-align-left', color: 'text-yellow-400' },
            { label: 'NCERT Questions', href: '/ncert-toolbox/questions?exam=neet', desc: 'NCERT in-text & exercise questions for NEET', icon: 'fa-question', color: 'text-green-400' },
            { label: 'NCERT Exemplars', href: '/ncert-toolbox/exemplars?exam=neet', desc: 'NCERT exemplar problems targeted for NEET', icon: 'fa-star', color: 'text-pink-400' },
            { label: 'NCERT Diagrams', href: '/ncert-toolbox/diagrams?exam=neet', desc: 'Important NCERT diagrams for NEET Biology', icon: 'fa-image', color: 'text-sky-400' },
            { label: 'NTA Abhyas', href: '/ncert-toolbox/nta-abhyas?exam=neet', desc: 'NTA Abhyas app questions for NEET practice', icon: 'fa-mobile-alt', color: 'text-purple-400' },
        ],
    },
];

// ── NEET FAQs ─────────────────────────────────────────────────────────────
const NEET_FAQS = [
    {
        q: `When will NEET ${YEAR} exam be conducted?`,
        a: `NEET ${YEAR} is tentatively scheduled for May ${YEAR}. The exact date will be announced by NTA on the official website neet.nta.nic.in. Candidates should keep checking the official site for updates.`,
    },
    {
        q: 'How many questions and marks are there in NEET?',
        a: 'NEET consists of 200 questions in total, out of which candidates must attempt 180. The total marks are 720. Each correct answer carries +4 marks, while each wrong answer results in a -1 mark deduction. Unattempted questions carry 0 marks.',
    },
    {
        q: 'What is the minimum eligibility criteria for NEET?',
        a: 'Candidates must have passed 10+2 with Physics, Chemistry, and Biology/Biotechnology from a recognised board. Minimum marks required: 50% for General category, 40% for SC/ST/OBC-NCL, and 45% for PWD candidates. Minimum age is 17 years.',
    },
    {
        q: 'What is the syllabus of NEET based on?',
        a: 'The NEET syllabus is prescribed by NTA and is primarily based on NCERT Class 11 and Class 12 textbooks covering Physics, Chemistry, and Biology (Botany + Zoology). NCERT is considered the most important resource for NEET preparation.',
    },
    {
        q: 'Is NEET conducted online or offline?',
        a: 'NEET is a completely offline exam (Pen & Paper Based Test). It is conducted in 13+ languages including Hindi, English, and other regional languages. There is no online/computer-based mode for NEET UG.',
    },
    {
        q: 'How many attempts are allowed for NEET?',
        a: 'As per the latest NTA guidelines, there is no restriction on the number of attempts for NEET, provided the candidate meets the age and educational eligibility criteria. Candidates can appear in NEET as many times as they wish.',
    },
    {
        q: 'How to download the NEET Admit Card?',
        a: 'The NEET Admit Card is released exclusively online at neet.nta.nic.in. Visit the official website, enter your Application Number and Date of Birth, and download the admit card. A printed copy is mandatory on exam day along with a valid photo ID.',
    },
    {
        q: 'What is the weightage of Biology in NEET?',
        a: 'Biology (Botany + Zoology) carries the highest weightage in NEET — 360 marks out of 720 (50%). Physics and Chemistry carry 180 marks each. Focusing more on Biology is the most effective strategy to maximize your NEET score.',
    },
    {
        q: 'Which are the best books for NEET preparation?',
        a: 'NCERT Class 11 & 12 textbooks are the most important for NEET. Additionally, DC Pandey for Physics, OP Tandon / MS Chauhan for Chemistry, and Trueman\'s Biology for Biology are highly recommended. Always prioritise NCERT over other books.',
    },
    {
        q: 'What is the NEET cut-off score?',
        a: 'NEET cut-off varies every year. The qualifying percentile for General category is 50th, which typically translates to around 138–150+ marks out of 720. For Government MBBS colleges, candidates generally need 550+ marks. Private college cut-offs are comparatively lower.',
    },
];

// ── Tag color helper ───────────────────────────────────────────────────────
const tagColor = (tag) => {
    if (tag === 'Chemistry') return 'bg-green-900/60 text-green-300';
    if (tag === 'Physics') return 'bg-blue-900/60 text-blue-300';
    if (tag === 'Biology') return 'bg-pink-900/60 text-pink-300';
    return 'bg-gray-700 text-gray-300';
};

// ══════════════════════════════════════════════════════════════════════════════
const NeetExam = () => {
    const [openFaq, setOpenFaq] = React.useState(null);
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('overview');
    const sectionRefs = useRef({});
    const observerRef = useRef(null);

    // Build ref for each section id
    const setRef = useCallback((id) => (el) => {
        sectionRefs.current[id] = el;
    }, []);

    // Scroll to section
    const scrollTo = (id) => {
        const el = sectionRefs.current[id];
        if (el) {
            const offset = 135; // navbar + filter bar height
            const top = el.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    };

    // IntersectionObserver — update active sidebar item on scroll
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

    // ── Section renderers ────────────────────────────────────────────────────

    const renderOverview = () => (
        <div className="space-y-6">
            <p className="text-gray-300 leading-relaxed text-base">
                <strong className="text-white">NEET (UG) {YEAR} Overview:</strong> The National Eligibility cum Entrance Test (NEET) is the single pre-medical entrance test for undergraduate medical admissions in India. It is conducted by the <span className="text-cyan-400 font-semibold">National Testing Agency (NTA)</span> every year.
            </p>
            {/* Latest Notification */}
            <div className="rounded-xl border border-cyan-800/50 bg-cyan-950/30 p-5">
                <h3 className="font-bold text-white mb-3 flex items-center gap-2 text-sm">
                    <i className="fas fa-bell text-cyan-400"></i> Latest Notification
                </h3>
                <ul className="space-y-2 text-gray-300 text-sm list-disc pl-5">
                    <li><strong className="text-white">NEET {YEAR} Registration Open:</strong> Feb – Mar {YEAR}</li>
                    <li>Exam conducted offline (pen &amp; paper) in 13+ languages.</li>
                    <li>Official sites: <a href="https://nta.ac.in" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">nta.ac.in</a> &amp; <a href="https://neet.nta.nic.in" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">neet.nta.nic.in</a></li>
                </ul>
            </div>
            {/* Highlights table */}
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
                            ['Exam Name', 'National Eligibility cum Entrance Test (UG)'],
                            ['Conducting Body', 'National Testing Agency (NTA)'],
                            ['Exam Mode', 'Offline – Pen & Paper'],
                            ['Languages', '13+ Regional Languages'],
                            ['Eligibility', '12th with Physics, Chemistry, Biology'],
                            ['Minimum Age', '17 years'],
                            ['Exam Date', `May ${YEAR} (Tentative)`],
                            ['Result Date', `June ${YEAR} (Tentative)`],
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
            <p>The NEET registration process is exclusively conducted online by the NTA. Eligible candidates must submit their application forms via the official NTA website.</p>
            <h3 className="text-base font-bold text-white mt-4">Steps to Apply:</h3>
            <ol className="list-decimal pl-6 space-y-3">
                {[
                    ['Online Registration', 'Generate an application number by providing your name, email ID, and phone number.'],
                    ['Fill Application Form', 'Complete personal, academic, and communication details carefully.'],
                    ['Upload Documents', 'Scanned passport-size photograph, signature, and thumb impression.'],
                    ['Fee Payment', 'Pay via credit card, debit card, or net banking (non-refundable).'],
                    ['Confirmation Page', 'Download and print the final confirmation page for future reference.'],
                ].map(([title, desc]) => (
                    <li key={title}><strong className="text-white">{title}:</strong> {desc}</li>
                ))}
            </ol>
        </div>
    );

    const renderApplicationForm = () => (
        <div className="space-y-4 text-gray-300 text-sm leading-relaxed">
            <p>Keep the following documents and details ready before starting the application to avoid rejection:</p>
            <ul className="list-disc pl-6 space-y-2">
                {[
                    'Valid mobile number and email address',
                    'Class 10th & Class 12th marksheet / certificate',
                    'Aadhaar card (last 4 digits required)',
                    'Scanned passport-size photograph (10 KB – 200 KB)',
                    'Scanned signature (4 KB – 30 KB)',
                    'Left-hand thumb impression (10 KB – 200 KB)',
                    'Postcard size photograph (10 KB – 200 KB)',
                ].map((item) => <li key={item}>{item}</li>)}
            </ul>
        </div>
    );

    const renderEligibility = () => (
        <div className="space-y-4 text-gray-300 text-sm">
            <p>Before filling the form, ensure you fulfil the criteria below:</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                {[
                    { icon: 'fa-birthday-cake', color: 'text-pink-400', border: 'border-pink-800/50 bg-pink-950/20', title: 'Age Limit', desc: 'Minimum 17 years at time of admission. There is no upper age limit as per latest NTA guidelines.' },
                    { icon: 'fa-book', color: 'text-cyan-400', border: 'border-cyan-800/50 bg-cyan-950/20', title: 'Education', desc: '10+2 with Physics, Chemistry, Biology/Biotechnology and English from a recognised board.' },
                    { icon: 'fa-percent', color: 'text-green-400', border: 'border-green-800/50 bg-green-950/20', title: 'Min. Marks', desc: 'General: 50% | SC/ST/OBC-NCL: 40% | PWD: 45% aggregate in PCB subjects.' },
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
        <div className="space-y-4 text-gray-300 text-sm">
            <p>Offline (pen &amp; paper mode), objective-type MCQs only.</p>
            <div className="overflow-x-auto rounded-xl border border-gray-700 mt-2">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-800 border-b border-gray-700">
                            {['Subject', 'Section A', 'Section B', 'Total Marks'].map((h) => (
                                <th key={h} className="p-4 font-bold text-white text-sm">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700 bg-gray-800/20">
                        {[
                            ['Physics', '35 Qs', '15 Qs (attempt any 10)', '180'],
                            ['Chemistry', '35 Qs', '15 Qs (attempt any 10)', '180'],
                            ['Botany', '35 Qs', '15 Qs (attempt any 10)', '180'],
                            ['Zoology', '35 Qs', '15 Qs (attempt any 10)', '180'],
                            ['Total', '140 Qs', '60 Qs (attempt 40)', '720'],
                        ].map(([sub, a, b, m]) => (
                            <tr key={sub} className={`hover:bg-gray-800/50 transition ${sub === 'Total' ? 'bg-cyan-900/10 font-bold' : ''}`}>
                                <td className="p-4 text-white text-sm">{sub}</td>
                                <td className="p-4 text-gray-300 text-sm">{a}</td>
                                <td className="p-4 text-gray-300 text-sm">{b}</td>
                                <td className="p-4 text-cyan-400 font-bold text-sm">{m}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <p className="text-cyan-300 text-xs font-semibold mt-3">
                <i className="fas fa-info-circle mr-2"></i>Marking Scheme: +4 for correct · −1 for wrong · 0 for unattempted
            </p>
        </div>
    );

    const renderExamDate = () => (
        <div className="space-y-3 text-sm">
            {[
                { period: 'February – March 2027', event: 'Online Submission of Application Form', dot: 'bg-cyan-500' },
                { period: 'March 2027', event: 'Application Form Correction Window', dot: 'bg-blue-500' },
                { period: 'April 2027', event: 'Availability of Admit Cards on NTA website', dot: 'bg-purple-500' },
                { period: 'May 2027', event: 'NEET (UG) Examination Day', dot: 'bg-green-500' },
                { period: 'June 2027', event: 'Declaration of Results on NTA website', dot: 'bg-amber-500' },
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
            <p className="text-gray-300">NEET syllabus is based on Class 11 &amp; 12 NCERT Biology, Physics, and Chemistry curriculum. Download official PDFs below.</p>
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
                            ['Physics', 'Mechanics, Thermodynamics, Waves, Kinetic Theory', 'Electrodynamics, Modern Physics, Optics, Semiconductors', 'https://neet.nta.nic.in'],
                            ['Chemistry', 'Atomic Structure, Bonding, Equilibrium, States of Matter', 'p-Block, Coordination Compounds, Organic Chemistry', 'https://neet.nta.nic.in'],
                            ['Biology', 'Cell Biology, Plant Kingdom, Animal Kingdom, Biomolecules', 'Genetics, Evolution, Human Physiology, Ecology & Environment', 'https://neet.nta.nic.in'],
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
            {/* External PDF links */}
            <div className="space-y-3 mt-2">
                {[
                    { title: 'Official NTA NEET Syllabus PDF', href: 'https://neet.nta.nic.in', icon: 'fa-file-pdf', desc: 'Download directly from the official NTA NEET portal', color: 'border-red-700/50 bg-red-950/20' },
                    { title: 'NCERT Full Syllabus Reference', href: 'https://ncert.nic.in', icon: 'fa-book', desc: 'Complete NCERT curriculum aligned to NEET pattern', color: 'border-blue-700/50 bg-blue-950/20' },
                ].map(({ title, href, icon, desc, color }) => (
                    <a key={title} href={href} target="_blank" rel="noreferrer"
                        className={`flex items-center gap-4 p-4 rounded-xl border ${color} hover:opacity-90 transition`}>
                        <i className={`fas ${icon} text-2xl text-red-400`}></i>
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
            <p className="text-gray-300">Focus on high-weightage chapters to maximise your NEET score:</p>
            {[
                { subject: 'Physics', color: 'text-blue-400', border: 'border-blue-800/50 bg-blue-950/10', topics: ['Mechanics (>30%)', 'Electrodynamics (~20%)', 'Modern Physics', 'Optics', 'Thermodynamics'] },
                { subject: 'Chemistry', color: 'text-green-400', border: 'border-green-800/50 bg-green-950/10', topics: ['Organic Chemistry', 'Equilibrium', 'Electrochemistry', 'p-Block Elements', 'Coordination Compounds'] },
                { subject: 'Biology', color: 'text-pink-400', border: 'border-pink-800/50 bg-pink-950/10', topics: ['Human Physiology', 'Genetics & Evolution', 'Ecology', 'Cell Structure', 'Plant Kingdom'] },
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
            <p>The NEET admit card is released exclusively online on the NTA website. It contains your Roll Number, Exam Centre, Reporting Time, and Instructions.</p>
            <ol className="list-decimal pl-6 space-y-3">
                {[
                    'Visit the official NEET-NTA website (neet.nta.nic.in).',
                    'Click the Admit Card download link on the homepage.',
                    'Enter your Application Number and Date of Birth.',
                    'Download and take a clear, legible coloured printout.',
                    'Verify all details on the admit card carefully before exam day.',
                ].map((s, i) => <li key={i}>{s}</li>)}
            </ol>
            <div className="bg-amber-950/30 border border-amber-700/40 rounded-xl p-4 text-xs text-amber-300">
                <i className="fas fa-exclamation-triangle mr-2"></i>
                <strong>Important:</strong> Carry a printed admit card with a valid government-issued photo ID on exam day. No digital copy is accepted.
            </div>
        </div>
    );

    const renderExamCentre = () => (
        <div className="space-y-4 text-gray-300 text-sm">
            <p>NEET is conducted across 500+ cities in India and select international locations. Centre allocation is based on preferences filled during application.</p>
            <ul className="space-y-3">
                {[
                    { icon: 'fa-clock', color: 'text-cyan-400', text: 'Reach the examination centre at least 2 hours before the exam starts.' },
                    { icon: 'fa-id-card', color: 'text-blue-400', text: 'Carry a printed admit card along with a valid photo ID (Aadhaar / Passport / Driving Licence).' },
                    { icon: 'fa-ban', color: 'text-red-400', text: 'Prohibited items: mobile phones, calculators, smartwatches, electronic gadgets, and metallic objects.' },
                    { icon: 'fa-door-closed', color: 'text-amber-400', text: 'No late entry is permitted after the gate-closing time mentioned on your admit card.' },
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
            <p className="text-gray-400 text-sm">NEET-specific lectures from our YouTube channel:</p>
            <div className="space-y-2">
                {NEET_VIDEOS.map((v, i) => (
                    <a key={i} href={v.url} target="_blank" rel="noreferrer"
                        className="flex items-center gap-4 p-4 rounded-xl border border-gray-700/60 bg-gray-800/20 hover:bg-gray-800/50 hover:border-gray-600 transition group">
                        {/* Thumbnail placeholder */}
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
                    <i className="fab fa-youtube"></i> View All NEET Videos on YouTube
                </a>
            </div>
        </div>
    );

    // Resource group renderer — one link per line
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

    // Map section id → renderer
    const renderers = {
        'overview': renderOverview,
        'registration': renderRegistration,
        'application-form': renderApplicationForm,
        'eligibility-criteria': renderEligibility,
        'exam-pattern': renderExamPattern,
        'exam-date': renderExamDate,
        'neet-syllabus': renderSyllabus,
        'chapter-wise-weightage': renderChapterWeightage,
        'admit-card': renderAdmitCard,
        'exam-centre': renderExamCentre,
        'videos': renderVideos,
        'courses': () => renderResourceGroup(RESOURCE_GROUPS[0]),
        'study-material': () => renderResourceGroup(RESOURCE_GROUPS[1]),
        'practice-tools': () => renderResourceGroup(RESOURCE_GROUPS[2]),
        'ncert-resources': () => renderResourceGroup(RESOURCE_GROUPS[3]),
    };

    // ── Render ─────────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-gray-950 text-gray-200 pb-28">

            {/* ── Hero Header ── */}
            <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-950 to-black pt-8 pb-8 border-b border-gray-800">
                <div className="absolute inset-0 pointer-events-none" style={{
                    backgroundImage: 'radial-gradient(circle at 15% 50%, rgba(6,182,212,0.08) 0%, transparent 50%), radial-gradient(circle at 85% 20%, rgba(59,130,246,0.08) 0%, transparent 50%)',
                }} />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                        <Link to="/" className="hover:text-cyan-400 transition">Home</Link>
                        <i className="fas fa-chevron-right text-gray-700 text-xs"></i>
                        <span className="hover:text-cyan-400 cursor-pointer" onClick={() => scrollTo('overview')}>Exams</span>
                        <i className="fas fa-chevron-right text-gray-700 text-xs"></i>
                        <span className="text-cyan-400">NEET</span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-10">
                        <div className="flex-1">
                            <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold px-3 py-1.5 rounded-full mb-4">
                                <i className="fas fa-stethoscope"></i> NEET UG {YEAR}
                            </div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-3 leading-tight">
                                NEET {YEAR} — Exam Date,{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                                    Important Information
                                </span>
                                , Latest Notification &amp; Complete Schedule
                            </h1>
                            <p className="text-gray-400 text-sm md:text-base max-w-3xl">
                                One-stop hub for NEET {YEAR} — syllabus, exam dates, admit card, eligibility criteria, videos, and all study resources.
                            </p>
                            {/* Stat chips */}
                            <div className="flex flex-wrap gap-3 mt-5">
                                {[
                                    { label: 'Exam Date', value: `May ${YEAR}`, icon: 'fa-calendar-alt', color: 'text-cyan-400' },
                                    { label: 'Total Marks', value: '720', icon: 'fa-star', color: 'text-yellow-400' },
                                    { label: 'Mode', value: 'Offline', icon: 'fa-pencil-alt', color: 'text-green-400' },
                                    { label: 'Questions', value: '200 MCQs', icon: 'fa-question-circle', color: 'text-pink-400' },
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
                        <div className="flex-shrink-0 bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border border-cyan-700/40 rounded-2xl p-6 text-center min-w-[180px]">
                            <p className="text-xs text-gray-400 mb-1">NEET {YEAR}</p>
                            <p className="text-5xl font-extrabold text-cyan-400 leading-none">May</p>
                            <p className="text-3xl font-extrabold text-white">{YEAR}</p>
                            <p className="text-xs text-gray-500 mt-2 border-t border-gray-700 pt-2">Tentative Exam Date</p>
                            <a href="https://neet.nta.nic.in" target="_blank" rel="noreferrer"
                                className="mt-4 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition w-full">
                                <i className="fas fa-download"></i> Download Info PDF
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Filter Tab Bar ── */}
            <div className="sticky top-20 z-30 bg-gray-950/95 backdrop-blur-md border-b border-gray-800 shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2 py-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
                        <a href="https://neet.nta.nic.in" target="_blank" rel="noreferrer"
                            className="flex-shrink-0 flex items-center gap-2 border border-orange-500 text-orange-400 hover:bg-orange-500/10 text-xs font-bold px-4 py-2 rounded-lg transition whitespace-nowrap">
                            <i className="fas fa-download"></i> Download PDF
                        </a>
                        {FILTER_TABS.map((tab) => (
                            <button key={tab.id}
                                onClick={() => scrollTo(tab.id)}
                                className={`flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg transition whitespace-nowrap border ${activeSection === tab.id
                                    ? 'bg-cyan-600/20 border-cyan-500 text-cyan-300'
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

                    {/* ── Scrollable Content Area ── */}
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
                                    {/* Section heading */}
                                    <div className="flex items-center gap-3 mb-5">
                                        <div className="w-1 h-8 rounded-full bg-gradient-to-b from-cyan-400 to-blue-600 flex-shrink-0"></div>
                                        <i className={`fas ${icon} text-cyan-500 text-sm`}></i>
                                        <h2 className="text-lg md:text-xl font-extrabold text-white">{label}</h2>
                                    </div>
                                    <div className="bg-gray-900/50 border border-gray-800/80 rounded-2xl p-5 md:p-7">
                                        {renderer ? renderer() : <p className="text-gray-500 text-sm">Content coming soon…</p>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* ── Sticky Sidebar ── */}
                    <div className="w-full lg:w-1/4 order-1 lg:order-2">
                        <div className="sticky top-[136px]">
                            <div className="rounded-2xl border border-gray-700 overflow-hidden shadow-xl bg-gray-900">
                                <div className="bg-gradient-to-r from-cyan-900/70 to-blue-900/70 px-5 py-4 border-b border-gray-700">
                                    <h3 className="font-bold text-white flex items-center gap-2 text-sm">
                                        <i className="fas fa-list-ul text-cyan-400"></i>
                                        NEET {YEAR} — Exam Info
                                    </h3>
                                </div>
                                <div className="flex flex-col divide-y divide-gray-800/70 max-h-[72vh] overflow-y-auto"
                                    style={{ scrollbarWidth: 'thin' }}>
                                    {SECTIONS.map(({ id, label, icon }) => (
                                        <button
                                            key={id}
                                            onClick={() => scrollTo(id)}
                                            className={`w-full text-left px-4 py-3 transition-all duration-200 flex items-center gap-3 text-sm ${activeSection === id
                                                ? 'text-cyan-400 bg-gray-800/80 border-l-4 border-cyan-400 pl-3'
                                                : 'text-gray-400 hover:bg-gray-800/40 hover:text-gray-200 border-l-4 border-transparent'
                                                }`}
                                        >
                                            <i className={`fas ${icon} text-xs flex-shrink-0 ${activeSection === id ? 'text-cyan-400' : 'text-gray-600'}`}></i>
                                            <span className="flex-1 leading-tight font-medium">{label}</span>
                                            {activeSection === id && (
                                                <i className="fas fa-chevron-right text-cyan-500 text-xs flex-shrink-0"></i>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Quick external links */}
                            <div className="mt-4 rounded-2xl border border-gray-700 bg-gray-900 p-4">
                                <p className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-widest">Official Links</p>
                                <div className="space-y-2.5">
                                    {[
                                        { label: 'NEET Official Site', href: 'https://neet.nta.nic.in', icon: 'fa-external-link-alt', color: 'text-cyan-400' },
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
                    <div className="w-1 h-8 rounded-full bg-gradient-to-b from-cyan-400 to-blue-600 flex-shrink-0"></div>
                    <i className="fas fa-question-circle text-cyan-500 text-sm"></i>
                    <h2 className="text-xl md:text-2xl font-extrabold text-white">NEET {YEAR} — Frequently Asked Questions</h2>
                </div>
                <div className="space-y-3">
                    {NEET_FAQS.map((faq, idx) => (
                        <div
                            key={idx}
                            className={`rounded-2xl border transition-all duration-300 overflow-hidden ${openFaq === idx
                                ? 'border-cyan-600/60 bg-cyan-950/20'
                                : 'border-gray-700/70 bg-gray-900/50 hover:border-gray-600'
                                }`}
                        >
                            <button
                                className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left"
                                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                            >
                                <span className={`font-semibold text-sm md:text-base leading-snug ${openFaq === idx ? 'text-cyan-300' : 'text-white'
                                    }`}>
                                    <span className="inline-block text-cyan-500 font-bold mr-2">Q{idx + 1}.</span>
                                    {faq.q}
                                </span>
                                <i className={`fas fa-chevron-down text-xs flex-shrink-0 transition-transform duration-300 ${openFaq === idx ? 'rotate-180 text-cyan-400' : 'text-gray-500'
                                    }`}></i>
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

            <style dangerouslySetInnerHTML={{
                __html: `
        .scroll-mt-40 { scroll-margin-top: 160px; }
      ` }} />
        </div>
    );
};

export default NeetExam;
