/**
 * Number Parser Utility
 * 
 * Simple utility for parsing and validating numbers from strings.
 * Follows KISS principle - one simple function instead of duplicating logic.
 */

/**
 * Parse a string to number with optional validation
 * 
 * @param value - String value to parse
 * @param min - Optional minimum value
 * @param max - Optional maximum value
 * @returns Parsed number or undefined if invalid
 * 
 * @example
 * parseNumber('123') // 123
 * parseNumber('abc') // undefined
 * parseNumber('50', 0, 100) // 50
 * parseNumber('150', 0, 100) // undefined (out of range)
 */
export function parseNumber(
  value: string | undefined,
  min?: number,
  max?: number
): number | undefined {
  if (!value || value.trim() === '') {
    return undefined;
  }

  const num = parseFloat(value);

  // Check if valid number
  if (isNaN(num)) {
    return undefined;
  }

  // Check range if provided
  if (min !== undefined && num < min) {
    return undefined;
  }

  if (max !== undefined && num > max) {
    return undefined;
  }

  return num;
}

/**
 * Parse multiple string values to numbers
 * 
 * @param values - Object with string values
 * @returns Object with parsed numbers (undefined for invalid values)
 * 
 * @example
 * parseNumbers({ height: '170', weight: 'abc' })
 * // { height: 170, weight: undefined }
 */
export function parseNumbers<T extends Record<string, string | undefined>>(
  values: T
): Record<keyof T, number | undefined> {
  const result: Record<string, number | undefined> = {};

  for (const [key, value] of Object.entries(values)) {
    result[key] = parseNumber(value);
  }

  return result as Record<keyof T, number | undefined>;
}
