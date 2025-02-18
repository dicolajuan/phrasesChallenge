import { logger } from "@/logger/LoggerImpl";
import { useEffect } from "react";
import { useRouteError } from "react-router";
import { ErrorPageIcon } from "../icons";

interface UiErrorProp {
    page: string;
}

export const UiError = ({ page }: UiErrorProp) => {
    const routerError = useRouteError();

    useEffect(() => {
        const throwError = () => {
            logger.error(`Error Page: ${page} \n`,routerError);
        };

        throwError();
    }, []);

    return (
        <div className="w-full h-screen flex flex-col gap-4 justify-center items-center text-2xl">
            <ErrorPageIcon className="w-[200px] h-[200px]" />
            <h1 className="text-2xl font-semibold">Hubo un error al cargar la pagina</h1>
            <p className="italic text-sm">Por favor chequee la consola antes de recargar</p>
        </div>
    );
};
