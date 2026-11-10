import React from "react";
import styled from "styled-components";
import { getTranslation } from "../../services/Utility";
import { useTranslation } from "react-i18next";
import mataphoto from "../../assets/images/showcase/3ddevelop.jpg";
import ToolTip from "../../components/Tooltip/Tooltip";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100%;
  width: 100%;
  gap: 5px;
`;
const ContainerList = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: start;
  flex-direction: column;
  max-height: 90%;
  padding: 0 10px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background-color: "#DDDDDD";
  }

  &::-webkit-scrollbar-thumb {
    background-color: "#858585";
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #999;
  }
`;

const Text = styled.p`
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.themeBtn};
  font-size: 12px;
  width: 20px;
  height: 20px;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const ContainerTextTooltip = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
`;
const ImgPosition = styled.img`
  width: 114px;
  height: 114px;
  border-radius: 12px;
`;
const Hr = styled.div`
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.iconText};
  width: 100%;
  padding: 0 15px;
  height: 2px;
  margin-bottom: 10px;
  opacity: 0.4;
`;

const TooltipContent = ({ imgSrc, name, lang, href, onlineUser }) => {
  return (
    <ToolTip
      lang={lang}
      place="right-end"
      width={262}
      height={161}
      content={
        <>
          {name}
          <Hr />
          <ContainerTextTooltip>
            <Text>{onlineUser} </Text>
            {getTranslation("252")}
          </ContainerTextTooltip>
          <Hr />
          <ContainerTextTooltip>
            <Text>0</Text>
            {getTranslation("253")}
          </ContainerTextTooltip>
        </>
      }
      Chidren={
        <a href={href} target="_blank" rel="noreferrer">
          <ImgPosition src={imgSrc} />
        </a>
      }
    />
  );
};

const ListPositions = () => {
  const { i18n } = useTranslation();

  return (
    <Container>
      <ContainerList>
        <React.Fragment>
          <TooltipContent
            imgSrc={mataphoto}
            name={getTranslation("1591")}
            lang={i18n.language}
            href="https://dev1-world-3d.metarang.com"
            onlineUser={"20"}
          />
        </React.Fragment>
      </ContainerList>
    </Container>
  );
};

export default ListPositions;