import styled from "styled-components";
import { useContext } from "react";
import ColorCard from "./ColorCard";
import gif1 from "../../../../assets/gif/limit-of-influence.gif";
import gif2 from "../../../../assets/gif/yellow-color.gif";
import gif3 from "../../../../assets/gif/red-color.gif";
import gif4 from "../../../../assets/gif/blue-color.gif";
import gif5 from "../../../../assets/gif/rial.gif";
import gif6 from "../../../../assets/gif/psc.gif";
import { getTranslation } from "../../../../services/Utility";
import { Skeleton } from "../../../../components/Skeleton";
import { WalletContext } from "../../../../services/reducers/WalletContext.jsx";

const COLOR_ITEMS = [
  { key: "effect", gif: gif1, labelKey: "723" },
  { key: "yellow", gif: gif2, labelKey: "51" },
  { key: "red", gif: gif3, labelKey: "50" },
  { key: "blue", gif: gif4, labelKey: "49" },
  { key: "irr", gif: gif5, labelKey: "48" },
  { key: "psc", gif: gif6, labelKey: "47" },
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
