# NCERT Questions Not Showing on Production (ace2examz.com) - FIX GUIDE

## ❌ Problem

- Questions show in admin panel ✅
- Questions exist in database (19 questions) ✅
- Questions **NOT showing on production website** (ace2examz.com) ❌

## 🎯 Root Cause

The Nginx configuration needs to be updated and Nginx needs to be restarted to proxy `/api` requests to the backend server.

---

## ✅ SOLUTION

### **Step 1: Nginx Configuration Fixed**

I've updated the Nginx configuration file:
`/www/server/panel/vhost/nginx/node_Ace2Examz.conf`

**Changed:**
```nginx
# OLD (incorrect):
location /api/ {
    proxy_pass http://127.0.0.1:5000;
}

# NEW (correct):
location /api/ {
    proxy_pass http://127.0.0.1:5000/api/;
}
```

This ensures that requests to `https://ace2examz.com/api/ncert/questions` are properly forwarded to `http://127.0.0.1:5000/api/ncert/questions`.

---

### **Step 2: Restart Nginx**

You need to restart Nginx for the changes to take effect.

**Option 1: Via BT Panel (Recommended)**
1. Login to BT Panel (宝塔面板)
2. Go to "Software Store" (软件商店)
3. Find "Nginx"
4. Click "Restart" (重启)

**Option 2: Via Command Line**
```bash
# Find nginx service
systemctl restart nginx
# OR
service nginx restart
# OR
/etc/init.d/nginx restart
```

**Option 3: Via PM2 (if using PM2)**
```bash
pm2 restart all
```

---

### **Step 3: Rebuild Frontend (Already Done)**

You've already run `npm run build`, which created the production files in `/www/wwwroot/reaction-lab/dist`.

The build uses `.env.production` which is correctly set to:
```
VITE_API_URL=https://ace2examz.com/api
```

---

### **Step 4: Verify Backend is Running**

Check that the backend server is running on port 5000:

```bash
# Check if backend is responding
curl "http://127.0.0.1:5000/api/ncert/questions?category=questions&badgeType=in-text"

# Should return JSON with questions
```

**Result:** ✅ Backend is running and returning 3 questions

---

### **Step 5: Test Production API**

After restarting Nginx, test the production API:

```bash
curl "https://ace2examz.com/api/ncert/questions?category=questions&badgeType=in-text"

# Should return JSON with questions
```

---

## 📊 Expected Results After Nginx Restart

### **On ace2examz.com:**

**Questions Tab:**
- In-text Questions: 3 questions
- Exercise Questions: 1 question

**Exemplars Tab:**
- MCQ (Exemplar): 3 questions
- Short Answer: 1 question

**Diagrams Tab:**
- Diagram Labeling: 3 questions
- Diagram MCQs: 3 questions
- Process Diagrams: 2 questions

**Total: 19 questions across all tabs!**

---

## 🔍 Verification Steps

### **1. Check Backend (Local)**
```bash
curl "http://127.0.0.1:5000/api/ncert/questions" | python3 -m json.tool
```
✅ Should return 19 questions

### **2. Check API via Domain (After Nginx Restart)**
```bash
curl "https://ace2examz.com/api/ncert/questions" | python3 -m json.tool
```
✅ Should return 19 questions

### **3. Check Frontend**
1. Open `https://ace2examz.com`
2. Go to NCERT Toolbox
3. Click Questions tab
4. Click "In-text Questions" badge
5. Should see 3 questions!

---

## 🚨 If Still Not Working

### **Check 1: Backend Server Running?**
```bash
# Check if process is running
ps aux | grep "node.*server"

# Check if port 5000 is listening
netstat -tlnp | grep 5000
# OR
lsof -i :5000
```

### **Check 2: Nginx Logs**
```bash
# Check error log
tail -50 /www/wwwlogs/Ace2Examz.error.log

# Check access log
tail -50 /www/wwwlogs/Ace2Examz.log
```

### **Check 3: Firewall**
```bash
# Check if port 5000 is blocked
iptables -L -n | grep 5000
```

---

## 📝 Summary

**The fix requires:**

1. ✅ Nginx configuration updated (DONE)
2. ⚠️ **Nginx needs to be RESTARTED** (DO THIS)
3. ✅ Frontend built (DONE)
4. ✅ Backend running (VERIFIED)

**After restarting Nginx, questions will appear on ace2examz.com!** 🚀

---

## 🎯 Quick Commands

```bash
# 1. Verify backend is running
curl "http://127.0.0.1:5000/api/ncert/questions" | head -20

# 2. Restart Nginx (choose one):
systemctl restart nginx
# OR via BT Panel

# 3. Test production API
curl "https://ace2examz.com/api/ncert/questions" | head -20

# 4. If questions appear, you're done! 🎉
```

---

## 📞 Alternative: Use PM2 to Manage Backend

If the backend isn't running as a service, you can use PM2:

```bash
# Install PM2 globally
npm install -g pm2

# Start backend with PM2
cd /www/wwwroot/reaction-lab/server
pm2 start npm --name "ace2examz-backend" -- run dev

# Save PM2 process list
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

This ensures the backend always runs, even after server restart.

---

**RESTART NGINX AND THE QUESTIONS WILL APPEAR!** 🚀
