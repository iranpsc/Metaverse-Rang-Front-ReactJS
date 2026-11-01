// کارت تنظیمات حساب بانکی و امنیتی (انتخاب شماره شبا، تعداد روز تسویه و زمان خروج خودکار) با اعتبارسنجی بازه‌ی هر فیلد و دکمه‌ی ذخیره؛ مناسب تب حساب کاربری که تنظیمات را با پراپ settings می‌گیرد

import styled from "styled-components";
import { useEffect, useState } from "react";
import Dropdown from "../../../../components/Common/Dropdown";
import TitleHeader from "../../../../components/TitleHeader";
import Button from "../../../../components/Button";
import useRequest from "../../../../hooks/useRequest.js";
import {
  getTranslation,
  ToastError,
  ToastSuccess,
} from "../../../../services/Utility";

// name = کلید تنظیم در بک‌اند، label = کلید ترجمه‌ی عنوان
// minError و maxError = کلید ترجمه‌ی پیام خطا وقتی مقدار از بازه بیرون باشد
const FIELDS = [
  {
    name: "checkout_days_count",
    label: "637",
    min: 3,
    max: 1000,
    minError: 1771,
    maxError: 1772,
  },
  {
    name: "automatic_logout",
    label: "638",
    min: 1,
    max: 55,
    minError: 1769,
    maxError: 1770,
  },
];

const getInitialValues = (settings) =>
  Object.fromEntries(FIELDS.map(({ name }) => [name, settings?.[name] ?? ""]));

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  border-radius: 5px;
  background-color: ${({ theme }) =>
    theme.colors.newColors.otherColors.inputBg};
`;

const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;
`;

const Field = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:not(:last-child) {
    padding-bottom: 20px;
    border-bottom: 1px solid #454545;
  }
`;

const Label = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.newColors.shades.title};
`;

const Input = styled.input`
  width: 70px;
  height: 50px;
  font-size: 16px;
  text-align: center;
  outline: none;
  border: 1px solid ${({ $error }) => ($error ? "red" : "#454545")};
  border-radius: 5px;
  color: ${({ theme }) => theme.colors.newColors.shades.title};
  background-color: ${({ theme }) =>
    theme.colors.newColors.otherColors.inputBg};

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    margin: 0;
    -webkit-appearance: none;
  }
`;

const Bank = ({ settings }) => {
  const { Request, HTTP_METHOD } = useRequest();

  const [cards, setCards] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");
  const [values, setValues] = useState(() => getInitialValues(settings));
  const [errors, setErrors] = useState({});
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    let cancelled = false;

    Request("bank-accounts")
      .then((response) => {
        if (!cancelled) setCards(response.data.data || []);
      })
      .catch((error) => {
        console.error("Error fetching bank accounts:", error);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleInputChange = (name, e) => {
    const { value } = e.target;

    setValues((prev) => ({
      ...prev,
      [name]: value === "" ? "" : Number(value),
    }));
    setErrors((prev) => ({ ...prev, [name]: false }));
  };

  // مقدار خالی فقط ایراد قرمز می‌گیرد، مقدار خارج از بازه ایراد و پیام
  const validate = () => {
    const nextErrors = {};

    FIELDS.forEach(({ name, min, max, minError, maxError }) => {
      const value = values[name];

      if (value === "") {
        nextErrors[name] = true;
      } else if (value < min) {
        nextErrors[name] = true;
        ToastError(getTranslation(minError));
      } else if (value > max) {
        nextErrors[name] = true;
        ToastError(getTranslation(maxError));
      }
    });

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    setIsSending(true);

    Request("settings", HTTP_METHOD.POST, values)
      .then(() => ToastSuccess(getTranslation(1773)))
      .catch((error) =>
        ToastError(error.response?.data?.message || getTranslation(1774)),
      )
      .finally(() => setIsSending(false));
  };

  const options = cards.map(({ id, shaba_num }) => ({
    value: id,
    label: shaba_num,
  }));

  const isDisabled = FIELDS.some(({ name }) => values[name] === "");

  return (
    <Container>
      <TitleHeader title={getTranslation("635")} />

      {options.length > 0 && (
        <Dropdown
          options={options}
          selected={selectedValue}
          onSelect={setSelectedValue}
          placeholder={getTranslation("636")}
        />
      )}

      <Fields>
        {FIELDS.map(({ name, label }) => (
          <Field key={name}>
            <Label>{getTranslation(label)}</Label>
            <Input
              type="number"
              placeholder="0"
              value={values[name]}
              $error={errors[name]}
              onChange={(e) => handleInputChange(name, e)}
            />
          </Field>
        ))}
      </Fields>

      <Button
        full
        label={getTranslation("629")}
        onClick={handleSave}
        disabled={isDisabled ? true : isSending ? "pending" : false}
      />
    </Container>
  );
};

export default Bank;
