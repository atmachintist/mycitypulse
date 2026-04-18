#!/bin/bash
# MyCityPulse – ship today's build-recovery + routing fix
# Run this from your local terminal, in the mycitypulse project directory.
# Safe to re-run: each run will commit only what has actually changed.

set -e

cd "$(dirname "$0")"

echo "🔎  Where am I?"
pwd

echo ""
echo "🔎  Git remote:"
git remote -v || { echo "❌ No git remote configured. Aborting."; exit 1; }

echo ""
echo "🔎  Pre-flight: run the build locally first"
npm run build

echo ""
echo "🔎  Pre-flight: validate all 15 Gujarat election datasets"
npm run validate:gujarat-elections

echo ""
echo "📦  Files changed in today's recovery:"
git status --short

echo ""
echo "➕  Staging the source changes (skipping build artifacts and OS files)…"
git add src/App.jsx
git add src/features/city/CityPage.jsx
git add src/features/compare/CompareView.jsx
git add src/components/ElectionsCard.jsx
git add src/lib/routing.js
git add src/domain/elections/ahmedabad.js
git add src/domain/elections/rajkot.js
git add src/domain/elections/loadElectionData.js
git add src/domain/elections/verification.js
git add DEPLOY_TODAYS_FIX.sh

echo ""
echo "✍️   Creating the commit…"
git commit -m "fix(build): restore App root + ward deep-link routing + SEC verification badges

Recovered truncated files (App.jsx, CityPage.jsx, CompareView.jsx,
ElectionsCard.jsx, ahmedabad.js, rajkot.js) from a prior interrupted
session, added export default function App() with URL routing,
wired Navsari/Gandhidham/Vapi election modules, and added a
verification module so the UI can surface SEC-verified vs pending
status. All 15 Gujarat municipal corporation datasets now validate.

- Routing: /:citySlug/:panel/ward/:n shareable deep-links
- popstate support for browser back/forward
- loadElectionData normalizer for old/new data-shape conventions
- src/domain/elections/verification.js for trust-inducing badges"

echo ""
echo "🚀  Pushing to origin…"
git push

echo ""
echo "✅  Push complete."
echo "    Vercel / Netlify will pick this up from your connected GitHub repo"
echo "    and redeploy mycitypulse.in automatically within a minute or two."
echo ""
echo "    Watch the deploy: https://vercel.com/dashboard"
