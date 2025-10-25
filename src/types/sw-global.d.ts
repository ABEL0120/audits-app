declare global {
  interface Window {
    __swUpdate?: () => Promise<void>;
  }
}

export {};
