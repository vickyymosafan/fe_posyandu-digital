/**
 * Fail Fast Utilities
 *
 * Utility functions untuk implement fail-fast principle.
 * Segera throw error saat ada kondisi invalid untuk detect bug lebih cepat.
 *
 * Prinsip Fail Fast:
 * - Validate input immediately
 * - Throw error pada kondisi invalid
 * - Jangan biarkan invalid state propagate
 * - Make bugs obvious and loud
 */

/**
 * Assert value is not null or undefined
 * Throws immediately if value is nullish
 *
 * @param value - Value to check
 * @param message - Error message
 * @throws Error if value is null or undefined
 *
 * @example
 * ```ts
 * const user = await getUser();
 * assertDefined(user, 'User not found'); // Throws if user is null/undefined
 * // Now TypeScript knows user is defined
 * console.log(user.name);
 * ```
 */
export function assertDefined<T>(
  value: T | null | undefined,
  message: string = 'Value is null or undefined'
): asserts value is T {
  if (value === null || value === undefined) {
    console.error('❌ [FailFast] Assertion failed:', message);
    console.error('❌ [FailFast] Value:', value);
    console.error('❌ [FailFast] Stack trace:', new Error().stack);
    throw new Error(`Assertion failed: ${message}`);
  }
}

/**
 * Assert condition is true
 * Throws immediately if condition is false
 *
 * @param condition - Condition to check
 * @param message - Error message
 * @throws Error if condition is false
 *
 * @example
 * ```ts
 * const age = getUserAge();
 * assert(age >= 0, 'Age cannot be negative');
 * assert(age <= 150, 'Age is unrealistic');
 * ```
 */
export function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    console.error('❌ [FailFast] Assertion failed:', message);
    console.error('❌ [FailFast] Stack trace:', new Error().stack);
    throw new Error(`Assertion failed: ${message}`);
  }
}

/**
 * Assert value is a valid string (not empty)
 * Throws immediately if string is empty or whitespace only
 *
 * @param value - String to check
 * @param fieldName - Name of field for error message
 * @throws Error if string is empty
 *
 * @example
 * ```ts
 * assertNonEmptyString(email, 'Email');
 * assertNonEmptyString(password, 'Password');
 * ```
 */
export function assertNonEmptyString(value: string, fieldName: string): void {
  if (typeof value !== 'string') {
    console.error('❌ [FailFast] Type assertion failed:', {
      fieldName,
      expectedType: 'string',
      actualType: typeof value,
      value,
    });
    throw new Error(`${fieldName} must be a string, got ${typeof value}`);
  }

  if (value.trim().length === 0) {
    console.error('❌ [FailFast] Empty string assertion failed:', fieldName);
    throw new Error(`${fieldName} cannot be empty`);
  }
}

/**
 * Assert value is a valid number (not NaN, not Infinity)
 * Throws immediately if number is invalid
 *
 * @param value - Number to check
 * @param fieldName - Name of field for error message
 * @throws Error if number is invalid
 *
 * @example
 * ```ts
 * assertValidNumber(age, 'Age');
 * assertValidNumber(price, 'Price');
 * ```
 */
export function assertValidNumber(value: number, fieldName: string): void {
  if (typeof value !== 'number') {
    console.error('❌ [FailFast] Type assertion failed:', {
      fieldName,
      expectedType: 'number',
      actualType: typeof value,
      value,
    });
    throw new Error(`${fieldName} must be a number, got ${typeof value}`);
  }

  if (Number.isNaN(value)) {
    console.error('❌ [FailFast] NaN assertion failed:', fieldName);
    throw new Error(`${fieldName} is NaN`);
  }

  if (!Number.isFinite(value)) {
    console.error('❌ [FailFast] Infinity assertion failed:', fieldName);
    throw new Error(`${fieldName} is Infinity`);
  }
}

/**
 * Assert value is within range
 * Throws immediately if value is out of range
 *
 * @param value - Number to check
 * @param min - Minimum value (inclusive)
 * @param max - Maximum value (inclusive)
 * @param fieldName - Name of field for error message
 * @throws Error if value is out of range
 *
 * @example
 * ```ts
 * assertInRange(age, 0, 150, 'Age');
 * assertInRange(percentage, 0, 100, 'Percentage');
 * ```
 */
export function assertInRange(
  value: number,
  min: number,
  max: number,
  fieldName: string
): void {
  assertValidNumber(value, fieldName);

  if (value < min || value > max) {
    console.error('❌ [FailFast] Range assertion failed:', {
      fieldName,
      value,
      min,
      max,
    });
    throw new Error(`${fieldName} must be between ${min} and ${max}, got ${value}`);
  }
}

/**
 * Assert array is not empty
 * Throws immediately if array is empty
 *
 * @param array - Array to check
 * @param fieldName - Name of field for error message
 * @throws Error if array is empty
 *
 * @example
 * ```ts
 * assertNonEmptyArray(users, 'Users');
 * assertNonEmptyArray(items, 'Items');
 * ```
 */
