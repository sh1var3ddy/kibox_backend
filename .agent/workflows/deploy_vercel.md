---
description: Deploy the backend app to Vercel
---
# Deploy to Vercel

This workflow guides you through deploying your backend application to Vercel.

## Prerequisites

- You need a Vercel account.
- `npm` installed.

## Steps

1. **Install Vercel CLI (if not installed)**
   You can run `npx vercel` directly, or install globally:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```
   Follow the instructions to log in with your email or GitHub/GitLab/Bitbucket.

3. **Deploy**
   Run the deployment command:
   ```bash
   vercel
   ```
   - Set up and deploy: `Y`
   - In which scope: `[Select your scope]`
   - Link to existing project: `N`
   - What's your project's name: `kibox-backend` (or your preferred name)
   - In which directory is your code located: `./`
   - Want to modify these settings: `N`

   Wait for the deployment to complete. You will get a Production URL.

4. **Set Environment Variables**
   The application requires environment variables (MONGO_URI, JWT_SECRET, etc.).
   
   You can set them via the CLI:
   ```bash
   vercel env add MONGO_URI
   ```
   (You will be prompted to enter the value for Production, Preview, and Development).
   Repeat for:
   - `JWT_SECRET`
   - `EMAIL_USER`
   - `EMAIL_PASS`
   - Any other variables from your `.env` file.

   Alternatively, go to the Vercel Dashboard -> Project Settings -> Environment Variables and add them there.

5. **Redeploy**
   After setting environment variables, you might need to redeploy for them to take effect:
   ```bash
   vercel --prod
   ```
