import {
    convert,
    formatResult,
    getUnitsForCategory,
    isValidConversion
} from './conversion-core.js';

// Helper function for populating dropdowns
function populateUnitDropdowns(units) {
    const fromUnit = document.getElementById('fromUnit');
    const toUnit = document.getElementById('toUnit');
    
    [fromUnit, toUnit].forEach(select => {
        const currentValue = select.value;
        select.innerHTML = '';
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

// Event listeners for the popup interface
document.addEventListener('DOMContentLoaded', () => {
    const categorySelect = document.getElementById('categorySelect');
    const fromUnit = document.getElementById('fromUnit');
    const toUnit = document.getElementById('toUnit');
    const valueInput = document.getElementById('valueInput');
    const convertBtn = document.getElementById('convertBtn');
    const result = document.getElementById('result');

    // Populate category dropdown
    categorySelect.addEventListener('change', () => {
        const category = categorySelect.value;
        const units = getUnitsForCategory(category);
        populateUnitDropdowns(units);
    });

    // Handle conversion button click
    convertBtn.addEventListener('click', () => {
        try {
            const value = parseFloat(valueInput.value);
            const category = categorySelect.value;
            const convertedValue = convert(value, category, fromUnit.value, toUnit.value);
            result.textContent = `${formatResult(convertedValue)} ${toUnit.value}`;
            
            // Save to history (implementation needed)
            chrome.storage.local.set({
                lastConversion: {
                    value,
                    category,
                    fromUnit: fromUnit.value,
                    toUnit: toUnit.value,
                    result: convertedValue,
                    timestamp: Date.now()
                }
            });
        } catch (error) {
            result.textContent = `Error: ${error.message}`;
        }
    });
});