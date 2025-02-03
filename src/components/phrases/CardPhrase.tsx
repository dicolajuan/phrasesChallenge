import {
    Card,
    CardMedia,
    CardContent,
    IconButton,
    Modal,
    Box,
    Typography,
    Tooltip,
} from "@mui/material";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import GradeIcon from "@mui/icons-material/Grade";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Phrase } from "@/interface";
import { useState } from "react";

interface CardPhraseProps {
    phrase: Phrase;
    handleFavoritePhrase: (id: number) => void;
    handleDeletePhrase: (id: number) => void;
}

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    boxShadow: 24,
    borderRadius: 4,
    p: 4,
};

const CardPhrase = ({
    phrase,
    handleFavoritePhrase,
    handleDeletePhrase,
}: CardPhraseProps) => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            <Card className={`min-w-[200px] !rounded-2xl hover:cursor-pointer hover:!bg-gray-100 active:scale-95 !transition-all !duration-300 ${phrase.isFavorite ? "!border-2 !border-yellow-400 !shadow-none" : ""}`} onClick={handleOpen}>
                <div className="relative">
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
                    {
                    phrase.isFavorite && <GradeIcon className="!absolute !top-[10px] !right-[15px] bg- cursor-pointer text-yellow-400 hover:text-yellow-600 transition-colors duration-300" />
                    }
                    
                </div>
                    <CardContent className="flex flex-col gap-2 p-4">
                        <div className="line-clamp-3 text-start">
                            {phrase.phrase}
                        </div>
                    </CardContent>
                        
            </Card>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} className="max-sm:w-[calc(100%-20px)] !min-w-[300px]">
                    <div className="flex justify-end !mt-[-25px]">
                        <Tooltip
                            title={`${
                                phrase.isFavorite
                                    ? "Quitar de favoritos"
                                    : "Añadir a favoritos"
                            }`}
                        >
                            <IconButton
                                aria-label="favorites"
                                onClick={() => handleFavoritePhrase(phrase.id)}
                            >
                                {phrase.isFavorite ? (
                                    <GradeIcon className="cursor-pointer text-yellow-400 hover:text-yellow-600 transition-colors duration-300" />
                                ) : (
                                    <StarOutlineIcon className="cursor-pointer text-yellow-600 hover:text-yellow-400 transition-colors duration-300" />
                                )}
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar frase">
                            <IconButton
                                aria-label="delete"
                                onClick={() => handleDeletePhrase(phrase.id)}
                            >
                                <DeleteOutlineIcon className="cursor-pointer text-red-500 hover:text-red-400 transition-colors duration-300" />
                            </IconButton>
                        </Tooltip>
                    </div>
                    <Typography id="modal-modal-description">
                        {phrase.phrase}
                    </Typography>
                </Box>
            </Modal>
        </>
    );
};

export default CardPhrase;
