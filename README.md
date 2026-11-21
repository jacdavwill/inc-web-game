# Rise of the Hero - Incremental RPG Game

An incremental RPG browser game that can be hosted on GitHub Pages. The game allows you to upgrade technology through your history, from basic calculators to quantum processors.

## Features

- **Progressive Upgrades**: Start with a calculator and upgrade to supercomputers
- **Statistics Tracking**: Track your level, XP, credits earned, and epic moments
- **Save System**: Automatically saves your game progress every 30 seconds
- **Epic Moments**: Generate unique in-game stories as you progress
- **Mobile Responsive**: Works great on mobile devices

## How to Deploy to GitHub Pages

### Prerequisites
- A GitHub account (free)
- Basic knowledge of command-line operations

### Deployment Steps

1. **Create a repository on GitHub**
   ```bash
   # Clone or create your repo
   git clone https://github.com/YOUR_USERNAME/inc-web-game.git
   cd inc-web-game
   ```

2. **Commit the files**
   ```bash
   git add .
   git commit -m "Initial commit: Incremental RPG game"
   ```

3. **Enable GitHub Pages**
   
   Go to your repository on GitHub and set the branch to `main` (GitHub Pages defaults to main now).

4. **Configure the site**
   
   In the repository settings, under "Pages":
   - Select "Deploy from a branch"
   - Branch: `main` (or `master` if you're using the legacy setting)
   - Folder: `/`

5. **Deploy**
   
   GitHub will automatically deploy your site when you make commits to the main branch.

### Alternative Deployment Methods

#### Vercel (Recommended for Performance)
```bash
npm install -g vercel
vercel --prod
```

#### Netlify
```bash
npm install -G netlify-cli
netlify dev
# Then deploy from the build output
```

## Game Mechanics

### Upgrade Cost Formula
```javascript
currentCost = baseCost * Math.pow(multiplier, count - 1)
```

### Progression System
- Each upgrade increases your multiplier (efficiency gain)
- Purchased upgrades are saved to local storage
- Your game auto-saves every 30 seconds
- Epic moments are generated based on milestones achieved

### Currency & Stats
- Earn credits from purchases
- Level up by gaining XP
- Track the number of epic moments you've experienced
- See how high you've climbed in the ranks

## Files Structure

```
inc-web-game/
├── index.html          # Main HTML structure
├── css/
│   └── styles.css      # Game styling
├── js/
│   └── main.js         # Game logic and state management
├── .github/
│   └── PAGES.yml       # GitHub Pages config
├── package.json         # npm package info
└── README.md           # This file
```

## Customization

### Modify Upgrades in `js/main.js`

```javascript
const defaultUpgrades = [
    {
        id: 'upgrade-X',
        name: 'Your Upgrade Name',
        multiplier: 1.5,      // Multiplier factor for this upgrade
        description: 'Description of what this upgrade does',
        baseCost: 100,        // Base cost for first purchase
        purchased: false,
        boughtAt: null
    }
];
```

### Style Customization

Edit `css/styles.css` to change colors and styling. The CSS variables at the top let you easily theme the entire game.

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

## License

This is a demo project for demonstrating incremental RPG on GitHub. Feel free to fork or use as inspiration for your own projects!
