#!/bin/bash

echo "🔍 Assertion & Reason - System Verification"
echo "==========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Check if server is running
echo "1️⃣  Checking if server is running..."
if pm2 list | grep -q "reaction-server"; then
    echo -e "${GREEN}✅ Server is running${NC}"
else
    echo -e "${RED}❌ Server is not running${NC}"
    exit 1
fi
echo ""

# Test 2: Check database connection
echo "2️⃣  Checking database..."
CHAPTER_COUNT=$(mongo chemistry_coaching --quiet --eval "db.assertionreasonchapters.count()")
QUESTION_COUNT=$(mongo chemistry_coaching --quiet --eval "db.assertionreasonquestions.count()")

if [ "$CHAPTER_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✅ Database connected${NC}"
    echo "   📚 Chapters: $CHAPTER_COUNT"
    echo "   ❓ Questions: $QUESTION_COUNT"
else
    echo -e "${RED}❌ No data in database${NC}"
    exit 1
fi
echo ""

# Test 3: Test frontend API endpoint
echo "3️⃣  Testing frontend API endpoint..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:5000/api/assertion-reason/chapters?userId=guest")

if [ "$RESPONSE" -eq 200 ]; then
    echo -e "${GREEN}✅ Frontend API working (HTTP $RESPONSE)${NC}"
    
    # Get stats
    STATS=$(curl -s "http://localhost:5000/api/assertion-reason/chapters?userId=guest" | jq -r '.stats | "   Total Questions: \(.totalQuestions)\n   Total Chapters: \(.totalChapters)\n   Due Today: \(.dueToday)\n   Mastered: \(.mastered)"')
    echo "$STATS"
else
    echo -e "${RED}❌ Frontend API failed (HTTP $RESPONSE)${NC}"
    exit 1
fi
echo ""

# Test 4: Test admin API endpoint
echo "4️⃣  Testing admin API endpoint..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:5000/api/assertion-reason/admin/chapters")

if [ "$RESPONSE" -eq 200 ]; then
    echo -e "${GREEN}✅ Admin API working (HTTP $RESPONSE)${NC}"
else
    echo -e "${RED}❌ Admin API failed (HTTP $RESPONSE)${NC}"
    exit 1
fi
echo ""

# Test 5: Test chapter details endpoint
echo "5️⃣  Testing chapter details endpoint..."
FIRST_CHAPTER_ID=$(curl -s "http://localhost:5000/api/assertion-reason/chapters?userId=guest" | jq -r '.chapters[0]._id')
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:5000/api/assertion-reason/chapters/$FIRST_CHAPTER_ID?userId=guest")

if [ "$RESPONSE" -eq 200 ]; then
    echo -e "${GREEN}✅ Chapter details API working (HTTP $RESPONSE)${NC}"
    
    # Get chapter stats
    CHAPTER_STATS=$(curl -s "http://localhost:5000/api/assertion-reason/chapters/$FIRST_CHAPTER_ID?userId=guest" | jq -r '.chapter | "   Chapter: \(.name)\n   New: \(.newCount)\n   Learning: \(.learningCount)\n   Reviewing: \(.reviewingCount)\n   Mastered: \(.masteredCount)"')
    echo "$CHAPTER_STATS"
else
    echo -e "${RED}❌ Chapter details API failed (HTTP $RESPONSE)${NC}"
    exit 1
fi
echo ""

# Test 6: List all chapters
echo "6️⃣  Listing all chapters..."
curl -s "http://localhost:5000/api/assertion-reason/admin/chapters" | jq -r '.[] | "   ✓ \(.name) (\(.questionCount) questions)"'
echo ""

# Summary
echo "==========================================="
echo -e "${GREEN}🎉 All tests passed successfully!${NC}"
echo ""
echo "📋 Next Steps:"
echo "   1. Open browser and navigate to /assertion-reason"
echo "   2. You should see $CHAPTER_COUNT chapter cards"
echo "   3. Click on any chapter to practice"
echo "   4. Check admin panel to manage content"
echo ""
echo "📚 Documentation:"
echo "   - ASSERTION_SETUP_COMPLETE.md"
echo "   - ASSERTION_REASON_DATA_FLOW.md"
echo "   - ASSERTION_DYNAMIC_DATA_REFERENCE.md"
echo ""
echo "✅ System is ready for use!"
echo "==========================================="
