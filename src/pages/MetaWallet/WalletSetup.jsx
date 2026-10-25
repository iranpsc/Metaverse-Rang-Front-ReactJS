import styled from "styled-components";
import {
  getTranslation,
  ToastSuccess,
  ToastError,
  getBrowser,
  isMobile,
} from "../../services/Utility";
import Button from "../../components/Button";
import useRequest from "../../hooks/useRequest.js";
import { useNavigate } from "react-router";
import { UserContext } from "../../services/reducers/UserContext";
import { useContext } from "react";
import { UserContextTypes } from "../../services/actions/UserContextAction";
import EthereumProvider from "@walletconnect/ethereum-provider";
const Container = styled.div`
  margin-top: 20px;

  h3 {
    color: ${(props) => props.theme.colors.newColors.shades.title};
    font-size: 16px;
    font-weight: 400;
  }

  p {
    color: ${(props) => props.theme.colors.newColors.otherColors.gray};
    font-size: 16px;
    font-weight: 400;
  }

  @media (max-width: 768px) {
    margin-top: 0;

    h3,
    p {
      font-size: 14px;
    }
  }
`;

const WalletSetup = () => {
  const { Request, HTTP_METHOD } = useRequest();
  const navigate = useNavigate();
  const [user, dispatch] = useContext(UserContext);
  // 1. Detect MetaMask availability

  const handleSend = async () => {
    try {
      if (!window.ethereum) {
        alert(getTranslation(1765));
        getBrowser().then((browser) => {
          const metamaskLinks = {
            Chrome:
              "https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn",

            Brave:
              "https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn",

            Opera:
              "https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn",

            Edge: "https://microsoftedge.microsoft.com/addons/detail/metamask/ejbalbakoplchlghecdalmeeeajnimhm",

            Firefox:
              "https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/",
          };

          const url = metamaskLinks[browser];

          if (url) {
            window.open(url, "_blank");
          } else {
            window.open("https://metamask.io/download/", "_blank");
          }
        });

        return;
      }
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const address = accounts[0];


      const nonceResponse = await Request(
        `wallet/link/nonce?address=${address}`,
        HTTP_METHOD.GET,
      );

      const nonce = nonceResponse.data.nonce;


      const signature = await window.ethereum.request({
        method: "personal_sign",
        params: [nonce, address],
      });


      const linkResponse = await Request("wallet/link", HTTP_METHOD.POST, {
        address,
        signature,
      });

      dispatch({
        type: UserContextTypes.UPDATE_FIELD,
        payload: {
          key: "has_wallet",
          value: true,
        },
      });

      dispatch({
        type: UserContextTypes.UPDATE_FIELD,
        payload: {
          key: "wallet_address",
          value: linkResponse.data.wallet_address,
        },
      });

      ToastSuccess(getTranslation(1766));
      navigate("/");
    } catch (error) {
      ToastError(error?.response?.data.message);
    }
  };
  const handleWalletConnect = async () => {
    try {
      //dashboard.walletconnect.com for projectId
      const provider = await EthereumProvider.init({
        projectId: "159214f888fe7975147c3ce84bf0e31d",
        chains: [1],
        showQrModal: true,
      });

      await provider.connect();

      const accounts = provider.accounts;
      const address = accounts[0];


      const nonceResponse = await Request(
        `wallet/link/nonce?address=${address}`,
        HTTP_METHOD.GET,
      );

      const nonce = nonceResponse.data.nonce;

      const signature = await provider.request({
        method: "personal_sign",
        params: [nonce, address],
      });

      const linkResponse = await Request("wallet/link", HTTP_METHOD.POST, {
        address,
        signature,
      });

      dispatch({
        type: UserContextTypes.UPDATE_FIELD,
        payload: {
          key: "has_wallet",
          value: true,
        },
      });

      dispatch({
        type: UserContextTypes.UPDATE_FIELD,
        payload: {
          key: "wallet_address",
          value: linkResponse.data.wallet_address,
        },
      });

      ToastSuccess(getTranslation(1767));

      navigate("/");
    } catch (error) {
      console.error("Error during WalletConnect process:", error);
      ToastError(getTranslation(1768));
    }
  };
  return (
    <Container>
      <h3>{getTranslation(1760)}</h3>
      {user.has_wallet ? (
        <p> {getTranslation(1764)}</p>
      ) : (
        <p>{getTranslation(1761)}</p>
      )}

      {user.has_wallet == false && (
        <div style={{ display: "flex", gap: "10px" }}>
          {!isMobile && (
            <Button
              label={getTranslation(1762)}
              onClick={handleSend}
              full
              color="#E27625"
            />
          )}

          <Button
            label={getTranslation(1763)}
            onClick={handleWalletConnect}
            full
            color="#5570FF"
          />
        </div>
      )}
    </Container>
  );
};

export default WalletSetup;
