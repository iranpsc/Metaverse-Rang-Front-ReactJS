import { useState } from "react";
import FullModal from "../../components/Modal/FullModal";
import Content from "./Content";
import Footer from "./Footer";
import Video from "./Video";

const EDUCATION_MODAL_SIZE = { width: 550, height: 550 };

const Education = ({ setOpenEducation, adviserData }) => {
  const [show, setShow] = useState(false);

  return (
    <FullModal
      onClose={() => setOpenEducation(false)}
      size={EDUCATION_MODAL_SIZE}
      overlayZIndex={100002}
    >
      {({ isFullscreen }) => (
        <>
          <Video isFullscreen={isFullscreen} video={adviserData?.video} />

          {!isFullscreen && (
            <>
              <Content show={show} setShow={setShow} data={adviserData} />
              <Footer show={show} data={adviserData} />
            </>
          )}
        </>
      )}
    </FullModal>
  );
};

export default Education;
