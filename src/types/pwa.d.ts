declare module "virtual:pwa-register" {
  export function registerSW(options?: {
    onNeedRefresh?: () => void;
    onOfflineReady?: () => void;
  }): () => Promise<void>;
  export default registerSW;
}
