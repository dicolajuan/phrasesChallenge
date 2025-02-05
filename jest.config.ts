import type { Config } from "jest";

const config: Config = {
    // Indica a Jest que use ts-jest como preset para compilar TypeScript
    preset: "ts-jest",
    // Indica a Jest que use el DOM como entorno de prueba (por ejemplo para Testing Library)
    testEnvironment: "jest-environment-jsdom",

    // Opcional: define patrones para encontrar tus archivos de test
    testMatch: ["**/__tests__/**/*.test.ts?(x)", "**/?(*.)+(spec|test).ts?(x)"],

    // Opcional: define directorios o archivos a ignorar en las pruebas
    testPathIgnorePatterns: ["/node_modules/", "/dist/"],

    // Opcional: indica qué extensiones de archivo manejará Jest
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],

    // Opcional: config para mapear alias si usas paths de TypeScript (tsconfig paths)
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
      },

    transform: {
        "^.+\\.tsx?$": [
            "ts-jest",
            {
                tsconfig: "tsconfig.app.json",
            },
        ],
    },

    // Opcional: para limpiar los mocks de jest en cada test
    clearMocks: true,

    // Otros ajustes adicionales según tus necesidades...
};

export default config;
