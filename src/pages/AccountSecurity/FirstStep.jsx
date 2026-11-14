import { useState } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import styled from "styled-components";
import Button from "../../components/Button";
import useRequest from "../../hooks/useRequest.js";
import { convertToEnglish, getTranslation } from "../../services/Utility";
import TitleHeader from "../../components/TitleHeader.jsx";
import TitleBody from "../../components/TitleBody.jsx";
import LabeledInput from "../../components/LabeledInput.jsx";
const MIN_TIME = 5;
const MAX_TIME = 60;
const PHONE_LENGTH = 11;
const VALIDATION_ERROR_STATUS = 422;

const toDigits = (value) => convertToEnglish(value).replace(/\D/g, "");

const normalizeTime = (value) => {
  const digits = toDigits(value);
  if (!digits) return "";

  const number = parseInt(digits, 10);

  if (number < MIN_TIME) {
    if (digits.length >= 2) return MIN_TIME;
    return number === 0 ? "" : number;
  }

  return Math.min(number, MAX_TIME);
};

const Container = styled.form`
  button {
    margin-top: 30px;
    margin-bottom: 10px;

    width: 100%;
    border-color: transparent;
    cursor: pointer;
    color: ${({ theme }) =>
      theme.colors.newColors.otherColors.secondaryBtnText};
    background-color: ${({ theme }) =>
      theme.colors.newColors.otherColors.secondaryBtn};
    @media (max-width: 1024px) {
      margin-top: 10px;
      margin-bottom: 0px;
    }
  }
`;

const Field = styled.div`
  position: relative;
  height: fit-content;

  > div {
    margin-top: 20px;
  }

  @media (max-width: 768px) {
    > div {
      margin-top: 10px;
    }
  }
`;

const Arrows = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.newColors.shades.title};
  pointer-events: auto;
`;

const Arrow = styled.span`
  display: inline-flex;
  user-select: none;

  svg {
    width: 20px;
    height: 20px;
  }

  @media (max-width: 1024px) {
    svg {
      width: 17px;
      height: 17px;
    }
  }
`;

const MinHint = styled.span`
  font-size: 14px;
  margin-top: 1.5px;
  color: ${({ theme }) => theme.colors.newColors.shades.title};
  white-space: nowrap;

  @media (max-width: 1024px) {
    font-size: 12px;
    margin-top: 0px;
  }
`;

const FirstStep = ({ setStep, time, setTime }) => {
  const { Request, HTTP_METHOD } = useRequest();

  const [loading, setLoading] = useState(false);
  const [needsPhone, setNeedsPhone] = useState(false);
  const [phone, setPhone] = useState("");

  const numericTime = Number(time);
  const isTimeValid =
    Number.isInteger(numericTime) &&
    numericTime >= MIN_TIME &&
    numericTime <= MAX_TIME;
  const isPhoneValid = !needsPhone || phone.length === PHONE_LENGTH;
  const isSubmitDisabled = !isTimeValid || !isPhoneValid;

  const increaseTime = () => {
    setTime((previousTime) =>
      previousTime === "" || previousTime == null
        ? MIN_TIME
        : Math.min(MAX_TIME, Math.max(MIN_TIME, Number(previousTime) + 1)),
    );
  };

  const decreaseTime = () => {
    setTime((previousTime) =>
      Number(previousTime) > MIN_TIME ? Number(previousTime) - 1 : previousTime,
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading || !isTimeValid || !isPhoneValid) return;

    const sendTime = Math.min(MAX_TIME, Math.max(MIN_TIME, numericTime));
    if (sendTime !== numericTime) setTime(sendTime);

    setLoading(true);

    try {
      await Request(
        "account/security",
        HTTP_METHOD.POST,
        needsPhone ? { phone, time: sendTime } : { time: sendTime },
      );

      setStep(2);
    } catch (error) {
      if (error?.response?.status === VALIDATION_ERROR_STATUS) {
        setNeedsPhone(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container onSubmit={handleSubmit}>
      <TitleHeader noMargin title={getTranslation("858")} />
      <TitleBody gray title={getTranslation(32)} />

      <Field>
        <LabeledInput
          type="number"
          name="time"
          maxLength={2}
          value={time}
          placeholder={getTranslation("858")}
          onChange={(e) => setTime(normalizeTime(e.target.value))}
          unit={time !== "" && <MinHint>{getTranslation("33")}</MinHint>}
          prefixWidth={24}
          prefixSide="end"
          prefix={
            <Arrows>
              <Arrow onClick={increaseTime}>
                <MdKeyboardArrowUp />
              </Arrow>
              <Arrow onClick={decreaseTime}>
                <MdKeyboardArrowDown />
              </Arrow>
            </Arrows>
          }
        />

        {needsPhone && (
          <LabeledInput
            type="number"
            name="phone"
            maxLength={PHONE_LENGTH}
            value={phone}
            placeholder="09XXXXXXXXX"
            onChange={(e) =>
              setPhone(toDigits(e.target.value).slice(0, PHONE_LENGTH))
            }
          />
        )}
      </Field>

      <Button
        type="submit"
        label={getTranslation("859")}
        disabled={loading ? "pending" : isSubmitDisabled}
      />
    </Container>
  );
};

export default FirstStep;
