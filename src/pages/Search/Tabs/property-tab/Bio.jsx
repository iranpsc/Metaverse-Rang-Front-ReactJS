import { LuBuilding2 } from "react-icons/lu";
import styled from "styled-components";
import {
  formatNumber,
  getTranslation,
  convertToPersian,
} from "../../../../services/Utility";
import TitleBody from "../../../../components/TitleBody";
import LandText from "../../../../components/LandText";
import UserCode from "../../../../components/UserCode";
import { COLOR_CONFIG } from "../../../../services/constants/colorConfig.js";
const Container = styled.div`
  padding-bottom: 15px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: 100%;
  color: ${({ theme }) => theme.colors.newColors.otherColors.iconText};
  background-color: ${({ theme }) => theme.colors.newColors.otherColors.iconBg};
`;

const Identity = styled.div`
  h2 {
    font-size: 14px;
    color: #a0a0ab;
  }
`;

const Rows = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 20px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;

  h2 {
    max-width: 280px;
    font-size: 16px;
    font-weight: 400;
    color: ${({ theme }) => theme.colors.newColors.shades.title};
  }

  a {
    color: #0066ff;
    text-decoration: none;
  }
`;

const Label = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;

  h3 {
    font-size: 14px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.newColors.shades.title};
  }

  img {
    width: 20px;
    height: 20px;
  }
`;

const renderValue = ({ type, value }) => {
  if (type === "link") {
    return <UserCode code={value} />;
  }
  return (
    <TitleBody
      title={type === "price" ? convertToPersian(formatNumber(value)) : value}
    />
  );
};

const Bio = ({ item }) => {
  const sellRequest = item?.latest_sell_request;

  const rows = [
    { key: "address", title: getTranslation("46"), value: item?.address },
    {
      key: "owner",
      title: getTranslation("43"),
      value: item?.owner_code,
      type: "link",
    },
    ...(sellRequest
      ? [
          {
            key: "psc",
            title: getTranslation("45"),
            value: sellRequest.price_psc,
            type: "price",
            icon: COLOR_CONFIG.psc.gif,
          },
          {
            key: "irr",
            title: getTranslation("44"),
            value: sellRequest.price_irr,
            type: "price",
            icon: COLOR_CONFIG.irr.gif,
          },
        ]
      : []),
  ];

  return (
    <Container>
      <Header>
        <IconWrapper>
          <LuBuilding2 size={30} />
        </IconWrapper>

        <Identity>
          <TitleBody title={getTranslation("1478")} />
          <LandText
            label={item?.feature_properties_id}
            to={`/feature/${item?.id}/info`}
          />
        </Identity>
      </Header>

      <Rows>
        {rows.map((row) => (
          <Row key={row.key}>
            <Label>
              <TitleBody title={row.title} />

              {row.icon && (
                <img
                  src={row.icon}
                  alt=""
                  width={20}
                  height={20}
                  loading="lazy"
                />
              )}
            </Label>

            {renderValue(row)}
          </Row>
        ))}
      </Rows>
    </Container>
  );
};

export default Bio;
