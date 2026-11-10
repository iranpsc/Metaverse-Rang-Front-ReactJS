// صفحه‌ی ارسال پیشنهاد قیمت برای خرید ملک (ریال، PSC و توضیحات) با اعتبارسنجی حداقل ارزش معامله و موجودی کیف پول؛ مبلغ نهایی با کارمزد و باقی‌مانده تا حداقل ارزش را نشان می‌دهد و بعد از ثبت موفق کارمزد از کیف پول کم می‌شود؛ مناسب مسیر buy/suggest در صفحه‌ی ملک

import styled from "styled-components";
import { useContext, useEffect, useState } from "react";
import ResultInfo from "../../../components/ResultInfo";
import { FeatureContext } from "../../../Context/FeatureProvider";
import { FeaturePrice } from "../../../../../services/constants/FeatureType";
import BaseContainer from "../../../../../components/Common/Container";
import Button from "../../../../../components/Button";
import CustomEditor from "../../../../../components/Common/CustomEditor";
import WalletAsset from "../../../../../components/WalletAsset.jsx";
import TitleValue from "../../../../../components/TitleValue";
import TitleBody from "../../../../../components/TitleBody.jsx";
import LabeledInput from "../../../../../components/LabeledInput.jsx";
import useRequest from "../../../../../hooks/useRequest.js";
import { WalletContext } from "../../../../../services/reducers/WalletContext";
import useWalletUpdate from "../../../../../hooks/useWalletUpdate.js";
import {
  calculateFee,
  convertToPersian,
  formatNumber,
  getTranslation,
  normalizeDecimalInput,
  pscToIrr,
  ToastError,
  ToastSuccess,
} from "../../../../../services/Utility";

/* ---------- Constants & helpers ---------- */

const FEE_PERCENT = 5;
const NOTE_CHAR_LIMIT = 1000;
const PSC_DECIMALS = 2;

// ارزش یک PSC به ریال (از همان نرخ Utility گرفته می‌شود تا عدد ۹۰۰ دو جا نباشد)
const PSC_RATE = pscToIrr(1);

// گرد کردن به ۲ رقم؛ EPSILON خطای ممیز شناور (مثل 1.005) را جبران می‌کند
const roundTo2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;

/* ---------- Styles ---------- */

export const InputsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-left: 20px;

  @media (min-width: 600px) {
    flex-direction: row;
    padding-left: 0;
  }
`;

export const ResultWrapper = styled.div`
  display: grid;
  gap: 20px;
  width: 100%;

  @media (min-width: 670px) {
    grid-template-columns: 1fr;
  }
  @media (min-width: 1023px) {
    grid-template-columns: 2fr 1fr;
  }
  @media (min-width: 1300px) {
    grid-template-columns: 3fr 2fr;
  }
`;

export const Sec = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: 2fr 1fr;
`;

const Page = styled(BaseContainer)`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  padding-top: 20px;
  p {
    line-height: 1.5rem;
    color: ${({ theme }) => theme.colors.newColors.shades.title};
  }
`;

/* ---------- Component ---------- */

