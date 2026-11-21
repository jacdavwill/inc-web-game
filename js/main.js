// Game State Management
let gameState = {
    credits: 100,
    upgrades: [],
    stats: {
        level: 1,
        xp: 0,
        totalClicks: 0,
        totalUpgrades: 0,
        highestLevel: 1,
        highestCredits: 100
    },
    epics: []
};

// Initial Upgrades - Incremental RPG progression
const defaultUpgrades = [
    {
        id: 'upgrade-1',
        name: 'Basic Calculator',
        multiplier: 1.0,
        description: 'Start your journey with a simple calculator.',
        baseCost: 15,
        purchased: false,
        boughtAt: null
    },
    {
        id: 'upgrade-2',
        name: 'Advanced Computer',
        multiplier: 1.4,
        description: 'Upgrade your computing power!',
        baseCost: 100,
        purchased: false,
        boughtAt: null
    },
    {
        id: 'upgrade-3',
        name: 'Supercomputer',
        multiplier: 2.0,
        description: 'The most powerful computer in your sector.',
        baseCost: 500,
        purchased: false,
        boughtAt: null
    },
    {
        id: 'upgrade-4',
        name: 'Quantum Processor',
        multiplier: 2.8,
        description: 'Harness the power of quantum computing.',
        baseCost: 2000,
        purchased: false,
        boughtAt: null
    }
];

// Game Configuration
const CONFIG = {
    SAVE_KEY: 'rise_of_the_hero_save',
    AUTO_SAVE_INTERVAL: 30000 // 30 seconds
};

// DOM Elements
const upgradesList = document.getElementById('upgrades-list');
const statsDisplay = document.getElementById('stats-display');
const epicsList = document.getElementById('epic-moments-list');
const currentTimestamp = document.getElementById('current-time');
const currencyDisplay = document.getElementById('currency-display');
const totalUpgradesDisplay = document.getElementById('total-upgrades');

// Initialize Game
document.addEventListener('DOMContentLoaded', () => {
    loadGame();
    renderUpgrades();
    renderStats();
    renderEpics();
    updateCurrencyDisplay();
    
    // Auto-save functionality
    setInterval(() => {
        if (gameState.credits > 0) {
            saveGame();
        }
    }, CONFIG.AUTO_SAVE_INTERVAL);

    // Check for saved game on load
    setTimeout(() => {
        const savedData = localStorage.getItem(CONFIG.SAVE_KEY);
        if (!savedData && defaultUpgrades.length > 0) {
            gameState.upgrades = JSON.parse(JSON.stringify(defaultUpgrades));
            saveGame();
        }
    }, 100);
});

// Game Logic Functions
function calculateCost(upgrade, baseMultiplier) {
    const multiplier = upgrade.multiplier || baseMultiplier;
    return Math.floor(baseCost * (Math.pow(multiplier, upgrade.count - 1)));
}

function getBaseCost(upgradeId) {
    const defaultUpgrade = defaultUpgrades.find(u => u.id === upgradeId);
    return defaultUpgrade ? defaultUpgrade.baseCost : 15;
}

function countUpgrades() {
    let count = 0;
    gameState.upgrades.forEach(u => {
        if (u.purchased) count++;
    });
    return count;
}

// Render Functions
function renderUpgrades() {
    upgradesList.innerHTML = '';
    
    gameState.upgrades.forEach(upgrade => {
        const upgradeItem = document.createElement('div');
        upgradeItem.className = 'upgrade-item';
        
        if (upgrade.purchased) {
            upgradeItem.classList.add('purchased');
        } else {
            // Add hover effect for non-purchased items
            upgradeItem.addEventListener('mouseover', () => {
                upgradeItem.style.transform = 'scale(1.05)';
            });
            
            upgradeItem.addEventListener('mouseout', () => {
                upgradeItem.style.transform = 'scale(1)';
            });
        }

        const header = document.createElement('div');
        header.className = 'upgrade-header';
        
        const nameSpan = document.createElement('span');
        nameSpan.className = 'upgrade-name';
        nameSpan.textContent = upgrade.name;
        header.appendChild(nameSpan);
        
        const multiplierSpan = document.createElement('span');
        multiplierSpan.className = 'upgrade-multiplier';
        multiplierSpan.textContent = `x${upgrade.multiplier.toFixed(1)}`;
        header.appendChild(multiplierSpan);

        const desc = document.createElement('p');
        desc.className = 'upgrade-desc';
        desc.textContent = upgrade.description;
        header.appendChild(desc);

        const costsDiv = document.createElement('div');
        costsDiv.className = 'upgrade-costs';
        
        const currentCostDiv = document.createElement('div');
        currentCostDiv.className = 'upgrade-cost';
        const label1 = document.createElement('span');
        label1.textContent = 'Current Cost:';
        costsDiv.appendChild(label1);
        
        const currentCostValue = document.createElement('span');
        currentCostValue.className = 'current';
        currentCostValue.textContent = '$' + formatNumber(calculateCost(upgrade, upgrade.multiplier));
        costsDiv.appendChild(currentCostValue);
        
        const purchasedCostDiv = document.createElement('div');
        purchasedCostDiv.className = 'upgrade-cost';
        purchasedCostDiv.innerHTML = `<span>Purchase: $${formatNumber(getBaseCost(upgrade.id))}</span>`;
        costsDiv.appendChild(purchasedCostDiv);

        const purchasedBadge = document.createElement('div');
        purchasedBadge.className = 'purchased';
        if (upgrade.purchased) {
            purchasedBadge.textContent = `OWNED!`;
        } else {
            purchasedBadge.textContent = '';
        }

        upgradeItem.appendChild(header);
        upgradeItem.appendChild(desc);
        upgradeItem.appendChild(costsDiv);
        upgradeItem.appendChild(purchasedBadge);

        upgradesList.appendChild(upgradeItem);
    });
}

