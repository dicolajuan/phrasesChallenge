import React from "react";
import { Button } from "@mui/material";
import { RoundedTextField } from "../common";
import { Phrase } from "@/interface";

interface CreatePhraseProps {
    newPhrase: Phrase;
    handleAddPhrase: () => void;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

const CreatePhrase = ({ newPhrase, handleAddPhrase, handleChange }: CreatePhraseProps) => {
    return (
        <section className="w-full flex max-sm:flex-col max-md:items-center sm:flex-row justify-center gap-2 text-center items-center">
            <RoundedTextField
                className="w-full max-w-[900px]"
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
                className="h-fit"
                onClick={handleAddPhrase}
                disabled={!newPhrase.phrase}
                variant="contained"
                sx={{
                    borderRadius: "30px",
                    backgroundColor: "#6FC5D2",
                    boxShadow: "none",
                    "&:hover": {
                        backgroundColor: "#467A82",
                        boxShadow: "none",
                    },
                }}
            >
                crear
            </Button>
        </section>
    );
};

export default CreatePhrase;
