// TestError.tsx

import { logger } from "@/logger/LoggerImpl";

export default function TestError() {
    const throwError = () => {
        try {
            throw new Error("Prueba para logger error");
        } catch (err) {
            logger.error(err);
        }
    };

    return (
        <div>
            <h2>Example Component</h2>
            <button onClick={throwError}>Probar Error</button>
        </div>
    );
}
