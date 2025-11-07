# Open/Closed Principle (OCP) Refactoring

## Summary

Applied Open/Closed Principle to make the codebase extensible without modifying existing code. Created a generic health classification system that allows adding new standards and metrics without changing core logic.

## Principle Applied

**Open/Closed Principle (OCP)**: Software entities should be **open for extension** but **closed for modification**.

## Problem Identified

### Before Refactoring

The health classification utilities (BMI, blood pressure, glucose, cholesterol, uric acid) had **hard-coded thresholds and categories**:

```typescript
// Hard-coded classification logic
export function klasifikasiBMI(bmi: number): string {
  if (bmi < 17.0) return 'Berat Badan Sangat Kurang';
  if (bmi < 18.5) return 'Berat Badan Kurang';
  if (bmi < 23.0) return 'Normal';
  if (bmi < 25.0) return 'Kelebihan Berat Badan';
  if (bmi < 30.0) return 'Obesitas I';
  if (bmi < 35.0) return 'Obesitas II';
  return 'Obesitas III';
}
```

**Problems**:
1. ❌ To add new BMI standards (e.g., WHO International), must **modify** existing function
2. ❌ To change thresholds, must **modify** existing code
3. ❌ To add new health metrics (e.g., HbA1c), must create new functions with duplicated logic
4. ❌ Cannot easily switch between different standards
5. ❌ Violates OCP - not closed for modification

## Solution Implemented

### Generic Health Classifier System

Created a **configuration-based classification system** that separates:
- **Classification logic** (generic, reusable)
- **Classification standards** (configurable, extensible)

```typescript
// Generic classifier (closed for modification)
export function classifyHealthMetric(
  value: number,
  standard: ClassificationStandard
): ClassificationResult {
  for (const range of standard.ranges) {
    const min = range.min ?? 0;
    if (value >= min && value < range.max) {
      return {
        category: range.label,
        emergency: range.emergency ?? false,
        standard: standard.name,
      };
    }
  }
  // ...
}

// Standards are data (open for extension)
export const BMI_STANDARD_ASIA_PACIFIC: ClassificationStandard = {
  name: 'WHO Asia-Pacific BMI',
  unit: 'kg/m²',
  ranges: [
    { max: 17.0, label: 'Berat Badan Sangat Kurang' },
    { max: 18.5, label: 'Berat Badan Kurang' },
    { max: 23.0, label: 'Normal' },
    // ... more ranges
  ],
};
```

## Benefits

### 1. Easy to Add New Standards

Add new classification standards **without modifying existing code**:

```typescript
// Add WHO International BMI standard (different thresholds)
export const BMI_STANDARD_WHO_INTERNATIONAL: ClassificationStandard = {
  name: 'WHO International BMI',
  unit: 'kg/m²',
  ranges: [
    { max: 16.0, label: 'Severe Thinness' },
    { max: 18.5, label: 'Mild Thinness' },
    { max: 25.0, label: 'Normal' },
    { max: 30.0, label: 'Overweight' },
    // ... more ranges
  ],
};

// Use it immediately
const result = classifyHealthMetric(24.5, BMI_STANDARD_WHO_INTERNATIONAL);
```

### 2. Easy to Add New Metrics

Add completely new health metrics **without modifying core logic**:

```typescript
// Add HbA1c classification (new metric)
export const HBA1C_STANDARD: ClassificationStandard = {
  name: 'HbA1c',
  unit: '%',
  ranges: [
    { max: 5.7, label: 'Normal' },
    { max: 6.5, label: 'Pra-Diabetes' },
    { max: Infinity, label: 'Diabetes' },
  ],
};

// Use the same classifier
const hba1cResult = classifyHealthMetric(6.0, HBA1C_STANDARD);
```

### 3. Easy to Switch Standards

Switch between standards at runtime **without code changes**:

```typescript
function classifyPatientBMI(bmi: number, region: 'asia' | 'international') {
  const standard = region === 'asia' 
    ? BMI_STANDARD_ASIA_PACIFIC 
    : BMI_STANDARD_WHO_INTERNATIONAL;
  
  return classifyHealthMetric(bmi, standard);
}
```

### 4. Easy to Customize for Special Cases

Create custom standards for specific patient groups:

```typescript
// Custom standard for elderly patients
export const BLOOD_PRESSURE_STANDARD_ELDERLY: ClassificationStandard = {
  name: 'Blood Pressure (Elderly)',
  unit: 'mmHg',
  ranges: [
    { max: 130, label: 'Normal' },
    { max: 150, label: 'Hipertensi Tahap 1' },
    // More lenient thresholds
  ],
};
```

## Files Created

### 1. `lib/utils/healthClassifier.ts`
Generic health classification system with:
- `classifyHealthMetric()` - Generic classifier function
- `classifyHealthMetricSafe()` - Safe version for invalid input
- Pre-defined standards (BMI, blood pressure, glucose, cholesterol, uric acid)
- Convenience functions for backward compatibility

### 2. `lib/config/healthStandards.example.ts`
Example configurations showing how to extend the system:
- Alternative BMI standards
- Custom blood pressure standards
- New metrics (HbA1c, LDL, HDL, triglycerides, creatinine)
- Usage examples

## Files Modified

### 1. `lib/utils/bmi.ts`
- Updated to use `healthClassifier` internally
- Maintains backward compatibility
- Added OCP compliance notes

### 2. `lib/utils/index.ts`
- Exports new `healthClassifier` functions and types
- Exports pre-defined classification standards
- Maintains all existing exports

## Backward Compatibility

✅ **All existing code continues to work** without changes:

```typescript
// Old code still works
const kategori = klasifikasiBMI(24.5);
// Output: "Kelebihan Berat Badan"

// New code can use generic classifier
const result = classifyHealthMetric(24.5, BMI_STANDARD_ASIA_PACIFIC);
// Output: { category: "Kelebihan Berat Badan", emergency: false, ... }
```

## Design Patterns Used

### 1. Strategy Pattern
Different classification strategies (standards) can be plugged in without modifying the classifier.

### 2. Configuration Pattern
Behavior is controlled by configuration data, not code logic.

### 3. Open/Closed Principle
- **Open for extension**: Add new standards by creating new configuration objects
- **Closed for modification**: Core classifier logic never needs to change

## Future Extensions (Examples)

The system is now ready for:

1. **Multi-region support**: Different standards for different countries
2. **Age-specific standards**: Different thresholds for children, adults, elderly
3. **Condition-specific standards**: Custom thresholds for patients with specific conditions
4. **Dynamic standards**: Load standards from database or API
5. **New health metrics**: Add any new metric without touching core code

## Testing Recommendations

1. Test generic classifier with various standards
2. Test backward compatibility of existing functions
3. Test edge cases (boundary values, invalid input)
4. Test custom standards creation
5. Test standard switching at runtime

## Impact

- **Extensibility**: ⬆️⬆️⬆️ Dramatically improved
- **Maintainability**: ⬆️⬆️ Easier to maintain
- **Flexibility**: ⬆️⬆️⬆️ Can adapt to new requirements
- **Code Duplication**: ⬇️⬇️ Reduced significantly
- **Breaking Changes**: ✅ None - fully backward compatible

Date: November 7, 2025
