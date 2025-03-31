import { getUnitsForCategory } from './conversion-core.js';

// Default settings
const DEFAULT_SETTINGS = {
    defaultCategory: 'length',
    defaultFromUnit: 'm',
    defaultToUnit: 'ft',
    enableHistory: true,
    theme: 'light',
    shortcuts: {
        popup: 'Ctrl+Shift+C',
        inline: 'Alt+C'
    }
};

// Cache DOM elements
const elements = {
    defaultCategory: document.getElementById('defaultCategory'),
    defaultFromUnit: document.getElementById('defaultFromUnit'),
    defaultToUnit: document.getElementById('defaultToUnit'),
    enableHistory: document.getElementById('enableHistory'),
    theme: document.getElementsByName('theme'),
    popupShortcut: document.getElementById('popupShortcut'),
    inlineShortcut: document.getElementById('inlineShortcut'),
    recordPopupShortcut: document.getElementById('recordPopupShortcut'),
    recordInlineShortcut: document.getElementById('recordInlineShortcut'),
    saveSettings: document.getElementById('saveSettings'),
    resetSettings: document.getElementById('resetSettings')
};

// Load settings from storage
async function loadSettings() {
    const settings = await chrome.storage.sync.get(DEFAULT_SETTINGS);
    
    // Update form elements with stored settings
    elements.defaultCategory.value = settings.defaultCategory;
    await updateUnitDropdowns(settings.defaultCategory);
    elements.defaultFromUnit.value = settings.defaultFromUnit;
    elements.defaultToUnit.value = settings.defaultToUnit;
    elements.enableHistory.checked = settings.enableHistory;
    elements.popupShortcut.value = settings.shortcuts.popup;
    elements.inlineShortcut.value = settings.shortcuts.inline;
    
    // Set theme radio button
    document.querySelector(`input[name="theme"][value="${settings.theme}"]`).checked = true;
}

// Update unit dropdowns when category changes
async function updateUnitDropdowns(category) {
    const units = getUnitsForCategory(category);
    
    [elements.defaultFromUnit, elements.defaultToUnit].forEach(select => {
        select.innerHTML = units.map(unit => 
            `<option value="${unit}">${unit}</option>`
        ).join('');
    });
}

// Save settings to storage
async function saveSettings() {
    const settings = {
        defaultCategory: elements.defaultCategory.value,
        defaultFromUnit: elements.defaultFromUnit.value,
        defaultToUnit: elements.defaultToUnit.value,
        enableHistory: elements.enableHistory.checked,
        theme: document.querySelector('input[name="theme"]:checked').value,
        shortcuts: {
            popup: elements.popupShortcut.value,
            inline: elements.inlineShortcut.value
        }
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

// Event listeners
document.addEventListener('DOMContentLoaded', loadSettings);
elements.defaultCategory.addEventListener('change', e => updateUnitDropdowns(e.target.value));
elements.saveSettings.addEventListener('click', saveSettings);
elements.resetSettings.addEventListener('click', resetSettings);
elements.recordPopupShortcut.addEventListener('click', () => startRecordingShortcut(elements.popupShortcut));
elements.recordInlineShortcut.addEventListener('click', () => startRecordingShortcut(elements.inlineShortcut));