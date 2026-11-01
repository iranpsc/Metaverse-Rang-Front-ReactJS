import styled from "styled-components";
import { useState } from "react";
import Rial from "../../../../../components/Rial";
import Psc from "../../../../../components/Psc";
import {
  calculateFee,
  getTranslation,
  sanitizePriceInputValue,
  convertToPersian,
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

  @media (min-width: 741px) {
    grid-template-columns: 2fr 1fr;
  }

  @media (min-width: 840px) {
    grid-template-columns: 5fr 2fr;
  }

  @media (min-width: 1200px) {
    grid-template-columns: 4fr 1fr;
  }
`;

const Wrapper = styled.div`
  display: flex;
  border-radius: 5px;
  height: 40px;
  border: 1px solid
    ${(props) => props.theme.colors.newColors.otherColors.inputBorder};
  font-weight: 400;
  overflow: hidden;

  @media (min-width: 998px) {
    height: 48px;
  }
`;

const Title = styled.h3`
  font-size: 16px;
  font-weight: 400;
  height: fit-content;
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.inputBg};
  color: ${(props) => props.theme.colors.newColors.shades.title};
  padding: 5px 20px;

  @media (min-width: 998px) {
    padding: 8px 20px;
  }
`;

const Value = styled.p`
  color: ${(props) => props.theme.colors.newColors.shades.title};
  font-size: 18px;
  padding: 5px 20px;

  @media (min-width: 998px) {
    padding: 8px 20px;
  }
`;

const FillInputs = ({
  setAssign,
  validateAndSubmit,
  rial,
  setRial,
  psc,
  setPsc,
}) => {
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [isCancelLoading, setIsCancelLoading] = useState(false);

  const cancel = rial !== 0 || psc !== 0;

  const handleRialChange = (e) => {
    setRial(sanitizePriceInputValue(e.target.value));
  };

  const handlePscChange = (e) => {
    setPsc(sanitizePriceInputValue(e.target.value));
  };

  const handleSubmit = () => {
    if (isSubmitLoading || isCancelLoading) return;

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
          value={rialValue}
          maxLength={14}
          onChange={handleRialChange}
          type="number"
          placeholder={`${getTranslation("521")} (${getTranslation("48")})`}
          suffix={<Rial />}
        />
        <LabeledInput
          maxLength={14}
          value={pscValue}
          onChange={handlePscChange}
          type="number"
          placeholder={`${getTranslation("521")} (${getTranslation("47")})`}
          suffix={<Psc />}
        />
      </InputsWrapper>

      <ResultWrapper>
        <Wrapper>
          <Title>{getTranslation("522")}</Title>

          <Value>
            {convertToPersian(calculateFee(rial) || 0)} IRR /{" "}
            {convertToPersian(calculateFee(psc) || 0)} PSC
          </Value>
        </Wrapper>

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
