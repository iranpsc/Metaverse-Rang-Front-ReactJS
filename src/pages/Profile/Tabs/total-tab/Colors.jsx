import styled from "styled-components";
import { useContext } from "react";
import ColorCard from "./ColorCard";
import { getTranslation } from "../../../../services/Utility";
import { Skeleton } from "../../../../components/Skeletons/Skeleton.jsx";
import { WalletContext } from "../../../../services/reducers/WalletContext.jsx";
import { COLOR_CONFIG } from "../../../../services/constants/colorConfig.js";

const COLOR_ITEMS = [
  { key: "effect", ...COLOR_CONFIG.effect },
  { key: "yellow", ...COLOR_CONFIG.yellow },
  { key: "red", ...COLOR_CONFIG.red },
  { key: "blue", ...COLOR_CONFIG.blue },
  { key: "irr", ...COLOR_CONFIG.irr },
  { key: "psc", ...COLOR_CONFIG.psc },
];

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const Colors = () => {
  const [walletData] = useContext(WalletContext);

  return (
    <Container>
      {COLOR_ITEMS.map(({ key, gif, labelKey }) =>
        walletData ? (
          <ColorCard
            key={key}
            gif={gif}
            label={getTranslation(labelKey)}
            value={walletData[key]}
          />
        ) : (
          <Skeleton key={key} height="150px" />
        ),
      )}
    </Container>
  );
};

export default Colors;
