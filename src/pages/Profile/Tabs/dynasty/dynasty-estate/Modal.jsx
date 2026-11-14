// مدال تایید یک عملیات که به زمان سپری‌شده وابسته است: اگر هنوز ۳۰ روز نگذشته باشد زمان باقی‌مانده را نشان می‌دهد و در غیر این صورت پیام عادی تایید را؛ elapsed را از GetTimeElapsed می‌گیرد؛ مناسب هر جایی که کاربر قبل از انجام کار باید تایید بدهد

import styled from "styled-components";
import Button from "../../../../../components/Button";
import ModalXs from "../../../../../components/Modal/ModalXs";
import {
  convertToPersian,
  getTranslation,
} from "../../../../../services/Utility";
import TitleBody from "../../../../../components/TitleBody";
const WAIT_DAYS = 30;
const SECONDS_IN_DAY = 24 * 60 * 60;

// زمان باقی‌مانده تا ۳۰ روز؛ اگر داده‌ی زمان نیست یا ۳۰ روز گذشته باشد null برمی‌گرداند
const getRemainingTime = (elapsed) => {
  if (!elapsed || Number.isNaN(elapsed.days)) return null;

  const elapsedSeconds =
    elapsed.days * SECONDS_IN_DAY +
    elapsed.hours * 3600 +
    elapsed.minutes * 60 +
    (elapsed.seconds || 0);
  const remaining = WAIT_DAYS * SECONDS_IN_DAY - elapsedSeconds;

  if (remaining <= 0) return null;

  return {
    days: Math.floor(remaining / SECONDS_IN_DAY),
    hours: Math.floor((remaining % SECONDS_IN_DAY) / 3600),
    minutes: Math.floor((remaining % 3600) / 60),
  };
};

const Buttons = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-top: 30px;
`;

const Modal = ({ setModal, onConfirm, elapsed }) => {
  const close = () => setModal(false);
  const remaining = getRemainingTime(elapsed);
  const mssg = remaining
    ? `${getTranslation(821)} ${convertToPersian(remaining.days)} ${getTranslation(380)}, ${convertToPersian(remaining.hours)} ${getTranslation(560)}, ${convertToPersian(remaining.minutes)} ${getTranslation(33)} ${getTranslation(1409)}`
    : getTranslation(1439);
  return (
    <ModalXs global title={122} handleExitClick={close} onClose={close}>
      <TitleBody title={mssg} />
      <Buttons>
        <Button
          fit
          color="#18C08F"
          textColor="#D7FBF0"
          label={getTranslation("823")}
          onClick={onConfirm}
        />
        <Button
          fit
          color="#C30000"
          textColor="#FFFFFF"
          label={getTranslation("824")}
          onClick={close}
        />
      </Buttons>
    </ModalXs>
  );
};

export default Modal;
