export const dummyNCERTData = {
    chapters: [
        {
            _id: "chap_001",
            name: "Some Basic Concepts of Chemistry",
            chapterNumber: "Chapter 1",
            description: "Introduction to chemistry, matter, atomic mass, molecular mass, and mole concept.",
            icon: "fa-flask",
            color: "cyan",
            category: "line-by-line"
        },
        {
            _id: "chap_002",
            name: "Structure of Atom",
            chapterNumber: "Chapter 2",
            description: "Atomic models, quantum mechanical model, electronic configuration.",
            icon: "fa-atom",
            color: "purple",
            category: "line-by-line"
        },
        {
            _id: "chap_003",
            name: "Classification of Elements",
            chapterNumber: "Chapter 3",
            description: "Periodic table history, trends in physical and chemical properties.",
            icon: "fa-th",
            color: "blue",
            category: "line-by-line"
        },
        {
            _id: "chap_004",
            name: "Chemical Bonding and Molecular Structure",
            chapterNumber: "Chapter 4",
            description: "Ionic and covalent bonds, VSEPR theory, molecular orbital theory.",
            icon: "fa-link",
            color: "pink",
            category: "line-by-line"
        },
        {
            _id: "chap_005",
            name: "States of Matter",
            chapterNumber: "Chapter 5",
            description: "Gas laws, kinetic molecular theory, intermolecular forces.",
            icon: "fa-cloud",
            color: "green",
            category: "line-by-line"
        },
        {
            _id: "chap_006",
            name: "Thermodynamics",
            chapterNumber: "Chapter 6",
            description: "First law, enthalpy, entropy, free energy.",
            icon: "fa-fire",
            color: "orange",
            category: "line-by-line"
        }
    ],
    topics: {
        "chap_001": [
            {
                _id: "topic_101",
                name: "Mole Concept and Molar Mass",
                difficulty: "Medium",
                questions: 15,
                progress: 45,
                chapterId: "chap_001",
                description: "Understanding moles, molar mass, and Avogadro's number calculations."
            },
            {
                _id: "topic_102",
                name: "Stoichiometry",
                difficulty: "Hard",
                questions: 12,
                progress: 20,
                chapterId: "chap_001",
                description: "Calculations involving chemical equations and limiting reagents."
            }
        ],
        "chap_002": [
            {
                _id: "topic_201",
                name: "Bohr's Model",
                difficulty: "Easy",
                questions: 10,
                progress: 80,
                chapterId: "chap_002",
                description: "Postulates and limitations of Bohr's atomic model."
            },
            {
                _id: "topic_202",
                name: "Quantum Mechanical Model",
                difficulty: "Hard",
                questions: 18,
                chapterId: "chap_002",
                description: "Schrodinger equation, quantum numbers, and orbitals."
            }
        ],
        "chap_003": [
            {
                _id: "topic_301",
                name: "Periodic Trends",
                difficulty: "Medium",
                questions: 20,
                chapterId: "chap_003",
                description: "Trends in atomic radius, ionization energy, and electron affinity."
            }
        ],
        "chap_004": [
            {
                _id: "topic_401",
                name: "VSEPR Theory",
                difficulty: "Hard",
                questions: 15,
                chapterId: "chap_004",
                description: "Predicting molecular geometry and bond agles."
            },
            {
                _id: "topic_402",
                name: "Hybridization",
                difficulty: "Medium",
                questions: 12,
                chapterId: "chap_004",
                description: "sp, sp2, sp3 hybridization and molecular shapes."
            }
        ],
        "chap_005": [
            {
                _id: "topic_501",
                name: "Ideal Gas Equation",
                difficulty: "Medium",
                questions: 14,
                chapterId: "chap_005",
                description: "PV=nRT applications and calculations."
            }
        ],
        "chap_006": [
            {
                _id: "topic_601",
                name: "Enthalpy Changes",
                difficulty: "Hard",
                questions: 16,
                chapterId: "chap_006",
                description: "Hess's law, enthalpy of formation/combustion."
            }
        ]
    },
    questions: {
        "topic_101": [
            {
                _id: "q_101_01",
                question: "Calculate the number of moles in 52g of He.",
                questionType: "Numerical",
                difficulty: "Easy",
                marks: 2,
                ncertLine: "Page 18, Problem 1.4",
                hint: "Atomic mass of He is 4u.",
                solution: "No. of moles = Mass / Molar Mass = 52 / 4 = 13 moles."
            },
            {
                _id: "q_101_02",
                question: "Which has more number of atoms, 100g of Sodium or 100g of Iron?",
                questionType: "Conceptual",
                difficulty: "Medium",
                marks: 3,
                ncertLine: "Page 19, Concept of Atomicity",
                hint: "Calculate moles then multiply by Avogadro's number.",
                solution: "Na (23g/mol) > Fe (56g/mol). 100g Na has more moles, thus more atoms."
            },
            {
                _id: "q_101_03",
                question: "What is the concentration of sugar (C12H22O11) in mol L-1 if its 20g are dissolved in enough water to make a final volume up to 2L?",
                questionType: "Numerical",
                difficulty: "Medium",
                marks: 3,
                ncertLine: "Page 22, Problem 1.7",
                hint: "Molar mass of sugar is 342 g/mol. Molarity = Moles/Volume(L).",
                solution: "Moles = 20/342 = 0.0585 mol. Molarity = 0.0585 / 2 = 0.0293 M."
            }
        ],
        "topic_102": [
            {
                _id: "q_102_01",
                question: "How much copper can be obtained from 100g of copper sulphate (CuSO4)?",
                questionType: "Numerical",
                difficulty: "Medium",
                marks: 3,
                ncertLine: "Page 21, Problem 1.6",
                hint: "Molar mass of CuSO4 is 159.5 g/mol. Atomic mass of Cu is 63.5 g/mol.",
                solution: "1 mole (159.5g) CuSO4 contains 1 mole (63.5g) Cu. Amount of Cu in 100g = (63.5/159.5) * 100 = 39.81g."
            }
        ],
        "topic_201": [
            {
                _id: "q_201_01",
                question: "What is the frequency of radiation emitted when electron falls from n=4 to n=1 in H-atom?",
                questionType: "Numerical",
                difficulty: "Hard",
                marks: 4,
                ncertLine: "Page 45, Equation 2.17",
                hint: "Use Rydberg formula.",
                solution: "Using Rydberg formula: v = R(1/n1^2 - 1/n2^2)... Answer calculation..."
            }
        ],
        "topic_301": [
            {
                _id: "q_301_01",
                question: "Explain why cation is smaller than its parent atom.",
                questionType: "Conceptual",
                difficulty: "Easy",
                marks: 2,
                ncertLine: "Page 87, 3.7.1",
                hint: "Consider effective nuclear charge.",
                solution: "Cations are formed by loss of electrons. This increases effective nuclear charge per electron, pulling the shell closer, reducing size."
            }
        ],
        "topic_401": [
            {
                _id: "q_401_01",
                question: "Predict the shape of SF6 molecule using VSEPR theory.",
                questionType: "Conceptual",
                difficulty: "Medium",
                marks: 3,
                ncertLine: "Page 112, Table 4.6",
                hint: "Count total valence electrons and bonding pairs.",
                solution: "Sulphur has 6 valence electrons. Forms 6 bonds with F. Steric number 6. Geometry: Octahedral."
            }
        ],
        "topic_402": [
            {
                _id: "q_402_01",
                question: "Describe the hybridization in C2H2.",
                questionType: "Conceptual",
                difficulty: "Medium",
                marks: 3,
                ncertLine: "Page 118, 4.6.3",
                hint: "Look at the triple bond.",
                solution: "Each Carbon is sp hybridized. One sigma bond between C-C, two pi bonds."
            }
        ],
        "topic_501": [
            {
                _id: "q_501_01",
                question: "Calculate the volume occupied by 8.8g of CO2 at 31.1°C and 1 bar pressure.",
                questionType: "Numerical",
                difficulty: "Medium",
                marks: 3,
                ncertLine: "Page 142, Problem 5.3",
                hint: "Use PV=nRT. n = 8.8/44.",
                solution: "n = 0.2 mol. V = nRT/P = (0.2 * 0.083 * 304.1) / 1 = 5.05 L."
            }
        ],
        "topic_601": [
            {
                _id: "q_601_01",
                question: "Standard enthalpy of combustion of CH4 is -890 kJ/mol. How much heat is evolved when 10g of CH4 burns?",
                questionType: "Numerical",
                difficulty: "Medium",
                marks: 3,
                ncertLine: "Page 170, Problem 6.8",
                hint: "Calculate moles of CH4 in 10g.",
                solution: "Moles = 10/16 = 0.625 mol. Heat = 0.625 * 890 = 556.25 kJ."
            }
        ]
    }
};
