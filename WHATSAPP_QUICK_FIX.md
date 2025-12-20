# WhatsApp Integration - Quick Fix Guide

## 🚨 Current Issue

**Error:** `"Sending message outside 24 hour window is not allowed"`

**Why:** WhatsApp Business API requires users to message your business first before you can send them automated messages. This is a WhatsApp policy to prevent spam.

---

## ✅ IMMEDIATE WORKAROUND (Test Right Now!)

### Option 1: Message First, Then Test (Works in 30 seconds)

1. **Open WhatsApp** on your phone
2. **Send ANY message** to: **+919115179935** (your business number)
   - Example: "Hi" or "Test"
3. **Wait 10 seconds**
4. **Go to your website:** https://chemistry-coaching.vercel.app
5. **Enter the SAME phone number** you just messaged from
6. **Click "Get the link"**
7. **✅ You should receive the app download message!**

This works because you're now within the 24-hour messaging window!

---

### Option 2: Test with a Phone That Already Messaged You

If any user has previously messaged your business WhatsApp number (+919115179935) in the last 24 hours:
1. Use that phone number in the form
2. Click "Get the link"
3. ✅ Message will be delivered!

---

## 🎯 PERMANENT SOLUTION (For New Users)

To send messages to users who have NEVER messaged you, you need a **WhatsApp Message Template**.

### Steps:

1. **Login to BotBiz Dashboard:** https://dash.botbiz.io

2. **Create a Message Template:**
   - Go to **Templates** section
   - Click **"Create New Template"**
   - Fill in:
     - **Name:** `app_download`
     - **Category:** **UTILITY** (important!)
     - **Language:** English
     - **Body:** 
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
   - Click **Submit**

3. **Wait for Approval** (5 minutes - 24 hours)
   - You'll receive an email when approved

4. **Update Code** (after approval):
   - Edit `api/send-whatsapp.js` line 25
   - Change to:
     ```javascript
     const TEMPLATE_NAME = 'app_download';
     ```
   - Add template API call (see WHATSAPP_TEMPLATE_SETUP.md for details)

---

## 🧪 TEST IT NOW!

**Try the workaround right now:**

1. ✅ Send a WhatsApp message from your phone to **+919115179935**
2. ✅ Wait 10 seconds
3. ✅ Go to https://chemistry-coaching.vercel.app
4. ✅ Enter your phone number (the one you just messaged from)
5. ✅ Click "Get the link"
6. ✅ **You should receive the message!** 🎉

---

## 📊 How It Works

```
User Messages You First → Within 24 Hours → ✅ You Can Send Free Messages
User Never Messaged You → Outside 24 Hours → ❌ Need Template
```

**Current Setup:**
- ✅ API is working correctly
- ✅ Authentication is successful
- ❌ WhatsApp blocks messages to new users (policy)
- ✅ Workaround: User messages first

**After Template Approval:**
- ✅ Can message new users
- ✅ Can message anyone anytime
- ✅ No 24-hour window restriction

---

## 🎯 Summary

**For Testing NOW:**
- Message +919115179935 from your phone first
- Then use that number in the form
- ✅ Works immediately!

**For Production (New Users):**
- Create WhatsApp Message Template in BotBiz
- Wait for approval
- Update code to use template
- ✅ Works for everyone!

---

**Last Updated:** 2025-12-20 23:30 IST  
**Status:** ✅ Code deployed - Ready to test with workaround  
**Next Action:** Try the workaround OR create template for permanent solution
