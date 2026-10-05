import styled from "styled-components";
import BtnFlagMap from "./BtnFlagMap";
import Status from "./Status";
import PrivateComponent from "../../middleware/PrivateComponent";
import PublicComponent from "../../middleware/PublicComponent";
import ListPositions from "./ListPositions";
import AssetsWallet from "./AssetsWallet";
import { useScrollDirectionContext } from "../../services/reducers/ScrollDirectionContext";
const Container = styled.div`
  display: ${({ show }) => (show ? "none" : "flex")};
  flex-direction: column;
  gap: 5px;
  height: 100%;
`;

const TopSection = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 5px;
  min-height: 0; /* برای اینکه overflow-y در فرزندها کار کنه */
  width: 100%;
`;

const WalletContainer = styled.div`
  width: 100%;
border-radius: 10px 10px 0 0;
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.menuBg};
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 6px;
  padding: 10px;
  flex-shrink: 0; /* ارتفاع کیف پول فشرده نشه */
  transition: all 0.3s ease 0s;

  @media (min-width: 1024px) {
    border-radius: 20px;
    border-radius: 20px 20px 0 0;

  }

  @media (max-height: 420px) {
    gap: 0px;
      padding: 5px 10px;

  }
`;
const FlagMapContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  width: 100%;
  min-height: 0;
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.menuBg};
  padding: 4px 7px 4px 10px;
  overflow-y: auto;
  transition: all 0.3s ease 0s;

 
`;
const StatusContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 10%;
  gap: 5px;
  padding: 10px;
border-radius: 0 0 10px 10px;
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.menuBg};
  flex-shrink: 0;
  transition: all 0.3s ease 0s;

  @media (min-width: 1024px) {
    height: 6%;
border-radius: 0 0 20px 20px;
  }
   @media (max-height: 400px) {
  padding: 5px;
border-radius: 0 0 10px 10px;

  }
`;

const StatusBar = () => {
  const { isGlobalFullScreenMap } = useScrollDirectionContext();
  return (
    <Container show={isGlobalFullScreenMap}>
      <TopSection>
        <WalletContainer>
          <PrivateComponent>
            <AssetsWallet />
          </PrivateComponent>
          <PublicComponent>
            <ListPositions />
          </PublicComponent>
        </WalletContainer>
        <FlagMapContainer>
          <BtnFlagMap />
        </FlagMapContainer>
      </TopSection>

      <StatusContainer>
        <Status />
      </StatusContainer>
    </Container>
  );
};

export default StatusBar;
