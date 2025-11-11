# API Deployment Guide for Render.com

This guide will help you deploy the Kanban API (json-server) to Render.com's free tier.

## Prerequisites

- A GitHub account
- The kanban-dashboard code ready to push

## Step 1: Push Code to GitHub

### Option A: Using GitHub Web Interface

1. Go to [GitHub](https://github.com) and create a new repository:
   - Repository name: `kanban-dashboard`
   - Visibility: Public (required for Render free tier)
   - Don't initialize with README (we already have code)

2. After creating the repository, GitHub will show you commands. Run these in your terminal:

```bash
cd kanban-dashboard
git remote add origin https://github.com/YOUR_USERNAME/kanban-dashboard.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

### Option B: Using Git Commands (if you have write access)

```bash
cd kanban-dashboard

# If you haven't set git config yet:
git config user.name "Your Name"
git config user.email "your.email@example.com"

# Create repo on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/kanban-dashboard.git
git push -u origin main
```

## Step 2: Deploy to Render.com

1. **Sign up/Login to Render**
   - Go to [render.com](https://render.com)
   - Sign up using your GitHub account (easiest method)

2. **Create New Web Service**
   - Click "New +" button
   - Select "Web Service"
   - Connect your GitHub account if not already connected
   - Find and select your `kanban-dashboard` repository

3. **Configure the Web Service**
   Fill in the following settings:

   | Setting | Value |
   |---------|-------|
   | **Name** | `kanban-api` (or any name you prefer) |
   | **Region** | Choose closest to you |
   | **Branch** | `main` |
   | **Root Directory** | Leave blank |
   | **Runtime** | `Node` |
   | **Build Command** | `npm install` |
   | **Start Command** | `node api-server.js` |
   | **Instance Type** | `Free` |

4. **Environment Variables** (Optional)
   - Click "Advanced"
   - Add environment variable:
     - Key: `NODE_ENV`
     - Value: `production`

5. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy your API
   - This usually takes 2-5 minutes

6. **Get Your API URL**
   - Once deployed, Render will show your service URL
   - It will look like: `https://kanban-api-xxxx.onrender.com`
   - Your API endpoint will be: `https://kanban-api-xxxx.onrender.com/tasks`

7. **Test Your API**
   - Visit: `https://your-service-url.onrender.com/health`
   - You should see: `{"status":"ok","message":"Kanban API is running"}`
   - Visit: `https://your-service-url.onrender.com/tasks`
   - You should see the list of tasks

## Step 3: Update Vercel Frontend to Use Production API

Once your API is deployed on Render:

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/eng-ahmedmahmouds-projects/kanban-dashboard/settings/environment-variables

2. **Add Environment Variable**
   - Click "Add New"
   - Name: `NEXT_PUBLIC_API_URL`
   - Value: `https://your-render-service-url.onrender.com` (replace with actual URL)
   - Environment: Select all (Production, Preview, Development)
   - Click "Save"

3. **Redeploy Frontend**
   ```bash
   cd kanban-dashboard
   vercel --prod
   ```

## Step 4: Verify Everything Works

1. Visit your Vercel production URL:
   - https://kanban-dashboard-nsqmrdm50-eng-ahmedmahmouds-projects.vercel.app

2. Test functionality:
   - ✅ Create a new task
   - ✅ Edit a task
   - ✅ Drag and drop tasks
   - ✅ Delete a task
   - ✅ Search for tasks

## Important Notes

### Free Tier Limitations

⚠️ **Render.com Free Tier**:
- Service will spin down after 15 minutes of inactivity
- First request after spin-down will be slow (30-60 seconds)
- 750 hours/month of usage (sufficient for demo/testing)

### API URL Structure

Your API will be available at:
- Health check: `https://your-service.onrender.com/health`
- Tasks endpoint: `https://your-service.onrender.com/tasks`
- Single task: `https://your-service.onrender.com/tasks/1`

### Troubleshooting

**If deployment fails:**
1. Check Render logs in the dashboard
2. Verify `api-server.js` is in the root directory
3. Ensure `json-server` is in `dependencies` (not `devDependencies`)
4. Verify `db.json` exists and is not in `.gitignore`

**If API returns errors:**
1. Check Render logs for error messages
2. Verify the service is running (check Render dashboard)
3. Test with curl: `curl https://your-service.onrender.com/health`

**If frontend doesn't connect:**
1. Verify `NEXT_PUBLIC_API_URL` is set in Vercel
2. Check browser console for CORS errors
3. Ensure the URL doesn't have a trailing slash

## Alternative: Deploy API via Render CLI

If you prefer using the CLI:

```bash
# Install Render CLI
npm install -g @render-com/cli

# Login
render login

# Deploy
render deploy
```

Follow the prompts to select your service.

## Complete Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Render account created
- [ ] Web service created on Render
- [ ] Service successfully deployed
- [ ] API health check working
- [ ] Tasks endpoint returning data
- [ ] Environment variable added to Vercel
- [ ] Frontend redeployed
- [ ] CRUD operations working on production
- [ ] Search and drag-drop working

---

## Quick Command Reference

```bash
# Check Git status
git status

# Push to GitHub
git push

# Redeploy to Vercel
vercel --prod

# Test API
curl https://your-render-url.onrender.com/health
curl https://your-render-url.onrender.com/tasks

# Check Vercel deployment
vercel ls

# View Vercel logs
vercel logs
```

---

## Support

- Render Documentation: https://render.com/docs
- Vercel Documentation: https://vercel.com/docs
- GitHub Help: https://docs.github.com

---

**Need help?** Check the main README.md and DEPLOYMENT.md for more information.
