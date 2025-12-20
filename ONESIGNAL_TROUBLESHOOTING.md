# OneSignal Troubleshooting Guide

## Current Issue
Push notifications are not working when sent from OneSignal dashboard.

---

## ✅ Current Setup Verification

### Files Checked:

1. **`index.html`** ✅
   - OneSignal SDK loaded correctly
   - App ID: `f19678f2-4968-4172-b5a8-7854008c21b0`
   - Safari Web ID configured
   - Notify button enabled

2. **`public/OneSignalSDKWorker.js`** ✅
   - Service worker file exists
   - Imports OneSignal SDK correctly

---

## 🔍 Troubleshooting Steps

### Step 1: Check Browser Console

Open your browser's Developer Tools (F12) and check the Console tab for:

**Look for these messages:**
```
[OneSignal] Initializing...
[OneSignal] Service Worker registered
[OneSignal] User subscribed: true
```

**Common errors to look for:**
- `Service Worker registration failed`
- `Permission denied`
- `App ID not found`
- CORS errors

### Step 2: Check Subscription Status

Open browser console and run:
```javascript
// Check if OneSignal is loaded
console.log('OneSignal loaded:', typeof OneSignal !== 'undefined');

// Check subscription status
OneSignal.User.PushSubscription.optedIn.then(optedIn => {
    console.log('User opted in:', optedIn);
});

// Get subscription ID
OneSignal.User.PushSubscription.id.then(id => {
    console.log('Subscription ID:', id);
});

// Get user ID
OneSignal.User.id.then(userId => {
    console.log('User ID:', userId);
});
```

### Step 3: Check Service Worker

1. Open DevTools → **Application** tab
2. Click **Service Workers** in left sidebar
3. Look for `OneSignalSDKWorker.js`
4. Status should be: **"activated and running"**

**If not activated:**
- Click "Unregister" 
- Refresh page
- Check if it registers again

### Step 4: Check Notification Permission

In browser console:
```javascript
console.log('Notification permission:', Notification.permission);
// Should be: "granted", "denied", or "default"
```

**If "denied":**
- User blocked notifications
- Need to reset site permissions in browser settings

**If "default":**
- User hasn't been prompted yet
- Click the OneSignal bell icon to subscribe

### Step 5: Verify in OneSignal Dashboard

1. Go to https://dashboard.onesignal.com/
2. Navigate to **Audience** → **All Users**
3. Check if you see your subscription
4. Look for your device/browser

**If no subscribers:**
- Subscription didn't complete
- Check console for errors

### Step 6: Test Notification Sending

From OneSignal Dashboard:

1. Go to **Messages** → **New Push**
2. Create a test message:
   - **Title**: "Test Notification"
   - **Message**: "Testing OneSignal setup"
3. **Send To**: "All Subscribed Users" or "Test Users"
4. Click **Send Message**

**Check:**
- Delivery status in dashboard
- Browser should receive notification

---

## 🐛 Common Issues & Solutions

### Issue 1: "Service Worker not registering"

**Causes:**
- File path incorrect
- HTTPS required (except localhost)
- Browser doesn't support service workers

**Solutions:**
```javascript
// Check if service workers are supported
if ('serviceWorker' in navigator) {
    console.log('Service Workers supported');
} else {
    console.log('Service Workers NOT supported');
}
```

- Ensure you're on HTTPS or localhost
- Check `OneSignalSDKWorker.js` is in `/public` folder
- Clear browser cache and reload

### Issue 2: "Notifications not received"

**Causes:**
- User not subscribed
- Notification permission denied
- Browser notifications disabled
- Focus Assist/Do Not Disturb enabled (Windows/Mac)

**Solutions:**
1. Check subscription status (see Step 2)
2. Check notification permission (see Step 4)
3. Check OS notification settings
4. Disable Do Not Disturb mode

### Issue 3: "Bell icon not showing"

**Causes:**
- OneSignal SDK not loaded
- `notifyButton.enable` set to false
- CSS z-index conflict

**Solutions:**
1. Check console for SDK load errors
2. Verify `notifyButton.enable: true` in config
3. Check if button is hidden behind other elements

### Issue 4: "HTTPS Required Error"

**Cause:**
- OneSignal requires HTTPS in production

**Solutions:**
- Use localhost for development (HTTP allowed)
- Deploy to HTTPS hosting (Vercel, Netlify, etc.)
- Use ngrok for local HTTPS testing

### Issue 5: "App ID not found"

**Cause:**
- Incorrect App ID in configuration

