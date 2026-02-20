#!/bin/bash

# Test Free Quiz API and Filter
echo "=== Testing Free Quiz API ==="
echo ""

# Get all quizzes
echo "1. Fetching all quizzes..."
QUIZZES=$(curl -s http://localhost:5000/api/free-quizzes)
TOTAL=$(echo $QUIZZES | jq '. | length')
echo "   Total quizzes: $TOTAL"
echo ""

# Show quiz categories
echo "2. Quiz Category Distribution:"
echo $QUIZZES | jq -r '[.[] | .quizCategory] | group_by(.) | map({category: .[0], count: length}) | .[]' | jq -r '"   \(.category): \(.count)"'
echo ""

# Show exam types
echo "3. Exam Type Distribution:"
echo $QUIZZES | jq -r '[.[] | .examType] | group_by(.) | map({type: .[0], count: length}) | .[]' | jq -r '"   \(.type): \(.count)"'
echo ""

# Test filtering by category
echo "4. Testing Filter Logic:"
for CATEGORY in "Quiz" "Mock Test" "PYPs"; do
    COUNT=$(echo $QUIZZES | jq "[.[] | select(.quizCategory == \"$CATEGORY\")] | length")
    echo "   $CATEGORY: $COUNT quizzes"
done
echo ""

# Show sample data
echo "5. Sample Quiz Data (first 2):"
echo $QUIZZES | jq '[.[] | {title, examType, quizCategory, chapter}] | .[0:2]'
