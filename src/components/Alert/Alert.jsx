// این کامپوننت مناسب نمایش پیام موفقیت، خطا، در حال بررسی یا اخطار (انجام یک مرحله‌ی قبلی) در بالای کامپوننت در هر مدال یا صفحه است؛ در حالت error و warning می‌تواند دکمه‌ی اقدام داشته باشد (با to هدایت می‌کند یا onClick را اجرا می‌کند)؛ با پراپ blocking همه‌ی المان‌های بعد از خودش در همان والد کم‌رنگ و غیرقابل کلیک می‌شوند

import styled, { css } from "styled-components";
import { useNavigate } from "react-router";
import { AiFillWarning, AiOutlineClockCircle } from "react-icons/ai";
import { BsFillExclamationOctagonFill } from "react-icons/bs";
import { IoIosCheckmarkCircle } from "react-icons/io";
import Button from "../Button";

const ALERT_TYPES = {
  success: { color: "#18C08F", Icon: IoIosCheckmarkCircle },
  error: { color: "#C30000", Icon: BsFillExclamationOctagonFill },
  pending: { color: "#FFA500", Icon: AiOutlineClockCircle },
  warning: { color: "#FFC700", Icon: AiFillWarning },
};

// نوع‌هایی که متن تأکیدی (info) بالای متن اصلی نشان می‌دهند
const TYPES_WITH_INFO = ["error", "warning"];

// المان‌های بعد از Alert در همان والد غیرفعال می‌شوند
const blockingStyles = css`
  & ~ * {
    opacity: 0.35;
    pointer-events: none;
    user-select: none;
  }
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 5px;
  padding: 10px;
  border: 1px solid ${({ $color }) => $color};
  border-radius: 5px;
  background-color: ${({ theme }) =>
    theme.colors.newColors.otherColors.inputBg};

  svg {
    flex-shrink: 0;
    font-size: 40px;
    color: ${({ $color }) => $color};
  }

  ${({ $blocking }) => $blocking && blockingStyles}
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const Text = styled.p`
  font-weight: ${({ $isInfo }) => ($isInfo ? 700 : "normal")};
  color: ${({ $isInfo, $color, theme }) =>
    $isInfo ? $color : theme.colors.newColors.otherColors.iconText};
`;

const Action = styled.div`
  flex-shrink: 0;
`;

const Alert = ({
  type = "success",
  text,
  info,
  buttonText,
  to, // مسیری که دکمه به آن هدایت می‌کند
  state, // state ناوبری (مثلاً { from: pathname } برای برگشت بعد از بستن مدال)

  onClick,
  onclick,
  blocking = false, // المان‌های بعد از Alert در همان والد غیرفعال شوند
}) => {
  const navigate = useNavigate();
  const { color, Icon } = ALERT_TYPES[type] ?? ALERT_TYPES.success;

  const handleAction = onClick ?? onclick;
  const showInfo = info && TYPES_WITH_INFO.includes(type);
  const showAction = Boolean(buttonText) && (to || handleAction);

  const handleClick = (e) => {
    handleAction?.(e);
    if (to) navigate(to, { state });
  };

  return (
    <Container $color={color} $blocking={blocking}>
      <Content>
        <Icon />
        <div>
          {showInfo && (
            <Text $isInfo $color={color}>
              {info}
            </Text>
          )}
          <Text>{text}</Text>
        </div>
      </Content>

      {showAction && (
        <Action>
          <Button color="#e9e9e9" label={buttonText} onClick={handleClick} />
        </Action>
      )}
    </Container>
  );
};

export default Alert;
