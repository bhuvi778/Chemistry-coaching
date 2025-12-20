# Create WhatsApp Template - URGENT ACTION REQUIRED

## 🚨 CRITICAL: You MUST Create a WhatsApp Template

The code is now configured to use WhatsApp Templates (the correct way). You need to create a template in BotBiz dashboard.

---

## ✅ STEP-BY-STEP GUIDE

### Step 1: Login to BotBiz Dashboard
https://dash.botbiz.io

### Step 2: Go to Templates Section
- Look for **"Templates"** or **"Message Templates"** in the sidebar
- Click on it

### Step 3: Create New Template
Click **"Create New Template"** or **"Add Template"**

### Step 4: Fill in Template Details

**Template Name:** `app_download`  
(IMPORTANT: Use exactly this name, or update the code)

**Category:** **UTILITY**  
(This is important for approval)

**Language:** English (en)

**Header:** (Optional - leave empty or add)
```
Download Our App
```

**Body:** (Required - Copy this exactly)
```
Hi! 👋

Thank you for your interest in Ace2Examz!

Download our app to learn from the best and access:
✅ Live Classes
✅ Study Materials
✅ Practice Tests
✅ Expert Guidance

📱 Download Now:
https://play.google.com/store/apps/details?id=com.ace2examzapp.android

Start your journey to success today! 🚀
```

**Footer:** (Optional)
```
Ace2Examz - Your Learning Partner
```

**Buttons:** (Optional but recommended)
- Button Type: **URL**
- Button Text: **Download App**
- URL: `https://play.google.com/store/apps/details?id=com.ace2examzapp.android`

### Step 5: Submit for Approval
- Click **"Submit"** or **"Create Template"**
- WhatsApp/Meta will review it
- **Approval time:** Usually 5 minutes to 24 hours
- You'll receive an email when approved

---

## 📝 After Approval

Once your template is approved:

### If you used a DIFFERENT template name:

Edit `api/send-whatsapp.js` line 45:
```javascript
const TEMPLATE_NAME = process.env.BOTBIZ_TEMPLATE_NAME || 'YOUR_TEMPLATE_NAME';
```

Replace `'app_download'` with your actual template name.

### If you used `app_download`:
✅ No changes needed! Just wait for Vercel to deploy (1-2 minutes) and test!

---

## 🧪 Testing After Approval

1. **Wait for email** confirming template approval
2. **Wait for Vercel deployment** (1-2 minutes after pushing code)
3. **Go to:** https://chemistry-coaching.vercel.app
4. **Enter any phone number** (doesn't need to message you first!)
5. **Click "Get the link"**
6. **✅ Message should be delivered!**

---

## 🎯 Template API Format

The code now uses:
```
https://dash.botbiz.io/api/v1/whatsapp/send/template?apiToken=...&phone_number_id=...&phone_number=...&template_name=app_download&language=en
```

This is the CORRECT way to send WhatsApp messages to new users!

---

## ⚠️ Common Issues

### Template Rejected?
- Make sure Category is **UTILITY** (not MARKETING)
- Avoid promotional language
- Keep it professional and informative

### Template Not Found Error?
- Check the template name matches exactly (case-sensitive)
- Make sure template status is "APPROVED" (not pending/rejected)
- Wait a few minutes after approval before testing

### Still Getting 24-Hour Window Error?
- Template is not approved yet
- Template name doesn't match
- Template status is rejected

---

## 📊 Current Code Status

✅ Code updated to use template endpoint  
✅ Template name set to: `app_download`  
✅ Language set to: `en`  
⏳ Waiting for you to create template in BotBiz  
⏳ Waiting for WhatsApp approval  

---

## 🚀 Quick Summary

1. **Login:** https://dash.botbiz.io
2. **Create template** named `app_download`
3. **Category:** UTILITY
4. **Add your app download message**
5. **Submit for approval**
6. **Wait for email confirmation**
7. **Test on website!**

---

**IMPORTANT:** The template name in BotBiz MUST match the name in the code (`app_download`), or you need to update the code with the correct name!

**Last Updated:** 2025-12-20 23:56 IST  
**Status:** ✅ Code ready - Waiting for template creation  
**Action Required:** Create template in BotBiz dashboard NOW!
