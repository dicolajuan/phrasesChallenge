// NotFound.tsx

import { NotFoundIcon } from "@/components/icons";
import { logger } from "@/logger/LoggerImpl";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function NotFound() {

    const navigate = useNavigate();

    useEffect(() => {
        const throwError = () => {
            try {
                throw new Error("No se encontró la pagina solicitada");
            } catch (err) {
                logger.error(err);
            }
        };

        throwError();
    }, []);

    return (
        <div className="h-screen flex flex-col gap-8 items-center justify-center bg-gray-200">
            <NotFoundIcon className="w-[200px] h-[200px]" />
            <h1 className="text-2xl font-semibold">No se ha encontrado la página solicitada</h1>
            <p>Volver al <span className="underline text-blue-400 cursor-pointer" onClick={() => navigate("/")}>Inicio</span></p>
        </div>
    );
}
