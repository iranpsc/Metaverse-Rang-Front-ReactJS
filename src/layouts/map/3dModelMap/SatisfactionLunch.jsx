import { useState, useEffect, useContext } from "react";
import ModalXs from "../../../components/Modal/ModalXs";
import InputNumber from "../../../components/Inputs/InputNumber";
import TextValueIcon from "../../../components/TextValue/TextValueIcon";
import styled from "styled-components";
import WatchIcon from "../../../assets/svg/watch.svg?react";
import Submit from "../../../components/Buttons/Submit";
import { useSelectedEnvironment } from "../../../hooks/useSelectedEnvironment.js";
import {
  WalletContext,
  WalletContextTypes,
} from "../../../services/reducers/WalletContext";
import useRequest from "../../../hooks/useRequest.js";

import {
  getTranslation,
  ToastError,
  ToastSuccess,
} from "../../../services/Utility";
import { useMapData } from "../../../hooks/useMapData.js";

const Icon = styled(WatchIcon)`
  stroke: ${(props) => props.theme.colors.primary};
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const SatisfactionLunch = ({
  position,
  rotation,
  handleExitClick,
  handelSubmitEnvironment,
}) => {
  const { selectedEnvironment, formState } = useSelectedEnvironment();
  const { Request, HTTP_METHOD, checkSecurity } = useRequest();
  const [Wallet, dispatch] = useContext(WalletContext);
  const initialSatisfaction =
    Wallet && Wallet.satisfaction ? parseFloat(Wallet.satisfaction) : 0;
  const [inputValue, setInputValue] = useState(initialSatisfaction.toString());
  const { addBuilding } = useMapData();

  const [error, setError] = useState(false);
  const [formData, setFormData] = useState({
    activity_line: "",
    address: "",
    description: "",
    name: "",
    postal_code: "",
    website: "",
    launched_satisfaction: 0,
    rotation: 0,
    position: "",
  });

  useEffect(() => {
    setFormData({
      activity_line: formState.activity_line,
      address: formState.address,
      description: formState.description,
      name: formState.name,
      postal_code: formState.postal_code,
      website: formState.website,
      launched_satisfaction: inputValue,
      rotation: rotation,
      position: `${position[0]}, ${position[1]}`,
    });
  }, [formState, inputValue, position, rotation]);

  const SatisfactionRequired = selectedEnvironment?.required_satisfaction;
  const satisfaction = Number(SatisfactionRequired);
  const input = Number(inputValue);

  const hourOfComplete =
    satisfaction > 0 && input > 0 ? (satisfaction * 288000) / input : 0;

  const dayOfComplete = hourOfComplete / 24;

  const base = Number(Wallet.satisfaction) || 0;
  const extra = Number(input) || 0;
  const total = base - extra;

  const handleInputChange = (event) => {
    const value = event.target.value;
    const inputNumberValue = parseFloat(value);
    if (
      inputNumberValue > initialSatisfaction ||
      inputNumberValue < SatisfactionRequired
    ) {
      setError(true);
    } else {
      setError(false);
    }

    setInputValue(value);
  };

  const handleSubmit = () => {
    if (!checkSecurity()) return;

    Request(
      `features/${formState.featureId}/build/${selectedEnvironment.id}`,
      HTTP_METHOD.POST,
      formData,
    )
      .then((res) => {
        addBuilding(res.data.data.building_models[0]);
        handelSubmitEnvironment();
        ToastSuccess(getTranslation("1606"));
        dispatch({
          type: WalletContextTypes.ADD_WALLET,
          payload: {
            ...Wallet,
            satisfaction: total,
          },
        });
      })
      .catch((err) => {
        ToastError(err.response.data.message);
      });
  };

  return (
    <ModalXs
      title={"561"}
      handleExitClick={handleExitClick}
      handelSubmitEnvironment={handelSubmitEnvironment}
    >
      <Container>
        <InputNumber
          placeholder={getTranslation("561")}
          value={inputValue}
          onChange={handleInputChange}
          Error={error}
        />
        <TextValueIcon
          title={getTranslation("379")}
          icon={<Icon />}
          value={dayOfComplete.toFixed(2)}
        />
        <Submit
          text={getTranslation("561")}
          type="primary"
          options={{
            style: {
              alignSelf: "start",
            },
            onClick: handleSubmit,
          }}
        />
      </Container>
    </ModalXs>
  );
};

export default SatisfactionLunch;
