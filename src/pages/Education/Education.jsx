import FullModal from "../../components/Modal/FullModal";
import Content from "./Content";
import Footer from "./Footer";
import Video from "./Video";
import styled from "styled-components";

const DIV = styled.button`
  display: flex;
  flex-direction: column;
  border: none;
  justify-content: space-between;
`;
const EDUCATION_MODAL_SIZE = { width: 550, height: 550 };

const Education = ({
  setOpenEducation,
  adviserData,
  title,
  overlayZIndex = 2147483646,
}) => {
  return (
    <FullModal
      onClose={() => setOpenEducation(false)}
      size={EDUCATION_MODAL_SIZE}
      overlayZIndex={overlayZIndex}
      title={title}
    >
      {({ isFullscreen }) => (
        <DIV>
          <div>
            <Video isFullscreen={isFullscreen} video={adviserData?.video} />
            <Content data={adviserData} />
          </div>
          <Footer data={adviserData} />
        </DIV>
      )}
    </FullModal>
  );
};

export default Education;
