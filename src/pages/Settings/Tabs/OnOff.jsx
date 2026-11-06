// کلید روشن/خاموش (سوییچ) استاندارد؛ مناسب تنظیمات دو حالته مثل فعال/غیرفعال کردن اعلان‌ها که مقدار را از والد می‌گیرد و با کلیک مقدار جدید را به onToggle می‌دهد

import styled from "styled-components";

const WIDTH = "clamp(36px, 4.5vw, 45px)";
const HEIGHT = "clamp(20px, 2.5vw, 25px)";
const GAP = "clamp(1.5px, 0.2vw, 2px)";

const Track = styled.button`
  --switch-height: ${HEIGHT};
  --switch-gap: ${GAP};
  --switch-knob-size: calc(
    var(--switch-height) - var(--switch-gap) - var(--switch-gap)
  );
  position: relative;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  width: ${WIDTH};
  height: ${HEIGHT};
  padding: 0;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s linear;
  background-color: ${({ $active, theme }) =>
    $active ? theme.colors.primary : "#cccccc"};
`;

const Knob = styled.span`
  position: absolute;
  top: var(--switch-gap);
  left: ${({ $active }) =>
    $active
      ? "calc(100% - var(--switch-knob-size) - var(--switch-gap))"
      : "var(--switch-gap)"};
  width: var(--switch-knob-size);
  height: var(--switch-knob-size);
  border-radius: 50%;
  transition: all 0.2s linear;
  background-color: ${({ $active, theme }) =>
    $active ? theme.colors.newColors.otherColors.toggleBg : "white"};
`;

// توجه: isOn=false یعنی کلید رنگی (فعال) نمایش داده می‌شود
const OnOff = ({ isOn, onToggle, label, disabled = false }) => {
  const active = !isOn;

  return (
    <Track
      type="button"
      role="switch"
      aria-checked={active}
      aria-label={label}
      $active={active}
      disabled={disabled}
      onClick={() => onToggle?.(!active)}
    >
      <Knob $active={active} />
    </Track>
  );
};

export default OnOff;
