import { IStorageStrategy, Phrase } from "@/interface";
import { SessionStorageStrategy, LocalStorageStrategy } from "./storageStrategies";
import { VITE_NODE_ENV } from "@/utilities/constants.utility";

export class StorageContext {
  private strategy: IStorageStrategy;
  private EXPIRATION_TIME = 1000 * 60 * 5; // 5 minutos

  constructor(strategy: IStorageStrategy) {
    this.strategy = strategy;
  }

  public setItem(key: string, value: Phrase[]): void {
    const payload = JSON.stringify({
      phrases: value,
      timestamp: Date.now(),
    });

    this.strategy.setItem(key, payload);
  }

  public getItem(key: string): Phrase[] | null {
    const serializedData = this.strategy.getItem(key);

    if (!serializedData) return null; // 🔹 Verificamos que no sea null antes de parsear

    try {
      const { phrases, timestamp } = JSON.parse(serializedData); // 🔹 JSON.parse siempre recibe un string

      if (Date.now() - timestamp > this.EXPIRATION_TIME) {
        this.strategy.setItem(key, ""); // 🔹 Se usa "" en lugar de null
        return null;
      }

      return phrases;
    } catch {
      return null; // 🔹 Manejo de error si el JSON está corrupto
    }
  }

  public clear(): void {
    this.strategy.setItem("phrases", ""); // 🔹 Se usa "" en lugar de null
  }
}

// 🔹 Detección de entorno para elegir estrategia
let selectedStrategy: IStorageStrategy;

if (VITE_NODE_ENV === "development") {
  selectedStrategy = new SessionStorageStrategy();
} else {
  selectedStrategy = new LocalStorageStrategy();
}

// Exportamos la instancia única
const storageContext = new StorageContext(selectedStrategy);
export default storageContext;
