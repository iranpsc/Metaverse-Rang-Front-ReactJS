
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import useRequest from "../../services/Hooks/useRequest";
import { setItem } from "../../services/Utility/LocalStorage";
import {
  getTranslation,
  ToastError,
  formatTime,
  convertToPersian,
  convertToEnglish,
} from "../../services/Utility";
import Button from "../../components/Button";

const CODE_LENGTH = 6;
const INITIAL_TIMER = 2 * 60;
const EMPTY_CODE = () => Array(CODE_LENGTH).fill("");

const normalizeDigits = (value) =>
  convertToEnglish(String(value ?? ""))
    .replace(/[٠-٩]/g, (digit) =>
      String("٠١٢٣٤٥٦٧٨٩".indexOf(digit))
    )
    .replace(/\D/g, "");

const Codes = styled.div`
  display: flex;
  gap: 10px;
  margin: 0 auto;
  direction: ltr;
  margin-bottom: 30px !important;

  input {
    width: 30px;
    height: 50px;
    font-size: 16px;
    padding: 12px;
    text-align: center;
    border-radius: 5px;
    border: 1px solid
      ${(props) => props.theme.colors.newColors.otherColors.inputBorder};
    color: ${(props) => props.theme.colors.newColors.shades.title};
    font-weight: 400;
    outline: none;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @media (min-width: 1024px) {
    input {
      width: 60px;
      height: 60px;
      font-size: 16px;
    }
  }
`;

const Container = styled.div`
  margin-top: 20px;

  h3 {
    color: ${(props) => props.theme.colors.newColors.shades.title};
    font-size: 16px;
    font-weight: 400;
  }

  p {
    color: ${(props) => props.theme.colors.newColors.shades.title};
    font-size: 16px;
    font-weight: 400;
  }

  input {
    border-radius: 5px;
    background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.inputBg};
    border: 1px solid
      ${(props) => props.theme.colors.newColors.otherColors.inputBorder};
    padding: 14px 18px 14px 18px;
    outline: none;
    width: 93%;
    color: ${(props) => props.theme.colors.newColors.shades.title};
    margin-top: 20px;

    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }

  button {
    border-radius: 5px;
    height: 50px;
    width: 100%;
    background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.secondaryBtn};
    border: 1px solid
      ${(props) => props.theme.colors.newColors.otherColors.secondaryBtnBorder};
    margin-top: 30px;
    margin-bottom: 15px;
    color: ${(props) =>
    props.theme.colors.newColors.otherColors.secondaryBtnText};
    cursor: pointer;
  }

  div {
    display: flex;
    align-items: center;
    font-size: 15px;
    text-align: center;
    width: fit-content;
    margin: 0 auto;

    h4 {
      color: #008bf8;
      margin-left: 5px;
    }

    span {
      color: #969696;
    }

    h2 {
      font-size: 12px;
      color: #dc920a;
      cursor: pointer;

      &:hover {
        color: #ad740a;
      }
    }
  }
`;

const SecondStep = ({ setStep, time }) => {
  const inputRefs = useRef([]);
  const [timer, setTimer] = useState(INITIAL_TIMER);
  const [errors, setErrors] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [codeValues, setCodeValues] = useState(EMPTY_CODE);

  const { Request, HTTP_METHOD } = useRequest();

  const isCodeComplete = codeValues.every((value) => value !== "");
  const isBusy = loading || resending;

  useEffect(() => {
    if (timer <= 0) return;

    const timeoutId = setTimeout(() => {
      setTimer((previous) => Math.max(0, previous - 1));
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [timer]);

  const focusInput = (index) => {
    inputRefs.current[index]?.focus();
  };

  const updateCode = (values) => {
    setCodeValues(values);
    setErrors(false);
  };

  const nextStep = async (values = codeValues) => {
    if (isBusy) return;

    if (!values.every((value) => value !== "")) {
      setErrors(true);
      return;
    }

    setLoading(true);

    try {
      await Request(
        "account/security/verify",
        HTTP_METHOD.POST,
        { code: values.join("") }
      );

      const duration = Number.parseInt(time, 10) * 60 * 1000;

      setItem("account_security", {
        account_security: Date.now() + duration,
        time,
      });

      setStep(3);
    } catch {
      setErrors(true);
      ToastError(getTranslation("1639"));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (index, event) => {
    const digits = normalizeDigits(event.target.value);
    const value = digits.slice(-1);
    const newValues = [...codeValues];

    newValues[index] = value;

    updateCode(newValues);

    if (value && index < CODE_LENGTH - 1) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      if (isCodeComplete) {
        nextStep();
      }

      return;
    }

    if (event.key !== "Backspace") return;

    event.preventDefault();

    const newValues = [...codeValues];

    if (newValues[index] !== "") {
      newValues[index] = "";
      updateCode(newValues);
      return;
    }

    if (index > 0) {
      newValues[index - 1] = "";

      updateCode(newValues);
      focusInput(index - 1);
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();

    const pastedCode = normalizeDigits(
      event.clipboardData.getData("text/plain")
    ).slice(0, CODE_LENGTH);

    if (!pastedCode) return;

    const newValues = EMPTY_CODE();

    [...pastedCode].forEach((digit, index) => {
      newValues[index] = digit;
    });

    updateCode(newValues);

    if (pastedCode.length === CODE_LENGTH) {
      focusInput(CODE_LENGTH - 1);
      nextStep(newValues);
      return;
    }

    focusInput(pastedCode.length);
  };

  const resetHandler = async () => {
    if (isBusy) return;

    setResending(true);

    try {
      await Request(
        "account/security",
        HTTP_METHOD.POST,
        { time }
      );

      setCodeValues(EMPTY_CODE());
      setErrors(false);
      setTimer(INITIAL_TIMER);
      focusInput(0);
    } catch {
      ToastError(getTranslation("1639"));
    } finally {
      setResending(false);
    }
  };

  return (
    <Container>
      <h3>{getTranslation("860")}</h3>

      <p>{getTranslation("861")}</p>

      <Codes>
        {codeValues.map((value, index) => (
          <input
            key={index}
            placeholder="-"
            type="text"
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            maxLength={1}
            ref={(element) => {
              inputRefs.current[index] = element;
            }}
            value={value}
            onChange={(event) => handleInputChange(index, event)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onPaste={handlePaste}
            className={errors ? "invalid-input" : ""}
          />
        ))}
      </Codes>

      <div>
        <h4>
          {convertToPersian(formatTime(timer))}
        </h4>

        {timer !== 0 ? (
          <span>{getTranslation("863")}</span>
        ) : (
          <h2
            onClick={resetHandler}
            style={{ pointerEvents: isBusy ? "none" : "auto" }}
          >
            {getTranslation(1642)}
          </h2>
        )}
      </div>

      <Button
        label={getTranslation("859")}
        disabled={
          loading
            ? "pending"
            : !isCodeComplete || resending
        }
        onClick={() => nextStep()}
      />
    </Container>
  );
};

export default SecondStep;