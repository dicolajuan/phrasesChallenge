import { useMemo, useState, useEffect, useRef } from "react";
import { Phrase } from "./interface";
import Fuse from "fuse.js";
import { CardPhrase, CreatePhrase, RoundedTextField } from "./components";
import styled from "@emotion/styled";
import { Button, Tab, Tabs } from "@mui/material";
import { mockPhrases } from "./utilities";

const INITIAL_STATE = {
    id: 0,
    phrase: "",
    isFavorite: false,
};

const options = {
    keys: ["phrase"],
    threshold: 0.3,
    includeScore: true,
    ignoreLocation: true,
};

interface StyledTabProps {
    label: string;
}

const AntTabs = styled(Tabs)({
    borderBottom: "1px solid #e8e8e8",
    "& .MuiTabs-indicator": {
        backgroundColor: "#1890ff",
    },
});

const AntTab = styled((props: StyledTabProps) => (
    <Tab disableRipple {...props} />
))(({ theme }) => ({
    textTransform: "none",
    minWidth: 0,
    color: "rgba(0, 0, 0, 0.85)",
    fontFamily: [
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Roboto",
        '"Helvetica Neue"',
        "Arial",
        "sans-serif",
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
    ].join(","),
    "&:hover": {
        color: "#40a9ff",
        opacity: 1,
    },
    "&.Mui-selected": {
        color: "#1890ff",
    },
    "&.Mui-focusVisible": {
        backgroundColor: "#d1eaff",
    },
}));

function App() {
    const [newPhrase, setNewPhrase] = useState<Phrase>(INITIAL_STATE);
    const [phrases, setPhrases] = useState<Phrase[]>(mockPhrases);
    const [query, setQuery] = useState("");
    const [tabValue, setTabValue] = useState(0);
    const [visiblePhrases, setVisiblePhrases] = useState(4);
    const [isResetting, setIsResetting] = useState(false); // 🔥 Evita carga automática al resetear
    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    const fuse = useMemo(() => new Fuse(phrases, options), [phrases]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setNewPhrase({ ...newPhrase, phrase: e.target.value });
    };

    const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
        setNewPhrase(INITIAL_STATE);
        setQuery("");
    };

    const handleAddPhrase = () => {
        if (!newPhrase.phrase) return;
        const objNewPhrase = { ...newPhrase, id: phrases.length + 1 };
        setPhrases([...phrases, objNewPhrase]);
        setNewPhrase(INITIAL_STATE);
    };

    const handleDeletePhrase = (id: number) => {
        setPhrases(phrases.filter((phrase) => phrase.id !== id));
    };

    const handleFavoritePhrase = (id: number) => {
        setPhrases(
            phrases.map((phrase) =>
                phrase.id === id
                    ? { ...phrase, isFavorite: !phrase.isFavorite }
                    : phrase
            )
        );
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        setVisiblePhrases(4);
    };

    const results = query
        ? fuse
              .search(query)
              .map((res) => res.item)
              .sort((a, b) => Number(b.isFavorite) - Number(a.isFavorite))
        : [...phrases].sort(
              (a, b) => Number(b.isFavorite) - Number(a.isFavorite)
          );

    const visibleResults = results.slice(0, visiblePhrases);

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

    return (
        <main className="h-full w-full min-w-[400px] flex flex-col items-center gap-[3rem] p-8">
            <div className="flex flex-col items-center gap-4">
                <h1 className="flex items-center justify-center max-sm:text-2xl max-md:text-3xl max-lg:text-4xl lg:text-5xl">
                    Bienvenido a la biblioteca de frases!
                </h1>
                <AntTabs
                    className="w-fit"
                    value={tabValue}
                    onChange={handleChangeTab}
                    aria-label="ant example"
                >
                    <AntTab label="Crear" />
                    <AntTab label="Buscar" />
                </AntTabs>
            </div>
            {tabValue ? (
                <RoundedTextField
                    className="w-full max-w-[900px]"
                    type="text"
                    value={query}
                    onChange={handleSearch}
                    placeholder="Buscar en la frase..."
                />
            ) : (
                <CreatePhrase
                    newPhrase={newPhrase}
                    handleAddPhrase={handleAddPhrase}
                    handleChange={handleChange}
                />
            )}

            <section className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
                {visibleResults.map((phrase, index) => (
                    <CardPhrase
                        key={index}
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
                    variant="text"
                    onClick={() => {
                        setIsResetting(true); // 🚀 Bloquea la carga infinita momentáneamente
                        setVisiblePhrases(4); // 🔥 Reinicia las frases visibles
                        window.scrollTo({ top: 0, behavior: "smooth" }); // 🔥 Hace scroll al inicio
                        setTimeout(() => setIsResetting(false), 1000); // ⏳ Reactiva después de 1s
                    }}
                >
                    Mostrar menos
                </Button>
            )}
        </main>
    );
}

export default App;
