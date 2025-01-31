import { Box, Button, TextField } from "@mui/material";
import { useMemo, useState } from "react";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import GradeIcon from "@mui/icons-material/Grade";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Phrase } from "./interface";
import Fuse from "fuse.js";

const INITIAL_STATE = {
    id: 0,
    phrase: "",
    isFavorite: false,
};

const options = { keys: ["phrase"], threshold: 0.3 };

function App() {
    const [newPhrase, setNewPhrase] = useState<Phrase>(INITIAL_STATE);
    const [phrases, setPhrases] = useState<Phrase[]>([]);
    const [query, setQuery] = useState("");

    const fuse = useMemo(() => new Fuse(phrases, options), [phrases]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setNewPhrase({ ...newPhrase, phrase: e.target.value });
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
    };

    const results = query
    ? fuse.search(query).map(res => res.item).sort((a, b) => Number(b.isFavorite) - Number(a.isFavorite))
    : [...phrases].sort((a, b) => Number(b.isFavorite) - Number(a.isFavorite));

    return (
        <main className="h-screen w-screen flex flex-col gap-[4rem] p-8">
            <h1
                className="flex items-center justify-center max-sm:text-2xl max-md:text-3xl max-lg:text-4xl lg:text-5xl underline"
            >
                Escriba la frase que quiera guardar
            </h1>
            <section className="flex max-sm:flex-col max-md:items-center sm:flex-row justify-center gap-2 text-center items-center">
                <TextField
                    className="sm:w-1/2 max-sm:w-2/3"
                    id="phrase"
                    value={newPhrase.phrase}
                    onChange={(e) => handleChange(e)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault(); // Evita salto de línea en multiline
                          handleAddPhrase();
                      }
                  }} 
                    placeholder="En la noche de la noche..."
                    maxRows={3}
                    multiline
                />
                <Button
                    className="h-fit "
                    onClick={handleAddPhrase}
                    disabled={!newPhrase.phrase}
                    variant="contained"
                >
                    Guardar
                </Button>
            </section>
            <input
                type="text"
                value={query}
                onChange={handleSearch}
                placeholder="Buscar usuario..."
                className="border p-2"
            />
            <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
                {results.map((phrase, index) => (
                    <Box
                        key={index}
                        className="min-w-[200px] flex flex-col gap-2 border-2 border-black p-4 rounded-2xl"
                    >
                        <div className="flex gap-2 justify-end">
                            {phrase.isFavorite ? (
                                <GradeIcon
                                    className="cursor-pointer text-yellow-400 hover:text-yellow-600 transition-colors duration-300"
                                    onClick={() => handleFavoritePhrase(phrase.id)}
                                />
                            ) : (
                                <StarOutlineIcon
                                    className="cursor-pointer text-yellow-600 hover:text-yellow-400 transition-colors duration-300"
                                    onClick={() => handleFavoritePhrase(phrase.id)}
                                />
                            )}
                            <DeleteOutlineIcon
                                className="cursor-pointer text-red-500 hover:text-red-400 transition-colors duration-300"
                                onClick={() => handleDeletePhrase(phrase.id)}
                            />
                        </div>
                        <div>{phrase.phrase}</div>
                    </Box>
                ))}
            </section>
        </main>
    );
}

export default App;
