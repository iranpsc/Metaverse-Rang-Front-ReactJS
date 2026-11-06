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
import LabeledInput from "../../components/LabeledInput.jsx";
import TitleBody from "../../components/TitleBody.jsx";
import TitleHeader from "../../components/TitleHeader.jsx";
const CODE_LENGTH = 6;
const INITIAL_TIMER = 2 * 60;
const MS_PER_MINUTE = 60 * 1000;
const MIN_TIME = 5;
const MAX_TIME = 60;

const createEmptyCode = () => Array(CODE_LENGTH).fill("");

const toDigits = (value) =>
  String(fixNumbers(String(value ?? ""))).replace(/\D/g, "");

const isFilled = (values) => values.every((value) => value !== "");
const Codes = styled.div`
  display: grid;
  grid-template-columns: repeat(${CODE_LENGTH}, 1fr);
  gap: 10px;
  width: 100%;
  margin: 10px 0;
  direction: ltr;

  input {
    height: 50px;
    padding: 8px;
    font-size: 16px;
    text-align: center;
  }

  @media (min-width: 1024px) {
    input {
      height: 60px;
    }
  }

  @media (max-width: 1024px) {
    gap: 6px;
    margin-bottom: 20px;

    input {
      height: 42px;
      padding: 4px;
      font-size: 14px;
    }
  }
`;

const Container = styled.div`
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

  @media (max-width: 1024px) {
    margin-top: 0;

    button {
      height: 42px;
      margin-top: 18px;
      margin-bottom: 10px;
      font-size: 14px;
    }
  }
`;

// ردیف تایمر و ارسال مجدد؛ قانون‌هایش قبلاً روی همه‌ی divهای داخل Container اعمال می‌شد
const ResendRow = styled.div`
  display: flex;
  align-items: center;
  width: fit-content;
  margin: 0 auto;
  font-size: 15px;
  text-align: center;

  h4 {
    margin-left: 5px;
    color: #008bf8;
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

  @media (max-width: 1024px) {
    font-size: 13px;

    h4 {
      margin-left: 4px;
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
      <TitleHeader title={getTranslation("860")} />
      <TitleBody title={getTranslation("861")} />

      <Codes>
        {codeValues.map((value, index) => (
          <LabeledInput
            key={index}
            ref={(element) => {
              inputRefs.current[index] = element;
            }}
            type="number"
            maxLength={1}
            placeholder="-"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            value={value}
            onChange={(event) => handleChange(index, event)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onPaste={handlePaste}
            error={hasError}
            size="big"
          />
        ))}
      </Codes>

      <ResendRow>
        <TitleBody title={convertToPersian(formatTime(timer))} />

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
      </ResendRow>

      <Button
        label={getTranslation("859")}
        disabled={loading ? "pending" : !isComplete || resending}
        onClick={() => submit()}
      />
    </Container>
  );
};

export default SecondStep;
