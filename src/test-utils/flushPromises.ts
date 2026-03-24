/** Flush the microtask/macrotask queue so fire-and-forget async functions complete. */
export const flushPromises = (): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, 0));
