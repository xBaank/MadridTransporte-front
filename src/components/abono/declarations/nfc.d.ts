// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface Window {
  util?: {
    arrayBufferToHexString: (bytes: ArrayBuffer) => string;
  };
  nfc?: {
    connect: (value: string) => Promise<void>;
    close: () => void;
    transceive: (payload: string | ArrayBuffer) => Promise<ArrayBuffer>;
    addTagDiscoveredListener: (callback: (event: any) => void) => void;
    removeTagDiscoveredListener: (callback: (event: any) => void) => void;
  };
}
