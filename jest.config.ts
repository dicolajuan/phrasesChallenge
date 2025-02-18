import type { Config } from "jest";

const config: Config = {
    // Indica a Jest que use ts-jest como preset para compilar TypeScript
    preset: "ts-jest",

    // Indica a Jest que use jsdom como entorno de prueba (para pruebas con React Testing Library)
    testEnvironment: "jsdom",

    // 📌 🔹 Asegura que Jest cargue `jest.setup.ts` antes de ejecutar las pruebas
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

    // Opcional: define patrones para encontrar tus archivos de test
    testMatch: ["**/__tests__/**/*.test.ts?(x)", "**/?(*.)+(spec|test).ts?(x)"],

    // Ignorar node_modules y dist para mejorar rendimiento
    testPathIgnorePatterns: ["/node_modules/", "/dist/"],

    // Extensiones de archivo que Jest manejará
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],

    // Configuración para mapear alias si usas paths de TypeScript
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
    },

    // Transforma archivos TypeScript usando ts-jest y tsconfig.app.json
    transform: {
        "^.+\\.tsx?$": [
            "ts-jest",
            {
                tsconfig: "tsconfig.app.json",
            },
        ],
    },

    // Limpia mocks después de cada prueba
    clearMocks: true,

    // Aumenta el tiempo de espera para pruebas async si algunas demoran demasiado
    testTimeout: 30000,  // (Opcional) Ajusta según tus necesidades
};

export default config;
