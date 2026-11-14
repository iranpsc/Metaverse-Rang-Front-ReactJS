// Round action button on a photo: delete for the photo's owner, report for everyone else. Used on album thumbnails and inside the gallery slider (desktop and mobile).
import { HiOutlineTrash } from "react-icons/hi";
import { IoWarningOutline } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router";
import styled from "styled-components";

import { getTranslation } from "../../../../../services/Utility";

const SIZES = {
  sm: { box: 24, icon: 17 },
  md: { box: 36, icon: 20 },
};

const Button = styled.button`
  display: flex;
  width: ${({ $size }) => SIZES[$size].box}px;
  height: ${({ $size }) => SIZES[$size].box}px;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;

  svg {
    color: ${({ theme }) => theme.colors.newColors.shades.bg2};
    font-size: ${({ $size }) => SIZES[$size].icon}px;
  }
`;

const PhotoActionButton = ({
  image,
  isOwner,
  onDelete,
  size = "md",
  className,
}) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleClick = () =>
    isOwner
      ? onDelete(image.id)
      : navigate("/report/send", {
          state: { from: pathname, title: "photoReport", photo: image.url },
        });

  return (
    <Button
      type="button"
      className={className}
      $size={size}
      aria-label={isOwner ? getTranslation("738") : "Report image"}
      onClick={handleClick}
    >
      {isOwner ? <HiOutlineTrash /> : <IoWarningOutline />}
    </Button>
  );
};

export default PhotoActionButton;