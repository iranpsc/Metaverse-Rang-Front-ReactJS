import { useContext } from "react";
import { useNavigate } from "react-router";
import EthereumProvider from "@walletconnect/ethereum-provider";
import useRequest from "./useRequest.js";
import { UserContext } from "../services/reducers/UserContext";
import { UserContextTypes } from "../services/actions/UserContextAction";
import {
  getTranslation,
  ToastSuccess,
  ToastError,
  getBrowser,
} from "../services/Utility";

const WALLETCONNECT_PROJECT_ID = "159214f888fe7975147c3ce84bf0e31d"; // dashboard.walletconnect.com
const CHAIN_IDS = [1];

const CHROME_STORE =
  "https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn";

const METAMASK_LINKS = {
  Chrome: CHROME_STORE,
  Brave: CHROME_STORE,
  Opera: CHROME_STORE,
  Edge: "https://microsoftedge.microsoft.com/addons/detail/metamask/ejbalbakoplchlghecdalmeeeajnimhm",
  Firefox: "https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/",
};

const DEFAULT_METAMASK_LINK = "https://metamask.io/download/";

const useWalletLink = () => {
  const { Request, HTTP_METHOD } = useRequest();
  const navigate = useNavigate();
  const [, dispatch] = useContext(UserContext);

  const openMetaMaskInstallPage = async () => {
    const browser = await getBrowser();
    window.open(METAMASK_LINKS[browser] || DEFAULT_METAMASK_LINK, "_blank");
  };

  const updateUserWallet = (walletAddress) => {
    dispatch({
      type: UserContextTypes.UPDATE_FIELD,
      payload: { key: "has_wallet", value: true },
    });
    dispatch({
      type: UserContextTypes.UPDATE_FIELD,
      payload: { key: "wallet_address", value: walletAddress },
    });
  };

  // مرحله‌های مشترک بین هر دو روش: گرفتن nonce، امضا، ثبت در سرور
  const linkWallet = async ({ address, sign }) => {
    const { data: nonceData } = await Request(
      `wallet/link/nonce?address=${address}`,
      HTTP_METHOD.GET,
    );

    const signature = await sign(nonceData.nonce);

    const { data } = await Request("wallet/link", HTTP_METHOD.POST, {
      address,
      signature,
    });

    updateUserWallet(data.wallet_address);
  };

  const connectMetaMask = async () => {
    if (!window.ethereum) {
      alert(getTranslation(1765));
      openMetaMaskInstallPage();
      return;
    }

    try {
      const [address] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      await linkWallet({
        address,
        sign: (nonce) =>
          window.ethereum.request({
            method: "personal_sign",
            params: [nonce, address],
          }),
      });

      ToastSuccess(getTranslation(1766));
      navigate("/");
    } catch (error) {
      ToastError(error?.response?.data?.message);
    }
  };

  const connectWalletConnect = async () => {
    try {
      const provider = await EthereumProvider.init({
        projectId: WALLETCONNECT_PROJECT_ID,
        chains: CHAIN_IDS,
        showQrModal: true,
      });

      await provider.connect();
      const [address] = provider.accounts;

      await linkWallet({
        address,
        sign: (nonce) =>
          provider.request({
            method: "personal_sign",
            params: [nonce, address],
          }),
      });

      ToastSuccess(getTranslation(1767));
      navigate("/");
    } catch (error) {
      console.error("Error during WalletConnect process:", error);
      ToastError(getTranslation(1768));
    }
  };

  return { connectMetaMask, connectWalletConnect };
};

export default useWalletLink;