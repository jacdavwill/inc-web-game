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
    epics: [],
    dungeon: {
        unlockedLevel: 1,
        currentLevel: null,
        nodes: [],
        completed: false,
        lastCompletedLevel: null,
        completedLevels: []
    },
    resources: {}
};

// Resource Definitions - 10 magical metals and mana
const RESOURCES = [
    { id: 'ironwood', name: 'Ironwood', type: 'Metal', rarity: 'Common', description: 'A sturdy magical metal infused with earth elemental energy. Great for basic enchanted gear.', miningTime: 1000, value: 10 },
    { id: 'arcane_mana', name: 'Arcane Mana', type: 'Mana', rarity: 'Common', description: 'Raw magical energy, pure and untapped. The foundation of all arcane practice.', miningTime: 1000, value: 10 },
    { id: 'mithral', name: 'Mithral', type: 'Metal', rarity: 'Uncommon', description: 'A lightweight, ultra-strong magical alloy. Highly prized for armor crafting.', miningTime: 2000, value: 25 },
    { id: 'adamantite', name: 'Adamantite', type: 'Metal', rarity: 'Uncommon', description: 'An incredibly dense magical metal, nearly unbreakable. For advanced equipment.', miningTime: 2000, value: 25 },
    { id: 'starsteel', name: 'Starsteel', type: 'Metal', rarity: 'Rare', description: 'Forged from fallen stars, this metal radiates arcane power. Fearsome for war.', miningTime: 3000, value: 40 },
    { id: 'mooniron', name: 'Mooniron', type: 'Metal', rarity: 'Rare', description: 'Moon-touched metal with lunar properties, enhancing spellcasters and warriors.', miningTime: 3000, value: 40 },
    { id: 'dragonbone', name: 'Dragonbone', type: 'Metal', rarity: 'Rare', description: 'Dragon remains, magically hardened. Fearsome and powerful beyond compare.', miningTime: 3000, value: 40 },
    { id: 'astralite', name: 'Astralite', type: 'Metal', rarity: 'Very Rare', description: 'Astral projection material, barely found in the deepest voids of reality.', miningTime: 5000, value: 60 },
    { id: 'voidiron', name: 'Voidiron', type: 'Metal', rarity: 'Very Rare', description: 'Iron from the void between worlds. Unstable but immensely powerful.', miningTime: 5000, value: 60 },
    { id: 'chronosilver', name: 'Chronosilver', type: 'Metal', rarity: 'Very Rare', description: 'Silver from the time stream. Manipulates temporal energy in wondrous ways.', miningTime: 5000, value: 60 }
];

// Dungeon Levels Configuration
const DUNGEON_LEVELS = [
    { level: 1, name: 'The Cursed Caverns', description: 'A damp network of caves filled with common magical ores.', availableResources: ['ironwood', 'arcane_mana'] },
    { level: 2, name: 'The Iron Warrens', description: 'An abandoned iron mine rich with uncommon magical metals.', availableResources: ['ironwood', 'arcane_mana', 'mithral', 'adamantite'] },
    { level: 3, name: 'The Star Depths', description: 'Deep beneath the earth where star-forged metals lie.', availableResources: ['ironwood', 'arcane_mana', 'mithral', 'adamantite', 'starsteel', 'mooniron', 'dragonbone'] },
    { level: 4, name: 'The Void Lair', description: 'The deepest dungeon where void and chronal materials await.', availableResources: ['ironwood', 'arcane_mana', 'mithral', 'adamantite', 'starsteel', 'mooniron', 'dragonbone', 'astralite', 'voidiron', 'chronosilver'] }
];

// Initial Upgrades - Incremental RPG progression
const defaultUpgrades = [
    { id: 'upgrade-1', name: 'Basic Calculator', multiplier: 1.0, description: 'Start your journey with a simple calculator.', baseCost: 15, purchased: false, boughtAt: null, count: 1 },
    { id: 'upgrade-2', name: 'Advanced Computer', multiplier: 1.4, description: 'Upgrade your computing power!', baseCost: 100, purchased: false, boughtAt: null, count: 1 },
    { id: 'upgrade-3', name: 'Supercomputer', multiplier: 2.0, description: 'The most powerful computer in your sector.', baseCost: 500, purchased: false, boughtAt: null, count: 1 },
    { id: 'upgrade-4', name: 'Quantum Processor', multiplier: 2.8, description: 'Harness the power of quantum computing.', baseCost: 2000, purchased: false, boughtAt: null, count: 1 }
];

