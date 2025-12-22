# BotBiz Template Variable Fix - #User-Name# Not Replacing

## 🚨 Problem
The WhatsApp template shows `#User-Name#` instead of the actual user's name.

## 🔍 Root Cause
BotBiz/WhatsApp templates use specific variable syntax, and the template configuration must match the code.

## ✅ Solution: Update Your BotBiz Template

### Step 1: Login to BotBiz Dashboard
1. Go to https://dash.botbiz.io
2. Navigate to **Templates** section
3. Find your template (ID: 277083, Name: `get_link`)

### Step 2: Check Template Variable Format

BotBiz supports two variable formats:

#### Format 1: Standard WhatsApp Variables (Recommended)
```
Hello {{1}}, welcome to Ace2Examz!
Download our app: {{2}}
```
- Variables: `{{1}}`, `{{2}}`, `{{3}}`, etc.
- Code sends: `["UserName", "URL"]`

#### Format 2: Custom Data Fields
```
Hello #User-Name#, welcome to Ace2Examz!
```
- Variables: `#Field-Name#`
- Code sends: `{"User-Name": "ActualName"}`

### Step 3: Update Template to Use {{1}} Format

**Edit your template body to:**
```
Hello {{1}}, welcome to Ace2Examz! 👋

Thank you for your interest! 🎓

Download our app to access:
✅ Live Classes
✅ Study Materials
✅ Practice Tests
✅ Expert Guidance

📱 Download Now:
https://play.google.com/store/apps/details?id=com.ace2examzapp.android

Start your learning journey today! 🚀
```

**Variable Configuration:**
- Variable 1: `{{1}}` = User's Name
- This is the standard WhatsApp template variable format

### Step 4: Wait for Approval
- Submit the updated template
- Wait for WhatsApp/Meta approval (usually 5-30 minutes)
- You'll receive an email notification

## 📝 Update Backend Code (After Template Approval)

Update the API code to send variables in the correct format:

```javascript
// For {{1}} format (Standard WhatsApp)
formData.append('variables', JSON.stringify([name]));
```

## 🔄 Current Code Status

The current code (`api/send-whatsapp.js`) is configured for custom data format (`#User-Name#`).

**To switch to {{1}} format**, replace lines 57-67 with:

```javascript
// Standard WhatsApp template variables ({{1}}, {{2}}, etc.)
formData.append('variables', JSON.stringify([name]));

console.log('API URL:', apiUrl);
console.log('Form Data:');
console.log('  - template_id:', TEMPLATE_ID);
console.log('  - phone_number:', phone);
console.log('  - variables:', JSON.stringify([name]));
console.log('========================');
```

## 🧪 Testing Checklist

1. ✅ Template updated in BotBiz with `{{1}}`
2. ✅ Template approved by WhatsApp/Meta
3. ✅ Backend code updated to send `variables` array
4. ✅ Code deployed to Vercel
5. ✅ Test with real phone number

## 📞 Expected Result

**Input:**
- Name: "Rahul"
- Phone: "+919876543210"

**Message Sent:**
```
Hello Rahul, welcome to Ace2Examz! 👋
...
```

## 🆘 Still Not Working?

Check the browser console logs:
1. Open DevTools (F12)
2. Go to Console tab
3. Click "Get the link"
4. Look for API response details
5. Check if `variables` or `custom_data` is being sent correctly

The logs will show exactly what's being sent to BotBiz API.
