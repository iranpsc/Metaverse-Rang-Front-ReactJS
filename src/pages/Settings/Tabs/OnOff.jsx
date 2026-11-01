// کلید روشن/خاموش (سوییچ) استاندارد؛ مناسب تنظیمات دو حالته مثل فعال/غیرفعال کردن اعلان‌ها که مقدار را از والد می‌گیرد و با کلیک مقدار جدید را به onToggle می‌دهد

import styled from "styled-components";

const WIDTH = 45;
const HEIGHT = 25;
const GAP = 2; 
const KNOB_SIZE = HEIGHT - GAP * 2;

const Track = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  width: ${WIDTH}px;
  height: ${HEIGHT}px;
  margin-top: 5px;
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
  top: ${GAP}px;
  left: ${({ $active }) => ($active ? WIDTH - KNOB_SIZE - GAP : GAP)}px;
  width: ${KNOB_SIZE}px;
  height: ${KNOB_SIZE}px;
  border-radius: 50%;
  transition: all 0.2s linear;
  background-color: ${({ $active, theme }) =>
    $active ? theme.colors.newColors.otherColors.toggleBg : "white"};
`;

// توجه: isOn=false یعنی کلید رنگی (فعال) نمایش داده می‌شود
const OnOff = ({ isOn, onToggle }) => {
  const active = !isOn;

  return (
    <Track
      type="button"
      role="switch"
      aria-checked={active}
      $active={active}
      onClick={() => onToggle(!active)}
    >
      <Knob $active={active} />
    </Track>
  );
};

export default OnOff;
