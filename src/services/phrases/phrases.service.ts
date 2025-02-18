import { Phrase } from "@/interface";
import { VITE_PHRASES_API_KEY } from "@/utilities/constants.utility";

// Constantes para configuración
const API_CONFIG = {
  BASE_URL: "https://api.json-generator.com/templates/z_L2iVaKRHDJ/data",
  TIMEOUT: 5000, // 5 segundos de timeout
  CACHE_TIME: 5 * 60 * 1000, // 5 minutos de cache
} as const;
// Cache simple para almacenar resultados
let phrasesCache: {
  data: Phrase[] | null;
  timestamp: number;
} = {
  data: null,
  timestamp: 0,
};

export const getInitialPhrases = async (): Promise<Phrase[]> => {
    // Verificar cache válido
    const now = Date.now();
    if (phrasesCache.data && (now - phrasesCache.timestamp) < API_CONFIG.CACHE_TIME) {
        return phrasesCache.data;
    }

    const token = VITE_PHRASES_API_KEY;
    const headers = {
        Authorization: `Bearer ${token}`,
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
    };

    try {
        // Crear AbortController para el timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

        const response = await fetch(API_CONFIG.BASE_URL, { 
            headers,
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Actualizar cache
        phrasesCache = {
            data,
            timestamp: now
        };

        return data;
    } catch (error) {
        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                console.error("La solicitud excedió el tiempo límite");
            } else {
                console.error("Error al obtener las frases iniciales:", error.message);
            }
        }
        
        // Si hay error, devolver cache expirado si existe
        return phrasesCache.data || [];
    }
};

/**
 * Limpia el cache de frases
 */
export const clearPhrasesCache = (): void => {
    phrasesCache = {
        data: null,
        timestamp: 0
    };
};