# WhatsApp Message Template Setup Guide

## 🚨 Critical Issue Identified

**Problem:** WhatsApp Business API blocks free-form messages to users outside the 24-hour messaging window.

**Error Message:**
```
"Sending message outside 24 hour window is not allowed. You can only send template message to this user."
```

## 📋 Solution: Create a WhatsApp Message Template

### Step 1: Login to BotBiz Dashboard

1. Go to: https://dash.botbiz.io
2. Login with your credentials

### Step 2: Navigate to Templates Section

1. Look for **"Templates"** or **"Message Templates"** in the sidebar
2. Click on **"Create New Template"** or **"Add Template"**

### Step 3: Create Your Template

Fill in the template details:

#### Template Information:
- **Template Name:** `app_download_link` (use lowercase, underscores only)
- **Category:** Select **"UTILITY"** (for transactional messages)
- **Language:** English (en)

#### Template Content:

**Header (Optional):**
```
None (or you can add: "Download Our App")
```

**Body (Required):**
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

**Footer (Optional):**
```
Ace2Examz - Your Learning Partner
```

**Buttons (Optional):**
- Button Type: URL
- Button Text: "Download App"
- URL: `https://play.google.com/store/apps/details?id=com.ace2examzapp.android`

### Step 4: Submit for Approval

1. Click **"Submit"** or **"Create Template"**
2. WhatsApp/Meta will review your template
3. **Approval Time:** Usually 5 minutes to 24 hours
4. You'll receive an email when approved

### Step 5: Update Your Code

Once your template is approved, update the environment variable:

#### Option A: Update in Vercel Dashboard

1. Go to Vercel Dashboard → Your Project
2. Settings → Environment Variables
3. Add new variable:
   - **Name:** `BOTBIZ_TEMPLATE_NAME`
   - **Value:** `app_download_link` (your template name)
4. Redeploy your application

#### Option B: Update in Code (Temporary)

Edit `api/send-whatsapp.js` line 25:
```javascript
const TEMPLATE_NAME = process.env.BOTBIZ_TEMPLATE_NAME || 'app_download_link';
```

## 🎯 Alternative: Use Pre-Approved Template

WhatsApp provides a default **"hello_world"** template that's pre-approved for all accounts:

**Message:** "Hello World"

To use it immediately:
1. No setup needed - it's already approved
2. The code is already configured to use it as fallback
3. Just deploy and test

**Note:** This sends a generic "Hello World" message, not your custom app download message.

## 📱 Template with Variables (Advanced)

If you want to personalize messages with user names or dynamic content:

**Body with Variables:**
```
Hi {{1}}! 👋

Thank you for your interest in Ace2Examz!

Download our app to learn from the best and access:
✅ Live Classes
✅ Study Materials
✅ Practice Tests
✅ Expert Guidance

📱 Download Now:
{{2}}

Start your journey to success today! 🚀
```

**Variables:**
- `{{1}}` = User's name
- `{{2}}` = Download URL

Then update the API call to pass variables (requires code modification).

## ✅ Testing Your Template

After approval:

1. **Wait for approval email** from WhatsApp/Meta
2. **Redeploy** your application (if you updated environment variables)
3. **Test** by entering a phone number and clicking "Get the link"
4. **Check WhatsApp** on that phone number
5. You should receive the template message within seconds

## 🔍 Troubleshooting

### Template Not Approved?

Common rejection reasons:
- ❌ Promotional content (use UTILITY category instead)
- ❌ Misleading information
- ❌ Broken links
- ❌ Spam-like content

**Solution:** Revise and resubmit with clearer, more professional content.

### Template Approved but Not Sending?

1. **Check template name** matches exactly (case-sensitive)
2. **Verify template status** is "APPROVED" in BotBiz dashboard
3. **Check console logs** for error messages
4. **Ensure environment variable** is set correctly

### Still Getting 24-Hour Window Error?

1. **Verify template is approved** (not pending/rejected)
2. **Check template name** in code matches BotBiz dashboard
3. **Clear cache** and redeploy
4. **Wait a few minutes** after approval before testing

## 📝 Current Code Configuration

The code has been updated to:
1. ✅ Try template API first (for new users)
2. ✅ Fallback to regular message (for users within 24-hour window)
3. ✅ Use `hello_world` template by default
4. ✅ Detect and report 24-hour window errors with helpful messages

## 🚀 Quick Start (Using Default Template)

The easiest way to test immediately:

1. **No template creation needed** - uses pre-approved `hello_world`
2. **Just deploy** the updated code
3. **Test** with any phone number
4. **Receive** a simple "Hello World" message

Then create your custom template for the full app download message.

---

**Need Help?**
- BotBiz Documentation: https://docs.botbiz.io
- BotBiz Support: Contact through dashboard
- WhatsApp Business API Docs: https://developers.facebook.com/docs/whatsapp
