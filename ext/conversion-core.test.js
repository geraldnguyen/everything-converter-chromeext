import { convert, formatResult, getUnitsForCategory, isValidConversion } from './conversion-core.js';

describe('Unit Converter Core Functions', () => {
  describe('convert()', () => {
    // Length conversions
    test('converts meters to feet correctly', () => {
      expect(convert(1, 'length', 'm', 'ft')).toBeCloseTo(3.28084);
    });

    test('converts kilometers to miles correctly', () => {
      expect(convert(10, 'length', 'km', 'mi')).toBeCloseTo(6.21371);
    });

    // Weight conversions
    test('converts kilograms to pounds correctly', () => {
      expect(convert(1, 'weight', 'kg', 'lb')).toBeCloseTo(2.20462);
    });

    test('converts grams to ounces correctly', () => {
      expect(convert(100, 'weight', 'g', 'oz')).toBeCloseTo(3.52740);
    });

    // Temperature conversions
    test('converts Celsius to Fahrenheit correctly', () => {
      expect(convert(0, 'temperature', '°C', '°F')).toBe(32);
      expect(convert(100, 'temperature', '°C', '°F')).toBe(212);
    });

    test('converts Kelvin to Celsius correctly', () => {
      expect(convert(273.15, 'temperature', 'K', '°C')).toBe(0);
    });

    // Error cases
    test('throws error for invalid input value', () => {
      expect(() => convert(NaN, 'length', 'm', 'ft')).toThrow('Invalid input value');
    });

    test('throws error for unknown category', () => {
      expect(() => convert(1, 'invalid', 'm', 'ft')).toThrow('Unknown category');
    });

    test('throws error for unsupported conversion', () => {
      expect(() => convert(1, 'length', 'invalid', 'ft')).toThrow('Unsupported conversion');
    });
  });

  describe('formatResult()', () => {
    test('formats small numbers in scientific notation', () => {
      expect(formatResult(0.000123)).toBe('1.23e-4');
    });

    test('formats regular numbers with appropriate precision', () => {
      expect(formatResult(123.456)).toBe('123.456');
    });

    test('removes trailing zeros', () => {
      expect(formatResult(123.4500)).toBe('123.45');
    });
  });

  describe('getUnitsForCategory()', () => {
    test('returns correct units for length category', () => {
      const units = getUnitsForCategory('length');
      expect(units).toContain('m');
      expect(units).toContain('ft');
      expect(units.length).toBe(8);
    });

    test('returns empty array for invalid category', () => {
      expect(getUnitsForCategory('invalid')).toEqual([]);
    });
  });

  describe('isValidConversion()', () => {
    test('validates correct length conversion', () => {
      expect(isValidConversion('length', 'm', 'ft')).toBe(true);
    });

    test('validates correct temperature conversion', () => {
      expect(isValidConversion('temperature', '°C', '°F')).toBe(true);
    });

    test('invalidates incorrect units', () => {
      expect(isValidConversion('length', 'invalid', 'ft')).toBe(false);
    });

    test('invalidates incorrect category', () => {
      expect(isValidConversion('invalid', 'm', 'ft')).toBe(false);
    });
  });

  describe('Number Formatting', () => {
    test.each([
        // [input, expected]
        [0, '0'],                   // Zero
        [100000, '100000'],         // Large integer
        [100000.5, '100000.50'],    // Large number with decimals
        [1234.5678, '1234.57'],     // Large number rounded
        [123.456789, '123.457'],    // Medium number rounded
        [1.23456789, '1.23457'],    // Regular number
        [0.123456789, '0.123457'],  // Small number
        [0.001234, '1.234e-3'],     // Very small number
        [0.00001234, '1.234e-5'],   // Tiny number
        [-123.456, '-123.456'],     // Negative numbers
        [1.230, '1.23'],            // Remove trailing zeros
        [1.0, '1'],                 // Integer with decimal
        [1000.0, '1000'],           // Large integer with decimal
    ])('formats %f as %s', (input, expected) => {
        expect(formatResult(input)).toBe(expected);
    });
  });
});