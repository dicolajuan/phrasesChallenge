export interface IStorageStrategy {
  setItem(key: string, value: string): void; // 🔹 Se cambia a string para evitar errores
  getItem(key: string): string | null;
}