export function assertNonEmptyArray<T>(array: T[], fieldName: string): void {
  if (!Array.isArray(array)) {
    console.error('❌ [FailFast] Array type assertion failed:', {
      fieldName,
      actualType: typeof array,
      value: array,
    });
    throw new Error(`${fieldName} must be an array, got ${typeof array}`);
  }

  if (array.length === 0) {
    console.error('❌ [FailFast] Empty array assertion failed:', fieldName);
    throw new Error(`${fieldName} cannot be empty`);
  }
}

/**
 * Assert value is one of allowed values
 * Throws immediately if value is not in allowed list
 *
 * @param value - Value to check
 * @param allowedValues - Array of allowed values
 * @param fieldName - Name of field for error message
 * @throws Error if value is not allowed
 *
 * @example
 * ```ts
 * assertOneOf(role, ['ADMIN', 'PETUGAS'], 'Role');
 * assertOneOf(status, ['active', 'inactive'], 'Status');
 * ```
 */
export function assertOneOf<T>(
  value: T,
  allowedValues: T[],
  fieldName: string
): void {
  if (!allowedValues.includes(value)) {
    console.error('❌ [FailFast] Enum assertion failed:', {
      fieldName,
      value,
      allowedValues,
    });
    throw new Error(
      `${fieldName} must be one of [${allowedValues.join(', ')}], got ${value}`
    );
  }
}

/**
 * Assert object has required properties
 * Throws immediately if any property is missing
 *
 * @param obj - Object to check
 * @param requiredProps - Array of required property names
 * @param objectName - Name of object for error message
 * @throws Error if any property is missing
 *
 * @example
 * ```ts
 * assertHasProperties(user, ['id', 'name', 'email'], 'User');
 * assertHasProperties(config, ['apiUrl', 'timeout'], 'Config');
 * ```
 */
export function assertHasProperties<T extends object>(
  obj: T,
  requiredProps: (keyof T)[],
  objectName: string
): void {
  if (typeof obj !== 'object' || obj === null) {
    console.error('❌ [FailFast] Object type assertion failed:', {
      objectName,
      actualType: typeof obj,
      value: obj,
    });
    throw new Error(`${objectName} must be an object, got ${typeof obj}`);
  }

  const missingProps = requiredProps.filter((prop) => !(prop in obj));

  if (missingProps.length > 0) {
    console.error('❌ [FailFast] Missing properties assertion failed:', {
      objectName,
      missingProps,
      actualProps: Object.keys(obj),
    });
    throw new Error(
      `${objectName} is missing required properties: ${missingProps.join(', ')}`
    );
  }
}

/**
 * Assert value is a valid Date
 * Throws immediately if date is invalid
 *
 * @param value - Date to check
 * @param fieldName - Name of field for error message
 * @throws Error if date is invalid
 *
 * @example
 * ```ts
 * assertValidDate(birthDate, 'Birth date');
 * assertValidDate(expiryDate, 'Expiry date');
 * ```
 */
export function assertValidDate(value: Date, fieldName: string): void {
  if (!(value instanceof Date)) {
    console.error('❌ [FailFast] Date type assertion failed:', {
      fieldName,
      actualType: typeof value,
      value,
    });
    throw new Error(`${fieldName} must be a Date, got ${typeof value}`);
  }

  if (Number.isNaN(value.getTime())) {
    console.error('❌ [FailFast] Invalid date assertion failed:', {
      fieldName,
      value,
    });
    throw new Error(`${fieldName} is an invalid date`);
  }
}

/**
 * Assert function is called with valid context
 * Useful for class methods that require 'this' context
 *
 * @param context - Context to check
 * @param expectedType - Expected type name
 * @throws Error if context is invalid
 *
 * @example
 * ```ts
 * class MyClass {
 *   myMethod() {
 *     assertValidContext(this, 'MyClass');
 *     // Now safe to use this
 *   }
 * }
 * ```
 */
export function assertValidContext(context: unknown, expectedType: string): void {
  if (context === null || context === undefined) {
    console.error('❌ [FailFast] Context assertion failed:', {
      expectedType,
      actualContext: context,
    });
    throw new Error(
      `Method must be called with valid ${expectedType} context, got ${context}`
    );
  }
}

/**
 * Unreachable code marker
 * Throws error if code path is reached
 * Useful for exhaustive switch statements
 *
 * @param value - Value that should never be reached
 * @param message - Optional error message
 * @throws Error always
 *
 * @example
 * ```ts
 * function handleStatus(status: 'active' | 'inactive') {
 *   switch (status) {
 *     case 'active':
 *       return 'Active';
 *     case 'inactive':
 *       return 'Inactive';
 *     default:
 *       unreachable(status, 'Unknown status');
 *   }
 * }
 * ```
 */
export function unreachable(value: never, message: string = 'Unreachable code'): never {
  console.error('❌ [FailFast] Unreachable code reached:', {
    message,
    value,
  });
  throw new Error(`${message}: ${JSON.stringify(value)}`);
}
