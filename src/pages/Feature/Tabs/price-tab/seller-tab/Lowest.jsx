import { useContext, useState } from "react";
import styled from "styled-components";
import Button from "../../../../../components/Button";
import Container from "../../../../../components/Common/Container";
import { UserContext } from "../../../../../services/reducers/UserContext";
import { FeatureContext } from "../../../Context/FeatureProvider";
import useRequest from "../../../../../hooks/useRequest.js";
import LabeledInput from "../../../../../components/LabeledInput.jsx";
import {
  getTranslation,
  TimeAgo,
  ToastError,
  ToastSuccess,
  formatNumber,
} from "../../../../../services/Utility";
import ResultInfo from "../../../components/ResultInfo";
import TitleBody from "../../../../../components/TitleBody.jsx";
const ADULT_AGE = 18;
const MIN_PERCENTAGE_ADULT = 80;
const MIN_PERCENTAGE_DEFAULT = 110;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
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
    feature?.properties?.minimum_price_percentage || "",
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
        { minimum_price_percentage: +percentage },
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
    } catch {
      // useRequest already displays request errors.
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <Wrapper>
        <TitleBody title={getTranslation(518)} />

        <LabeledInput
          value={percentage}
          onChange={(e) => setPercentage(e.target.value)}
          type="number"
          maxLength={3}
          placeholder="100"
          suffix="%"
          width="276px"
        />

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
