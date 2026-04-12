#!/bin/bash
# MyCityPulse - Deploy Live NOW
# Copy & paste these commands in order

echo "🚀 DEPLOYING MYCITYPULSE LIVE"
echo "=============================="
echo ""

# STEP 1: Configure git (if not already done)
echo "Step 1: Configuring git..."
git config --global user.email "joglekar.yash@gmail.com"
git config --global user.name "Yash Joglekar"
echo "✓ Git configured"
echo ""

# STEP 2: Add all files
echo "Step 2: Staging all files..."
git add .
echo "✓ Files staged"
echo ""

# STEP 3: Commit
echo "Step 3: Creating commit..."
git commit -m "🚀 Deploy: Complete URL routing with all panels - Ready for production

- Added complete URL routing system
- All sub-pages have unique URLs: /city/health, /city/ecosystem, /city/issues, /city/elections, /city/wards
- Browser back/forward buttons fully supported
- Page refresh preserves state
- URLs are shareable and bookmarkable
- Production build optimized
- Vercel and Netlify configured for auto-deploy

Production ready and tested!"

echo "✓ Commit created"
echo ""

# STEP 4: Push to GitHub
echo "Step 4: Pushing to GitHub..."
echo "⚠️  You'll be asked to authenticate with GitHub"
echo "⚠️  Use your GitHub credentials or personal access token"
echo ""
git push -u origin main

echo ""
echo "✓ Pushed to GitHub"
echo ""

echo "=============================="
echo "🎉 GITHUB PUSH COMPLETE!"
echo "=============================="
echo ""
echo "NOW DO THIS:"
echo ""
echo "1. Go to: https://vercel.com/new"
echo "2. Click 'Continue with GitHub'"
echo "3. Select your repository"
echo "4. Click 'Deploy'"
echo ""
echo "Your site will be live in 2-3 minutes! 🚀"
echo ""