// Game Configuration
const CONFIG = {
    SAVE_KEY: 'rise_of_the_hero_save',
    AUTO_SAVE_INTERVAL: 30000, // 30 seconds
    MINE_TICK_MS: 50
};

// DOM Elements
const upgradesList = document.getElementById('upgrades-list');
const statsDisplay = document.getElementById('stats-display');
const epicsList = document.getElementById('epic-moments-list');
const currentTimestamp = document.getElementById('current-time');
const currencyDisplay = document.getElementById('currency-display');
const totalUpgradesDisplay = document.getElementById('total-upgrades');
const dungeonLevelsList = document.getElementById('dungeon-levels-list');
const dungeonActive = document.getElementById('dungeon-active');
const resourceNodesContainer = document.getElementById('resource-nodes-container');
const wikiResourcesList = document.getElementById('wiki-resources-list');
const ownedResourcesDisplay = document.getElementById('owned-resources');
const resourcesList = document.getElementById('resources-list');

// Initialize Game
document.addEventListener('DOMContentLoaded', () => {
    loadGame();
    switchTab('dungeon');
    renderDungeonLevels();
    renderUpgrades();
    renderStats();
    renderEpics();
    renderWiki();
    renderResources();
    updateCurrencyDisplay();
    
    // Auto-save functionality
    setInterval(() => {
        if (gameState.credits > 0) {
            saveGame();
        }
    }, CONFIG.AUTO_SAVE_INTERVAL);
});

// Tab Management
function switchTab(tabName) {
    const tabs = document.querySelectorAll('.tab');
    const contents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === tabName);
    });
    
    contents.forEach(content => {
        content.classList.toggle('active', content.id === tabName + '-section');
    });
}

