const mongoose = require('mongoose');
require('dotenv').config();

const Blog = require('../models/Blog');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/chemistry_coaching';

const sampleBlogWithMedia = {
    title: 'Mastering Organic Chemistry: Complete Guide for JEE & NEET 2025',
    slug: 'mastering-organic-chemistry-complete-guide-jee-neet-2025',
    author: 'JEE',
    excerpt: 'A comprehensive guide to mastering Organic Chemistry for JEE and NEET 2025. Includes video tutorials, important diagrams, reaction mechanisms, and expert tips to score maximum marks.',
    content: `
    <h2>Introduction to Organic Chemistry Mastery</h2>
    <p>Organic Chemistry is often considered one of the most challenging yet scoring subjects in JEE and NEET. With the right approach, proper understanding of mechanisms, and consistent practice, you can master this subject and score exceptionally well in your exams.</p>

    <h2>Why Organic Chemistry is Crucial for JEE & NEET</h2>
    <p>Organic Chemistry carries significant weightage in both JEE and NEET examinations:</p>
    <ul>
      <li><strong>JEE Main:</strong> Approximately 30-35% of Chemistry section (10-12 questions)</li>
      <li><strong>JEE Advanced:</strong> 40-45% weightage with complex mechanism-based questions</li>
      <li><strong>NEET:</strong> 25-30% of Chemistry section with focus on reactions and conversions</li>
    </ul>

    <h3>Key Topics You Must Master</h3>
    <ol>
      <li><strong>General Organic Chemistry (GOC):</strong> Foundation of all organic chemistry - inductive effect, resonance, hyperconjugation, and reaction mechanisms</li>
      <li><strong>Hydrocarbons:</strong> Alkanes, alkenes, alkynes, and aromatic compounds</li>
      <li><strong>Organic Compounds with Functional Groups:</strong> Alcohols, phenols, ethers, aldehydes, ketones, carboxylic acids, and their derivatives</li>
      <li><strong>Biomolecules:</strong> Carbohydrates, proteins, amino acids, and nucleic acids</li>
      <li><strong>Polymers:</strong> Classification, preparation, and properties</li>
      <li><strong>Chemistry in Everyday Life:</strong> Drugs, detergents, and chemicals in daily use</li>
    </ol>

    <h2>The 3-Month Organic Chemistry Study Plan</h2>
    
    <h3>Month 1: Building Strong Foundations</h3>
    <p><strong>Week 1-2: General Organic Chemistry</strong></p>
    <ul>
      <li>Master electronic effects: Inductive, mesomeric, hyperconjugation</li>
      <li>Understand reaction mechanisms: SN1, SN2, E1, E2</li>
      <li>Practice identifying reactive intermediates: carbocations, carbanions, free radicals</li>
      <li>Learn IUPAC nomenclature thoroughly</li>
    </ul>

    <p><strong>Week 3-4: Hydrocarbons</strong></p>
    <ul>
      <li>Study preparation methods and properties of alkanes, alkenes, alkynes</li>
      <li>Focus on aromatic chemistry - Hückel's rule, aromaticity, electrophilic substitution</li>
      <li>Practice all name reactions: Wurtz, Friedel-Crafts, Birch reduction, etc.</li>
      <li>Memorize important reagents and their specific uses</li>
    </ul>

    <h3>Month 2: Functional Groups Mastery</h3>
    <p><strong>Week 1: Alcohols, Phenols, and Ethers</strong></p>
    <ul>
      <li>Preparation methods from different starting materials</li>
      <li>Chemical reactions and their mechanisms</li>
      <li>Distinction tests between alcohols and phenols</li>
      <li>Important conversions and reagents</li>
    </ul>

    <p><strong>Week 2: Aldehydes and Ketones</strong></p>
    <ul>
      <li>Nucleophilic addition reactions</li>
      <li>Aldol condensation, Cannizzaro reaction, Clemmensen reduction</li>
      <li>Distinction between aldehydes and ketones</li>
      <li>Important named reactions</li>
    </ul>

    <p><strong>Week 3: Carboxylic Acids and Derivatives</strong></p>
    <ul>
      <li>Acidity of carboxylic acids and factors affecting it</li>
      <li>Preparation and reactions of acid chlorides, anhydrides, esters, amides</li>
      <li>Hell-Volhard-Zelinsky reaction, Kolbe's electrolysis</li>
      <li>Interconversion of derivatives</li>
    </ul>

    <p><strong>Week 4: Nitrogen Compounds</strong></p>
    <ul>
      <li>Amines: basicity, preparation, and reactions</li>
      <li>Diazonium salts and their importance</li>
      <li>Distinction tests for primary, secondary, and tertiary amines</li>
    </ul>

    <h3>Month 3: Biomolecules, Polymers & Revision</h3>
    <p><strong>Week 1-2: Biomolecules and Polymers</strong></p>
    <ul>
      <li>Carbohydrates: monosaccharides, disaccharides, polysaccharides</li>
      <li>Proteins and amino acids: structure, properties, peptide bonds</li>
      <li>Enzymes and vitamins</li>
      <li>Polymers: addition and condensation polymers</li>
    </ul>

    <p><strong>Week 3-4: Intensive Revision and Practice</strong></p>
    <ul>
      <li>Solve previous year questions (PYQs) from JEE and NEET</li>
      <li>Take topic-wise mock tests</li>
      <li>Revise all name reactions and mechanisms</li>
      <li>Practice conversion problems daily</li>
    </ul>

    <h2>Pro Tips for Organic Chemistry Success</h2>
    
    <h3>1. Master the Mechanisms</h3>
    <p>Don't just memorize reactions - understand WHY they happen. Draw electron movement arrows, identify nucleophiles and electrophiles, and understand the stability of intermediates.</p>

    <h3>2. Create a Reaction Chart</h3>
    <p>Make a comprehensive chart showing all reactions of each functional group. This visual representation helps in quick revision and better retention.</p>

    <h3>3. Practice Conversions Daily</h3>
    <p>Solve at least 10-15 conversion problems every day. This improves your ability to think of multiple pathways and choose the most efficient one.</p>

    <h3>4. Use Mnemonics and Memory Tricks</h3>
    <p>Create mnemonics for remembering reagents, conditions, and reaction sequences. For example, "Please Send Lions, Cats, Monkeys And Zebras In Udupi" for the reactivity series.</p>

    <h3>5. Focus on Name Reactions</h3>
    <p>JEE and NEET love to test name reactions. Make a separate list of all important name reactions with their conditions and products.</p>

    <h2>Important Reagents You Must Know</h2>
    <ul>
      <li><strong>LiAlH₄:</strong> Strong reducing agent - reduces esters, acids, aldehydes, ketones to alcohols</li>
      <li><strong>NaBH₄:</strong> Mild reducing agent - reduces only aldehydes and ketones</li>
      <li><strong>PCC (Pyridinium Chlorochromate):</strong> Oxidizes primary alcohols to aldehydes (stops at aldehyde)</li>
      <li><strong>KMnO₄:</strong> Strong oxidizing agent - oxidizes alkenes, alcohols, aldehydes</li>
      <li><strong>Grignard Reagent (RMgX):</strong> Nucleophilic addition to carbonyl compounds</li>
      <li><strong>Lucas Reagent (ZnCl₂ + HCl):</strong> Distinguishes between 1°, 2°, and 3° alcohols</li>
    </ul>

    <h2>Common Mistakes to Avoid</h2>
    <ol>
      <li><strong>Ignoring GOC:</strong> Many students skip General Organic Chemistry thinking it's theoretical. This is the foundation - master it first!</li>
      <li><strong>Not practicing mechanisms:</strong> Understanding mechanisms helps you solve unseen problems in exams</li>
      <li><strong>Memorizing without understanding:</strong> Organic chemistry is about logic, not rote learning</li>
      <li><strong>Skipping NCERT:</strong> NCERT is the bible for NEET and crucial for JEE Mains. Don't ignore it!</li>
      <li><strong>Not revising regularly:</strong> Organic chemistry requires constant revision to retain reactions and mechanisms</li>
    </ol>

    <h2>Recommended Practice Strategy</h2>
    <p><strong>Daily Routine:</strong></p>
    <ul>
      <li>Morning: Learn new concepts and mechanisms (2 hours)</li>
      <li>Afternoon: Solve NCERT exercises and examples (1 hour)</li>
      <li>Evening: Practice previous year questions (1.5 hours)</li>
      <li>Night: Quick revision of the day's topics (30 minutes)</li>
    </ul>

    <p><strong>Weekly Targets:</strong></p>
    <ul>
      <li>Complete 2-3 chapters thoroughly</li>
      <li>Solve 100+ MCQs from various sources</li>
      <li>Attempt 1 full-length mock test</li>
      <li>Revise previous week's topics</li>
    </ul>

    <h2>Final Words of Motivation</h2>
    <p>Organic Chemistry might seem overwhelming at first, but with consistent effort and the right strategy, you can not only master it but also enjoy it! Remember, every IIT-JEE topper and NEET AIR holder has walked this path. What sets them apart is their dedication, smart work, and never-give-up attitude.</p>

    <p><strong>Key Takeaways:</strong></p>
    <ul>
      <li>✅ Start with GOC - it's the foundation</li>
      <li>✅ Understand mechanisms, don't just memorize</li>
      <li>✅ Practice conversions daily</li>
      <li>✅ Make comprehensive notes and charts</li>
      <li>✅ Solve PYQs religiously</li>
      <li>✅ Revise regularly and consistently</li>
    </ul>

    <p>Stay focused, stay consistent, and success will follow. All the best for your JEE and NEET preparation! 🎯</p>
  `,
    category: 'JEE',
    tags: ['Organic Chemistry', 'JEE 2025', 'NEET 2025', 'Study Plan', 'Chemistry Tips', 'Name Reactions'],
    isPublished: true,
    publishedDate: new Date('2024-11-09'),
    views: 1247,

    // Video URLs - Educational content
    videoUrls: [
        'https://www.youtube.com/embed/dQw4w9WgXcQ', // Replace with actual chemistry video
        'https://www.youtube.com/embed/dQw4w9WgXcQ'  // Replace with actual chemistry video
    ],

    // Additional Images - Will be populated with placeholder URLs
    additionalImages: [
        'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=600&fit=crop', // Chemistry lab
        'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=800&h=600&fit=crop', // Molecular structure
        'https://images.unsplash.com/photo-1554475901-4538ddfbccc2?w=800&h=600&fit=crop', // Chemistry equipment
        'https://images.unsplash.com/photo-1564325724739-bae0bd08762c?w=800&h=600&fit=crop', // Chemical formulas
        'https://images.unsplash.com/photo-1628595351029-c2bf17511435?w=800&h=600&fit=crop', // Lab work
        'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&h=600&fit=crop'  // Chemistry study
    ],

    featuredImage: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=1200&h=600&fit=crop',

    metaTitle: 'Master Organic Chemistry for JEE & NEET 2025 - Complete Guide',
    metaDescription: 'Comprehensive guide to mastering Organic Chemistry for JEE and NEET 2025. Includes study plan, video tutorials, important reactions, mechanisms, and expert tips.',
    metaKeywords: ['Organic Chemistry', 'JEE Preparation', 'NEET Chemistry', 'Study Guide', 'Name Reactions', 'Chemistry Tips']
};

