import { convert, getUnitsForCategory } from './conversion-core.js';

// Regular expression to match number and unit pattern (e.g., "10 kg", "5.2km")
const VALUE_UNIT_REGEX = /^(-?\d*\.?\d+)\s*([a-zA-Z°³²]+)$/;

// Unit to category mapping for quick lookup
const unitToCategoryMap = {
    // Length units
    mm: 'length', cm: 'length', m: 'length', km: 'length',
    in: 'length', ft: 'length', yd: 'length', mi: 'length',
    // Weight units
    g: 'length', kg: 'weight', t: 'weight',
    oz: 'weight', lb: 'weight', st: 'weight',
    // Temperature units
    '°C': 'temperature', '°F': 'temperature', 'K': 'temperature',
    // Volume units
    ml: 'volume', l: 'volume', 'm³': 'volume',
    tsp: 'volume', tbsp: 'volume', 'fl oz': 'volume',
    cup: 'volume', pt: 'volume', qt: 'volume',
    gal: 'volume', 'in³': 'volume',
    // Speed units
    'm/s': 'speed', 'km/h': 'speed', mph: 'speed',
    'ft/s': 'speed', knots: 'speed',
    // Area units
    'mm²': 'area', 'cm²': 'area', 'm²': 'area',
    ha: 'area', 'km²': 'area', 'in²': 'area',
    'ft²': 'area', 'yd²': 'area', acres: 'area', 'mi²': 'area'
};

// Initialize context menu on installation
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "convertSelection",
        title: "Convert with Everything Converter",
        contexts: ["selection"]
    });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === "convertSelection") {
        try {
            // Parse selected text
            const parsed = parseSelection(info.selectionText);
            if (!parsed) {
                throw new Error('Invalid format. Expected: "value unit" (e.g., "10 kg")');
            }

            const { value, unit, category } = parsed;
            
            // Get available units for the category
            const availableUnits = getUnitsForCategory(category);
            
            // Create popup for target unit selection
            const targetUnit = await showUnitSelectionPopup(tab.id, availableUnits, unit);
            if (!targetUnit) return; // User cancelled

            // Perform conversion
            const result = convert(value, category, unit, targetUnit);
            
            // Display result
            await showConversionResult(tab.id, {
                originalValue: value,
                originalUnit: unit,
                convertedValue: result,
                targetUnit: targetUnit
            });

        } catch (error) {
            // Show error message
            await showError(tab.id, error.message);
        }
    }
});

// Parse selected text into value and unit
function parseSelection(text) {
    const match = text.trim().match(VALUE_UNIT_REGEX);
    if (!match) return null;

    const [, value, unit] = match;
    const category = unitToCategoryMap[unit];
    
    if (!category) return null;

    return {
        value: parseFloat(value),
        unit,
        category
    };
}

// Show popup for target unit selection
async function showUnitSelectionPopup(tabId, units, currentUnit) {
    // Filter out the current unit
    const availableUnits = units.filter(u => u !== currentUnit);
    
    // Inject popup HTML
    await chrome.scripting.insertCSS({
        target: { tabId },
        css: `
            .converter-popup {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border: 1px solid #ccc;
                border-radius: 4px;
                padding: 10px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                z-index: 999999;
            }
        `
    });

    await chrome.scripting.executeScript({
        target: { tabId },
        function: (units) => {
            const popup = document.createElement('div');
            popup.className = 'converter-popup';
            popup.innerHTML = `
                <select id="targetUnit">
                    <option value="">Select target unit</option>
                    ${units.map(u => `<option value="${u}">${u}</option>`).join('')}
                </select>
                <button id="convertBtn">Convert</button>
                <button id="cancelBtn">Cancel</button>
            `;
            document.body.appendChild(popup);

            return new Promise(resolve => {
                document.getElementById('convertBtn').onclick = () => {
                    const selected = document.getElementById('targetUnit').value;
                    popup.remove();
                    resolve(selected);
                };
                document.getElementById('cancelBtn').onclick = () => {
                    popup.remove();
                    resolve(null);
                };
            });
        },
        args: [availableUnits]
    });
}

// Show conversion result
async function showConversionResult(tabId, result) {
    await chrome.scripting.executeScript({
        target: { tabId },
        function: (data) => {
            const toast = document.createElement('div');
            toast.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #4CAF50;
                color: white;
                padding: 10px 20px;
                border-radius: 4px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                z-index: 999999;
            `;
            toast.textContent = `${data.originalValue} ${data.originalUnit} = ${data.convertedValue} ${data.targetUnit}`;
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 3000);
        },
        args: [result]
    });
}

// Show error message
async function showError(tabId, message) {
    await chrome.scripting.executeScript({
        target: { tabId },
        function: (errorMessage) => {
            const toast = document.createElement('div');
            toast.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #f44336;
                color: white;
                padding: 10px 20px;
                border-radius: 4px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                z-index: 999999;
            `;
            toast.textContent = `Error: ${errorMessage}`;
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 3000);
        },
        args: [message]
    });
}