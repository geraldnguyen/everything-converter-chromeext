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

// Save conversion to history
function saveToHistory(value, category, fromUnit, toUnit, result) {
    chrome.storage.local.get('conversionHistory', (data) => {
        const history = data.conversionHistory || [];
        history.unshift({
            value,
            category,
            fromUnit,
            toUnit,
            result,
            timestamp: Date.now()
        });

        // Keep only last 20 entries
        history.splice(20);

        chrome.storage.local.set({ conversionHistory: history }, updateHistoryDisplay);
    });
}

// Update history display
function updateHistoryDisplay() {
    chrome.storage.local.get('conversionHistory', (data) => {
        const historyList = document.getElementById('historyList');
        const history = data.conversionHistory || [];

        historyList.innerHTML = history.map(item => `
            <div class="history-item">
                ${item.value} ${item.fromUnit} = ${formatResult(item.result)} ${item.toUnit}
            </div>
        `).join('');
    });
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
});