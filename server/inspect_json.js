
const fs = require('fs');

try {
    const data = fs.readFileSync('audiobook_response.json', 'utf8');
    const json = JSON.parse(data);

    console.log("Chapters array length:", json.chapters ? json.chapters.length : 'undefined');
    if (json.chapters) {
        console.log(JSON.stringify(json.chapters, null, 2));
    }
} catch (err) {
    console.error(err);
}
