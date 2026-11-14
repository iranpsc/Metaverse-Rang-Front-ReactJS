import styled from "styled-components";
import loader from "../../../../assets/gif/loader.svg";
import { getTranslation } from "../../../../services/Utility";
import FullModal from "../../../../components/Modal/FullModal";
import TitleHeader from "../../../../components/TitleHeader";
const Loader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  justify-content: center;
  gap: 20px;
  height: 100%;
`;

const LoadingModal = ({ isMobile, setOpen, open = true }) => (
  <FullModal
    open={open}
    onClose={() => setOpen(false)}
    size={isMobile ? "md" : "xl"}
    title={5151}
    loading
  >
    <Loader>
      <img src={loader} width={130} height={130} alt="loader" />
      <TitleHeader title={getTranslation(552)} />
    </Loader>
  </FullModal>
);

export default LoadingModal;
