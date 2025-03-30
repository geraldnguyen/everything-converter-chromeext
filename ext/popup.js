import { convert, formatResult, getUnitsForCategory } from './conversion-core.js';

// Unit mappings for each category
const unitCategoryMap = {
    length: ["mm", "cm", "m", "km", "in", "ft", "yd", "mi"],
    weight: ["g", "kg", "t", "oz", "lb", "st"],
    temperature: ["°C", "°F", "K"],
    volume: ["ml", "l", "m³", "tsp", "tbsp", "fl oz", "cup", "pt", "qt", "gal", "in³"],
    speed: ["m/s", "km/h", "mph", "ft/s", "knots"],
    area: ["mm²", "cm²", "m²", "ha", "km²", "in²", "ft²", "yd²", "acres", "mi²"]
};

// Populate unit dropdowns based on selected category
function populateUnitDropdowns(category) {
    const fromUnit = document.getElementById('fromUnit');
    const toUnit = document.getElementById('toUnit');
    const units = unitCategoryMap[category] || [];

    [fromUnit, toUnit].forEach(select => {
        const currentValue = select.value;
        select.innerHTML = '<option value="">Select unit</option>';
        units.forEach(unit => {
            const option = document.createElement('option');
            option.value = unit;
            option.textContent = unit;
            select.appendChild(option);
        });
        if (units.includes(currentValue)) {
            select.value = currentValue;
        }
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
function populateFromHistory(conversion) {
    const categorySelect = document.getElementById('categorySelect');
    const valueInput = document.getElementById('valueInput');
    const fromUnit = document.getElementById('fromUnit');
    const toUnit = document.getElementById('toUnit');

    categorySelect.value = conversion.category;
    populateUnitDropdowns(conversion.category);
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
document.addEventListener('DOMContentLoaded', () => {
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

    // Category change handler
    categorySelect.addEventListener('change', () => {
        populateUnitDropdowns(categorySelect.value);
    });

    // Switch units button handler
    switchUnits.addEventListener('click', () => {
        const tempValue = fromUnit.value;
        fromUnit.value = toUnit.value;
        toUnit.value = tempValue;
    });

    // Convert button handler
    convertBtn.addEventListener('click', () => {
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

            // Save to history
            saveToHistory(value, category, fromUnit.value, toUnit.value, convertedValue);
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