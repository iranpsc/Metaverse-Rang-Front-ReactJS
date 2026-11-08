import styled from "styled-components";
import { getTranslation } from "../services/Utility";
import { COLOR_CONFIG } from "../services/constants/colorConfig.js";

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;

  span {
    color: ${({ $color }) => $color};
  }
`;

const Icon = styled.img`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
`;

const WalletAsset = ({ asset, showLabel = false, color, size = 26 }) => {
  const config = COLOR_CONFIG[asset];
  if (!config) return null;

  return (
    <Container $color={color}>
      {showLabel && config.labelKey && (
        <span>{getTranslation(config.labelKey)}</span>
      )}
      <Icon src={config.gif} alt={asset} $size={size} />
    </Container>
  );
};

export default WalletAsset;
