export interface IDevice {
  id: number;
  uuid: string;
  brand: string | null;
  osName: string | null;
  osVersion: string | null;
  modelName: string | null;
  platformOs: string | null;
}
