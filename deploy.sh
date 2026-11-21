#!/bin/bash

# Quick Deploy Script for Rise of the Hero

echo "🚀 Rising to the top..."

# Step 1: Verify we have all files
echo "Checking file structure..."
if [ ! -f index.html ]; then
    echo "❌ Error: index.html not found"
    exit 1
fi

if [ ! -f css/styles.css ]; then
    echo "❌ Error: css/styles.css not found"
    exit 1
fi

if [ ! -f js/main.js ]; then
    echo "❌ Error: js/main.js not found"
    exit 1
fi

echo "✅ All files present!"

# Step 2: Choose deployment method
echo ""
echo "Choose deployment method:"
echo "1) Vercel (fast, recommended)"
echo "2) Netlify (free, flexible)"
echo "3) GitHub Pages (free, easy)"
echo "4) Custom URL"

read -p "Enter your choice: " DEPLOY_METHOD

case $DEPLOY_METHOD in
    1) echo ""
        echo "🚀 Deploying to Vercel..."
        npm install -g vercel
        vercel --prod
        ;;
    
    2) echo ""
        echo "🚀 Deploying to Netlify..."
        # Use browser UI or netlify-cli
        netlify deploy --prod
        ;;
    
    3) echo ""
        echo "🚀 Configuring GitHub Pages..."
        echo "Go to your GitHub repository → Settings → Pages"
        echo "Branch: main, Folder: /"
        ;;
    
    4) read -p "Enter your custom URL: " CUSTOM_URL
        echo ""
        echo "Custom URL configured as: ${CUSTOM_URL}"
        ;;
    
    *)
        echo "Invalid option!"
        exit 1
        ;;
esac

echo ""
echo "🎮 Your game is deploying! Check your console for the live URL."