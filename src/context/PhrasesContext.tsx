import {
    createContext,
    useContext,
    ReactNode,
    useState,
    useCallback,
    useEffect,
} from "react";
import { Phrase } from "@/interface";
import { useFetchPhrases } from "@/hooks/useFetchPhrases";

interface PhrasesContextType {
    phrases: Phrase[];
    isLoading: boolean;
    error: Error | null;
    addPhrase: (phrase: Phrase) => void;
    deletePhrase: (id: number) => void;
    toggleFavorite: (id: number) => void;
    refetch: () => void;
}

const PhrasesContext = createContext<PhrasesContextType | undefined>(undefined);

export function PhrasesProvider({ children }: { children: ReactNode }) {
    const {
        phrases: initialPhrases,
        isLoading,
        error,
        refetch,
    } = useFetchPhrases();
    
    const [phrases, setPhrases] = useState<Phrase[]>(initialPhrases);

    useEffect(() => {
        setPhrases(initialPhrases);
    }, [initialPhrases]);

    const addPhrase = useCallback((newPhrase: Phrase) => {
        setPhrases((prev) => [newPhrase, ...prev]);
    }, []);

    const deletePhrase = useCallback((id: number) => {
        setPhrases((prev) => prev.filter((phrase) => phrase.id !== id));
    }, []);

    const toggleFavorite = useCallback((id: number) => {
        setPhrases((prev) =>
            prev.map((phrase) =>
                phrase.id === id
                    ? { ...phrase, isFavorite: !phrase.isFavorite }
                    : phrase
            )
        );
    }, []);

    return (
        <PhrasesContext.Provider
            value={{
                phrases,
                isLoading,
                error,
                addPhrase,
                deletePhrase,
                toggleFavorite,
                refetch,
            }}
        >
            {children}
        </PhrasesContext.Provider>
    );
}

export function usePhrases() {
    const context = useContext(PhrasesContext);
    if (context === undefined) {
        throw new Error("usePhrases must be used within a PhrasesProvider");
    }
    return context;
}
