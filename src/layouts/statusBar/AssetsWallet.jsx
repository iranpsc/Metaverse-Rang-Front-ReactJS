
import { useContext } from "react";
import { WalletContext } from "../../services/reducers/WalletContext";
import styled from "styled-components";
import { convertToPersian, formatAmount } from "../../services/Utility";
import { COLOR_CONFIG } from "../../services/constants/colorConfig.js";

const Asset = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

`;

const ImgAsset = styled.img`
  width: 25px;
  height: 25px;
  @media (min-width: 1024px) {
    width: 35px;
    height: 35px;
  }
    @media (max-height: 400px) {
    width: 20px;
    height: 20px;
  }
`;

const TextAsset = styled.p`
  color: ${({ theme }) => theme.colors.newColors.otherColors.mutedText};
  font-size: 15px;
  font-style: normal;
  font-weight: 500;
  line-height: 180%; /* 25.2px */
  text-transform: capitalize;
  @media (min-width: 1024px) {
    font-size: 17px;
  }
      @media (max-height: 400px) {
  font-size: 12px;

  }
`;

const Line = styled.div`
  display: none;
  width: 100%;
  height: 2px;
  background-color: #efefef;

  @media (min-height: 451px) {
    display: block;
  }
`;
const AssetItem = ({ value, img, index, totalassets }) => (
  <>
    <Asset>
      <TextAsset>{convertToPersian(formatAmount(value) || "0.000")}</TextAsset>
      <ImgAsset src={img}  alt=""/>
    </Asset>
    {index !== totalassets - 1 && <Line />}
  </>
);

const AssetsWallet = () => {
  const [wallet] = useContext(WalletContext);

  const assets = [
    { title: "blue", value: wallet?.blue, img: COLOR_CONFIG.blue.gif },
    { title: "red", value: wallet?.red, img: COLOR_CONFIG.red.gif },
    { title: "yellow", value: wallet?.yellow, img: COLOR_CONFIG.yellow.gif },
    {
      title: "satisfaction",
      value: wallet?.satisfaction,
      img: COLOR_CONFIG.satisfaction.gif,
    },
    { title: "psc", value: wallet?.psc, img: COLOR_CONFIG.psc.gif },
    { title: "irr", value: wallet?.irr, img: COLOR_CONFIG.irr.gif },
  ];

  return (
    <>
      {assets.map((asset, index) => (
        <AssetItem
          key={asset.title}
          title={asset.title}
          value={asset.value}
          img={asset.img}
          index={index}
          totalassets={assets.length}
        />
      ))}
    </>
  );
};

export default AssetsWallet;