// Game Logic Functions
function calculateCost(upgrade) {
    const count = upgrade.count || 1;
    const multiplier = upgrade.multiplier;
    const baseCost = upgrade.baseCost;
    return Math.floor(baseCost * Math.pow(multiplier, count - 1));
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

function getResource(resourceId) {
    return RESOURCES.find(r => r.id === resourceId);
}

function getDungeonLevel(level) {
    return DUNGEON_LEVELS.find(d => d.level === level);
}

// Render Functions
function renderUpgrades() {
    upgradesList.innerHTML = '';
    
    gameState.upgrades.forEach(upgrade => {
        const upgradeItem = document.createElement('div');
        upgradeItem.className = 'upgrade-item' + (upgrade.purchased ? ' purchased' : '');

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
        currentCostValue.textContent = '$' + formatNumber(calculateCost(upgrade));
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

        // Purchase button functionality
        upgradeItem.addEventListener('click', () => {
            if (!upgrade.purchased) {
                const cost = calculateCost(upgrade);
                if (gameState.credits >= cost) {
                    gameState.credits -= cost;
                    upgrade.purchased = true;
                    upgrade.count = (upgrade.count || 0) + 1;
                    gameState.stats.totalUpgrades++;
                    gameState.stats.totalClicks++;
                    generateEpicMoment();
                    updateCurrencyDisplay();
                    renderStats();
                    renderUpgrades();
                    saveGame();
                }
            }
        });

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
        { label: 'Epic Moments', value: formatNumber(gameState.epics.length) },
        { label: 'Dungeon Levels Cleared', value: formatNumber(gameState.dungeon.lastCompletedLevel ? gameState.dungeon.lastCompletedLevel : 0) }
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

    if (ownedResourcesDisplay) {
        let ownedText = '';
        let hasAny = false;
        for (const resourceId in gameState.resources) {
            const resource = getResource(resourceId);
            if (resource) {
                ownedText += `${resource.name}: ${gameState.resources[resourceId]} | `;
                hasAny = true;
            }
        }
        ownedResourcesDisplay.textContent = hasAny ? ownedText : 'None';
    }
}

function renderResources() {
    resourcesList.innerHTML = '';
    
    const resourceIds = Object.keys(gameState.resources);
    if (resourceIds.length === 0) {
        resourcesList.innerHTML = '<p class="tab-description">No resources mined or siphoned yet. Enter a dungeon to gather magical resources!</p>';
        return;
    }
    
    resourceIds.forEach(resourceId => {
        const resource = getResource(resourceId);
        if (!resource) return;
        
        const resourceItem = document.createElement('div');
        resourceItem.className = 'resource-card';
        
        const name = document.createElement('h3');
        name.textContent = resource.name;
        
        const amount = document.createElement('p');
        amount.className = 'resource-amount';
        amount.textContent = `Amount: ${formatNumber(gameState.resources[resourceId])} ${resource.type === 'Mana' ? 'MP' : 'units'}`;
        
        const rarity = document.createElement('p');
        rarity.className = 'wiki-rarity';
        rarity.textContent = `Rarity: ${resource.rarity}`;
        
        const time = document.createElement('p');
        time.className = 'wiki-time';
        time.textContent = `Extraction Time: ${(resource.miningTime / 1000).toFixed(1)}s`;
        
        resourceItem.appendChild(name);
        resourceItem.appendChild(amount);
        resourceItem.appendChild(rarity);
        resourceItem.appendChild(time);
        resourcesList.appendChild(resourceItem);
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

function renderWiki() {
    wikiResourcesList.innerHTML = '';
    
    RESOURCES.forEach(resource => {
        const wikiCard = document.createElement('div');
        wikiCard.className = 'wiki-card';
        
        const h3 = document.createElement('h3');
        h3.textContent = resource.name;
        
        const typeSpan = document.createElement('span');
        typeSpan.className = 'wiki-type';
        typeSpan.textContent = `Type: ${resource.type}`;
        
        const desc = document.createElement('p');
        desc.className = 'wiki-desc';
        desc.textContent = resource.description;
        
        const rarityRow = document.createElement('p');
        rarityRow.className = 'wiki-rarity-row';
        rarityRow.innerHTML = `<span class="wiki-rarity">Rarity: ${resource.rarity}</span>`;
        
        const quantityRow = document.createElement('p');
        quantityRow.className = 'wiki-quantity';
        quantityRow.textContent = `Clears for: ${formatNumber(resource.value)} ${resource.type === 'Mana' ? 'MP' : 'units'}`;
        
        const timeRow = document.createElement('p');
        timeRow.className = 'wiki-time';
        timeRow.textContent = `Extraction Time: ${(resource.miningTime / 1000).toFixed(1)}s`;
        
        wikiCard.appendChild(h3);
        wikiCard.appendChild(typeSpan);
        wikiCard.appendChild(desc);
        wikiCard.appendChild(rarityRow);
        wikiCard.appendChild(quantityRow);
        wikiCard.appendChild(timeRow);
        
        wikiResourcesList.appendChild(wikiCard);
    });
}

// Dungeon Rendering
function renderDungeonLevels() {
    dungeonLevelsList.innerHTML = '';
    
    DUNGEON_LEVELS.forEach(dungeon => {
        const dungeonCard = document.createElement('div');
        dungeonCard.className = 'dungeon-card' + (dungeon.level > gameState.dungeon.unlockedLevel ? ' locked' : '');
        
        const h3 = document.createElement('h3');
        h3.textContent = `Level ${dungeon.level}: ${dungeon.name}`;
        
        const levelInfo = document.createElement('p');
        levelInfo.className = 'level-info';
        levelInfo.textContent = dungeon.description;
        
        const resourcesPreview = document.createElement('div');
        resourcesPreview.className = 'resources-preview';
        const availableResources = dungeon.availableResources || RESOURCES.filter(r => r.rarity === 'Common').map(r => r.name);
        resourcesPreview.textContent = `Resources: ${availableResources.join(', ')}`;
        
        const enterBtn = document.createElement('button');
        enterBtn.className = 'btn-dungeon';
        enterBtn.textContent = gameState.dungeon.completedLevels.includes(dungeon.level) ? 'Replay' : 'Enter Dungeon';
        enterBtn.disabled = dungeon.level > gameState.dungeon.unlockedLevel ? true : false;
        
        if (!enterBtn.disabled) {
            enterBtn.addEventListener('click', () => enterDungeon(dungeon.level));
        }
        
        dungeonCard.appendChild(h3);
        dungeonCard.appendChild(levelInfo);
        dungeonCard.appendChild(resourcesPreview);
        dungeonCard.appendChild(enterBtn);
        
        dungeonLevelsList.appendChild(dungeonCard);
    });
}

function renderDungeon() {
    if (!gameState.dungeon.currentLevel) {
        // Show dungeon selection
        dungeonActive.style.display = 'none';
        dungeonLevelsList.style.display = 'block';
        return;
    }
    
    // Show active dungeon
    dungeonLevelsList.style.display = 'none';
    dungeonActive.style.display = 'block';
    
    const dungeon = getDungeonLevel(gameState.dungeon.currentLevel.level);
    const completeBtn = document.getElementById('btn-complete-dungeon');
    const exitBtn = document.getElementById('btn-exit-dungeon');
    
    document.getElementById('dungeon-active-header').innerHTML = `
        <h2>Dungeon Level ${dungeon.level}: ${dungeon.name}</h2>
        <div id="dungeon-actions">
            <button id="btn-exit-dungeon" class="btn-exit-dungeon">Exit Early</button>
            <button id="btn-complete-dungeon" class="btn-complete-dungeon" ${gameState.dungeon.nodes.length > 0 ? 'disabled' : ''}>Complete Dungeon</button>
        </div>
    `;
    
    exitBtn.addEventListener('click', exitDungeon);
    completeBtn.addEventListener('click', completeDungeon);
}

function renderResourceNodes() {
    resourceNodesContainer.innerHTML = '';
    
    gameState.dungeon.nodes.forEach(node => {
        const resource = getResource(node.resourceId);
        const nodeDiv = document.createElement('div');
        nodeDiv.className = 'resource-node' + (node.miningState === 'mining' ? ' mining' : ' selectable');
        nodeDiv.dataset.nodeId = node.id;
        
        const name = document.createElement('div');
        name.className = 'resource-name';
        name.textContent = resource.name;
        
        const quantity = document.createElement('div');
        quantity.className = 'resource-quantity';
        quantity.textContent = `Quantity: ${formatNumber(node.quantity)}`;
        
        const status = document.createElement('div');
        status.className = 'mining-status';
        status.textContent = node.miningState === 'mining' ? `Mining... ${Math.floor(node.miningProgress)}%` : 'Not Mining';
        
        nodeDiv.appendChild(name);
        nodeDiv.appendChild(quantity);
        nodeDiv.appendChild(status);
        
        // Mine/Siphon button
        const mineBtn = document.createElement('button');
        mineBtn.textContent = node.miningState === 'mining' ? 'Stop' : (node.resource.type === 'Mana' ? 'Siphon' : 'Mine');
        mineBtn.addEventListener('click', () => {
            if (node.miningState === 'mining') {
                stopMining(node.id);
            } else {
                startMining(node.id);
            }
            renderResourceNodes();
        });
        nodeDiv.appendChild(mineBtn);
        
        // Progress bar at bottom
        const progressContainer = document.createElement('div');
        progressContainer.className = 'progress-container';
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.style.width = node.miningState === 'mining' ? node.miningProgress + '%' : '0%';
        progressContainer.appendChild(progressBar);
        nodeDiv.appendChild(progressContainer);
        
        nodeDiv.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') return;
            if (node.miningState === 'mining') {
                stopMining(node.id);
            } else {
                startMining(node.id);
            }
            renderResourceNodes();
        });
        
        resourceNodesContainer.appendChild(nodeDiv);
    });
}

// Dungeon Game Logic
function enterDungeon(level) {
    const dungeon = getDungeonLevel(level);
    if (!dungeon) return;
    
    // Reset complete button state
    const completeBtn = document.getElementById('btn-complete-dungeon');
    if (completeBtn) {
        completeBtn.disabled = true;
        completeBtn.textContent = 'Complete Dungeon';
    }
    
    // Generate 3 random resource nodes
    const availableResources = dungeon.availableResources || RESOURCES.filter(r => r.rarity === 'Common').map(r => r.id);
    const nodes = [];
    
    for (let i = 0; i < 3; i++) {
        const randomResourceId = availableResources[Math.floor(Math.random() * availableResources.length)];
        const resource = getResource(randomResourceId);
        const quantity = Math.floor(Math.random() * 41) + 10; // 10-50
        
        nodes.push({
            id: 'node-' + Date.now() + '-' + i,
            resourceId: randomResourceId,
            quantity: quantity,
            cleared: false,
            miningState: 'idle',
            miningProgress: 0,
            miningInterval: null
        });
    }
    
    gameState.dungeon.currentLevel = dungeon;
    gameState.dungeon.nodes = nodes;
    gameState.dungeon.completed = false;
    
    renderDungeon();
    renderResourceNodes();
}

function startMining(nodeId) {
    const node = gameState.dungeon.nodes.find(n => n.id === nodeId);
    if (!node || node.cleared) return;
    
    const resource = getResource(node.resourceId);
    if (!resource) return;
    
    // Stop mining on any other node
    gameState.dungeon.nodes.forEach(n => {
        if (n.id !== nodeId && n.miningState === 'mining') {
            if (n.miningInterval) {
                clearInterval(n.miningInterval);
                n.miningInterval = null;
            }
            n.miningState = 'idle';
            n.miningProgress = 0;
        }
    });
    
    node.miningState = 'mining';
    node.miningProgress = 0;
    
    const tickInterval = setInterval(() => {
        const increment = 100 / (resource.miningTime / CONFIG.MINE_TICK_MS);
        node.miningProgress += increment;
        if (node.miningProgress >= 100) {
            clearInterval(node.miningInterval);
            node.miningState = 'idle';
            node.miningProgress = 100;
            completeMining(node);
        }
        renderResourceNodes();
    }, CONFIG.MINE_TICK_MS);
    
    node.miningInterval = tickInterval;
}

function stopMining(nodeId) {
    const node = gameState.dungeon.nodes.find(n => n.id === nodeId);
    if (!node || node.cleared) return;
    if (node.miningInterval) {
        clearInterval(node.miningInterval);
        node.miningInterval = null;
    }
    node.miningState = 'idle';
    node.miningProgress = 0;
}

function completeMining(node) {
    if (node.miningInterval) {
        clearInterval(node.miningInterval);
        node.miningInterval = null;
    }
    node.miningState = 'idle';
    node.miningProgress = 100;
    
    const resource = getResource(node.resourceId);
    if (!resource) return;
    
    // Gain resources
    gameState.resources[node.resourceId] = (gameState.resources[node.resourceId] || 0) + node.quantity;
    gameState.credits += node.quantity * 2; // Bonus credits for clearing nodes
    
    // Remove the node
    gameState.dungeon.nodes = gameState.dungeon.nodes.filter(n => n.id !== node.id);
    
    // Re-render
    renderResourceNodes();
    renderStats();
    
    // Check if all nodes cleared
    if (gameState.dungeon.nodes.length === 0) {
        gameState.dungeon.completed = true;
        const completeBtn = document.getElementById('btn-complete-dungeon');
        if (completeBtn) {
            completeBtn.disabled = false;
            completeBtn.textContent = 'Complete Dungeon';
        }
    }
}

function completeDungeon() {
    if (!gameState.dungeon.completed) return;
    
    // Grant dungeon completion rewards
    const dungeon = gameState.dungeon.currentLevel;
    gameState.credits += 50; // Completion bonus
    
    // Generate epic moment
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
    gameState.epics.push(randomEpic);
    
    // Mark level as completed and unlock next
    gameState.dungeon.completedLevels.push(dungeon.level);
    gameState.dungeon.lastCompletedLevel = dungeon.level;
    if (dungeon.level < DUNGEON_LEVELS.length) {
        gameState.dungeon.unlockedLevel = dungeon.level + 1;
    }
    
    // Exit dungeon
    gameState.dungeon.currentLevel = null;
    gameState.dungeon.nodes = [];
    gameState.dungeon.completed = false;
    
    generateEpicMoment();
    renderDungeonLevels();
    renderStats();
    renderResources();
    updateCurrencyDisplay();
}

function exitDungeon() {
    gameState.dungeon.currentLevel = null;
    gameState.dungeon.nodes = [];
    gameState.dungeon.completed = false;
    renderDungeonLevels();
    renderStats();
    renderResources();
}

// Generate Epic Moment
function generateEpicMoment() {
    const upgrades = gameState.upgrades.filter(u => u.purchased);
    if (upgrades.length === 0) {
        return;
    }

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
    const panel = document.getElementById('settings-panel');
    panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
}

// Form Submission Handler for Adding New Upgrades
document.getElementById('new-upgrade-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('new-upgrade-name').value;
    const cost = parseInt(document.getElementById('new-upgrade-cost').value) || 10;
    const multiplier = parseFloat(document.getElementById('new-upgrade-multiplier').value) || 1.5;
    const description = document.getElementById('new-upgrade-description').value;
    
    const newUpgrade = {
        id: 'upgrade-' + Date.now(),
        name: name,
        multiplier: multiplier,
        description: description || 'A powerful new upgrade for your hero!',
        baseCost: cost,
        purchased: false,
        boughtAt: null,
        count: 1
    };
    
    gameState.upgrades.push(newUpgrade);
    renderUpgrades();
    saveGame();
});

// Tab Event Listeners
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        switchTab(tab.dataset.tab);
    });
});

// Error handling
document.addEventListener('error', (e) => {
    console.error('Game error:', e);
});

console.log('Rise of the Hero - Incremental RPG Loaded!');