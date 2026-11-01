// Main image of the mobile gallery: shows the selected image (or a placeholder) with a delete (owner) or report (others) action. Used inside MobileSlider.
import styled from "styled-components";

import PhotoActionButton from "./components/PhotoActionButton.jsx";
import noPic from "../../../../assets/images/nopic.jpg";

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 20px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ActionButton = styled(PhotoActionButton)`
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 1;
`;

const MainSlider = ({ activeImage, deleteHandler, isOwner }) => {
  const imageUrl = activeImage?.url;

  return (
    <Wrapper>
      <img
        loading="lazy"
        src={imageUrl || noPic}
        alt={imageUrl ? "Selected image" : "No image available"}
      />
      {imageUrl && (
        <ActionButton
          image={activeImage}
          isOwner={isOwner}
          onDelete={deleteHandler}
        />
      )}
    </Wrapper>
  );
};

export default MainSlider;
