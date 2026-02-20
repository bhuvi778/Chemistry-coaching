#!/bin/bash

echo "🔍 NCERT Toolbox - Frontend Questions Diagnostic"
echo "================================================"
echo ""

# Check if backend is running
echo "1️⃣ Checking Backend Server..."
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/ncert/questions)
if [ "$BACKEND_STATUS" = "200" ]; then
    echo "   ✅ Backend is running and responding"
else
    echo "   ❌ Backend is NOT responding (Status: $BACKEND_STATUS)"
    echo "   Please start the backend server: cd server && npm run dev"
    exit 1
fi

# Check questions in database
echo ""
echo "2️⃣ Checking Questions in Database..."
QUESTIONS_COUNT=$(curl -s "http://localhost:5000/api/ncert/questions" | python3 -c "import sys, json; print(len(json.load(sys.stdin)))" 2>/dev/null)
echo "   Total questions: $QUESTIONS_COUNT"

# Check questions by category
echo ""
echo "3️⃣ Questions by Category:"
echo "   Questions Tab (in-text):"
curl -s "http://localhost:5000/api/ncert/questions?category=questions&badgeType=in-text" | python3 -c "import sys, json; data = json.load(sys.stdin); print(f'      Found: {len(data)} questions'); [print(f'      - {q[\"question\"][:50]}...') for q in data[:2]]" 2>/dev/null

echo ""
echo "   Exemplars Tab (exemplar-mcq):"
curl -s "http://localhost:5000/api/ncert/questions?category=exemplars&badgeType=exemplar-mcq" | python3 -c "import sys, json; data = json.load(sys.stdin); print(f'      Found: {len(data)} questions'); [print(f'      - {q[\"question\"][:50]}...') for q in data[:2]]" 2>/dev/null

echo ""
echo "   Diagrams Tab (diagram-label):"
curl -s "http://localhost:5000/api/ncert/questions?category=diagrams&badgeType=diagram-label" | python3 -c "import sys, json; data = json.load(sys.stdin); print(f'      Found: {len(data)} questions'); [print(f'      - {q[\"question\"][:50]}...') for q in data[:2]]" 2>/dev/null

# Check if frontend dev server is running
echo ""
echo "4️⃣ Checking Frontend Dev Server..."
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5173 2>/dev/null)
if [ "$FRONTEND_STATUS" = "200" ]; then
    echo "   ✅ Frontend dev server is running"
else
    echo "   ⚠️  Frontend dev server might not be running"
    echo "   Start it with: npm run dev"
fi

# Check proxy configuration
echo ""
echo "5️⃣ Checking Vite Proxy Configuration..."
if grep -q "'/api'" /www/wwwroot/reaction-lab/vite.config.js; then
    echo "   ✅ Proxy configuration found in vite.config.js"
else
    echo "   ❌ Proxy configuration NOT found"
fi

echo ""
echo "================================================"
echo "📋 SUMMARY:"
echo ""
echo "Backend API: ✅ Working"
echo "Questions in DB: ✅ $QUESTIONS_COUNT questions"
echo ""
echo "🔧 NEXT STEPS:"
echo ""
echo "1. RESTART the frontend dev server:"
echo "   - Press Ctrl+C in the terminal running 'npm run dev'"
echo "   - Run: npm run dev"
echo ""
echo "2. Open browser to: http://localhost:5173"
echo ""
echo "3. Navigate to: NCERT Toolbox → Questions → Click badge"
echo ""
echo "4. Questions should now appear! 🎉"
echo ""
echo "================================================"