**Solution:**
- Verify App ID matches dashboard
- Current ID: `f19678f2-4968-4172-b5a8-7854008c21b0`

---

## 🧪 Enhanced Debugging Setup

Add this to your `index.html` after OneSignal init:

```html
<script>
  window.OneSignalDeferred = window.OneSignalDeferred || [];
  OneSignalDeferred.push(async function(OneSignal) {
    await OneSignal.init({
      appId: "f19678f2-4968-4172-b5a8-7854008c21b0",
      safari_web_id: "web.onesignal.auto.41b6a3ea-cfe2-480b-805a-97ab17a018f3",
      notifyButton: {
        enable: true,
      },
    });

    // Debug logging
    console.log('[OneSignal] Initialized successfully');

    // Check subscription status
    const optedIn = await OneSignal.User.PushSubscription.optedIn;
    console.log('[OneSignal] User opted in:', optedIn);

    // Get subscription ID
    const subscriptionId = await OneSignal.User.PushSubscription.id;
    console.log('[OneSignal] Subscription ID:', subscriptionId);

    // Get user ID
    const userId = await OneSignal.User.id;
    console.log('[OneSignal] User ID:', userId);

    // Listen for subscription changes
    OneSignal.User.PushSubscription.addEventListener('change', (event) => {
      console.log('[OneSignal] Subscription changed:', event);
    });

    // Listen for notification display
    OneSignal.Notifications.addEventListener('foregroundWillDisplay', (event) => {
      console.log('[OneSignal] Notification will display:', event);
    });

    // Listen for notification click
    OneSignal.Notifications.addEventListener('click', (event) => {
      console.log('[OneSignal] Notification clicked:', event);
    });
  });
</script>
```

---

## 📋 Checklist for Working Notifications

- [ ] OneSignal SDK loads without errors
- [ ] Service worker registered and activated
- [ ] User granted notification permission
- [ ] User subscribed (has subscription ID)
- [ ] Subscription visible in OneSignal dashboard
- [ ] Test notification sent from dashboard
- [ ] Notification received in browser
- [ ] Notification click works

---

## 🔧 Quick Fixes to Try

### 1. Clear Everything and Start Fresh

```javascript
// In browser console:
// Unsubscribe from OneSignal
OneSignal.User.PushSubscription.optOut();

// Clear service workers
navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => registration.unregister());
});

// Clear cache
caches.keys().then(keys => {
    keys.forEach(key => caches.delete(key));
});

// Reload page
location.reload();
```

### 2. Reset Notification Permission

**Chrome:**
1. Click lock icon in address bar
2. Click "Site settings"
3. Find "Notifications"
4. Change to "Ask" or "Allow"
5. Reload page

**Firefox:**
1. Click lock icon in address bar
2. Click "Clear permissions and reload"
3. Reload page

### 3. Force Re-subscription

```javascript
// In browser console:
OneSignal.User.PushSubscription.optIn();
```

---

## 📊 Expected Console Output (Working Setup)

```
[OneSignal] Initializing...
[OneSignal] Service Worker registered
[OneSignal] Initialized successfully
[OneSignal] User opted in: true
[OneSignal] Subscription ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
[OneSignal] User ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

---

## 🆘 Still Not Working?

### Check These:

1. **Browser Compatibility**
   - Chrome/Edge: Full support ✅
   - Firefox: Full support ✅
   - Safari: Requires Safari Web ID (configured) ✅
   - Opera: Full support ✅

2. **Network Issues**
   - Check if `cdn.onesignal.com` is accessible
   - Check for firewall/proxy blocking

3. **OneSignal Dashboard**
   - Verify app is active
   - Check if you're in correct app
   - Look at delivery logs

4. **Browser Settings**
   - Notifications enabled in browser
   - Notifications enabled in OS
   - Focus Assist/Do Not Disturb disabled

---

## 📞 OneSignal Support Resources

- **Documentation**: https://documentation.onesignal.com/
- **Dashboard**: https://dashboard.onesignal.com/
- **Support**: https://onesignal.com/support
- **Community**: https://community.onesignal.com/
- **Status**: https://status.onesignal.com/

---

## 🎯 Next Steps

1. **Open browser console** (F12)
2. **Check for errors** in Console tab
3. **Run diagnostic commands** from Step 2
4. **Check service worker** status
5. **Verify subscription** in OneSignal dashboard
6. **Send test notification** from dashboard
7. **Report findings** for further troubleshooting

---

**Date Created:** December 20, 2025  
**App ID:** f19678f2-4968-4172-b5a8-7854008c21b0
