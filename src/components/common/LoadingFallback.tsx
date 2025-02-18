import { CircularProgress } from "@mui/material";

export const LoadingFallback = () => (
    <div className="h-full w-full flex flex-col gap-4 items-center justify-center" data-testid="loading">
        <CircularProgress />
        <p>Cargando las frases</p>
    </div>
);