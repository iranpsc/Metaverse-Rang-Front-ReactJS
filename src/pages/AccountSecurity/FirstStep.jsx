import { useState } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import styled from "styled-components";
import Button from "../../components/Button";
import { useLanguage } from "../../hooks/useLanguageContext.js";
import useRequest from "../../hooks/useRequest.js";
import { convertToEnglish, getTranslation } from "../../services/Utility";

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
  margin-top: 20px;

  h3,
  p {
    font-size: 16px;
    font-weight: 400;
  }

  h3 {
    color: ${({ theme }) => theme.colors.newColors.shades.title};
  }

  p {
    color: ${({ theme }) => theme.colors.newColors.otherColors.gray};
  }

  input {
    width: 100%;
    margin-top: 20px;
    padding: 14px 18px;
    font-size: 16px;
    border-radius: 5px;
    outline: none;
    color: ${({ theme }) => theme.colors.newColors.shades.title};
    background-color: ${({ theme }) =>
      theme.colors.newColors.otherColors.inputBg};
    border: 1px solid
      ${({ theme }) => theme.colors.newColors.otherColors.inputBg};
  }

  button {
    width: 100%;
    height: 50px;
    margin: 30px 0 15px;
    font-size: 16px;
    border-radius: 5px;
    border-color: transparent;
    cursor: pointer;
    color: ${({ theme }) =>
      theme.colors.newColors.otherColors.secondaryBtnText};
    background-color: ${({ theme }) =>
      theme.colors.newColors.otherColors.secondaryBtn};
  }

  @media (max-width: 768px) {
    margin-top: 0;

    h3,
    p {
      font-size: 14px;
    }

    input {
      margin-top: 10px;
      padding: 10px 14px;
    }

    button {
      height: 44px;
      margin-top: 10px;
      font-size: 14px;
    }
  }
`;

const Field = styled.div`
  position: relative;
  height: fit-content;
`;

const Arrows = styled.div`
  position: absolute;
  top: 28px;
  ${({ $isPersian }) => ($isPersian ? "left" : "right")}: 8px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.newColors.shades.title};

  @media (max-width: 768px) {
    top: 15px;
  }
`;

const Arrow = styled.span`
  display: inline-flex;
  user-select: none;

  svg {
    width: 20px;
    height: 20px;
  }
`;

const MinHint = styled.span`
  position: absolute;
  top: 37px;
  ${({ $isPersian }) => ($isPersian ? "right" : "left")}: 40px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.newColors.shades.title};

  @media (max-width: 768px) {
    top: 24px;
    font-size: 12px;
  }
`;

const FirstStep = ({ setStep, time, setTime }) => {
  const { Request, HTTP_METHOD } = useRequest();
  const isPersian = useLanguage();

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
      Number(previousTime) > MIN_TIME
        ? Number(previousTime) - 1
        : previousTime,
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
      <h3>{getTranslation("858")}</h3>
      <p>{getTranslation("32")}</p>

      <Field>
        <Arrows $isPersian={isPersian}>
          <Arrow onClick={increaseTime}>
            <MdKeyboardArrowUp />
          </Arrow>
          <Arrow onClick={decreaseTime}>
            <MdKeyboardArrowDown />
          </Arrow>
        </Arrows>

        <input
          type="text"
          inputMode="numeric"
          name="time"
          maxLength={2}
          aria-label={getTranslation("858")}
          value={time}
          placeholder={getTranslation("858")}
          onChange={(e) => setTime(normalizeTime(e.target.value))}
        />

        {needsPhone && (
          <input
            type="text"
            inputMode="numeric"
            name="phone"
            maxLength={PHONE_LENGTH}
            value={phone}
            placeholder="09XXXXXXXXX"
            onChange={(e) =>
              setPhone(toDigits(e.target.value).slice(0, PHONE_LENGTH))
            }
          />
        )}

        {time !== "" && (
          <MinHint $isPersian={isPersian}>{getTranslation("33")}</MinHint>
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
