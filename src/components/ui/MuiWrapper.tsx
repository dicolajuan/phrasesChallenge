import { styled } from "@mui/material/styles";
import { Card, IconButton, Modal, Box } from "@mui/material";

interface StyledCardProps {
    isFavorite?: boolean;
}

export const StyledCard = styled(Card, {
    shouldForwardProp: (prop) => prop !== 'isFavorite',
})<StyledCardProps>`
    && {
        box-shadow: ${({ isFavorite }) =>
            isFavorite ? "none" : "0px 2px 4px rgba(0, 0, 0, 0.1)"};

        background-color: #fff;

        transition: all 0.3s;

        border-radius: 1rem;

        min-width: 200px;

        &:hover {
            background-color: rgb(243 244 246); /* gray-100 */
            cursor: pointer;
        }

        &:active {
            transform: scale(0.95);
        }

        ${({ isFavorite }) =>
            isFavorite &&
            `

        border: 2px solid rgb(250 204 21); /* yellow-400 */

      `}
    }
`;

export const StyledIconButton = styled(IconButton)`
    && {
        padding: 4px;
        transition: all 0.3s;
    }
`;

export const StyledModal = styled(Modal)`
    && {
        display: flex;
        align-items: center;
        justify-content: center;
    }
`;

export const StyledModalBox = styled(Box)`
    && {
        background-color: #fff;
        border-radius: 1rem;
        /* padding: 2rem; */
        outline: none;
        overflow: hidden
    }
`;
