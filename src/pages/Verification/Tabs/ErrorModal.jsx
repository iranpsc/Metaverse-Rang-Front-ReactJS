// مدال نمایش لیست خطاهای احراز هویت (عنوان، توضیح و لیست اسکرول‌دار خطاها)؛ مناسب بعد از رد شدن یا ناقص بودن مدارک در تب احراز هویت

import styled from "styled-components";
import ErrorItem from "./ErrorItem";
import ModalXs from "../../../components/Modal/ModalXs";
import { getTranslation } from "../../../services/Utility";
import TitleBody from "../../../components/TitleBody";

const Errors = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 197px;
  padding-right: 15px;
  padding-top: 20px;
  overflow-y: auto;
`;

const ErrorModal = ({ setOpenErrorModal, errors }) => {
  const close = () => setOpenErrorModal(false);

  return (
    <ModalXs
      global
      title={883}
      onlyExit
      handleExitClick={close}
      onClose={close}
    >
      <TitleBody title={getTranslation("881")} />

      <Errors>
        {errors?.map((item, index) => (
          <ErrorItem key={`error-${index}`} item={item} />
        ))}
      </Errors>
    </ModalXs>
  );
};

export default ErrorModal;
