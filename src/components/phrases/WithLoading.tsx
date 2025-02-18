import { CircularProgress } from "@mui/material";
import React from "react";

interface WithLoadingProps {
    isLoading: boolean;
}

export const withLoading = <P extends object>(
    WrappedComponent: React.ComponentType<P>
) => {
    return function WithLoadingComponent({
        isLoading,
        ...props
    }: P & WithLoadingProps) {
        if (isLoading) {
            return (
                <div className="h-full w-full flex flex-col gap-4 items-center justify-center">
                    <CircularProgress />
                    <p>Cargando las frases</p>
                </div>
            );
        }
        return <WrappedComponent {...(props as P)} />;
    };
};
