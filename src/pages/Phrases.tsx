import {
    useMemo,
    useState,
    useEffect,
    useRef,
    useCallback,
} from "react";
import Fuse from "fuse.js";
import { Tooltip } from "@mui/material";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import {
    CreatePhrase,
    PhrasesContent,
    RoundedTextField,
} from "@/components";
import { Phrase } from "@/interface";
import { usePhrases } from "@/context/PhrasesContext";

const INITIAL_STATE: Phrase = {
    id: 0,
    phrase: "",
    isFavorite: false,
    creationDate: new Date().toISOString(),
};

const fuseOptions = {
    keys: ["phrase"],
    threshold: 0.3,
    includeScore: true,
    ignoreLocation: true,
};

const countVisibles = (width: number) => {
    if (width >= 1024) return 9;
    if (width >= 760) return 6;
    if (width >= 640) return 4;
    return 3;
};

export const Phrases = () => {
    const {
        phrases,
        isLoading,
        addPhrase,
        deletePhrase: handleDeletePhrase,
        toggleFavorite: handleFavoritePhrase,
    } = usePhrases();

    const width = window.innerWidth;

    // Estados principales
    const [newPhrase, setNewPhrase] = useState<Phrase>(INITIAL_STATE);
    const [uiState, setUiState] = useState({
        query: "",
        tabValue: 1,
        visiblePhrases: countVisibles(width),
        isResetting: false,
    });

    // Refs para manejar scroll y focos
    const loadMoreRef = useRef<HTMLDivElement | null>(null);
    const topRef = useRef<HTMLDivElement>(null);
    const phraseInputRef = useRef<HTMLInputElement>(null);

    // Creamos el índice de Fuse cuando cambia la lista de frases
    const fuse = useMemo(() => new Fuse(phrases, fuseOptions), [phrases]);

    // Al cambiar de tab, si es "Crear", enfocamos el input y reiniciamos frase y query.
    useEffect(() => {
        if (uiState.tabValue === 0 && phraseInputRef.current) {
            phraseInputRef.current.focus();
        }
        setNewPhrase(INITIAL_STATE);
        setUiState((prev) => ({ ...prev, query: "" }));
    }, [uiState.tabValue]);

    // Handler para actualizar la nueva frase
    const handlePhraseChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setNewPhrase((prev) => ({ ...prev, phrase: e.target.value }));
        },
        []
    );

    // Agregar nueva frase
    const handleAddPhrase = useCallback(() => {
        if (!newPhrase.phrase.trim()) return;
        const newId = phrases.length
            ? Math.max(...phrases.map((p) => p.id)) + 1
            : 1;
        const newEntry = { ...newPhrase, id: newId };
        addPhrase(newEntry);
        // setPhrases((prev) => [...prev, newEntry]);
        setNewPhrase(INITIAL_STATE);
    }, [newPhrase, phrases]);

    // Actualizar query y reiniciar número de frases visibles
    const handleSearch = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setUiState((prev) => ({ ...prev, query: e.target.value }));
            setUiState((prev) => ({
                ...prev,
                visiblePhrases: countVisibles(width),
            }));
        },
        []
    );

    // Calculamos los resultados según el query y luego los ordenamos
    const results = useMemo(() => {
        const baseList = uiState.query
            ? fuse.search(uiState.query).map((res) => res.item)
            : [...phrases];

        return baseList.sort((a, b) => {
            // Si uno es favorito y el otro no, el favorito va primero.
            if (a.isFavorite && !b.isFavorite) return -1;
            if (!a.isFavorite && b.isFavorite) return 1;
            // Si ambos son del mismo grupo, se ordenan por id descendiente.
            return b.id - a.id;
        });
    }, [uiState.query, fuse, phrases]);

    const visibleResults = useMemo(
        () => results.slice(0, uiState.visiblePhrases),
        [results, uiState.visiblePhrases]
    );

    // Observer para cargar más frases
    useEffect(() => {
        if (!loadMoreRef.current || uiState.isResetting) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setTimeout(() => {
                        setUiState((prev) => ({
                            ...prev,
                            visiblePhrases: prev.visiblePhrases + 3,
                        }));
                    }, 1000);
                }
            },
            { threshold: 1.0 }
        );

        observer.observe(loadMoreRef.current);
        return () => observer.disconnect();
    }, [uiState.visiblePhrases, results.length, uiState.isResetting]);

    // Handler para "Mostrar menos"
    const handleShowLess = () => {
        setUiState((prev) => ({ ...prev, isResetting: true }));
        setUiState((prev) => ({
            ...prev,
            visiblePhrases: countVisibles(width),
        }));
        // Pequeño retardo para que el DOM se actualice antes del scroll
        setTimeout(() => {
            topRef.current?.scrollIntoView({ behavior: "smooth" });
            setTimeout(
                () => setUiState((prev) => ({ ...prev, isResetting: false })),
                1000
            );
        }, 50);
    };

    // Handler para el botón flotante
    const handleFloatingButtonClick = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        setTimeout(() => phraseInputRef.current?.focus(), 300);
        setUiState((prev) => ({ ...prev, tabValue: 0 }));
    };

    return (
        <div className="h-full w-full flex flex-col items-center max-sm:gap-[1rem] sm:gap-[3rem] text-center max-sm:!p-6 sm:p-8">
            <div ref={topRef} />
            <div className="flex flex-col items-center gap-4">
                <h1 className="flex items-center justify-center max-sm:text-2xl max-md:text-3xl max-lg:text-4xl lg:text-5xl">
                    Bienvenido a la biblioteca de frases!
                </h1>
            </div>
            {uiState.tabValue === 0 ? (
                <div
                    className="w-full max-w-[900px]"
                    onBlur={() =>
                        setUiState((prev) => ({ ...prev, tabValue: 1 }))
                    }
                >
                    <CreatePhrase
                        newPhrase={newPhrase}
                        handleAddPhrase={handleAddPhrase}
                        handleChange={handlePhraseChange}
                        inputRef={phraseInputRef}
                    />
                </div>
            ) : (
                <RoundedTextField
                    className="w-full max-w-[900px]"
                    type="text"
                    value={uiState.query}
                    onChange={handleSearch}
                    placeholder="Buscar en las frases"
                />
            )}

            <PhrasesContent
                visibleResults={visibleResults}
                results={results}
                uiState={uiState}
                isLoading={isLoading}
                handleFavoritePhrase={handleFavoritePhrase}
                handleDeletePhrase={handleDeletePhrase}
                handleShowLess={handleShowLess}
                loadMoreRef={loadMoreRef}
            />

            <Tooltip title="Crear frase" placement="left" arrow>
                <button
                    className="fixed w-16 h-16 max-xs:bg-red-600 items-center justify-center bottom-4 right-4 bg-[#6FC5D2] active:bg-[#467A82] hover:bg-[#467A82] cursor-pointer active:scale-95 select-none text-white font-bold py-2 px-4 rounded-full shadow-lg transition duration-300"
                    onClick={handleFloatingButtonClick}
                    data-testid="floating-button"
                >
                    <BorderColorIcon />
                </button>
            </Tooltip>
        </div>
    );
};
