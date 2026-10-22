/** A failed React.lazy promise is cached. Resetting the boundary alone cannot
 * recover an outdated deployment chunk or a Vite dependency optimization. */
export function isModuleLoadError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /Failed to fetch dynamically imported module|Importing a module script failed|Loading chunk .+ failed|Outdated Optimize Dep/i.test(
    message,
  );
}
