// این کامپوننت مناسب نمایش پیام موفقیت خطا یا در حال بررسی در بالای کامپوننت در هر مدال است
import styled from "styled-components";
import { BsFillExclamationOctagonFill } from "react-icons/bs";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { AiOutlineClockCircle } from "react-icons/ai";

const ALERT_TYPES = {
  success: { color: "#18C08F", Icon: IoIosCheckmarkCircle },
  error: { color: "#C30000", Icon: BsFillExclamationOctagonFill },
  pending: { color: "#FFA500", Icon: AiOutlineClockCircle },
};

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 5px;
  padding: 10px;
  margin-bottom: 30px;
  border-radius: 5px;
  background-color: ${({ theme }) =>
    theme.colors.newColors.otherColors.inputBg};
  border: 1px solid ${({ $color }) => $color};

  svg {
    font-size: 40px;
    color: ${({ $color }) => $color};
  }
`;

const Content = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;

const Text = styled.p`
  font-weight: ${({ $isInfo }) => ($isInfo ? 700 : "normal")};
  color: ${({ $isInfo, theme }) =>
    $isInfo ? "#C30000" : theme.colors.newColors.otherColors.iconText};
`;

const ActionButton = styled.button`
  padding: 10px 22px;
  border: none;
  border-radius: 10px;
  background-color: #e9e9e9;
  font: inherit;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.newColors.shades.title};
  cursor: pointer;
`;

const Alert = ({ type = "success", text, info, buttonText, onclick }) => {
  const { color, Icon } = ALERT_TYPES[type] ?? ALERT_TYPES.success;
  const isError = type === "error";

  return (
    <Container $color={color}>
      <Content>
        <Icon />
        <div>
          {isError && info && <Text $isInfo>{info}</Text>}
          <Text>{text}</Text>
        </div>
      </Content>

      {isError && (
        <ActionButton type="button" onClick={onclick}>
          {buttonText}
        </ActionButton>
      )}
    </Container>
  );
};

export default Alert;