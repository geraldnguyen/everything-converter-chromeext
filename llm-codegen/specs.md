# Everything Converter Chrome Extension - Specification

## 1. Overview
The **Everything Converter** is a Google Chrome extension designed to perform various unit conversions. It supports conversions across multiple categories such as length, weight, temperature, volume, speed, and area. The extension provides a user-friendly interface and additional features like inline conversions, keyboard shortcuts, and a history of recent conversions.

---

## 2. Features

### 2.1. Supported Conversion Categories and Units
The extension supports the following categories and units:

#### Length
- **Metric**: millimeters (mm), centimeters (cm), meters (m), kilometers (km)
- **Imperial**: inches (in), feet (ft), yards (yd), miles (mi)

#### Weight
- **Metric**: grams (g), kilograms (kg), metric tons (t)
- **Imperial**: ounces (oz), pounds (lb), stones (st)

#### Temperature
- Celsius (°C), Fahrenheit (°F), Kelvin (K)

#### Volume
- **Metric**: milliliters (ml), liters (l), cubic meters (m³)
- **Imperial**: teaspoons (tsp), tablespoons (tbsp), fluid ounces (fl oz), cups, pints (pt), quarts (qt), gallons (gal), cubic inches (in³)

#### Speed
- **Metric**: meters per second (m/s), kilometers per hour (km/h)
- **Imperial**: miles per hour (mph), feet per second (ft/s), knots

#### Area
- **Metric**: square millimeters (mm²), square centimeters (cm²), square meters (m²), hectares (ha), square kilometers (km²)
- **Imperial**: square inches (in²), square feet (ft²), square yards (yd²), acres, square miles (mi²)

---

### 2.2. User Interaction Features
1. **Popup Interface**:
   - A popup appears when the user clicks the extension icon in the Chrome toolbar.
   - Includes input fields, dropdowns for selecting categories and units, and a "Convert" button.

2. **Inline Conversions**:
   - Users can highlight text on a webpage (e.g., "10 kg") and convert it via a context menu option or keyboard shortcut.
   - Results are displayed in a tooltip or modal near the highlighted text.

3. **Keyboard Shortcuts**:
   - Configurable shortcuts for opening the popup and triggering inline conversions.

4. **Settings Page**:
   - Allows users to customize preferences, such as default units, enabling/disabling history, and configuring shortcuts.

5. **History of Recent Conversions**:
   - Stores the last 20 conversions persistently across browser sessions.
   - Users can view, delete individual entries, or clear the entire history.

---

## 3. Popup Interface Layout

### Structure
1. **Header**:
   - Title: "Everything Converter"
   - Settings icon for accessing the settings page.

2. **Conversion Input Section**:
   - Input field for the value to convert.
   - Dropdowns for selecting:
     - Conversion category (e.g., Length, Weight, Temperature).
     - From-unit (e.g., kg, lb).
     - To-unit (e.g., lb, kg).
   - Quick-switch button to reverse the "From-Unit" and "To-Unit."
   - Convert button to trigger the conversion.

3. **Conversion Result Section**:
   - Displays the converted value and unit.

4. **History Section**:
   - A collapsible or scrollable list showing the last 20 conversions.
   - Includes a "Clear History" button.

5. **Footer**:
   - Links to "Help" and "Feedback."
   - Displays the current version of the extension.

---

## 4. Settings Page Layout

### Sections
1. **General Settings**:
   - Default conversion category and units.
   - Toggle to enable/disable the history feature.

2. **History Settings**:
   - Button to clear all saved history.

3. **Keyboard Shortcuts**:
   - Configurable shortcuts for opening the popup and triggering inline conversions.

4. **Appearance**:
   - Option to switch between Light Mode and Dark Mode.

5. **Footer**:
   - Save button to apply changes.
   - Reset button to restore default settings.

---

## 5. Conversion Logic

### Input Handling
- Accepts a numeric input value and validates it.
- Accepts "From-Unit" and "To-Unit" selections.

### Conversion Execution
- Uses predefined conversion factors and formulas stored in a structured format (e.g., JSON or JavaScript map).
- Handles special cases like temperature conversions using formulas.

### Error Handling
- Displays error messages for invalid inputs or unsupported conversions.

### Extensibility
- Designed to easily add new categories and units.

#### Example Conversion Logic
```javascript
const conversionFactors = {
    length: { mm_to_cm: 0.1, cm_to_m: 0.01, m_to_km: 0.001 },
    weight: { kg_to_lb: 2.20462, lb_to_kg: 1 / 2.20462 },
    temperature: {
        c_to_f: (c) => (c * 9) / 5 + 32,
        f_to_c: (f) => ((f - 32) * 5) / 9,
    },
};

function convert(value, category, fromUnit, toUnit) {
    const key = `${fromUnit}_to_${toUnit}`;
    const conversion = conversionFactors[category][key];
    if (!conversion) throw new Error(`Unsupported conversion: ${fromUnit} to ${toUnit}`);
    return typeof conversion === "function" ? conversion(value) : value * conversion;
}
```


## 6. Inline Conversion

### Workflow
1. User highlights text on a webpage (e.g., "10 kg").
2. Right-clicks and selects **"Convert with Everything Converter"** from the context menu.
3. The extension parses the text, validates the input, and prompts the user to select the "To-Unit."
4. Displays the result in a tooltip or modal near the highlighted text.

### Context Menu Setup
```javascript
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "convert",
        title: "Convert with Everything Converter",
        contexts: ["selection"],
    });
});
```

## 7. Unit Mapping and Validation

### Unit Mapping

```
const unitCategoryMap = {
    length: ["mm", "cm", "m", "km", "in", "ft", "yd", "mi"],
    weight: ["g", "kg", "t", "oz", "lb", "st"],
    temperature: ["°C", "°F", "K"],
    volume: ["ml", "l", "m³", "tsp", "tbsp", "fl oz", "cup", "pt", "qt", "gal", "in³"],
    speed: ["m/s", "km/h", "mph", "ft/s", "knots"],
    area: ["mm²", "cm²", "m²", "ha", "km²", "in²", "ft²", "yd²", "acres", "mi²"],
};
```

### Validation

```
function validateUnits(fromUnit, toUnit) {
    for (const [category, units] of Object.entries(unitCategoryMap)) {
        if (units.includes(fromUnit) && units.includes(toUnit)) {
            return category;
        }
    }
    throw new Error(`Invalid conversion: ${fromUnit} to ${toUnit}`);
}
```

## 8. Dynamic Dropdown Population

### Implementation

Populate the From-Unit and To-Unit dropdowns dynamically based on the selected category.
Automatically update the dropdowns when the category changes.


### Example Code

```
categoryDropdown.addEventListener("change", () => {
    const selectedCategory = categoryDropdown.value;
    const units = unitCategoryMap[selectedCategory] || [];
    populateDropdown(fromUnitDropdown, units);
    populateDropdown(toUnitDropdown, units);
});
```