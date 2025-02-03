import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import Fuse from "fuse.js";
import { Button, Tooltip } from "@mui/material";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { CreatePhrase, RoundedTextField, CardPhrase } from "@/components";
import { Phrase } from "@/interface";
import { mockPhrases } from "@/utilities";

const INITIAL_STATE: Phrase = {
    id: 0,
    phrase: "",
    isFavorite: false,
};

const fuseOptions = {
    keys: ["phrase"],
    threshold: 0.3,
    includeScore: true,
    ignoreLocation: true,
};

const countVisibles = (width: number) => {
    if(width >= 1024 ) return 9;
    if(width >= 760 ) return 6;
    if(width >= 640 ) return 4;
    return 3;
}

export const Phrases = () => {

    const width = window.innerWidth;

    // Estados principales
    const [newPhrase, setNewPhrase] = useState<Phrase>(INITIAL_STATE);
    const [phrases, setPhrases] = useState<Phrase[]>(mockPhrases);
    const [query, setQuery] = useState("");
    const [tabValue, setTabValue] = useState(1);
    const [visiblePhrases, setVisiblePhrases] = useState(countVisibles(width));
    const [isResetting, setIsResetting] = useState(false);

    


    // Refs para manejar scroll y focos
    const loadMoreRef = useRef<HTMLDivElement | null>(null);
    const topRef = useRef<HTMLDivElement>(null);
    const phraseInputRef = useRef<HTMLInputElement>(null);

    // Creamos el índice de Fuse cuando cambia la lista de frases
    const fuse = useMemo(() => new Fuse(phrases, fuseOptions), [phrases]);

    // Al cambiar de tab, si es "Crear", enfocamos el input y reiniciamos frase y query.
    useEffect(() => {
        if (tabValue === 0 && phraseInputRef.current) {
            phraseInputRef.current.focus();
        }
        setNewPhrase(INITIAL_STATE);
        setQuery("");
    }, [tabValue]);

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
        setPhrases((prev) => [...prev, newEntry]);
        setNewPhrase(INITIAL_STATE);
    }, [newPhrase, phrases]);

    // Eliminar frase
    const handleDeletePhrase = useCallback((id: number) => {
        setPhrases((prev) => prev.filter((phrase) => phrase.id !== id));
    }, []);

    // Alternar favorito
    const handleFavoritePhrase = useCallback((id: number) => {
        setPhrases((prev) =>
            prev.map((phrase) =>
                phrase.id === id
                    ? { ...phrase, isFavorite: !phrase.isFavorite }
                    : phrase
            )
        );
    }, []);

    // Actualizar query y reiniciar número de frases visibles
    const handleSearch = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setQuery(e.target.value);
            setVisiblePhrases(countVisibles(width));
        },
        []
    );

    // Calculamos los resultados según el query y luego los ordenamos
    const results = useMemo(() => {
        const baseList = query
            ? fuse.search(query).map((res) => res.item)
            : [...phrases];

        return baseList.sort((a, b) => {
            // Si uno es favorito y el otro no, el favorito va primero.
            if (a.isFavorite && !b.isFavorite) return -1;
            if (!a.isFavorite && b.isFavorite) return 1;
            // Si ambos son del mismo grupo, se ordenan por id descendiente.
            return b.id - a.id;
        });
    }, [query, fuse, phrases]);

    const visibleResults = useMemo(
        () => results.slice(0, visiblePhrases),
        [results, visiblePhrases]
    );

    // Observer para cargar más frases
    useEffect(() => {
        if (!loadMoreRef.current || isResetting) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setTimeout(() => {
                        setVisiblePhrases((prev) => prev + 3);
                    }, 1000);
                }
            },
            { threshold: 1.0 }
        );

        observer.observe(loadMoreRef.current);
        return () => observer.disconnect();
    }, [visiblePhrases, results.length, isResetting]);

    // Handler para "Mostrar menos"
    const handleShowLess = () => {
        setIsResetting(true);
        setVisiblePhrases(countVisibles(width));
        // Pequeño retardo para que el DOM se actualice antes del scroll
        setTimeout(() => {
            topRef.current?.scrollIntoView({ behavior: "smooth" });
            setTimeout(() => setIsResetting(false), 1000);
        }, 50);
    };

    // Handler para el botón flotante
    const handleFloatingButtonClick = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        setTimeout(() => phraseInputRef.current?.focus(), 300);
        setTabValue(0);
    };

    return (
        <div className="h-full w-full flex flex-col items-center max-sm:gap-[1rem] sm:gap-[3rem] text-center max-sm:!p-6 sm:p-8">
            <div ref={topRef} />
            <div className="flex flex-col items-center gap-4">
                <h1 className="flex items-center justify-center max-sm:text-2xl max-md:text-3xl max-lg:text-4xl lg:text-5xl">
                    Bienvenido a la biblioteca de frases!
                </h1>
            </div>
            {tabValue === 0 ? (
                <div
                    className="w-full max-w-[900px]"
                    onBlur={() => setTabValue(1)}
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
                    value={query}
                    onChange={handleSearch}
                    placeholder="Buscar en las frases"
                />
            )}
            {visibleResults.length === 0 ? (
                <p className="text-lg">
                    {" "}
                    {query
                        ? "No se encontraron frases"
                        : "Aun no hay frases"}{" "}
                </p>
            ) : (
                <>
                    <section className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {visibleResults.map((phrase) => (
                            <CardPhrase
                                key={phrase.id}
                                phrase={phrase}
                                handleFavoritePhrase={handleFavoritePhrase}
                                handleDeletePhrase={handleDeletePhrase}
                            />
                        ))}
                    </section>
                    {visiblePhrases < results.length ? (
                        <div
                            ref={loadMoreRef}
                            className="h-10 w-full text-center p-4 flex items-center justify-center"
                        >
                            Cargando más frases...
                        </div>
                    ) : (
                        <Button
                            className={
                                visibleResults.length === 0 ? "!hidden" : ""
                            }
                            variant="text"
                            onClick={handleShowLess}
                        >
                            Mostrar menos
                        </Button>
                    )}
                </>
            )}

            <Tooltip title="Crear frase" placement="left" arrow>
                <button
                    className="fixed w-16 h-16 max-xs:bg-red-600 items-center justify-center bottom-4 right-4 bg-[#6FC5D2] active:bg-[#467A82] hover:bg-[#467A82] cursor-pointer active:scale-95 select-none text-white font-bold py-2 px-4 rounded-full shadow-lg transition duration-300"
                    onClick={handleFloatingButtonClick}
                >
                    <BorderColorIcon />
                </button>
            </Tooltip>
        </div>
    );
};
