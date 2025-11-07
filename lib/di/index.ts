/**
 * Dependency Injection Module Exports
 *
 * Central export point for all IoC/DI functionality.
 * 
 * Usage:
 * ```typescript
 * import { DIProvider, useDependency, DependencyKeys } from '@/lib/di';
 * ```
 */

// Container
export { DIContainer, DependencyKeys, getContainer, resetContainer } from './Container';

// Registration
export { registerDependencies, initializeContainer } from './registerDependencies';

// React Integration
export { DIProvider, useDIContainer, useDependency } from './DIProvider';
