export interface IDevice {
  id: number;
  uuid: string;

  platformOs: "UNKNOWN" | "android" | "ios" | "windows" | "macos" | "web";
  deviceType: "UNKNOWN" | "PHONE" | "TABLET" | "TV" | "DESKTOP";

  brand: string | null;
  osName: string | null;
  osVersion: string | null;
  modelName: string | null;
}
