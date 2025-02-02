import { Card, CardMedia, CardContent, IconButton } from '@mui/material'
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import GradeIcon from "@mui/icons-material/Grade";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Phrase } from '@/interface';

interface CardPhraseProps {
    phrase: Phrase;
    handleFavoritePhrase: (id: number) => void;
    handleDeletePhrase: (id: number) => void;
}

const CardPhrase = ({ phrase, handleFavoritePhrase, handleDeletePhrase }: CardPhraseProps) => {
  return (
    <Card
    className="min-w-[200px] !rounded-2xl"
>
    <CardMedia
        component="img"
        alt="background"
        image="/bg-cards.webp"
        sx={{ objectFit: "cover", height: "120px", opacity: 0.7 }}
    />
    <CardContent className="flex flex-col gap-2 p-4">
        <div className="flex gap-2 justify-end">
            <IconButton aria-label="favorites">
                {phrase.isFavorite ? (
                    <GradeIcon
                        className="cursor-pointer text-yellow-400 hover:text-yellow-600 transition-colors duration-300"
                        onClick={() =>
                            handleFavoritePhrase(phrase.id)
                        }
                    />
                ) : (
                    <StarOutlineIcon
                        className="cursor-pointer text-yellow-600 hover:text-yellow-400 transition-colors duration-300"
                        onClick={() =>
                            handleFavoritePhrase(phrase.id)
                        }
                    />
                )}
            </IconButton>
            <IconButton aria-label="delete">
                <DeleteOutlineIcon
                    className="cursor-pointer text-red-500 hover:text-red-400 transition-colors duration-300"
                    onClick={() =>
                        handleDeletePhrase(phrase.id)
                    }
                />
            </IconButton>
        </div>
        <div className="line-clamp-3">{phrase.phrase}</div>
    </CardContent>
</Card>
  )
}

export default CardPhrase