import React from "react";
// import { Button } from "@mui/material";
import { RoundedTextField } from "../common";
import { Phrase } from "@/interface";
// import BorderColorIcon from '@mui/icons-material/BorderColor';
// import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

interface CreatePhraseProps {
    newPhrase: Phrase;
    handleAddPhrase: () => void;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    inputRef?: React.Ref<HTMLInputElement>;
};

const CreatePhrase = ({ newPhrase, handleAddPhrase, handleChange, inputRef }: CreatePhraseProps) => {
    return (
        <section className="w-full flex max-sm:flex-col max-md:items-center sm:flex-row justify-center gap-2 text-center items-center">
            <RoundedTextField
                className="w-full max-w-[900px]"
                id="phrase"
                value={newPhrase.phrase}
                inputRef={inputRef}
                onChange={(e) => handleChange(e)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault(); // Evita salto de línea en multiline
                        handleAddPhrase();
                    }
                }}
                placeholder="Presione Enter para guardar la frase"
                multiline
            />
        </section>
    );
};

export default CreatePhrase;
