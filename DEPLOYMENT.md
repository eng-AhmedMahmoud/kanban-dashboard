# Deployment Guide 🚀

This guide explains how to deploy your Kanban Dashboard to production.

## Vercel Deployment (Recommended)

### Step 1: Prepare Your Project

1. **Initialize Git repository** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Kanban Dashboard"
   ```

2. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/kanban-dashboard.git
   git push -u origin main
   ```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

5. **Add Environment Variables**:
   - Click "Environment Variables"
   - Add: `NEXT_PUBLIC_API_URL` = `YOUR_PRODUCTION_API_URL`

6. Click "Deploy"

### Step 3: Set Up Production API

**Important**: `json-server` is only for development. For production, you need a real backend.

#### Option A: Use a Backend-as-a-Service
- **Supabase**: PostgreSQL database with REST API
- **Firebase**: Real-time database
- **Appwrite**: Open-source BaaS
- **Hasura**: GraphQL API

#### Option B: Build Your Own API
Create a Node.js/Express API or use:
- Nest.js (Node.js)
- FastAPI (Python)
- Spring Boot (Java)
- ASP.NET (C#)

### Example: Deploying API to Railway

1. Create a new repository for your API
2. Add the following `package.json`:
   ```json
   {
     "scripts": {
       "start": "json-server --watch db.json --port $PORT --host 0.0.0.0"
     }
   }
   ```
3. Push to GitHub
4. Go to [railway.app](https://railway.app)
5. Create new project from GitHub
6. Deploy
7. Copy the deployed URL
8. Update Vercel environment variable with this URL

## Netlify Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

3. Deploy:
   ```bash
   netlify deploy --prod
   ```

4. Follow the prompts:
   - Publish directory: `.next`

## Environment Variables

For production, set these environment variables:

```
NEXT_PUBLIC_API_URL=https://your-api.com
NODE_ENV=production
```

## Pre-Deployment Checklist

- [ ] All features working locally
- [ ] No console errors
- [ ] Production API is set up
- [ ] Environment variables configured
- [ ] README updated with live URL
- [ ] .gitignore includes sensitive files
- [ ] Build completes without errors
- [ ] All TypeScript types are correct
- [ ] Images are optimized
- [ ] Analytics added (optional)

## Post-Deployment

1. **Test the deployed site**:
   - Test all CRUD operations
   - Test drag and drop
   - Test search functionality
   - Test on mobile devices
   - Test error states

2. **Monitor Performance**:
   - Use Vercel Analytics
   - Check Core Web Vitals
   - Monitor API response times

3. **Set up Domain** (optional):
   - Add custom domain in Vercel
   - Configure DNS settings
   - Enable HTTPS (automatic)

## Troubleshooting

### Build Fails

- Check TypeScript errors: `npm run lint`
- Verify all dependencies: `npm install`
- Check Node version: `node -v` (should be 18+)

### API Connection Issues

- Verify NEXT_PUBLIC_API_URL is set correctly
- Check CORS settings on API
- Ensure API is accessible from Vercel

### Environment Variables Not Working

- Prefix with `NEXT_PUBLIC_` for client-side access
- Redeploy after adding new variables
- Variables are only available after rebuild

## Monitoring and Maintenance

### Recommended Tools
- **Error Tracking**: Sentry
- **Analytics**: Vercel Analytics or Google Analytics
- **Uptime Monitoring**: UptimeRobot
- **Performance**: Lighthouse CI

### Regular Maintenance
- Update dependencies monthly
- Monitor error logs
- Check performance metrics
- Backup database regularly
- Test new features in staging first

## Scaling Considerations

As your application grows:

1. **Database**:
   - Use PostgreSQL or MongoDB
   - Implement connection pooling
   - Add database indexes
   - Consider read replicas

2. **Caching**:
   - Implement Redis for caching
   - Use CDN for static assets
   - Enable HTTP caching headers

3. **Authentication**:
   - Add user authentication
   - Implement JWT tokens
   - Add role-based access control

4. **Rate Limiting**:
   - Protect API endpoints
   - Use middleware for rate limiting
   - Monitor for abuse

## Security Best Practices

- Keep dependencies updated
- Enable HTTPS only
- Implement CSP headers
- Sanitize user inputs
- Use environment variables for secrets
- Enable CORS only for your domain
- Implement rate limiting
- Add request validation
- Use secure cookies

## Support

For deployment issues:
- Vercel: [vercel.com/docs](https://vercel.com/docs)
- Netlify: [docs.netlify.com](https://docs.netlify.com)

---

**Good luck with your deployment! 🎉**
