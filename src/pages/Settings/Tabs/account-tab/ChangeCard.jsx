// کارت تغییر شماره موبایل در دو مرحله (ارسال کد به شماره‌ی جدید و تایید کد) با تایمر ارسال مجدد؛ مناسب تب حساب کاربری که شماره‌ی موبایل را با inputs و تعداد دفعات باقی‌مانده‌ی تغییر دریافت می‌کند

import styled from "styled-components";
import { useEffect, useMemo, useState } from "react";
import { RiErrorWarningLine } from "react-icons/ri";
import Button from "../../../../components/Button";
import TitleHeader from "../../../../components/TitleHeader";
import EditInput from "../../../Feature/Tabs/enter-tab/EditInput";
import useRequest from "../../../../hooks/useRequest.js";
import {
  convertToPersian,
  fixNumbers,
  formatTime,
  getTranslation,
  ToastError,
  ToastSuccess,
} from "../../../../services/Utility";

const PHONE_INPUT_ID = "phone";
const CODE_INPUT_ID = "code";
const CODE_LENGTH = 6;
const RESEND_TIMER = 2 * 60;

// ورودی کد تایید که فقط در مرحله‌ی دوم نمایش داده می‌شود
const CODE_INPUT = {
  id: CODE_INPUT_ID,
  type: "number",
  label: 628,
  value: "",
  validation: "code",
};

// ارقام فارسی و عربی به انگلیسی تبدیل می‌شوند و پیش‌شماره‌ی 98 و 0098 به 09 تبدیل می‌شود
const normalizePhone = (value) => {
  let digits = fixNumbers(String(value ?? "")).replace(/\D/g, "");

  if (digits.startsWith("0098")) digits = digits.slice(4);
  else if (digits.startsWith("98")) digits = digits.slice(2);

  if (digits.startsWith("9")) digits = `0${digits}`;

  return digits;
};

const isValidPhone = (value) => /^09\d{9}$/.test(normalizePhone(value));
const isValidCode = (value) => String(value).trim().length === CODE_LENGTH;

// نوع validation هر ورودی => پیام خطا (رشته‌ی خالی یعنی معتبر)
const VALIDATORS = {
  mobile: (value) => (isValidPhone(value) ? "" : getTranslation(1834)),
  code: (value) => (isValidCode(value) ? "" : getTranslation(1833)),
};

const validateInput = (input, value) =>
  VALIDATORS[input?.validation]?.(value) ?? "";

const Container = styled.div`
  padding: 20px;
  border-radius: 5px;
  background-color: ${({ theme }) =>
    theme.colors.newColors.otherColors.inputBg};
  order: ${({ id }) => id === 3 && "4"};
`;

const Warn = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 6px 0 20px;

  svg {
    color: ${({ theme }) => theme.colors.primary};
  }

  h3 {
    font-size: 11px;
    font-weight: 400;
    color: ${({ theme }) => theme.colors.newColors.shades.title};
  }
`;

const Inputs = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 25px 0;
`;

const ErrorText = styled.span`
  margin-top: -20px;
  font-size: 12px;
  color: red;
`;

const ResendBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 20px;
  font-size: 15px;

  h4 {
    font-weight: 400;
    color: #008bf8;
  }

  span {
    color: #969696;
  }
`;

const ResendLink = styled.h2`
  font-size: 12px;
  color: #dc920a;
  cursor: pointer;
  pointer-events: ${({ $busy }) => ($busy ? "none" : "auto")};

  &:hover {
    color: #ad740a;
  }
