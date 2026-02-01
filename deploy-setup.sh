#!/bin/bash
# Quick deployment setup for GitHub and Vercel

set -e

echo "🚀 MeORYou Deployment Setup"
echo "================================"

# Check if git remote exists
if git remote | grep -q origin; then
    echo "✅ Git remote already configured"
else
    echo "❌ Git remote not found"
    echo "📝 Run this command to add your GitHub repo:"
    echo "   git remote add origin https://github.com/YOUR_USERNAME/meoryou.git"
    echo ""
fi

# Display current git status
echo "📊 Current Git Status:"
echo "---"
git log --oneline -3
echo ""

echo "📋 Current Remote:"
git remote -v 2>/dev/null || echo "   (no remote configured)"

echo ""
echo "✅ Setup Complete!"
echo ""
echo "📚 Next Steps:"
echo "1. Create a repository on GitHub (github.com/new)"
echo "2. Add remote: git remote add origin https://github.com/YOUR_USERNAME/meoryou.git"
echo "3. Push: git push -u origin main (or git branch -m master main)"
echo "4. Deploy frontend: https://vercel.com/new (import your repo)"
echo "5. Deploy backend: https://render.com (create web service)"
echo "6. See DEPLOYMENT.md for detailed instructions"
echo ""
