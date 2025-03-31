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
});