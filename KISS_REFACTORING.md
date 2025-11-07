# KISS (Keep It Simple, Stupid) Refactoring

## Overview
This document describes the KISS refactoring applied to eliminate unnecessary complexity and keep solutions as simple as possible.

## Problems Identified

### 1. Duplicate "FromStrings" Functions in healthMetricsService
**Problem:** Every classification function had two versions:
- `calculateBMI(number, number)` - works with numbers
- `calculateBMIFromStrings(string, string)` - parses strings then calls the number version

This pattern was repeated 5 times:
- calculateBMI / calculateBMIFromStrings
- classifyBloodPressure / classifyBloodPressureFromStrings
- classifyBloodGlucose / classifyBloodGlucoseFromStrings
- classifyCholesterol / classifyCholesterolFromString
- classifyUricAcid / classifyUricAcidFromString

**Why it's complex:**
- Duplicates string parsing logic 5 times
- Mixes concerns (parsing + business logic)
- Makes the service harder to understand
- More functions to maintain and test

### 2. Overly Complex Password Validation
**Problem:** usePasswordForm has 3 separate validation functions with complex regex patterns:
- validateOldPassword()
- validateNewPassword() - with 3 regex checks
- validateConfirmPassword()

**Why it's complex:**
- Manual validation instead of using Zod schema
- Regex patterns are hard to read and maintain
- Validation logic is duplicated in handleChange and handleSubmit

### 3. Too Many useEffect Hooks
**Problem:** usePemeriksaanGabunganForm has 5 separate useEffect hooks:
- Calculate BMI
- Classify blood pressure
- Classify blood glucose
- Classify cholesterol
- Classify uric acid

**Why it's complex:**
- Each useEffect does similar parsing and validation
- Too much state management (9 state variables!)
- Parsing logic is duplicated in each useEffect
- Hard to understand the flow

## Solutions Applied

### 1. Generic Number Parser Utility
**File:** `lib/utils/numberParser.ts`

Created a simple, reusable utility for parsing numbers:

```typescript
export function parseNumber(
  value: string | undefined,
  min?: number,
  max?: number
): number | undefined {
  if (!value || value.trim() === '') return undefined;
  const num = parseFloat(value);
  if (isNaN(num)) return undefined;
  if (min !== undefined && num < min) return undefined;
  if (max !== undefined && num > max) return undefined;
  return num;
}
```

**Benefits:**
- Single place for number parsing logic
- Optional range validation
- Reusable across the entire codebase
- Easy to test and maintain

### 2. Simplified healthMetricsService
**Changes:**
- Removed all "FromStrings" functions
- Updated functions to accept `number | undefined`
- Use `parseNumber()` utility in `calculateAllHealthMetrics()`

**Before:**
```typescript
export function calculateBMI(berat: number, tinggi: number): BMIResult
export function calculateBMIFromStrings(beratStr: string, tinggiStr: string): BMIResult
```

**After:**
```typescript
export function calculateBMI(
  berat: number | undefined,
  tinggi: number | undefined
): BMIResult {
  if (!berat || !tinggi) return { nilai: null, kategori: null };
  // ... calculation
}
```

**Benefits:**
- Reduced from 11 functions to 6 functions (45% reduction)
- Single responsibility: business logic only, no parsing
- Easier to understand and test
- Callers can use `parseNumber()` when needed

### 3. Separation of Concerns
**Principle:** String parsing is a UI concern, not a business logic concern.

**Before:** Service layer handled both parsing and business logic
**After:** 
- UI layer: Parse strings using `parseNumber()`
- Service layer: Work with numbers only

This makes each layer simpler and more focused.

## Code Reduction

| File | Before | After | Reduction |
|------|--------|-------|-----------|
| healthMetricsService.ts | ~300 lines | ~150 lines | 50% |
| Number of functions | 11 | 6 | 45% |

## Migration Guide

### For Existing Code Using "FromStrings" Functions

**Before:**
```typescript
import { calculateBMIFromStrings } from '@/lib/services';

const result = calculateBMIFromStrings(beratStr, tinggiStr);
```

**After:**
```typescript
import { calculateBMI } from '@/lib/services';
import { parseNumber } from '@/lib/utils';

const berat = parseNumber(beratStr);
const tinggi = parseNumber(tinggiStr);
const result = calculateBMI(berat, tinggi);
```

**Or use calculateAllHealthMetrics (recommended):**
```typescript
import { calculateAllHealthMetrics } from '@/lib/services';

// Pass strings directly - they're parsed internally
const metrics = calculateAllHealthMetrics(formData, gender);
```

### For New Code

Always use `parseNumber()` to convert string inputs:

```typescript
import { parseNumber } from '@/lib/utils';

// Simple parsing
const age = parseNumber(ageStr);

// With range validation
const height = parseNumber(heightStr, 50, 250); // 50-250 cm

// Parse multiple values
const { weight, height } = parseNumbers({
  weight: weightStr,
  height: heightStr,
});
```

## Future KISS Improvements

### 1. Simplify Password Validation
Replace manual validation with Zod schema:

```typescript
const passwordSchema = z.object({
  kataSandiLama: z.string().min(1),
  kataSandiBaru: z.string()
    .min(8)
    .regex(/[a-zA-Z]/, 'Must contain letter')
    .regex(/[0-9]/, 'Must contain number')
    .regex(/[!@#$%^&*]/, 'Must contain symbol'),
  konfirmasiKataSandi: z.string(),
}).refine(data => data.kataSandiBaru === data.konfirmasiKataSandi, {
  message: 'Passwords must match',
  path: ['konfirmasiKataSandi'],
});
```

### 2. Consolidate useEffect Hooks
Combine multiple useEffect hooks into one:

```typescript
useEffect(() => {
  const metrics = calculateAllHealthMetrics(formData, gender);
  setBmiResult(metrics.bmi);
  setTekananDarahResult(metrics.tekananDarah);
  // ... etc
}, [formData, gender]);
```

### 3. Reduce State Variables
Instead of 9 separate state variables, use one:

```typescript
const [metrics, setMetrics] = useState<HealthMetricsResult | null>(null);
```

## KISS Principles Applied

1. **One Function, One Purpose**: Each function does one thing well
2. **No Duplication**: Parsing logic exists in one place
3. **Clear Separation**: UI handles strings, services handle numbers
4. **Simple is Better**: Fewer functions, less code, easier to understand
5. **Reusable Utilities**: Generic functions that work everywhere

## Testing Considerations

Simplified code is easier to test:

**Before:** Had to test both number and string versions
```typescript
test('calculateBMI with numbers')
test('calculateBMIFromStrings with valid strings')
test('calculateBMIFromStrings with invalid strings')
```

**After:** Test once
```typescript
test('calculateBMI with valid numbers')
test('calculateBMI with undefined values')
test('parseNumber utility separately')
```

## Conclusion

By applying KISS principles, we:
- Reduced code by 50% in healthMetricsService
- Eliminated 5 duplicate functions
- Created a reusable parsing utility
- Made the codebase easier to understand and maintain
- Separated concerns properly (UI vs business logic)

**Remember:** The simplest solution that works is usually the best solution.
