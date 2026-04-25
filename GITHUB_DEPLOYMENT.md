# GitHub Deployment Guide

This guide will help you deploy your app to GitHub Pages so it's accessible from anywhere.

## Quick Start (Step-by-Step)

### Step 1: Create a GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in to your account
2. Click the `+` icon in the top right → select **New repository**
3. Name it: `tracker` (or any name you prefer)
4. Choose **Public** (so it's accessible)
5. **Do NOT** initialize with README, .gitignore, or license (we already have these)
6. Click **Create repository**

### Step 2: Add Your GitHub Remote

After creating the repository, GitHub will show you commands to run. Copy the HTTPS URL and run:

```bash
cd /home/anoxysec/Downloads/tracker
git branch -m master main
git remote add origin https://github.com/YOUR_USERNAME/tracker.git
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username.**

### Step 3: Set Up Environment Secrets

Your app needs the `GEMINI_API_KEY` to run. GitHub Actions will need access to this:

1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `VITE_GEMINI_API_KEY`
5. Value: Paste your actual Gemini API key
6. Click **Add secret**

### Step 4: Enable GitHub Pages

1. Go to **Settings** → **Pages** (left sidebar)
2. Under "Build and deployment":
   - Source: Select **Deploy from a branch**
   - Branch: Select **gh-pages** and **/(root)** folder
3. Click **Save**

### Step 5: Deploy!

The workflow will automatically trigger when you push to `main`. To deploy now:

```bash
cd /home/anoxysec/Downloads/tracker
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

### Step 6: Access Your App

After deployment completes (watch the **Actions** tab):

- **Default URL**: `https://YOUR_USERNAME.github.io/tracker`
- **Example**: `https://anoxysec.github.io/tracker`

---

## Deployment Status

Check deployment progress:
1. Go to your repository
2. Click **Actions** tab
3. View "Deploy to GitHub Pages" workflow
4. Green checkmark = ✅ Deployed successfully!

---

## Important Notes

### Repository Name Matters

If your repository name is **not** `tracker`, update this line in `.github/workflows/deploy.yml`:

```yaml
# If repo name is "hacker-tracker", set base: "/hacker-tracker/"
```

And update `vite.config.ts` if needed:

```javascript
export default defineConfig(({mode}) => {
  return {
    base: process.env.VITE_BASE_PATH || '/',
    // ... rest of config
  };
});
```

### Local Development vs Production

- **Development**: `npm run dev` → runs on `http://localhost:3000`
- **Production**: Deployed to `https://YOUR_USERNAME.github.io/tracker`

---

## Updating Your Deployment

Every time you push code to `main`:

```bash
git add .
git commit -m "Your changes here"
git push origin main
```

GitHub Actions will automatically rebuild and redeploy!

---

## Troubleshooting

### Action fails with "permission denied"

Make sure your git user is configured:

```bash
git config --global user.email "your-email@example.com"
git config --global user.name "Your Name"
```

### Deployment works but GEMINI_API_KEY is undefined

1. Check that you added the secret in GitHub Settings
2. Verify the secret name is exactly: `VITE_GEMINI_API_KEY`
3. In `vite.config.ts`, it's accessed as: `env.GEMINI_API_KEY`

### My app shows blank page

1. Check browser console (F12) for errors
2. Check GitHub Actions logs for build errors
3. Verify the repository is public (GitHub Pages needs this)

---

## What Happens Behind the Scenes

When you push to GitHub:

1. **GitHub Actions** runs automatically
2. It installs dependencies: `npm install`
3. It builds the app: `npm run build`
4. It deploys the `dist/` folder to **gh-pages** branch
5. GitHub Pages serves your `dist/` folder as a website

---

## Remove CNAME (if you don't have a custom domain)

The current workflow has:
```yaml
cname: tracker.example.com
```

If you **don't** have a custom domain, remove this line from `.github/workflows/deploy.yml`:

```yaml
# Remove this section if no custom domain:
# cname: tracker.example.com
```

If you have a custom domain, replace `tracker.example.com` with your actual domain.

---

## Access from Anywhere

✅ **Your app is now live at**: `https://YOUR_USERNAME.github.io/tracker`

You can access it from:
- Any browser, any device
- Any location in the world
- No need to run your laptop

---

## Next Steps

### Optional: Add a Custom Domain

If you own a domain (e.g., `mytracker.com`):

1. Update `.github/workflows/deploy.yml`: Change `cname: tracker.example.com` to your domain
2. Add DNS records pointing to GitHub Pages
3. In GitHub **Settings → Pages**: Update custom domain

### Optional: Add a README Badge

Show deployment status in your README:

```markdown
![Deploy Status](https://github.com/YOUR_USERNAME/tracker/workflows/Deploy%20to%20GitHub%20Pages/badge.svg)
```

---

## Security Reminder

⚠️ **Keep your Gemini API key safe!**
- Store it only in GitHub Secrets (not in code)
- Never commit `.env` file to GitHub
- The `.gitignore` file prevents accidental commits

---

## Questions?

If deployment fails:
1. Check GitHub Actions logs for error messages
2. Verify all environment variables are set
3. Ensure repository is public
4. Check that branch name is correct (`main` or `master`)
