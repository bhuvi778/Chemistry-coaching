const mongoose = require('mongoose');
const PuzzleSet = require('./models/PuzzleSet');

// Simple 1x1 red pixel PNG in base64
const testThumbnail = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==';

// Simple PDF in base64 (minimal valid PDF)
const testPDF = 'data:application/pdf;base64,JVBERi0xLjAKMSAwIG9iago8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFI+PmVuZG9iagoyIDAgb2JqCjw8L1R5cGUvUGFnZXMvS2lkc1szIDAgUl0vQ291bnQgMT4+ZW5kb2JqCjMgMCBvYmoKPDwvVHlwZS9QYWdlL01lZGlhQm94WzAgMCA2MTIgNzkyXS9QYXJlbnQgMiAwIFI+PmVuZG9iagp4cmVmCjAgNAowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTAgMDAwMDAgbiAKMDAwMDAwMDA1MyAwMDAwMCBuIAowMDAwMDAwMTAyIDAwMDAwIG4gCnRyYWlsZXIKPDwvU2l6ZSA0L1Jvb3QgMSAwIFI+PgpzdGFydHhyZWYKMTY5CiUlRU9G';

mongoose.connect('mongodb://127.0.0.1:27017/test')
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    
    const testPuzzle = new PuzzleSet({
      setNumber: 'TEST-001',
      title: 'Test Puzzle Set',
      description: 'Automated test puzzle',
      chapter: 'Test Chapter',
      topic: 'Test Topic',
      examType: 'JEE',
      difficulty: 'Easy',
      thumbnailUrl: testThumbnail,
      setPdfUrl: testPDF,
      answerPdfUrl: testPDF
    });
    
    const saved = await testPuzzle.save();
    console.log('✅ Test puzzle saved successfully!');
    console.log('📸 Has thumbnail:', !!saved.thumbnailUrl, '- Length:', saved.thumbnailUrl?.length || 0);
    console.log('📄 Has setPDF:', !!saved.setPdfUrl, '- Length:', saved.setPdfUrl?.length || 0);
    console.log('✔️  Has answerPDF:', !!saved.answerPdfUrl, '- Length:', saved.answerPdfUrl?.length || 0);
    
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