function renderStats() {
    statsDisplay.innerHTML = '';
    
    const statRows = [
        { label: 'Level', value: gameState.stats.level },
        { label: 'Total XP', value: formatNumber(gameState.stats.xp) },
        { label: 'Total Credits Earned', value: formatNumber(gameState.credits) },
        { label: 'Highest Level Reached', value: formatNumber(gameState.stats.highestLevel) },
        { label: 'Epic Moments', value: formatNumber(gameState.epics.length) }
    ];

    statRows.forEach(row => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'stat-row';
        
        const labelSpan = document.createElement('span');
        labelSpan.textContent = row.label + ':';
        
        const valueSpan = document.createElement('span');
        valueSpan.textContent = row.value;
        
        rowDiv.appendChild(labelSpan);
        rowDiv.appendChild(valueSpan);
        statsDisplay.appendChild(rowDiv);
    });
}

function renderEpics() {
    epicsList.innerHTML = '';
    
    gameState.epics.forEach(epic => {
        const epicItem = document.createElement('li');
        epicItem.className = 'epic-moment';
        
        const p1 = document.createElement('p');
        p1.textContent = `You purchased the ${epic.name} for the first time!`;
        const timeSpan = document.createElement('span');
        timeSpan.textContent = ` - At level ${epic.level}`;
        p1.appendChild(timeSpan);
        
        const timeElement = document.createElement('time');
        timeElement.setAttribute('datetime', new Date().toISOString());
        timeElement.textContent = 'Last updated: ' + epic.updatedAt;
        
        epicItem.appendChild(p1);
        epicItem.appendChild(timeElement);
        epicsList.appendChild(epicItem);
    });
}

function updateCurrencyDisplay() {
    currencyDisplay.textContent = formatNumber(gameState.credits);
    totalUpgradesDisplay.textContent = formatNumber(countUpgrades());
    
    // Update real-time clock
    const options = { hour: 'numeric', minute: 'numeric' };
    currentTimestamp.textContent = new Date().toLocaleTimeString(options);
}

function purchaseUpgrade(upgradeId) {
    const upgrade = gameState.upgrades.find(u => u.id === upgradeId);
    if (!upgrade || !gameState.credits || !gameState.credits > calculateCost(upgrade, upgrade.multiplier)) {
        return false;
    }

    // Deduct credits
    gameState.credits -= calculateCost(upgrade, upgrade.multiplier);
    
    // Mark as purchased
    upgrade.purchased = true;
    
    // Calculate new total credits (for display purposes)
    const multiplierFactor = 1 + ((upgrade.multiplier - 1) * (gameState.stats.totalUpgrades || 0));
    gameState.credits += calculateCost(upgrade, upgrade.multiplier) * multiplierFactor;

    // Update stats
    if (gameState.stats.level < gameState.highestLevel) {
        gameState.stats.level = Math.floor(Math.sqrt(gameState.stats.xp)) + 1;
        gameState.stats.xp += 100;
    }
    
    gameState.stats.totalUpgrades++;
    gameState.stats.totalClicks += 1;

    // Generate epic moment
    generateEpicMoment();

    updateCurrencyDisplay();
    renderStats();
    renderEpics();
    renderUpgrades();
    saveGame();

    return true;
}

function generateEpicMoment() {
    const upgrades = gameState.upgrades.filter(u => u.purchased);
    if (upgrades.length === 0) {
        return;
    }

    // Generate a random epic name based on purchased upgrades
    const epicNames = [
        'First Galactic Explorer',
        'Time Traveler',
        'Quantum Pioneer',
        'Virtual Reality Architect',
        'AI Developer',
        'Cybernetics Engineer'
    ];

    const randomEpic = {
        name: epicNames[Math.floor(Math.random() * epicNames.length)],
        level: gameState.stats.level,
        updatedAt: new Date().toLocaleString()
    };

    // Check if this epic already exists
    if (!gameState.epics.find(e => e.name === randomEpic.name)) {
        gameState.epics.push(randomEpic);
    }
}

// Save/Load Functions
function saveGame() {
    localStorage.setItem(CONFIG.SAVE_KEY, JSON.stringify(gameState));
}

function loadGame() {
    const savedData = localStorage.getItem(CONFIG.SAVE_KEY);
    if (savedData) {
        try {
            const loadedState = JSON.parse(savedData);
            gameState = { ...gameState, ...loadedState };
            
            // Restore default upgrades that might not exist in the load
            const defaultIds = defaultUpgrades.map(u => u.id);
            gameState.upgrades.forEach(u => {
                if (!defaultIds.includes(u.id)) {
                    u.purchased = false;
                    u.boughtAt = null;
                }
            });
        } catch (e) {
            console.error('Failed to load game state:', e);
        }
    }
}

// Utility Functions
function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(2) + 'k';
    return num.toString();
}

function toggleForm() {
    // Simple form toggle for mobile
    const panel = document.getElementById('settings-panel');
    panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
}

// Error handling
document.addEventListener('error', (e) => {
    console.error('Game error:', e);
    // In a real app, you might alert the user about the error
});

console.log('Rise of the Hero - Incremental RPG Loaded!');