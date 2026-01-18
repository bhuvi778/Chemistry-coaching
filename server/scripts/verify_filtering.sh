#!/bin/bash
# Verify categories in database
echo "🔍 Checking categories in database..."

# Query database for name and category of all chapters
mongosh chemistry_coaching --quiet --eval '
  db.assertionreasonchapters.find({}, {name: 1, category: 1, _id: 0})
    .sort({name: 1})
    .forEach(doc => {
      print(`- ${doc.name}: ${doc.category || "NO CATEGORY"}`)
    })
'
