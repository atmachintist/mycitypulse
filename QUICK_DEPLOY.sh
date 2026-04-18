#!/bin/bash

# MyCityPulse - Quick Deployment Script
# This script prepares your project for deployment

echo "🚀 MyCityPulse - Quick Deployment Script"
echo "========================================"
echo ""

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Check if git is initialized
echo -e "${BLUE}Step 1: Checking git repository...${NC}"
if [ ! -d ".git" ]; then
    echo "Git not initialized. Initializing..."
    git init
    git add .
    git commit -m "Initial commit - MyCityPulse with URL routing"
else
    echo -e "${GREEN}✓ Git repository found${NC}"
fi

# Step 2: Check for uncommitted changes
echo ""
echo -e "${BLUE}Step 2: Checking for changes...${NC}"
if [ -n "$(git status --porcelain)" ]; then
    echo "Changes detected:"
    git status --short
    echo ""
    echo "Committing changes..."
    git add .
    git commit -m "Deploy: Add URL routing and deployment configs"
    echo -e "${GREEN}✓ Changes committed${NC}"
else
    echo -e "${GREEN}✓ Working directory clean${NC}"
fi

# Step 3: Build the project
echo ""
echo -e "${BLUE}Step 3: Building production version...${NC}"
npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Build successful${NC}"
else
    echo "Build failed. Fix errors and try again."
    exit 1
fi

# Step 4: Show deployment instructions
echo ""
echo -e "${BLUE}Step 4: Ready to deploy!${NC}"
echo ""
echo -e "${YELLOW}Choose your deployment platform:${NC}"
echo ""
echo "  1. Vercel (Recommended)"
echo "     → Go to https://vercel.com/new"
echo "     → Select your GitHub repo"
echo "     → Click Deploy"
echo ""
echo "  2. Netlify"
echo "     → Go to https://app.netlify.com"
echo "     → Click 'Add new site'"
echo "     → Select your GitHub repo"
echo "     → Click Deploy"
echo ""
echo "  3. Your own server"
echo "     → Upload contents of ./dist/ folder"
echo "     → See DEPLOYMENT.md for server setup"
echo ""

# Step 5: Show what's ready
echo -e "${BLUE}What's Ready:${NC}"
echo -e "${GREEN}  ✓ Production build (./dist/)${NC}"
echo -e "${GREEN}  ✓ Vercel config (vercel.json)${NC}"
echo -e "${GREEN}  ✓ Netlify config (netlify.toml)${NC}"
echo -e "${GREEN}  ✓ GitHub Actions workflow${NC}"
echo -e "${GREEN}  ✓ URL routing configured${NC}"
echo ""

# Step 6: Final instructions
echo -e "${BLUE}Next Steps:${NC}"
echo ""
echo "1. Push to GitHub:"
echo "   git push origin main"
echo ""
echo "2. Connect to Vercel or Netlify"
echo "   (They'll auto-detect and deploy)"
echo ""
echo "3. Configure custom domain"
echo "   (Your hosting platform will guide you)"
echo ""

echo -e "${GREEN}═══════════════════════════════════════${NC}"
echo -e "${GREEN}  Ready to go live! 🚀${NC}"
echo -e "${GREEN}═══════════════════════════════════════${NC}"
echo ""
echo "For detailed instructions, see DEPLOY_NOW.md"
echo ""
