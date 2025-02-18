import { useState, useEffect, useCallback } from "react";
import { Phrase } from "@/interface";
import { getInitialPhrases } from "@/services/phrases/phrases.service";
import { logger } from "@/logger/LoggerImpl";
import storageContext from "@/services/storage/storageContext";

type Status = "idle" | "loading" | "success" | "error";

interface UseFetchPhrasesReturn {
  phrases: Phrase[];
  status: Status;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  clearCache: () => void;
}

export const useFetchPhrases = (): UseFetchPhrasesReturn => {
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<Error | null>(null);

  const fetchPhrases = useCallback(async () => {
    try {
      setStatus("loading");
      setError(null);

      // 🔹 1️⃣ Primero intentamos obtener desde el Storage
      const cachedPhrases = storageContext.getItem("phrases");

      if (cachedPhrases) {
        logger.debug("Usando frases del caché:", cachedPhrases);
        setPhrases(cachedPhrases);
        setStatus("success");
        return;
      }

      // 🔹 2️⃣ Si no hay en caché, vamos a la API
      const data = await getInitialPhrases();

      setPhrases(data);
      storageContext.setItem("phrases", data); // 🔹 3️⃣ Guardamos en storage
      logger.debug("Frases obtenidas desde la API:", data);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err : new Error("Error desconocido al obtener frases"));
      logger.error("Error al obtener frases", err);
      setPhrases([]);
    }
  }, []);

  useEffect(() => {
    fetchPhrases();
  }, [fetchPhrases]);

  // Permite recargar las frases manualmente
  const refetch = useCallback(async () => {
    storageContext.clear(); // 🔹 4️⃣ Limpia el caché antes de recargar
    await fetchPhrases();
  }, [fetchPhrases]);

  return {
    phrases,
    status,
    isLoading: status === "loading",
    isError: status === "error",
    error,
    refetch,
    clearCache: storageContext.clear,
  };
};