async function createSampleBlogWithMedia() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Check if blog already exists
        const existingBlog = await Blog.findOne({ slug: sampleBlogWithMedia.slug });
        if (existingBlog) {
            console.log('⏭️  Blog already exists. Updating with new content...');
            await Blog.findByIdAndUpdate(existingBlog._id, sampleBlogWithMedia);
            console.log('✅ Blog updated successfully!');
        } else {
            const blog = new Blog(sampleBlogWithMedia);
            await blog.save();
            console.log('✅ Created blog with media successfully!');
        }

        console.log('\n📊 Blog Details:');
        console.log(`   Title: ${sampleBlogWithMedia.title}`);
        console.log(`   Slug: ${sampleBlogWithMedia.slug}`);
        console.log(`   Videos: ${sampleBlogWithMedia.videoUrls.length}`);
        console.log(`   Images: ${sampleBlogWithMedia.additionalImages.length}`);
        console.log(`   Category: ${sampleBlogWithMedia.category}`);
        console.log(`   Views: ${sampleBlogWithMedia.views}`);

        console.log('\n🔗 Access the blog at:');
        console.log(`   Frontend: http://localhost:5173/blog/${sampleBlogWithMedia.slug}`);
        console.log(`   All Blogs: http://localhost:5173/blogs`);

        console.log('\n📝 Note: Replace the YouTube video URLs with actual chemistry tutorial videos');
        console.log('   Current URLs are placeholders - update them in the admin panel');

    } catch (error) {
        console.error('❌ Error creating blog:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\n👋 Database connection closed');
    }
}

createSampleBlogWithMedia();
