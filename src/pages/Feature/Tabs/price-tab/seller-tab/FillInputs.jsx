import styled from "styled-components";
import { useState } from "react";
import WalletAsset from "../../../../../components/WalletAsset.jsx";
import {
  calculateFee,
  getTranslation,
  convertToPersian,
  formatNumber,
} from "../../../../../services/Utility";
import TitleValue from "../../../../../components/TitleValue";
import Button from "../../../../../components/Button";
import LabeledInput from "../../../../../components/LabeledInput.jsx";
const Div = styled.div`
  display: flex;
  flex-direction: column;
  gap: 23px;
`;

const ButtonBox = styled.div`
  display: flex;
  gap: 23px;
`;

const InputsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0 0 0 20px;

  @media (min-width: 600px) {
    flex-direction: row;
    padding-left: 0;
  }
`;

const ResultWrapper = styled.div`
  display: grid;
  gap: 20px;
  width: 100%;
  grid-template-columns: 3fr 1fr;

  @media (min-width: 1200px) {
    grid-template-columns: 5fr 1fr;
  }
`;

const FillInputs = ({
  setAssign,
  validateAndSubmit,
  checkSecurity,
  rial,
  setRial,
  psc,
  setPsc,
}) => {
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [isCancelLoading, setIsCancelLoading] = useState(false);

  const cancel = rial !== 0 || psc !== 0;

  const handleRialChange = (e) => {
    setRial(e.target.value);
  };

  const handlePscChange = (e) => {
    setPsc(e.target.value);
  };

  const handleSubmit = () => {
    if (isSubmitLoading || isCancelLoading) return;
    if (!checkSecurity()) return;

    setIsSubmitLoading(true);

    // یک tick به React فرصت می‌ده Spinner را render کند
    setTimeout(() => {
      validateAndSubmit();
    }, 0);
  };

  const handleCancel = () => {
    if (isSubmitLoading || isCancelLoading) return;

    setIsCancelLoading(true);

    // یک tick به React فرصت می‌ده Spinner را render کند
    setTimeout(() => {
      setAssign(true);
    }, 0);
  };

  const rialValue = rial === 0 ? "" : rial;
  const pscValue = psc === 0 ? "" : psc;

  return (
    <Div>
      <InputsWrapper>
        <LabeledInput
          value={rialValue === "" ? "" : formatNumber(rialValue)}
          maxLength={14}
          onChange={handleRialChange}
          type="number"
          placeholder={`${getTranslation("521")} (${getTranslation("48")})`}
          suffix={<WalletAsset asset="irr" showLabel />}
        />
        <LabeledInput
          maxLength={14}
          value={pscValue === "" ? "" : formatNumber(pscValue)}
          onChange={handlePscChange}
          type="number"
          placeholder={`${getTranslation("521")} (${getTranslation("47")})`}
          suffix={<WalletAsset asset="psc" showLabel />}
        />
      </InputsWrapper>

      <ResultWrapper>
        <TitleValue
          title={getTranslation("522")}
          value={`${convertToPersian(calculateFee(rial) || 0)} IRR /
            ${convertToPersian(calculateFee(psc) || 0)} PSC`}
        />

        <TitleValue title={getTranslation("523")} value="5%" />
      </ResultWrapper>

      <ButtonBox>
        <Button
          label={getTranslation("519")}
          onclick={handleSubmit}
          disabled={isSubmitLoading ? "pending" : false}
        />

        {cancel && (
          <Button
            color="red"
            edit
            label={getTranslation("833")}
            onclick={handleCancel}
            disabled={isCancelLoading ? "pending" : false}
          />
        )}
      </ButtonBox>
    </Div>
  );
};

export default FillInputs;
