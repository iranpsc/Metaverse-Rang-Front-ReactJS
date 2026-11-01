import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Button from "../../components/Button";
import useRequest from "../../hooks/useRequest.js";
import {
  ToastError,
  convertToPersian,
  fixNumbers,
  formatTime,
  getTranslation,
} from "../../services/Utility";
import {
  getItem,
  removeItem,
  setItem,
} from "../../services/Utility/LocalStorage";

const CODE_LENGTH = 6;
const INITIAL_TIMER = 2 * 60;
const MS_PER_MINUTE = 60 * 1000;
const MIN_TIME = 5;
const MAX_TIME = 60;

const createEmptyCode = () => Array(CODE_LENGTH).fill("");

const toDigits = (value) =>
  String(fixNumbers(String(value ?? ""))).replace(/\D/g, "");

const isFilled = (values) => values.every((value) => value !== "");

// ⚠️ استایل‌های Codes و Container عمداً بدون تغییر مانده‌اند
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
  const { Request, HTTP_METHOD } = useRequest();
  const inputRefs = useRef([]);
  const requestInProgress = useRef(false);

  const [codeValues, setCodeValues] = useState(createEmptyCode);
  const [timer, setTimer] = useState(INITIAL_TIMER);
  const [resendAt, setResendAt] = useState(
    () => Date.now() + INITIAL_TIMER * 1000,
  );
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const isComplete = isFilled(codeValues);
  const isBusy = loading || resending;

  useEffect(() => {
    if (timer <= 0) return;

    const timeout = setTimeout(() => {
      setTimer(Math.max(0, Math.ceil((resendAt - Date.now()) / 1000)));
    }, 1000);

    return () => clearTimeout(timeout);
  }, [resendAt, timer]);

  const focusInput = (index) => inputRefs.current[index]?.focus();

  const updateCode = (values) => {
    setCodeValues(values);
    setHasError(false);
  };

  const submit = async (values = codeValues) => {
    if (requestInProgress.current) return;

    if (!isFilled(values)) {
      setHasError(true);
      return;
    }

    const duration = Number(time);
    if (
      !Number.isInteger(duration) ||
      duration < MIN_TIME ||
      duration > MAX_TIME
    ) {
      setHasError(true);
      setStep(1);
      return;
    }

    requestInProgress.current = true;
    setLoading(true);

    try {
      await Request(
        "account/security/verify",
        HTTP_METHOD.POST,
        { code: values.join("") },
        {},
        { showError: false },
      );

      const currentEndTime = Number(
        getItem("account_security")?.account_security,
      );
      const now = Date.now();
      const extensionBase =
        Number.isFinite(currentEndTime) && currentEndTime > now
          ? currentEndTime
          : now;

      setItem("account_security", {
        account_security: extensionBase + duration * MS_PER_MINUTE,
        time: duration,
      });
      removeItem("security_end_time");

      setStep(3);
    } catch {
      setHasError(true);
      ToastError(getTranslation("1639"));
    } finally {
      requestInProgress.current = false;
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (requestInProgress.current) return;

    requestInProgress.current = true;
    setResending(true);

    try {
      await Request(
        "account/security",
        HTTP_METHOD.POST,
        { time },
        {},
        { showError: false },
      );

      setCodeValues(createEmptyCode());
      setHasError(false);
      setResendAt(Date.now() + INITIAL_TIMER * 1000);
      setTimer(INITIAL_TIMER);
      focusInput(0);
    } catch {
      ToastError(getTranslation("1639"));
    } finally {
      requestInProgress.current = false;
      setResending(false);
    }
  };
  const handleChange = (index, event) => {
    const value = toDigits(event.target.value).slice(-1);
    const values = [...codeValues];

    values[index] = value;
    updateCode(values);

    if (value && index < CODE_LENGTH - 1) focusInput(index + 1);
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (isComplete) submit();
      return;
    }

    if (event.key !== "Backspace") return;

    event.preventDefault();

    const values = [...codeValues];

    if (values[index] !== "") {
      values[index] = "";
      updateCode(values);
    } else if (index > 0) {
      values[index - 1] = "";
      updateCode(values);
      focusInput(index - 1);
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();

    const pasted = toDigits(event.clipboardData.getData("text/plain")).slice(
      0,
      CODE_LENGTH,
    );

    if (!pasted) return;

    const values = createEmptyCode();
    [...pasted].forEach((digit, index) => {
      values[index] = digit;
    });

    updateCode(values);

    if (pasted.length === CODE_LENGTH) {
      focusInput(CODE_LENGTH - 1);
      submit(values);
    } else {
      focusInput(pasted.length);
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
            ref={(element) => {
              inputRefs.current[index] = element;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            placeholder="-"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            value={value}
            onChange={(event) => handleChange(index, event)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onPaste={handlePaste}
            className={hasError ? "invalid-input" : ""}
          />
        ))}
      </Codes>

      <div>
        <h4>{convertToPersian(formatTime(timer))}</h4>

        {timer > 0 ? (
          <span>{getTranslation("863")}</span>
        ) : (
          <h2
            onClick={handleResend}
            style={{ pointerEvents: isBusy ? "none" : "auto" }}
          >
            {getTranslation("1642")}
          </h2>
        )}
      </div>

      <Button
        label={getTranslation("859")}
        disabled={loading ? "pending" : !isComplete || resending}
        onClick={() => submit()}
      />
    </Container>
  );
};

export default SecondStep;
