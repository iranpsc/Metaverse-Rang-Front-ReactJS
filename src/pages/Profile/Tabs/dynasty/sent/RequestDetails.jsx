import Button from "../../../../../components/Button";
import MemberCard from "./MemberCard";
import { getTranslation, ToastError, ToastSuccess, SanitizeHTML, ConvertJalali, convertToPersian } from "../../../../../services/Utility";
import styled from "styled-components";
import ModalLg from "../../../../../components/Modal/ModalLg";
import useRequest from "../../../../../services/Hooks/useRequest";
const Container = styled.div`
  max-height: 100%;
  overflow-y: auto;
  padding: 5px;
padding-bottom: 40px;
`;
const Buttons = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-top: 30px;
`;

const Texts = styled.div`

padding-top: 30px;
    color: ${(props) => props.theme.colors.newColors.shades.title};
    font-size: 16px;
    font-weight: 400;
    &:last-of-type {
      font-weight: 600;
      color: ${(props) => props.theme.colors.newColors.otherColors.title};
    }
  
`;

const RequestDetails = ({
  setShowDetails,
  status,
  code,
  date,
  time, setRows,
  data,
  type,
}) => {
  const { Request, HTTP_METHOD } = useRequest();
  const handleReject = () => {
    Request(`dynasty/requests/recieved/${data.id}`, HTTP_METHOD.DELETE)
      .then(() => {
        ToastSuccess(getTranslation(1852));
        setRows((prev) => prev.filter((row) => row.id !== data.id));

        setShowDetails(false)
      })
      .catch((error) => {

        ToastError(error.response.data.message);
      });
  };
  const handleCancel = () => {
    Request(`dynasty/requests/sent/${data.id}`, HTTP_METHOD.DELETE)
      .then(() => {
        ToastSuccess(getTranslation(1853));
        setRows((prev) => prev.filter((row) => row.id !== data.id));
        setShowDetails(false);
      })
      .catch((error) => {
        ToastError(error.response.data.message);
      });
  };
  const handleAccept = () => {
    Request(`dynasty/requests/recieved/${data.id}`, HTTP_METHOD.POST)
      .then(() => {
        ToastSuccess(getTranslation(1854));
        setRows((prev) => prev.filter((row) => row.id !== data.id));

        setShowDetails(false)
      })
      .catch((error) => {

        ToastError(error.response.data.message);
      });
  };
  const isSendType = type === "sent" ? true : false;
  return (
    <ModalLg
      setShowModal={setShowDetails}
      titleId={isSendType ? "113" : "114"}
    >
      <Container>
        <MemberCard
          status={status}
          date={ConvertJalali(date)}
          time={convertToPersian(time)}
          code={code}
          name={data.from_user.name}
          image={data?.from_user?.profile_photo}
        />

        <Texts>
          {SanitizeHTML(data.message)}
        </Texts>

        <Buttons>
          {data?.status === 0 && !isSendType && (
            <Button
              label={getTranslation(823)}
              color="#18C08F"
              onClick={handleAccept}
              fit
              textColor="#D7FBF0"
            />
          )}
          {data?.status === 0 && (<Button
            label={!isSendType ? getTranslation(824) : getTranslation(833)}
            color="#C30000"
            onClick={!isSendType ? handleReject : handleCancel}
            fit
            textColor="#FFFFFF"
          />)}

        </Buttons>
      </Container>
    </ModalLg>
  );
};

export default RequestDetails;
