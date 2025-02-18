import { Button } from "@mui/material";
import CardPhrase from "./CardPhrase";
import { LoadingFallback } from "../common/LoadingFallback";
import { Phrase } from "@/interface";
import { RefObject } from "react";
import { withLoading } from "./WithLoading";

interface PhrasesContentProps {
    visibleResults: Phrase[];
    results: Phrase[];
    uiState: {
        query: string;
        visiblePhrases: number;
    };
    isLoading: boolean;
    handleFavoritePhrase: (id: number) => void;
    handleDeletePhrase: (id: number) => void;
    handleShowLess: () => void;
    loadMoreRef: RefObject<HTMLDivElement | null>;
}

const PhrasesContentBase = ({
    visibleResults,
    results,
    uiState,
    isLoading,
    handleFavoritePhrase,
    handleDeletePhrase,
    handleShowLess,
    loadMoreRef,
}: PhrasesContentProps) => {
    if (isLoading) {
        return <LoadingFallback />;
    }

    if (visibleResults.length === 0) {
        return (
            <p className="text-lg">
                {uiState.query
                    ? "No se encontraron frases"
                    : "Aun no hay frases"}
            </p>
        );
    }

    return (
        <>
            <section className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {visibleResults.map((phrase: Phrase) => (
                    <CardPhrase
                        key={phrase.id}
                        phrase={phrase}
                        handleFavoritePhrase={handleFavoritePhrase}
                        handleDeletePhrase={handleDeletePhrase}
                    />
                ))}
            </section>
            {uiState.visiblePhrases < results.length ? (
                <div
                    ref={loadMoreRef}
                    className="h-10 w-full text-center p-4 flex items-center justify-center"
                >
                    Cargando más frases...
                </div>
            ) : (
                <Button
                    className={visibleResults.length === 0 ? "!hidden" : ""}
                    variant="text"
                    onClick={handleShowLess}
                    data-testid="show-less"
                >
                    Mostrar menos
                </Button>
            )}
        </>
    );
};

export const PhrasesContent = withLoading(PhrasesContentBase);
