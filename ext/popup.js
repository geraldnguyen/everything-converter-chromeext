import { 
    convert, 
    formatResult, 
    getUnitsForCategory, 
    defaultSettings, 
    isHistoryEnabled, 
    saveToHistoryIfEnabled 
} from './conversion-core.js';

// Update populateUnitDropdowns function
async function populateUnitDropdowns(units) {
    if (!Array.isArray(units)) {
        console.error('Invalid units array:', units);
        units = [];
    }

    const settings = await chrome.storage.sync.get(defaultSettings);
    const category = categorySelect.value;
    // Add fallback for categoryDefaults
    const categoryDefaults = settings.categoryDefaults?.[category] || { from: units[0], to: units[1] };

    const fromUnit = document.getElementById('fromUnit');
    const toUnit = document.getElementById('toUnit');
    
    [fromUnit, toUnit].forEach((select, index) => {
        const currentValue = select.value;
        const defaultValue = index === 0 ? categoryDefaults.from : categoryDefaults.to;
        
        select.innerHTML = units.map(unit => 
            `<option value="${unit}">${unit}</option>`
        ).join('');
        
        select.value = units.includes(currentValue) ? currentValue : 
                      units.includes(defaultValue) ? defaultValue : 
                      units[0] || '';
    });
}

// Format timestamp to relative time
function formatRelativeTime(timestamp) {
    const diff = Date.now() - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'just now';
}

// Save conversion to history
function saveToHistory(value, category, fromUnit, toUnit, result) {
    chrome.storage.local.get('conversionHistory', (data) => {
        const history = data.conversionHistory || [];
        
        // Add new entry at the beginning
        history.unshift({
            value,
            category,
            fromUnit,
            toUnit,
            result,
            timestamp: Date.now()
        });

        // Keep only last 20 entries
        const trimmedHistory = history.slice(0, 20);

        chrome.storage.local.set({ 
            conversionHistory: trimmedHistory 
        }, updateHistoryDisplay);
    });
}

// Update history display
function updateHistoryDisplay() {
    chrome.storage.local.get('conversionHistory', (data) => {
        const historyList = document.getElementById('historyList');
        const history = data.conversionHistory || [];

        if (history.length === 0) {
            historyList.innerHTML = '<div class="history-item">No conversions yet</div>';
            return;
        }

        historyList.innerHTML = history.map(item => `
            <div class="history-item" data-timestamp="${item.timestamp}">
                <div class="conversion-text">
                    ${item.value} ${item.fromUnit} = ${formatResult(item.result)} ${item.toUnit}
                </div>
                <div class="timestamp" title="${new Date(item.timestamp).toLocaleString()}">
                    ${formatRelativeTime(item.timestamp)}
                </div>
            </div>
        `).join('');

        // Add click handlers to history items
        historyList.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', () => {
                const conversion = history.find(h => h.timestamp === parseInt(item.dataset.timestamp));
                if (conversion) {
                    populateFromHistory(conversion);
                }
            });
        });
    });
}

// Populate form with historical conversion
async function populateFromHistory(conversion) {
    const categorySelect = document.getElementById('categorySelect');
    const valueInput = document.getElementById('valueInput');
    const fromUnit = document.getElementById('fromUnit');
    const toUnit = document.getElementById('toUnit');

    categorySelect.value = conversion.category;
    // Get units for the category before populating dropdowns
    const units = getUnitsForCategory(conversion.category);
    await populateUnitDropdowns(units);
    
    // Set values after dropdowns are populated
    valueInput.value = conversion.value;
    fromUnit.value = conversion.fromUnit;
    toUnit.value = conversion.toUnit;
}

// Clear all conversion history
function clearHistory() {
    if (confirm('Are you sure you want to clear all conversion history?')) {
        chrome.storage.local.set({ 
            conversionHistory: [] 
        }, () => {
            updateHistoryDisplay();
        });
    }
}

// Initialize popup
document.addEventListener('DOMContentLoaded', async () => {
    const categorySelect = document.getElementById('categorySelect');
    const valueInput = document.getElementById('valueInput');
    const fromUnit = document.getElementById('fromUnit');
    const toUnit = document.getElementById('toUnit');
    const switchUnits = document.getElementById('switchUnits');
    const convertBtn = document.getElementById('convertBtn');
    const result = document.getElementById('result');
    const settingsBtn = document.getElementById('settingsBtn');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');

    // Load initial history
    updateHistoryDisplay();

    // Load user settings
    const settings = await chrome.storage.sync.get(defaultSettings);

    // Set default category
    categorySelect.value = settings.defaultCategory;
    
    // Populate unit dropdowns
    const units = getUnitsForCategory(settings.defaultCategory);
    await populateUnitDropdowns(units);

    // Set default units
    fromUnit.value = settings.defaultFromUnit;
    toUnit.value = settings.defaultToUnit;

    // Category change handler
    categorySelect.addEventListener('change', () => {
        const units = getUnitsForCategory(categorySelect.value);
        populateUnitDropdowns(units);
    });

    // Switch units button handler
    switchUnits.addEventListener('click', () => {
        const tempValue = fromUnit.value;
        fromUnit.value = toUnit.value;
        toUnit.value = tempValue;
    });

    // Convert button handler
    convertBtn.addEventListener('click', async () => {
        try {
            // Validate inputs
            if (!valueInput.value || !categorySelect.value || !fromUnit.value || !toUnit.value) {
                throw new Error('Please fill in all fields');
            }

            const value = parseFloat(valueInput.value);
            const category = categorySelect.value;
            const convertedValue = convert(value, category, fromUnit.value, toUnit.value);
            
            // Display result
            result.textContent = `${value} ${fromUnit.value} = ${formatResult(convertedValue)} ${toUnit.value}`;
            result.classList.remove('error');

            // Save to history only if enabled
            const isEnabled = await isHistoryEnabled();
            if (isEnabled) {
                await saveToHistoryIfEnabled({
                    value,
                    category,
                    fromUnit: fromUnit.value,
                    toUnit: toUnit.value,
                    result: convertedValue
                });
                // Immediately update history display
                updateHistoryDisplay();
            }
        } catch (error) {
            result.textContent = `Error: ${error.message}`;
            result.classList.add('error');
        }
    });

    // Settings button handler
    settingsBtn.addEventListener('click', () => {
        chrome.runtime.openOptionsPage();
    });

    // Enter key handler
    valueInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            convertBtn.click();
        }
    });

    // Clear history button handler
    clearHistoryBtn.addEventListener('click', clearHistory);
});

// Load and apply theme on popup open
document.addEventListener('DOMContentLoaded', async () => {
    const { theme } = await chrome.storage.sync.get({ theme: 'light' });
    document.documentElement.setAttribute('data-theme', theme);
});

// Update history display based on setting
async function updateHistoryVisibility() {
    const historySection = document.querySelector('.history-section');
    const isEnabled = await isHistoryEnabled();
    historySection.style.display = isEnabled ? 'block' : 'none';
}

// Listen for history setting changes
chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync' && changes.enableHistory) {
        updateHistoryVisibility();
    }
});

// Check history visibility on popup open
document.addEventListener('DOMContentLoaded', updateHistoryVisibility);