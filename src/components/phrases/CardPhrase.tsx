import { useState, useCallback } from "react";
import { Typography, Tooltip, CardMedia } from "@mui/material";
import {
    StyledCard,
    StyledIconButton,
    StyledModal,
    StyledModalBox,
} from "../ui/MuiWrapper";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import GradeIcon from "@mui/icons-material/Grade";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Phrase } from "@/interface";
import React from "react";
interface CardPhraseProps {
    phrase: Phrase;
    handleFavoritePhrase: (id: number) => void;
    handleDeletePhrase: (id: number) => void;
}

const CardPhrase = ({
    phrase,
    handleFavoritePhrase,
    handleDeletePhrase,
}: CardPhraseProps) => {
    const [open, setOpen] = useState<boolean>(false);

    const handleOpen = useCallback(() => setOpen(true), []);
    const handleClose = useCallback(() => setOpen(false), []);

    const onFavoriteClick = useCallback(
        (event: React.MouseEvent) => {
            event.stopPropagation();
            handleFavoritePhrase(phrase.id);
        },
        [handleFavoritePhrase, phrase.id]
    );

    const onDeleteClick = useCallback(
        (event: React.MouseEvent) => {
            event.stopPropagation();
            handleDeletePhrase(phrase.id);
        },
        [handleDeletePhrase, phrase.id]
    );

    return (
        <>
            <StyledCard
                isFavorite={phrase.isFavorite}
                onClick={handleOpen}
                role="button"
                aria-label="Abrir detalles de la frase"
            >
                <div className="relative felx">
                    <CardMedia
                        component="img"
                        alt="background"
                        image="/bg-cards.webp"
                        sx={{
                            objectFit: "cover",
                            height: "120px",
                            opacity: 0.7,
                        }}
                    />
                    {phrase.isFavorite && (
                        <GradeIcon
                            className="absolute top-[10px] right-[15px] text-yellow-400 hover:text-yellow-600"
                            aria-label="Frase favorita"
                            data-testid="favorite-icon"
                        />
                    )}
                    <Typography
                        className="text-gray-800"
                        data-testid="phrase-text"
                        sx={{
                            paddingY: ".5rem",
                            paddingX: "1rem",
                            textAlign: "left",
                        }}
                    >
                        {phrase.phrase}
                    </Typography>
                </div>
            </StyledCard>

            <StyledModal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-phrase-title"
                aria-describedby="modal-phrase-description"
            >
                <StyledModalBox className="max-sm:w-[calc(100%-20px)] min-w-[300px] max-w-[500px] relative">
                    <CardMedia
                        component="img"
                        alt="background"
                        image="/bg-cards.webp"
                        sx={{
                            objectFit: "cover",
                            height: "120px",
                            width: "100%",
                            opacity: 0.7,
                        }}
                    />
                    <div className="absolute top-2 right-[2px]">
                        <Tooltip
                            title={
                                phrase.isFavorite
                                    ? "Quitar de favoritos"
                                    : "Añadir a favoritos"
                            }
                        >
                            <StyledIconButton
                                aria-label={
                                    phrase.isFavorite
                                        ? "Quitar de favoritos"
                                        : "Añadir a favoritos"
                                }
                                onClick={onFavoriteClick}
                                className="hover:bg-gray-100"
                                data-testid="favorite-button"
                            >
                                {phrase.isFavorite ? (
                                    <GradeIcon className="text-yellow-400 hover:text-yellow-600" />
                                ) : (
                                    <StarOutlineIcon className="text-yellow-400 hover:text-yellow-600" />
                                )}
                            </StyledIconButton>
                        </Tooltip>

                        <Tooltip title="Eliminar frase">
                            <StyledIconButton
                                aria-label="Eliminar frase"
                                onClick={onDeleteClick}
                                className="hover:bg-gray-100"
                            >
                                <DeleteOutlineIcon className="text-red-500 hover:text-red-400" />
                            </StyledIconButton>
                        </Tooltip>
                    </div>

                    <Typography
                        id="modal-phrase-description"
                        component="p"
                        className="mt-4 p-4 text-gray-800"
                    >
                        {phrase.phrase}
                    </Typography>
                </StyledModalBox>
            </StyledModal>
        </>
    );
};

export default React.memo(CardPhrase, (prevProps, nextProps) => {
    return (
        prevProps.phrase.id === nextProps.phrase.id &&
        prevProps.phrase.phrase === nextProps.phrase.phrase &&
        prevProps.phrase.isFavorite === nextProps.phrase.isFavorite
    );
});
