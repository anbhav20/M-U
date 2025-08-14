# Render Deployment Setup

To properly deploy your Talk2Stranger application on Render, you need to make a few configuration changes to your `package.json` file before pushing to GitHub.

## Required Changes to package.json

Update your scripts section in package.json to include the following:

```json
"scripts": {
  "dev": "NODE_ENV=development tsx server/index.ts",
  "build": "vite build && esbuild server/production.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
  "start": "NODE_ENV=production node dist/production.js",
  "check": "tsc"
}
```

## Key changes made:

1. The `build` script now compiles the `server/production.ts` file (created for you) instead of `server/index.ts`
2. The `start` script will now run `dist/production.js` instead of `dist/index.js`
3. Removed any database-related scripts

## Step-by-Step Deployment Process

1. Create a GitHub repository and push your code
2. Sign up for a Render account at [render.com](https://render.com)
3. In the Render dashboard, click "New" and select "Web Service"
4. Connect your GitHub repository
5. Configure as follows:
   - **Name**: `talk2stranger` (or your preferred name)
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: Start with the free tier for testing

## Environment Variables

Add these environment variables in your Render dashboard:

- `NODE_ENV`: `production`
- `PORT`: Leave blank (Render will provide this)

## Important Security Considerations Before Public Release

Before making your app publicly available, consider implementing:

1. Rate limiting on API endpoints to prevent abuse
2. Update CORS settings in `server/routes.ts` to restrict to your domain
3. Add content filtering/moderation for chat messages
4. Implement user reporting functionality
5. Add a proper Terms of Service and Privacy Policy

The `server/production.ts` file we've created will handle serving your static files and API routes in production. This setup ensures your app will work correctly on Render's platform.

---

Follow the detailed deployment guide in DEPLOYMENT.md for more information on preparing your app for public release.