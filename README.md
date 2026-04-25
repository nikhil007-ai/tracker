<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 🎯 Hacking Tracker - Ghost Track v2.0

A **local-first** security research and bug bounty tracking application. Track your hacking journey, manage bounty reports, monitor progress, and stay organized - all stored securely in your browser.

## ✨ Features

✅ **Offline-First**: All data stored locally in your browser (IndexedDB)  
✅ **No API Keys Required**: Works 100% without external services  
✅ **Track Checklist**: Progress through security training phases  
✅ **Bug Bounty Tracker**: Log and manage bounty reports  
✅ **Daily Missions**: Stay motivated with daily objectives  
✅ **Skill Meter**: Track your progress and skill level  
✅ **Local Analytics**: View hours practiced, bugs found, rewards  
✅ **Mobile Friendly**: Use on any device  

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open browser
# http://localhost:3000
```

**That's it! No API keys needed.** 🎉

## 📦 Build & Deploy

### Build for Production

```bash
npm run build
```

This creates an optimized `dist/` folder ready for deployment.

### Deploy to GitHub Pages

See [GITHUB_DEPLOYMENT.md](GITHUB_DEPLOYMENT.md) for step-by-step guide.

One-line summary:
```bash
git push origin main
# GitHub Actions automatically builds and deploys!
```

Your app will be live at: `https://YOUR_USERNAME.github.io/tracker`

## 📝 How to Add Code

Want to customize the app? See [HOW_TO_ADD_CODE.md](HOW_TO_ADD_CODE.md) for examples:

- Add new data types
- Create new components
- Add helper functions
- Build custom features

## 🏗️ Project Structure

```
tracker/
├── src/
│   ├── App.tsx              ← Main components
│   ├── main.tsx             ← Entry point
│   ├── index.css            ← Styles
│   ├── db/database.ts       ← Database & data schema
│   └── lib/utils.ts         ← Helper functions
├── vite.config.ts           ← Build config
├── tsconfig.json            ← TypeScript config
├── package.json             ← Dependencies
└── index.html               ← HTML template
```

## 🎨 Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Dexie.js** - Local database
- **Motion** - Animations
- **Lucide React** - Icons
- **Vite** - Build tool

## ❓ FAQ

**Q: Do I need an API key?**  
A: No! The app works 100% without any API keys. Everything is stored locally.

**Q: Is my data secure?**  
A: Yes! All data stays in your browser. Nothing is sent to external servers.

**Q: Can I use this offline?**  
A: Yes! After loading, the app works completely offline.

**Q: Can I access from multiple devices?**  
A: Each device has its own data storage. You can manually export/import data between devices.

**Q: How do I deploy?**  
A: Push to GitHub and GitHub Actions automatically builds & deploys to GitHub Pages.

## 📚 Documentation

- [DEPLOYMENT_OPTIMIZATION.md](DEPLOYMENT_OPTIMIZATION.md) - Production optimization details
- [GITHUB_DEPLOYMENT.md](GITHUB_DEPLOYMENT.md) - GitHub Pages deployment guide
- [HOW_TO_ADD_CODE.md](HOW_TO_ADD_CODE.md) - Code customization guide

## 🛠️ Available Scripts

```bash
npm run dev      # Start development server on port 3000
npm run build    # Build for production
npm run preview  # Preview production build locally
npm run lint     # Check TypeScript errors
npm run clean    # Remove build artifacts
```

## 📄 License

This project is provided as-is for educational and personal use.

## 🤝 Contributing

Feel free to fork, modify, and deploy your own version!

---

**Made for hackers, by hackers.** ⚡🔒
