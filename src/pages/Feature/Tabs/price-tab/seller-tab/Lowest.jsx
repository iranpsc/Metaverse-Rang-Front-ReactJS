import { useContext, useState } from "react";
import styled from "styled-components";
import Button from "../../../../../components/Button";
import Container from "../../../../../components/Common/Container";
import { UserContext } from "../../../../../services/reducers/UserContext";
import { FeatureContext } from "../../../Context/FeatureProvider";
import useRequest from "../../../../../services/Hooks/useRequest";
import {
  getTranslation,
  TimeAgo,
  ToastError,
  ToastSuccess,
  formatNumber,
} from "../../../../../services/Utility";
import ResultInfo from "../../../components/ResultInfo";

const ADULT_AGE = 18;
const MIN_PERCENTAGE_ADULT = 80;
const MIN_PERCENTAGE_DEFAULT = 110;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const Text = styled.p`
  color: ${(props) => props.theme.colors.newColors.shades.title};
  line-height: 1.8rem;
`;

const InputWrapper = styled.div`
  height: 50px;
  position: relative;
  border-radius: 5px;
  border: 1px solid
    ${(props) => props.theme.colors.newColors.otherColors.inputBorder};
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.inputBg};
  overflow: hidden;
  width: 276px;
`;

const Input = styled.input`
  position: absolute;
  top: 0;
  right: 0;
  width: 80%;
  height: 50px;
  border: none;
  outline: none;
  padding-right: 10px;
  color: ${(props) => props.theme.colors.newColors.shades.title};
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.inputBg};

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const Span = styled.span`
  position: absolute;
  color: gray;
  left: 10px;
  top: 24%;
`;

const getPercentageRule = (birthdate) => {
  if (!birthdate) {
    return { min: MIN_PERCENTAGE_DEFAULT, errorKey: 1647 };
  }

  const min =
    TimeAgo(birthdate) >= ADULT_AGE
      ? MIN_PERCENTAGE_ADULT
      : MIN_PERCENTAGE_DEFAULT;

  return { min, errorKey: 1632 };
};

const Lowest = () => {
  const [user] = useContext(UserContext);
  const [feature, setFeature] = useContext(FeatureContext);
  const { Request, HTTP_METHOD, checkSecurity } = useRequest();

  const [percentage, setPercentage] = useState(
    feature?.properties?.minimum_price_percentage || ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const priceIrr = feature?.properties?.price_irr;
  const pricePsc = feature?.properties?.price_psc;
  const hasPrice = +priceIrr !== 0 || +pricePsc !== 0;
  const onSubmit = async () => {
    if (isSubmitting) return;

    const { min, errorKey } = getPercentageRule(user?.birthdate);

    if (Number(percentage) < min) {
      ToastError(getTranslation(errorKey));
      return;
    }

    if (!checkSecurity()) return;

    setIsSubmitting(true);

    try {
      const res = await Request(
        `my-features/${user.id}/features/${feature?.id}`,
        HTTP_METHOD.POST,
        { minimum_price_percentage: +percentage }
      );

      const { price_irr, price_psc } = res.data.data;

      setFeature((prev) => ({
        ...prev,
        properties: {
          ...prev.properties,
          minimum_price_percentage: percentage,
          price_irr,
          price_psc,
        },
      }));

      ToastSuccess(getTranslation(1634));
    } catch (error) {
      ToastError(error.response?.data?.message ?? error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <Wrapper>
        <Text>{getTranslation("518")}</Text>

        <InputWrapper>
          <Input
            value={percentage}
            onChange={(e) => setPercentage(e.target.value)}
            type="number"
            min={0}
            max={100}
            placeholder="100"
          />
          <Span>%</Span>
        </InputWrapper>

        <Button
          label={getTranslation("519")}
          onClick={onSubmit}
          disabled={isSubmitting ? "pending" : false}
        />

        {hasPrice && (
          <ResultInfo
            lowest
            rial={formatNumber(priceIrr || "")}
            psc={formatNumber(pricePsc || "")}
          />
        )}
      </Wrapper>
    </Container>
  );
};

export default Lowest;
