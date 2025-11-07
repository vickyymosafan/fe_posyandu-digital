/**
 * Dependency Injection Provider for React
 *
 * Provides the DI container to React components via Context API.
 * This implements IoC at the React level - components receive dependencies
 * instead of creating them.
 *
 * IoC Benefits in React:
 * - Components don't know about concrete implementations
 * - Easy to test (provide mock container)
 * - Easy to swap implementations
 * - Centralized dependency management
 */

'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { DIContainer, getContainer } from './Container';
import { initializeContainer } from './registerDependencies';

/**
 * DI Container Context
 * Makes the container available to all child components
 */
const DIContainerContext = createContext<DIContainer | null>(null);

/**
 * DI Provider Props
 */
interface DIProviderProps {
  children: React.ReactNode;
  container?: DIContainer; // Optional: for testing with mock container
}

/**
 * Dependency Injection Provider
 * 
 * Wrap your app with this provider to enable IoC throughout the component tree.
 * 
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <DIProvider>
 *       <YourApp />
 *     </DIProvider>
 *   );
 * }
 * ```
 */
export function DIProvider({ children, container: providedContainer }: DIProviderProps) {
  // Initialize container once
  const container = useMemo(() => {
    if (providedContainer) {
      return providedContainer; // Use provided container (for testing)
    }

    // Check if global container exists
    let globalContainer = getContainer();
    
    // If empty, initialize it
    if (globalContainer.getRegisteredKeys().length === 0) {
      globalContainer = initializeContainer();
    }

    return globalContainer;
  }, [providedContainer]);

  return (
    <DIContainerContext.Provider value={container}>
      {children}
    </DIContainerContext.Provider>
  );
}

/**
 * Hook to access the DI container
 * 
 * @throws Error if used outside DIProvider
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const container = useDIContainer();
 *   const useCase = container.resolve(DependencyKeys.REGISTER_LANSIA_USE_CASE);
 *   // Use the use case...
 * }
 * ```
 */
export function useDIContainer(): DIContainer {
  const container = useContext(DIContainerContext);

  if (!container) {
    throw new Error(
      'useDIContainer must be used within a DIProvider. ' +
      'Wrap your app with <DIProvider>...</DIProvider>'
    );
  }

  return container;
}

/**
 * Hook to resolve a specific dependency
 * 
 * Convenience hook that combines useDIContainer and resolve.
 * 
 * @param key - Dependency key to resolve
 * @returns The resolved dependency
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const useCase = useDependency<RegisterLansiaUseCase>(
 *     DependencyKeys.REGISTER_LANSIA_USE_CASE
 *   );
 *   // Use the use case...
 * }
 * ```
 */
export function useDependency<T>(key: string): T {
  const container = useDIContainer();
  return useMemo(() => container.resolve<T>(key), [container, key]);
}
