import { useEffect, useMemo, useState } from "react";
import { RiErrorWarningLine } from "react-icons/ri";
import styled from "styled-components";
import Button from "../../../../components/Button";
import EditInput from "../../../Feature/Tabs/enter-tab/EditInput";
import Title from "../../../../components/Title";
import useRequest from "../../../../services/Hooks/useRequest";
import {
  getTranslation,
  ToastError,
  ToastSuccess,
  formatTime,
  convertToPersian,
} from "../../../../services/Utility";

const PHONE_INPUT_ID = "phone";
const CODE_INPUT_ID = "code";
const RESEND_TIMER = 2 * 60;

const normalizePhone = (value) => {
  let digits = String(value ?? "")
    .replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d))
    .replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d))
    .replace(/\D/g, "");

  if (digits.startsWith("0098")) digits = digits.slice(4);
  else if (digits.startsWith("98")) digits = digits.slice(2);

  if (digits.startsWith("9")) digits = `0${digits}`;

  return digits;
};

const isValidPhone = (value) => /^09\d{9}$/.test(normalizePhone(value));

const Container = styled.div`
  padding: 20px;
  border-radius: 5px;
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.inputBg};
  order: ${(props) => props.id === 3 && "4"};
`;

const Inputs = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 25px 0;
`;

const Warn = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
  margin-bottom: 20px;
  svg {
    color: ${(props) => props.theme.colors.primary};
  }
  h3 {
    color: ${(props) => props.theme.colors.newColors.shades.title};
    font-size: 11px;
    font-weight: 400;
  }
  @media (min-width: 1400px) {
    font-size: 16px;
  }
`;

const Error = styled.span`
  color: red;
  font-size: 12px;
  margin-top: -20px;
`;

const ResendBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 20px;
  font-size: 15px;

  h4 {
    color: #008bf8;
    font-weight: 400;
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
`;

const ChangeCard = ({
  id,
  inputs,
  availableResetMobileResets = 0,
  onResetMobileSuccess,
}) => {
  const { Request, HTTP_METHOD } = useRequest();
  const [step, setStep] = useState("phone");
  const [isSending, setIsSending] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timer, setTimer] = useState(0);
  const [inputValues, setInputValues] = useState([]);
  const [inputErrors, setInputErrors] = useState([]);
  const [remainingResets, setRemainingResets] = useState(
    Number(availableResetMobileResets) || 0
  );

  useEffect(() => {
    if (step !== "code" || timer <= 0) return;

    const timeoutId = setTimeout(() => {
      setTimer((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [timer, step]);

  useEffect(() => {
    setRemainingResets(Number(availableResetMobileResets) || 0);
  }, [availableResetMobileResets]);

  const buildInputEntries = (mapper) =>
    Array.isArray(inputs) ? inputs.map(mapper) : [];

  const getInitialValues = () =>
    buildInputEntries((input) => ({
      id: String(input.id),
      value: input.value ?? "",
    }));

  const getInitialErrors = () =>
    buildInputEntries((input) => ({
      id: String(input.id),
      error: "",
    }));

  useEffect(() => {
    if (!Array.isArray(inputs)) return;

    setInputValues(getInitialValues());
    setInputErrors(getInitialErrors());
    setStep("phone");
    setTimer(0);
  }, [inputs]);

  const getInputValue = (id) =>
    inputValues.find((item) => String(item.id) === String(id))?.value ?? "";

  const getInputError = (id) =>
    inputErrors.find((item) => String(item.id) === String(id))?.error ?? "";

  const validateInput = (input, value) => {
    if (!input) return "";

    if (input.validation === "mobile") {
      return isValidPhone(value) ? "" : getTranslation(1834);
    }

    if (input.validation === "code") {
      if (String(value).trim().length !== 6) {
        return getTranslation(1833);
      }
      return "";
    }

    return "";
  };

  const handleInputChange = (inputId, value) => {
    const normalizedId = String(inputId);
    const currentInput =
      inputs.find((item) => String(item.id) === normalizedId) || {
        id: normalizedId,
        validation: normalizedId === CODE_INPUT_ID ? "code" : "mobile",
      };

    setInputValues((prevValues) => {
      const exists = prevValues.some(
        (item) => String(item.id) === normalizedId
      );

      if (exists) {
        return prevValues.map((item) =>
          String(item.id) === normalizedId ? { ...item, value } : item
        );
      }

      return [...prevValues, { id: normalizedId, value }];
    });

    setInputErrors((prevErrors) => {
      const exists = prevErrors.some(
        (item) => String(item.id) === normalizedId
      );

      const error = validateInput(currentInput, value);

      if (exists) {
        return prevErrors.map((item) =>
          String(item.id) === normalizedId ? { ...item, error } : item
        );
      }

      return [...prevErrors, { id: normalizedId, error }];
    });
  };

  const visibleInputs = useMemo(() => {
    if (!Array.isArray(inputs)) return [];

    const baseInputs = inputs.filter(
      (item) => String(item.id) !== CODE_INPUT_ID
    );

    if (step === "phone") return baseInputs;

    return [
      ...baseInputs,
      {
        id: CODE_INPUT_ID,
        type: "number",
        label: 628,
        value: "",
        validation: "code",
      },
    ];
  }, [inputs, step]);

  // ارسال کد: هم برای مرحله‌ی اول و هم برای ارسال مجدد
  const sendCode = async () => {
    const rawPhone = getInputValue(PHONE_INPUT_ID);

    if (!rawPhone) {
      ToastError(getTranslation(1837));
      return false;
    }

    if (!isValidPhone(rawPhone)) {
      ToastError(getTranslation(1834));
      return false;
    }

    const normalizedPhone = normalizePhone(rawPhone);

    try {
      await Request("mobile/send", HTTP_METHOD.POST, {
        mobile: normalizedPhone,
      });

      setTimer(RESEND_TIMER);
      ToastSuccess(getTranslation(1836));
      return true;
    } catch (error) {
      ToastError(error.response?.data?.message || getTranslation(1835));
      return false;
    }
  };

  const clearCodeValue = () => {
    setInputValues((prev) =>
      prev.map((item) =>
        String(item.id) === CODE_INPUT_ID ? { ...item, value: "" } : item
      )
    );
    setInputErrors((prev) =>
      prev.map((item) =>
        String(item.id) === CODE_INPUT_ID ? { ...item, error: "" } : item
      )
    );
  };

  const resendHandler = async () => {
    if (isSending || isResending || timer > 0) return;

    setIsResending(true);
    const success = await sendCode();
    if (success) clearCodeValue();
    setIsResending(false);
  };

  const handleSave = async () => {
    if (isSending || isResending) return;

    setIsSending(true);

    if (step === "phone") {
      const success = await sendCode();
      if (success) setStep("code");
      setIsSending(false);
      return;
    }

    const codeValue = getInputValue(CODE_INPUT_ID);

    if (!codeValue || String(codeValue).trim().length !== 6) {
      ToastError(getTranslation(1833));
      setIsSending(false);
      return;
    }

    try {
      await Request("mobile/verify", HTTP_METHOD.POST, { code: codeValue });

      setStep("phone");
      setTimer(0);
      setInputValues(getInitialValues());
      setInputErrors(getInitialErrors());

      const nextResetCount = Math.max(remainingResets - 1, 0);
      setRemainingResets(nextResetCount);

      if (typeof onResetMobileSuccess === "function") {
        onResetMobileSuccess(nextResetCount);
      }

      ToastSuccess(getTranslation(1832));
    } catch {
      ToastError(getTranslation(1831));
    } finally {
      setIsSending(false);
    }
  };

  if (!Array.isArray(inputs) || inputs.length === 0) {
    return null;
  }

  const isDisabled =
    step === "phone"
      ? !getInputValue(PHONE_INPUT_ID)
      : !getInputValue(CODE_INPUT_ID) ||
        String(getInputValue(CODE_INPUT_ID)).trim().length !== 6;

  const buttonLabel =
    step === "phone" ? getTranslation("629") : getTranslation("628");
  const warnMessage = ` ${remainingResets} ${getTranslation("1830")}`;
  const isBusy = isSending || isResending;

  return (
    <Container id={id}>
      <Title title={getTranslation(625)} />
      {warnMessage && (
        <Warn>
          <RiErrorWarningLine size={22} />
          <h3>{warnMessage}</h3>
        </Warn>
      )}

      <Inputs>
        {visibleInputs.map((item) => {
          const inputId = String(item.id);
          const itemValue = getInputValue(inputId);
          const itemError = getInputError(inputId);

          return (
            <div key={inputId}>
              <EditInput
                type={item.type}
                value={itemValue}
                onchange={(e) => handleInputChange(inputId, e.target.value)}
                title={getTranslation(item.label) || item.label}
                error={itemError}
                maxLength={11}
              />
              {itemError && <Error>{itemError}</Error>}
            </div>
          );
        })}
      </Inputs>

      {step === "code" && (
        <ResendBox>
          <h4>{convertToPersian(formatTime(timer))}</h4>

          {timer !== 0 ? (
            <span>{getTranslation("863")}</span>
          ) : (
            <h2
              onClick={resendHandler}
              style={{ pointerEvents: isBusy ? "none" : "auto" }}
            >
              {getTranslation(1642)}
            </h2>
          )}
        </ResendBox>
      )}

      <Button
        full
        label={buttonLabel}
        onclick={handleSave}
        disabled={isDisabled ? true : isBusy ? "pending" : false}
      />
    </Container>
  );
};

export default ChangeCard;
