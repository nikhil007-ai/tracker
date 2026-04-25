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
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/tracker.git
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username.**

### Step 3: Enable GitHub Pages

1. Go to **Settings** → **Pages** (left sidebar)
2. Under "Build and deployment":
   - Source: Select **Deploy from a branch**
   - Branch: Select **gh-pages** and **/(root)** folder
3. Click **Save**

### Step 4: Deploy!

The workflow will automatically trigger when you push to `main`. To deploy now:

```bash
cd /home/anoxysec/Downloads/tracker
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

### Step 5: Access Your App

After deployment completes (watch the **Actions** tab):

- **Default URL**: `https://YOUR_USERNAME.github.io/tracker`
- **Example**: `https://nikhil007-ai.github.io/tracker`

---

## Deployment Status

Check deployment progress:
1. Go to your repository
2. Click **Actions** tab
3. View "Deploy to GitHub Pages" workflow
4. Green checkmark = ✅ Deployed successfully!

---

## Important Notes

### The App Works WITHOUT API Keys! ✅

**Good news**: The app is completely self-contained:
- ✅ All data stored locally in your browser (IndexedDB)
- ✅ No external API calls required
- ✅ No Gemini API key needed (optional for future features)
- ✅ Works 100% offline

You can deploy and use it immediately without any configuration!

### Repository Name Matters

If your repository name is **not** `tracker`, update the base path in `vite.config.ts`:

```javascript
const baseUrl = process.env.GITHUB_PAGES === 'true' ? '/your-repo-name/' : '/';
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

### My app shows blank page

1. Check browser console (F12) for errors
2. Check GitHub Actions logs for build errors
3. Verify the repository is public (GitHub Pages needs this)

### Deployment works but something is broken

1. Check browser DevTools (F12) → Console for errors
2. Clear browser cache: Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac)
3. Try incognito/private browser window

---

## Remove CNAME (if you don't have a custom domain)

The current workflow does NOT set a custom domain by default.

If you have a custom domain (e.g., `mytracker.com`):

1. Update `.github/workflows/deploy.yml`: Add this after `publish_dir: ./dist`
   ```yaml
   cname: mytracker.com
   ```
2. Add DNS records pointing to GitHub Pages
3. In GitHub **Settings → Pages**: Update custom domain

---

## Access from Anywhere ✅

✅ **Your app is now live at**: `https://YOUR_USERNAME.github.io/tracker`

You can access it from:
- Any browser, any device
- Any location in the world
- Any time of day
- No need to run your laptop
- Works on mobile phones too!

---

## Next Steps

### Optional: Add a Custom Domain

If you own a domain (e.g., `mytracker.com`):

1. Update `.github/workflows/deploy.yml`: Add `cname: mytracker.com`
2. Add DNS records pointing to GitHub Pages
3. In GitHub **Settings → Pages**: Update custom domain

### Optional: Add a README Badge

Show deployment status in your README:

```markdown
![Deploy Status](https://github.com/YOUR_USERNAME/tracker/workflows/Deploy%20to%20GitHub%20Pages/badge.svg)
```

---

## FAQ

**Q: Do I need an API key to use this?**
A: No! The app works 100% without any API keys. All your data is stored locally in your browser.

**Q: Is my data secure?**
A: Yes! All data stays in your browser (IndexedDB). Nothing is sent to external servers.

**Q: Can I access my data from multiple devices?**
A: Each device has its own local storage. To sync across devices, you'd need to export/import data (feature can be added).

**Q: How do I update the app after deploying?**
A: Just push your changes to GitHub: `git push origin main`. GitHub Actions automatically rebuilds and deploys.

**Q: Can I use a custom domain?**
A: Yes! See the "Remove CNAME" section above.

**Q: What if deployment fails?**
A: Check the **Actions** tab for error messages. Common fixes: ensure repository is public, check branch name is `main`.

---

## Questions?

If you need help:
1. Check GitHub Actions logs for build errors
2. Verify all steps were followed correctly
3. Ensure repository is public
4. Try pushing a fresh commit: `git commit --allow-empty -m "Retry deployment"`
