import { getUnitsForCategory, unitCategoryMap } from './conversion-core.js';

// Default settings structure
const DEFAULT_SETTINGS = {
    enableHistory: true,
    theme: 'light',
    categoryDefaults: {
        length: { from: 'm', to: 'ft' },
        weight: { from: 'kg', to: 'lb' },
        temperature: { from: '°C', to: '°F' },
        volume: { from: 'l', to: 'gal' },
        speed: { from: 'km/h', to: 'mph' },
        area: { from: 'm²', to: 'ft²' }
    }
};

// Cache DOM elements
const elements = {
    enableHistory: document.getElementById('enableHistory'),
    theme: document.getElementsByName('theme'),
    popupShortcut: document.getElementById('popupShortcut'),
    inlineShortcut: document.getElementById('inlineShortcut'),
    recordPopupShortcut: document.getElementById('recordPopupShortcut'),
    recordInlineShortcut: document.getElementById('recordInlineShortcut'),
    saveSettings: document.getElementById('saveSettings'),
    resetSettings: document.getElementById('resetSettings')
};

// Initialize category defaults
function initializeCategoryDefaults() {
    const container = document.getElementById('categoryDefaults');
    container.innerHTML = ''; // Clear existing content

    Object.entries(unitCategoryMap).forEach(([category, units]) => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category-defaults';
        categoryDiv.dataset.category = category;

        categoryDiv.innerHTML = `
            <h3>${category.charAt(0).toUpperCase() + category.slice(1)}</h3>
            <div class="unit-pair">
                <select class="default-from" data-category="${category}">
                    ${units.map(unit => `<option value="${unit}">${unit}</option>`).join('')}
                </select>
                <span>→</span>
                <select class="default-to" data-category="${category}">
                    ${units.map(unit => `<option value="${unit}">${unit}</option>`).join('')}
                </select>
            </div>
        `;

        container.appendChild(categoryDiv);
    });
}

// Load settings from storage
async function loadSettings() {
    const settings = await chrome.storage.sync.get(DEFAULT_SETTINGS);
    
    // Load category defaults
    Object.entries(settings.categoryDefaults).forEach(([category, defaults]) => {
        const categoryDiv = document.querySelector(`[data-category="${category}"]`);
        if (categoryDiv) {
            categoryDiv.querySelector('.default-from').value = defaults.from;
            categoryDiv.querySelector('.default-to').value = defaults.to;
        }
    });

    // Update form elements with stored settings
    elements.enableHistory.checked = settings.enableHistory;
    elements.popupShortcut.value = settings.shortcuts.popup;
    elements.inlineShortcut.value = settings.shortcuts.inline;
    
    // Set theme radio button
    document.querySelector(`input[name="theme"][value="${settings.theme}"]`).checked = true;
}

// Save settings to storage
async function saveSettings() {
    const categoryDefaults = {};
    document.querySelectorAll('.category-defaults').forEach(div => {
        const category = div.dataset.category;
        categoryDefaults[category] = {
            from: div.querySelector('.default-from').value,
            to: div.querySelector('.default-to').value
        };
    });

    const settings = {
        enableHistory: elements.enableHistory.checked,
        theme: document.querySelector('input[name="theme"]:checked').value,
        categoryDefaults
    };

    await chrome.storage.sync.set(settings);
    showSaveConfirmation();
}

// Reset settings to defaults
async function resetSettings() {
    if (confirm('Are you sure you want to reset all settings to default?')) {
        await chrome.storage.sync.set(DEFAULT_SETTINGS);
        await loadSettings();
        showSaveConfirmation('Settings reset to defaults');
    }
}

// Show save confirmation message
function showSaveConfirmation(message = 'Settings saved successfully') {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 10px 20px;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Record keyboard shortcuts
function startRecordingShortcut(inputElement) {
    inputElement.value = 'Press keys...';
    
    const keyHandler = (e) => {
        e.preventDefault();
        
        const keys = [];
        if (e.ctrlKey) keys.push('Ctrl');
        if (e.altKey) keys.push('Alt');
        if (e.shiftKey) keys.push('Shift');
        if (e.key !== 'Control' && e.key !== 'Alt' && e.key !== 'Shift') {
            keys.push(e.key.toUpperCase());
        }
        
        inputElement.value = keys.join('+');
        
        // Stop recording after key combination is pressed
        document.removeEventListener('keydown', keyHandler);
    };
    
    document.addEventListener('keydown', keyHandler);
}

// Apply theme to all extension pages
async function applyTheme(theme) {
    // Set theme for current page
    document.documentElement.setAttribute('data-theme', theme);

    // Store theme preference
    await chrome.storage.sync.set({ theme });

    // Update theme in popup if open
    const views = chrome.extension.getViews({ type: 'popup' });
    views.forEach(view => {
        view.document.documentElement.setAttribute('data-theme', theme);
    });
}

// Handle theme changes
document.querySelectorAll('input[name="theme"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        applyTheme(e.target.value);
    });
});

// Load and apply theme on page load
document.addEventListener('DOMContentLoaded', async () => {
    const { theme } = await chrome.storage.sync.get({ theme: 'light' });
    document.documentElement.setAttribute('data-theme', theme);
    document.querySelector(`input[name="theme"][value="${theme}"]`).checked = true;
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeCategoryDefaults();
    loadSettings();
});

// Event listeners
elements.saveSettings.addEventListener('click', saveSettings);
elements.resetSettings.addEventListener('click', resetSettings);
elements.recordPopupShortcut.addEventListener('click', () => startRecordingShortcut(elements.popupShortcut));
elements.recordInlineShortcut.addEventListener('click', () => startRecordingShortcut(elements.inlineShortcut));