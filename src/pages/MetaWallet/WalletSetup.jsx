import { useContext } from "react";
import styled from "styled-components";
import { getTranslation, isMobile } from "../../services/Utility";
import { UserContext } from "../../services/reducers/UserContext";
import useWalletLink from "../../hooks/useWalletLink";
import Button from "../../components/Button";
import TitleHeader from "../../components/TitleHeader.jsx";
import TitleBody from "../../components/TitleBody.jsx";

const Container = styled.div`
  margin-top: 20px;

  @media (max-width: 768px) {
    margin-top: 0;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
  padding-top: 20px;
`;

const WalletSetup = () => {
  const [{ has_wallet: hasWallet }] = useContext(UserContext);
  const { connectMetaMask, connectWalletConnect } = useWalletLink();

  return (
    <Container>
      <TitleHeader title={getTranslation(1760)} />
      <TitleBody gray title={getTranslation(hasWallet ? 1764 : 1761)} />

      {!hasWallet && (
        <Actions>
          {!isMobile && (
            <Button
              label={getTranslation(1762)}
              onClick={connectMetaMask}
              full
              color="#E27625"
            />
          )}
          <Button
            label={getTranslation(1763)}
            onClick={connectWalletConnect}
            full
            color="#5570FF"
          />
        </Actions>
      )}
    </Container>
  );
};

export default WalletSetup;