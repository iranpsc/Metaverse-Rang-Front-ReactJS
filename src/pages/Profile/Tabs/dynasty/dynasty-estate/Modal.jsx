import Button from "../../../../../components/Button";
import styled from "styled-components";
import { getTranslation } from "../../../../../services/Utility";
import { ExitIcon } from "../../../../../components/Icons/IconsHeader";
const BackGround = styled.div`
  z-index: 999;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(5px);
  background-color: rgba(0, 0, 0, 0.713);
`;

const ModalBody = styled.div`
  border-radius: 10px;
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.inputBg};
  overflow-y: auto;
  padding: 20px;
  width: 700px;
  max-height: 577px;

  p {
    color: ${(props) => props.theme.colors.newColors.shades.title};
    font-weight: 400;
    font-size: 14px;
    line-height: 28px;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;
  margin-bottom: 20px;

  span {
    font-size: 24px;
    font-weight: 600;
    color: ${(props) => props.theme.colors.newColors.shades.title};
  }
`;

const Buttons = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-top: 30px;
`;
const Modal = ({ setModal, onConfirm, elapsed }) => {

  const getDisplayTime = () => {
    if (!elapsed || isNaN(elapsed.days)) return null;

    // اگر 30 روز یا بیشتر گذشته، همان مقدار اصلی
    if (elapsed.days >= 30) {
      return elapsed;
    }

    // تبدیل زمان سپری‌شده به ثانیه
    const elapsedSeconds =
      elapsed.days * 24 * 60 * 60 +
      elapsed.hours * 60 * 60 +
      elapsed.minutes * 60 +
      (elapsed.seconds || 0);

    // 30 روز بر حسب ثانیه
    const thirtyDaysSeconds = 30 * 24 * 60 * 60;

    // زمان باقی‌مانده
    const remainingSeconds = Math.max(
      0,
      thirtyDaysSeconds - elapsedSeconds
    );

    return {
      days: Math.floor(remainingSeconds / (24 * 60 * 60)),
      hours: Math.floor(
        (remainingSeconds % (24 * 60 * 60)) / (60 * 60)
      ),
      minutes: Math.floor(
        (remainingSeconds % (60 * 60)) / 60
      ),
      seconds: remainingSeconds % 60,
    };
  };

  const displayTime = getDisplayTime();

  return (
    <BackGround>
      <ModalBody>
        <Header>
          <span>{getTranslation("122")}</span>
          <ExitIcon onClick={() => setModal(false)}>X</ExitIcon>
        </Header>

        {displayTime ? (
          <p>{getTranslation(1439)}</p>
        ) : (
          <p>
            {getTranslation(821)}
            {displayTime.days} {getTranslation(380)},
            {displayTime.hours} {getTranslation(560)},
            {displayTime.minutes} {getTranslation(33)}
            {getTranslation(1409)}
          </p>
        )}

        <Buttons>
          <Button
            label={getTranslation("823")}
            color="#18C08F"
            onclick={onConfirm}
            fit
            textColor="#D7FBF0"
          />

          <Button
            label={getTranslation("824")}
            color="#C30000"
            onClick={() => setModal(false)}
            fit
            textColor="#FFFFFF"
          />
        </Buttons>
      </ModalBody>
    </BackGround>
  );
};
export default Modal;
