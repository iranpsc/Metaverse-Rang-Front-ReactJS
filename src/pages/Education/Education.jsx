import FullModal from "../../components/Modal/FullModal";
import Content from "./Content";
import Footer from "./Footer";
import Video from "./Video";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  background-color: ${({ theme }) => theme.colors.newColors.shades.bg2};
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
`;

const EDUCATION_MODAL_SIZE = {
  width: 550,
  height: "auto",
  mobileHeight: "auto",
};

const Education = ({
  setOpenEducation,
  adviserData,
  title,
  overlayZIndex = 2147483646,
}) => (
  <FullModal
    onClose={() => setOpenEducation(false)}
    size={EDUCATION_MODAL_SIZE}
    overlayZIndex={overlayZIndex}
    title={title}
  >
    {({ isFullscreen }) => (
      <Wrapper>
        <Body>
          <Video isFullscreen={isFullscreen} video={adviserData?.video} />
          <Content data={adviserData} isFullscreen={isFullscreen} />
        </Body>
        <Footer data={adviserData} />
      </Wrapper>
    )}
  </FullModal>
);

export default Education;
