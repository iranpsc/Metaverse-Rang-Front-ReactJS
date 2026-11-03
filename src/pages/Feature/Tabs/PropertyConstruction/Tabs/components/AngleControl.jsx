// Fixed floating card for placing a model on the map: first step sets the rotation angle, second step (same card, same buttons and theme, only the content changes) registers satisfaction and submits the build; suitable for map/3D placement flows.
import { useContext, useState } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import TitleBody from "../../../../../../components/TitleBody.jsx";
import Button from "../../../../../../components/Button";
import WatchIcon from "../../../../../../assets/svg/watch.svg?react";
import useRequest from "../../../../../../hooks/useRequest.js";
import { useMapData } from "../../../../../../hooks/useMapData.js";
import { useSelectedEnvironment } from "../../../../../../hooks/useSelectedEnvironment.js";
import {
  getTranslation,
  ToastError,
  ToastSuccess,
  convertToPersian,
  formatNumber,
  convertToEnglish,
} from "../../../../../../services/Utility";
import {
  WalletContext,
  WalletContextTypes,
} from "../../../../../../services/reducers/WalletContext";

const GREEN = "#3fbf7f";
const RED = "#e53935";

const COMPACT = {
  height: 30,
  padding: "0 10px",
  fontSize: 13,
  borderRadius: 6,
};

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9998;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  box-sizing: border-box;
  padding: 16px 16px calc(24px + env(safe-area-inset-bottom));
  pointer-events: none;
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  background-color: ${({ theme }) =>
    theme.colors.newColors.otherColors.bgContainer};
  width: 100%;
  max-width: 360px;
  padding: 14px 16px;
  border-radius: 14px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  pointer-events: auto;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: space-between;
  div {
    justify-content: center;
    align-items: center;
    display: flex;
    gap: 10px;
  }
`;

const Slider = styled.input`
  flex: 1;
  height: 4px;
  appearance: none;
  border-radius: 4px;
  background-color: #dfe3ea;
  outline: none;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 2px solid ${({ theme }) => theme.colors.primary};
    background-color: #fff;
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 2px solid ${({ theme }) => theme.colors.primary};
    background-color: #fff;
    cursor: pointer;
  }
`;

const Input = styled.input`
  flex: 1;
  min-width: 0;
  height: 36px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid ${({ $error }) => ($error ? RED : "#cfd5df")};
  background-color: #f4f6f9;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: ${({ $error }) => ($error ? RED : GREEN)};
  }
`;

const RotateIcon = styled.svg`
  flex-shrink: 0;
  stroke: ${({ theme }) => theme.colors.primary};
`;

const Icon = styled(WatchIcon)`
  flex-shrink: 0;
  stroke: ${GREEN};
`;

const ConfirmButton = ({ label, onClick, disabled }) => (
  <Button
    label={label}
    color={GREEN}
    textColor="#fff"
    disabled={disabled}
    onClick={onClick}
    style={{ ...COMPACT, padding: "0 14px" }}
  />
);

const CancelButton = ({ onClick }) => (
  <Button
    label="✕"
    color="#fbdada"
    textColor={RED}
    onClick={onClick}
    style={{
      ...COMPACT,
      width: 30,
      padding: 0,
      fontSize: 16,
    }}
  />
);

const PRESETS = [-90, 180, 90];

const SatisfactionForm = ({
  rotation,
  position,
  onBack,
  onCancel,
  onSubmitted,
}) => {
  const { selectedEnvironment, formState } = useSelectedEnvironment();
  const { Request, HTTP_METHOD, checkSecurity } = useRequest();
  const [wallet, dispatch] = useContext(WalletContext);
  const { addBuilding } = useMapData();

  const balance = parseFloat(wallet?.satisfaction) || 0;
  const required = Number(selectedEnvironment?.required_satisfaction);
  const [inputValue, setInputValue] = useState(String(balance));

  const input = Number(inputValue);
  const error = !(input >= required && input <= balance);
  const days = required > 0 && input > 0 ? (required * 288000) / input / 24 : 0;

  const handleSubmit = () => {
    if (error || !checkSecurity()) return;
    const { activity_line, address, description, name, postal_code, website } =
      formState;

    Request(
      `features/${formState.featureId}/build/${selectedEnvironment.id}`,
      HTTP_METHOD.POST,
      {
        activity_line,
        address,
        description,
        name,
        postal_code,
        website,
        launched_satisfaction: inputValue,
        rotation: (rotation * Math.PI) / 180,
        position: `${position.latitude}, ${position.longitude}`,
      },
    )
      .then((res) => {
        dispatch({
          type: WalletContextTypes.ADD_WALLET,
          payload: { ...wallet, satisfaction: balance - input },
        });
        console.log("res", res.data);
        addBuilding(res.data.data.building_models[0]);

        ToastSuccess(getTranslation("1606"));
        onSubmitted();
      })
      .catch((err) => ToastError(err.response.data.message));
  };
  return (
    <>
      <Row>
        <Input
          type="text"
          inputMode="decimal"
          placeholder={getTranslation("561")}
          value={convertToPersian(inputValue)}
          $error={error}
          onChange={(e) =>
            setInputValue(
              convertToEnglish(e.target.value).replace(/[^\d.]/g, ""),
            )
          }
        />
      </Row>
      <Row>
        <div>
          {" "}
          <Icon width="24" height="24" />
          <TitleBody title={getTranslation("379")} />
        </div>
        <div>
          {" "}
          <TitleBody title={getTranslation("380")} />
          <TitleBody title={convertToPersian(formatNumber(days))} />
        </div>
      </Row>
      <Row>
        <div>
          {" "}
          <ConfirmButton
            label={getTranslation("561")}
            disabled={error}
            onClick={handleSubmit}
          />
          <Button
            label={getTranslation("855")}
            grayTheme
            onClick={onBack}
            style={COMPACT}
          />
        </div>

        <CancelButton onClick={onCancel} />
      </Row>
    </>
  );
};

const AngleControl = ({
  step = "angle",
  value = 0,
  position,
  onChange,
  onConfirm,
  onCancel,
  onBack,
  onSubmitted,
  label = "زاویه",
}) =>
  createPortal(
    <Overlay role="dialog" aria-modal="false">
      <Card>
        {step === "form" ? (
          <SatisfactionForm
            rotation={value}
            position={position}
            onBack={onBack}
            onCancel={onCancel}
            onSubmitted={onSubmitted}
          />
        ) : (
          <>
            <Row>
              <TitleBody title={label} />
              <RotateIcon
                width="44"
                height="44"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 12a8 8 0 0 1-13.5 5.8M4 12a8 8 0 0 1 13.5-5.8" />
                <path d="M17.5 3v3.2h-3.2M6.5 21v-3.2h3.2" />
              </RotateIcon>
              <Slider
                type="range"
                min={-180}
                max={360}
                step={0.1}
                value={value}
                onChange={(e) => onChange?.(Number(e.target.value))}
              />
            </Row>
            <Row>
              <div>
                {" "}
                <ConfirmButton label="تایید ساخت" onClick={onConfirm} />
                {PRESETS.map((angle) => (
                  <Button
                    key={angle}
                    label={`${convertToPersian(angle)}°`}
                    grayTheme
                    onClick={() => onChange?.(angle)}
                    style={COMPACT}
                  />
                ))}
              </div>

              <CancelButton onClick={onCancel} />
            </Row>
          </>
        )}
      </Card>
    </Overlay>,
    document.body,
  );

export default AngleControl;
