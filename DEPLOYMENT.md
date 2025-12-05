# 🚀 Deployment Guide for Ace2examz Website

## 📋 Overview
This guide will help you deploy your full-stack application:
- **Frontend**: React + Vite (Deployed on Vercel)
- **Backend**: Node.js + Express + MongoDB (Deployed on Render)

---

## 🔧 Step 1: Deploy Backend (Render)

### 1.1 Sign Up / Login to Render
- Go to: https://render.com
- Sign up with your GitHub account (bhuvi778)

### 1.2 Create New Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub account
3. Select repository: **Chemistry-coaching**
4. Configure the service:

**Settings:**
```
Name: reaction-lab-backend
Region: Singapore (or closest to you)
Branch: main
Root Directory: server
Runtime: Node
Build Command: npm install
Start Command: node server.js
```

### 1.3 Add Environment Variables
Click **"Environment"** tab and add:
```
MONGODB_URI = mongodb+srv://bhupeshsingh778_db_user:qwerty12345@cluster0.u70wcn8.mongodb.net/?appName=Cluster0
PORT = 5000
NODE_ENV = production
```

### 1.4 Deploy
- Click **"Create Web Service"**
- Wait for deployment (2-3 minutes)
- Copy your backend URL (e.g., `https://reaction-lab-backend.onrender.com`)

---

## 🎨 Step 2: Deploy Frontend (Vercel)

### 2.1 Sign Up / Login to Vercel
- Go to: https://vercel.com
- Sign up with your GitHub account (bhuvi778)

### 2.2 Import Project
1. Click **"Add New..."** → **"Project"**
2. Import **Chemistry-coaching** repository
3. Configure the project:

**Settings:**
```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### 2.3 Add Environment Variable
Click **"Environment Variables"** and add:
```
Name: VITE_API_URL
Value: https://reaction-lab-backend.onrender.com/api
```
*(Replace with your actual Render backend URL)*

### 2.4 Deploy
- Click **"Deploy"**
- Wait for deployment (1-2 minutes)
- Your website will be live at: `https://chemistry-coaching.vercel.app`

---

## ✅ Step 3: Update Backend CORS

After deploying frontend, update your backend CORS settings:

1. Go to your GitHub repository
2. Edit `server/server.js`
3. Update the `allowedOrigins` array:
```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'https://chemistry-coaching.vercel.app',  // Your Vercel URL
  'https://chemistry-coaching-*.vercel.app'
];
```
4. Commit and push changes
5. Render will auto-deploy the update

---

## 🧪 Step 4: Test Your Website

### Test Backend API
Visit: `https://reaction-lab-backend.onrender.com/api/courses`
Should return course data in JSON format

### Test Frontend
Visit: `https://chemistry-coaching.vercel.app`
- Check if courses are loading
- Try submitting enquiry form
- Test light/dark mode toggle
- Check all pages

---

## 🔄 Step 5: Seed Database (First Time Only)

After backend is deployed, seed the database:
1. Visit: `https://reaction-lab-backend.onrender.com/api/seed`
2. You should see: `{"message":"Seeded"}` or `{"message":"Already has data"}`

---

## 📝 Important Notes

### Free Tier Limitations:
- **Render**: Backend may sleep after 15 min of inactivity (takes 30s to wake up)
- **Vercel**: 100GB bandwidth/month (plenty for small sites)

### Custom Domain (Optional):
Both Vercel and Render support custom domains:
- Buy domain from GoDaddy, Namecheap, etc.
- Add custom domain in Vercel/Render settings

### MongoDB Atlas:
- Your MongoDB is already configured
- Free tier: 512MB storage (enough for thousands of courses/enquiries)

---

## 🐛 Troubleshooting

**Problem: Frontend loads but no courses shown**
- Check browser console for CORS errors
- Verify `VITE_API_URL` is correct in Vercel
- Check backend is running on Render

**Problem: Backend shows 503 error**
- Wait 30 seconds (it's waking up from sleep)
- Check Render logs for errors

**Problem: MongoDB connection error**
- Verify `MONGODB_URI` in Render environment variables
- Check MongoDB Atlas allows all IPs (0.0.0.0/0)

---

## 🎉 Your Website URLs

After deployment, you'll have:
- **Live Website**: `https://chemistry-coaching.vercel.app`
- **Backend API**: `https://reaction-lab-backend.onrender.com`
- **GitHub Repo**: `https://github.com/bhuvi778/Chemistry-coaching`

---

## 📞 Support

If you encounter issues:
1. Check Render logs: Render Dashboard → Your Service → Logs
2. Check Vercel logs: Vercel Dashboard → Your Project → Deployments
3. Check browser console for frontend errors

---

**🚀 Ready to deploy? Follow the steps above!**
