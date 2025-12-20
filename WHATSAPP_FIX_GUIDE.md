# WhatsApp Integration Fix Guide

## Problem
The BotBiz API is returning `401 Unauthenticated` error, which means the API key is invalid or expired.

## Solution Steps

### 1. Get a Valid BotBiz API Key

1. **Login to BotBiz Dashboard**
   - Go to: https://dash.botbiz.io
   - Login with your credentials

2. **Navigate to API Settings**
   - Look for "API" or "Settings" section
   - Find "API Keys" or "WhatsApp API" section

3. **Generate/Copy API Key**
   - Generate a new API key if needed
   - Copy the complete API key

### 2. Update the API Key

#### Option A: Update in Vercel Dashboard (Recommended for Production)

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add a new environment variable:
   - **Name:** `BOTBIZ_API_KEY`
   - **Value:** Your BotBiz API key (e.g., `16072|YourActualAPIKeyHere`)
   - **Environment:** Production, Preview, Development (select all)
4. Click **Save**
5. **Redeploy** your application for changes to take effect

#### Option B: Update Locally for Testing

1. Create a `.env` file in the root directory (if it doesn't exist)
2. Add this line:
   ```
   BOTBIZ_API_KEY=your_actual_api_key_here
   ```
3. Restart your development server

#### Option C: Update Hardcoded Value (Not Recommended)

Edit `api/send-whatsapp.js` line 23 and replace the API key:
```javascript
const BOTBIZ_API_KEY = process.env.BOTBIZ_API_KEY || 'YOUR_NEW_API_KEY_HERE';
```

### 3. Verify BotBiz Account Setup

Make sure your BotBiz account has:
- ✅ Active WhatsApp Business API connection
- ✅ Verified phone number
- ✅ Sufficient credits/balance
- ✅ Correct API permissions enabled

### 4. Test the Integration

1. Deploy the updated code
2. Try sending a message again
3. Check the console logs for:
   - `API Key (first 10 chars):` - Should show your new key
   - Response status should be 200
   - Success message should appear

## Alternative: Use a Different WhatsApp API Provider

If BotBiz doesn't work, consider these alternatives:

### 1. **Twilio WhatsApp API**
- Website: https://www.twilio.com/whatsapp
- More reliable and well-documented
- Free trial available

### 2. **WhatsApp Business API (Official)**
- Website: https://business.whatsapp.com/products/business-platform
- Most reliable but requires business verification

### 3. **WATI (WhatsApp Team Inbox)**
- Website: https://www.wati.io
- Good for small businesses

## Current Error Details

```
BotBiz API Response: {message: 'Unauthenticated.'}
Status: 401 (Unauthorized)
```

This clearly indicates an authentication problem with the API key.

## Need Help?

1. Check BotBiz documentation: https://docs.botbiz.io
2. Contact BotBiz support
3. Verify your API key is active and has the correct permissions
