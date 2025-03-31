// Description: Core conversion logic for the unit converter app
// Conversion factors and unit mappings
const conversionFactors = {
  length: {
      // Base unit: meters (m)
      mm: 0.001,
      cm: 0.01,
      m: 1,
      km: 1000,
      in: 0.0254,
      ft: 0.3048,
      yd: 0.9144,
      mi: 1609.344
  },
  weight: {
      // Base unit: kilograms (kg)
      g: 0.001,
      kg: 1,
      t: 1000,
      oz: 0.0283495,
      lb: 0.453592,
      st: 6.35029
  },
  volume: {
      // Base unit: liters (l)
      ml: 0.001,
      l: 1,
      'm³': 1000,
      tsp: 0.00492892,
      tbsp: 0.0147868,
      'fl oz': 0.0295735,
      cup: 0.236588,
      pt: 0.473176,
      qt: 0.946353,
      gal: 3.78541,
      'in³': 0.0163871
  },
  speed: {
      // Base unit: meters per second (m/s)
      'm/s': 1,
      'km/h': 0.277778,
      mph: 0.44704,
      'ft/s': 0.3048,
      knots: 0.514444
  },
  area: {
      // Base unit: square meters (m²)
      'mm²': 0.000001,
      'cm²': 0.0001,
      'm²': 1,
      ha: 10000,
      'km²': 1000000,
      'in²': 0.00064516,
      'ft²': 0.092903,
      'yd²': 0.836127,
      acres: 4046.86,
      'mi²': 2589988.11
  }
};

// Special conversion functions for temperature
const temperatureConversions = {
  '°C_°F': (celsius) => (celsius * 9/5) + 32,
  '°F_°C': (fahrenheit) => (fahrenheit - 32) * 5/9,
  '°C_K': (celsius) => celsius + 273.15,
  'K_°C': (kelvin) => kelvin - 273.15,
  '°F_K': (fahrenheit) => (fahrenheit - 32) * 5/9 + 273.15,
  'K_°F': (kelvin) => (kelvin - 273.15) * 9/5 + 32
};

/**
* Converts a value from one unit to another within the same category
* @param {number} value - The value to convert
* @param {string} category - The category of conversion (length, weight, etc.)
* @param {string} fromUnit - The unit to convert from
* @param {string} toUnit - The unit to convert to
* @returns {number} The converted value
* @throws {Error} If conversion is not supported or invalid
*/
function convert(value, category, fromUnit, toUnit) {
  // Input validation
  if (typeof value !== 'number' || isNaN(value)) {
      throw new Error('Invalid input value');
  }

  // Handle temperature conversions separately
  if (category === 'temperature') {
      const conversionKey = `${fromUnit}_${toUnit}`;
      const conversion = temperatureConversions[conversionKey];
      if (!conversion) {
          throw new Error(`Unsupported temperature conversion: ${fromUnit} to ${toUnit}`);
      }
      return conversion(value);
  }

  // For other categories, convert using base unit method
  const factors = conversionFactors[category];
  if (!factors) {
      throw new Error(`Unknown category: ${category}`);
  }

  const fromFactor = factors[fromUnit];
  const toFactor = factors[toUnit];

  if (!fromFactor || !toFactor) {
      throw new Error(`Unsupported conversion: ${fromUnit} to ${toUnit}`);
  }

  // Convert to base unit first, then to target unit
  const baseValue = value * fromFactor;
  return baseValue / toFactor;
}

/**
* Formats the converted value to a reasonable number of decimal places
* @param {number} value - The value to format
* @returns {string} Formatted value
*/
function formatResult(value) {
    // Handle zero
    if (value === 0) return '0';

    const absValue = Math.abs(value);

    // Very small numbers: use scientific notation
    if (absValue < 0.01) {
        return value.toExponential(4);
    }

    // Large numbers: preserve all digits before decimal point
    if (absValue >= 1000) {
        // Use fixed notation for integers
        if (Number.isInteger(value)) {
            return value.toString();
        }
        // Round to 2 decimal places for large decimals
        return value.toFixed(2).replace(/\.?0+$/, '');
    }

    // Numbers between 0.01 and 999.999
    // Use up to 6 significant digits, but remove trailing zeros
    const formatted = value.toPrecision(6);
    return formatted
        .replace(/\.?0+e/, 'e') // Remove trailing zeros before exponent
        .replace(/\.?0+$/, '') // Remove trailing zeros after decimal
        .replace(/(\.\d*[1-9])0+$/, '$1'); // Keep significant trailing digits
}

/**
* Gets available units for a given category
* @param {string} category - The conversion category
* @returns {string[]} Array of available units
*/
function getUnitsForCategory(category) {
  return unitCategoryMap[category] || [];
}

/**
* Validates if a conversion is possible
* @param {string} category - The conversion category
* @param {string} fromUnit - Source unit
* @param {string} toUnit - Target unit
* @returns {boolean} Whether the conversion is valid
*/
function isValidConversion(category, fromUnit, toUnit) {
  if (category === 'temperature') {
      return temperatureConversions.hasOwnProperty(`${fromUnit}_${toUnit}`);
  }
  const factors = conversionFactors[category];
  return factors && factors[fromUnit] && factors[toUnit];
}

// Export conversion factors and functions for use across components
export const unitCategoryMap = {
    length: ["mm", "cm", "m", "km", "in", "ft", "yd", "mi"],
    weight: ["g", "kg", "t", "oz", "lb", "st"],
    temperature: ["°C", "°F", "K"],
    volume: ["ml", "l", "m³", "tsp", "tbsp", "fl oz", "cup", "pt", "qt", "gal", "in³"],
    speed: ["m/s", "km/h", "mph", "ft/s", "knots"],
    area: ["mm²", "cm²", "m²", "ha", "km²", "in²", "ft²", "yd²", "acres", "mi²"]
};

export const defaultSettings = {
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

/**
 * Checks if history recording is enabled
 * @returns {Promise<boolean>} Whether history is enabled
 */
export async function isHistoryEnabled() {
    const { enableHistory } = await chrome.storage.sync.get({ enableHistory: true });
    return enableHistory;
}

/**
 * Saves conversion to history if enabled
 * @param {object} conversion - Conversion details to save
 * @returns {Promise<void>}
 */
export async function saveToHistoryIfEnabled(conversion) {
    if (!(await isHistoryEnabled())) {
        return;
    }

    const { conversionHistory = [] } = await chrome.storage.local.get('conversionHistory');
    conversionHistory.unshift({
        ...conversion,
        timestamp: Date.now()
    });
    
    // Keep only last 20 entries
    conversionHistory.splice(20);
    
    await chrome.storage.local.set({ conversionHistory });
}

// Export functions for use in other modules
export {
  convert,
  formatResult,
  getUnitsForCategory,
  isValidConversion
};