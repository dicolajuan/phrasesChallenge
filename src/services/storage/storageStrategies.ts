import { IStorageStrategy } from "@/interface";

export class LocalStorageStrategy implements IStorageStrategy {
  setItem(key: string, value: string): void { // 🔹 Ahora solo acepta string
    localStorage.setItem(key, value);
  }

  getItem(key: string): string | null {
    return localStorage.getItem(key);
  }
}

export class SessionStorageStrategy implements IStorageStrategy {
  setItem(key: string, value: string): void { // 🔹 Ahora solo acepta string
    sessionStorage.setItem(key, value);
  }

  getItem(key: string): string | null {
    return sessionStorage.getItem(key);
  }
}