const SuggestPrice = () => {
  const [wallet] = useContext(WalletContext);
  const updateWallet = useWalletUpdate();
  const [feature] = useContext(FeatureContext);
  const { Request, HTTP_METHOD, checkSecurity } = useRequest();

  const [submitted, setSubmitted] = useState(false);
  const [rial, setRial] = useState(0);
  const [psc, setPsc] = useState("");
  const [suggestText, setSuggestText] = useState("");

  const properties = feature?.properties;

  // حداقل ارزش پیشنهاد به ریال
  const totalIrr = properties
    ? Number(properties.stability || 0) *
      Number(FeaturePrice(properties.rgb) || 0) *
      (Number(properties.minimum_price_percentage || 0) / 100)
    : 0;

  // مقدار پیش‌فرض پیشنهاد: نصف حداقل ارزش به ریال و نصف دیگر به PSC (گرد به بالا تا مجموع زیر حداقل نیاید)
  useEffect(() => {
    const half = totalIrr / 2;
    setRial(half);
    setPsc(half ? String(roundTo2(half / PSC_RATE)) : "");
  }, [totalIrr]);

  const rialValue = Number(rial) || 0;
  const pscValue = Number(psc) || 0;
  const totalPrice = rialValue + pscToIrr(pscValue);

  // باقی‌مانده تا حداقل ارزش به PSC (گرد شده)؛ || 0 جلوی -0 را می‌گیرد
  const remainingPsc = roundTo2((totalIrr - totalPrice) / PSC_RATE) || 0;
  const disabled = remainingPsc > 0;

  const walletIrr = wallet?.irr ?? 0;
  const walletPsc = wallet?.psc ?? 0;

  const handleRialChange = (e) => {
    const { value } = e.target;
    const next = value === "" ? "" : Number(value);

    setRial(Number.isFinite(next) ? next : "");
  };

  const handlePscChange = (e) =>
    setPsc(normalizeDecimalInput(e.target.value, PSC_DECIMALS));

  const validate = () => {
    if (remainingPsc > 0) {
      return `حداقل ارزش معامله ${properties?.minimum_price_percentage}% قیمت اولیه میباشد`;
    }
    if (rialValue > walletIrr) return getTranslation("1604");
    if (pscValue > walletPsc) return getTranslation("1605");

    return null;
  };

  const handleSubmit = () => {
    const errorMessage = validate();
    if (errorMessage) return ToastError(errorMessage);
    if (!checkSecurity()) return;

    Request(`buy-requests/store/${feature?.id}`, HTTP_METHOD.POST, {
      price_irr: rialValue,
      price_psc: pscValue,
      note: suggestText.trim(),
    })
      .then(() => {
        ToastSuccess(getTranslation("1607"));
        setSubmitted(true);

        updateWallet("irr", calculateFee(rialValue, FEE_PERCENT), "-");
        updateWallet("psc", calculateFee(pscValue, FEE_PERCENT), "-");

      })
      
  };

  return (
    <Page>
      <TitleBody title={getTranslation(527)} />

      {submitted ? (
        <ResultInfo rial={formatNumber(rialValue)} psc={pscValue} setAssign={setSubmitted} notEdit/>
      ) : (
        <>
          <InputsWrapper>
            <LabeledInput
              type="number"
              value={rial === "" ? "" : formatNumber(rial)}
              onChange={handleRialChange}
              suffix={<WalletAsset asset="irr" showLabel />}
            />
            <LabeledInput
              type="text"
              inputMode="decimal"
              value={convertToPersian(psc)}
              onChange={handlePscChange}
              suffix={<WalletAsset asset="psc" showLabel />}
            />
          </InputsWrapper>

          <CustomEditor
            value={suggestText}
            onChange={setSuggestText}
            charLimit={NOTE_CHAR_LIMIT}
            placeholder={getTranslation("529")}
          />

          <ResultWrapper>
            <TitleValue
              title={getTranslation("522")}
              value={`${calculateFee(rialValue, FEE_PERCENT)} ${getTranslation("48")} / ${calculateFee(pscValue, FEE_PERCENT)} ${getTranslation("47")}`}
            />

            <Sec>
              <TitleValue
                title={getTranslation("531")}
                value={convertToPersian(remainingPsc)}
              />
              <TitleValue
                title={getTranslation("523")}
                value={`${convertToPersian(FEE_PERCENT)}%`}
              />
            </Sec>
          </ResultWrapper>
          <div style={{ paddingTop: "30px" }}>
            <Button
              label={getTranslation("532")}
              onClick={handleSubmit}
              disabled={disabled}
            />
          </div>
        </>
      )}
    </Page>
  );
};

export default SuggestPrice;