`;

const ChangeCard = ({
  id,
  inputs,
  availableResetMobileResets = 0,
  onResetMobileSuccess,
}) => {
  const { Request, HTTP_METHOD } = useRequest();

  const [step, setStep] = useState("phone"); // "phone" | "code"
  const [busy, setBusy] = useState(false);
  const [timer, setTimer] = useState(0);
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [remainingResets, setRemainingResets] = useState(
    Number(availableResetMobileResets) || 0,
  );

  const initialValues = useMemo(
    () =>
      Object.fromEntries(
        (inputs ?? []).map((input) => [String(input.id), input.value ?? ""]),
      ),
    [inputs],
  );

  // ورودی‌های قابل نمایش: در مرحله‌ی کد، ورودی کد هم اضافه می‌شود
  const visibleInputs = useMemo(() => {
    if (!Array.isArray(inputs)) return [];

    const base = inputs.filter((item) => String(item.id) !== CODE_INPUT_ID);
    return step === "phone" ? base : [...base, CODE_INPUT];
  }, [inputs, step]);

  const getValue = (inputId) => values[inputId] ?? "";
  const getError = (inputId) => errors[inputId] ?? "";

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setStep("phone");
    setTimer(0);
  };

  // با تغییر inputs فرم از اول شروع می‌شود
  useEffect(() => {
    resetForm();
  }, [initialValues]);

  useEffect(() => {
    setRemainingResets(Number(availableResetMobileResets) || 0);
  }, [availableResetMobileResets]);

  // شمارش معکوس ارسال مجدد
  useEffect(() => {
    if (timer <= 0) return;

    const timeoutId = setTimeout(() => setTimer((prev) => prev - 1), 1000);
    return () => clearTimeout(timeoutId);
  }, [timer]);

  const handleInputChange = (inputId, value) => {
    const key = String(inputId);
    const input = visibleInputs.find((item) => String(item.id) === key);

    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: validateInput(input, value) }));
  };

  const clearCodeValue = () => {
    setValues((prev) => ({ ...prev, [CODE_INPUT_ID]: "" }));
    setErrors((prev) => ({ ...prev, [CODE_INPUT_ID]: "" }));
  };

  // ارسال کد: هم برای مرحله‌ی اول و هم برای ارسال مجدد
  const sendCode = async () => {
    const rawPhone = getValue(PHONE_INPUT_ID);

    if (!rawPhone) {
      ToastError(getTranslation(1837));
      return false;
    }

    if (!isValidPhone(rawPhone)) {
      ToastError(getTranslation(1834));
      return false;
    }

    try {
      await Request("mobile/send", HTTP_METHOD.POST, {
        mobile: normalizePhone(rawPhone),
      });

      setTimer(RESEND_TIMER);
      ToastSuccess(getTranslation(1836));
      return true;
    } catch (error) {
      ToastError(error.response?.data?.message || getTranslation(1835));
      return false;
    }
  };

  const verifyCode = async () => {
    const code = getValue(CODE_INPUT_ID);

    if (!isValidCode(code)) {
      ToastError(getTranslation(1833));
      return;
    }

    try {
      await Request("mobile/verify", HTTP_METHOD.POST, { code });

      resetForm();

      const nextResetCount = Math.max(remainingResets - 1, 0);
      setRemainingResets(nextResetCount);
      onResetMobileSuccess?.(nextResetCount);

      ToastSuccess(getTranslation(1832));
    } catch {
      ToastError(getTranslation(1831));
    }
  };

  const handleSave = async () => {
    if (busy) return;
    setBusy(true);

    try {
      if (step === "phone") {
        if (await sendCode()) setStep("code");
      } else {
        await verifyCode();
      }
    } finally {
      setBusy(false);
    }
  };

  const handleResend = async () => {
    if (busy || timer > 0) return;
    setBusy(true);

    try {
      if (await sendCode()) clearCodeValue();
    } finally {
      setBusy(false);
    }
  };

  if (visibleInputs.length === 0) return null;

  const isDisabled =
    step === "phone"
      ? !getValue(PHONE_INPUT_ID)
      : !isValidCode(getValue(CODE_INPUT_ID));

  return (
    <Container id={id}>
      <TitleHeader title={getTranslation(625)} />

      <Warn>
        <RiErrorWarningLine size={22} />
        <h3>
          {convertToPersian(remainingResets)} {getTranslation("1830")}
        </h3>
      </Warn>

      <Inputs>
        {visibleInputs.map((item) => {
          const inputId = String(item.id);
          const error = getError(inputId);

          return (
            <div key={inputId}>
              <EditInput
                type={item.type}
                value={getValue(inputId)}
                onchange={(e) => handleInputChange(inputId, e.target.value)}
                title={getTranslation(item.label) || item.label}
                error={error}
                maxLength={11}
              />
              {error && <ErrorText>{error}</ErrorText>}
            </div>
          );
        })}
      </Inputs>

      {step === "code" && (
        <ResendBox>
          <h4>{convertToPersian(formatTime(timer))}</h4>

          {timer > 0 ? (
            <span>{getTranslation("863")}</span>
          ) : (
            <ResendLink $busy={busy} onClick={handleResend}>
              {getTranslation(1642)}
            </ResendLink>
          )}
        </ResendBox>
      )}

      <Button
        full
        label={getTranslation(step === "phone" ? "34" : "628")}
        onClick={handleSave}
        disabled={isDisabled ? true : busy ? "pending" : false}
      />
    </Container>
  );
};

export default ChangeCard;
