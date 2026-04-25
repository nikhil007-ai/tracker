#!/bin/bash

# Hacking Tracker - GitHub Deployment Script
# This script helps you push your code to GitHub

echo "========================================="
echo "  Hacking Tracker - GitHub Deployment"
echo "========================================="
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "❌ Git is not initialized!"
    echo "Run: git init"
    exit 1
fi

# Check git config
if [ -z "$(git config user.email)" ]; then
    echo "⚠️  Git user not configured. Setting up..."
    read -p "Enter your email: " email
    read -p "Enter your name: " name
    git config --global user.email "$email"
    git config --global user.name "$name"
    echo "✅ Git configured!"
    echo ""
fi

# Check if remote exists
if ! git remote get-url origin &> /dev/null; then
    echo "⚠️  GitHub remote not configured."
    echo ""
    echo "Steps to set up:"
    echo "1. Create a repository on GitHub: https://github.com/new"
    echo "2. Copy the HTTPS URL from GitHub"
    echo "3. Run this command:"
    echo ""
    echo "   git remote add origin <YOUR_GITHUB_URL>"
    echo "   git branch -m master main"
    echo "   git push -u origin main"
    echo ""
    echo "Example:"
    echo "   git remote add origin https://github.com/anoxysec/tracker.git"
    echo "   git branch -m master main"
    echo "   git push -u origin main"
    exit 1
fi

# Show current remote
current_remote=$(git remote get-url origin)
echo "📍 Current remote: $current_remote"
echo ""

# Stage changes
echo "📦 Staging changes..."
git add .

# Check for changes
if [ -z "$(git status --porcelain)" ]; then
    echo "✅ No changes to commit"
    exit 0
fi

# Show changes
echo "📝 Changes to commit:"
git status --short
echo ""

# Get commit message
read -p "📝 Enter commit message: " commit_message

if [ -z "$commit_message" ]; then
    commit_message="Update tracker code"
fi

# Commit
echo "💾 Committing..."
git commit -m "$commit_message"

# Push
echo "🚀 Pushing to GitHub..."
git push origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================="
    echo "✅ Deploy Successful!"
    echo "========================================="
    echo ""
    echo "📍 Your app will be available at:"
    remote_url=$(git config --get remote.origin.url)
    username=$(echo $remote_url | grep -oP '(?<=github.com/)[^/]+' || echo "YOUR_USERNAME")
    echo "   https://$username.github.io/tracker"
    echo ""
    echo "⏳ Deployment takes 1-2 minutes..."
    echo "👀 Watch progress: GitHub Actions tab in your repository"
    echo ""
else
    echo "❌ Push failed! Check your internet connection or git configuration."
    exit 1
fi
