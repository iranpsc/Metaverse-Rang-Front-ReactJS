import { LuBuilding2 } from "react-icons/lu";
import { useLocation, useNavigate } from "react-router";
import styled from "styled-components";
import psc from "../../../../assets/gif/psc.gif";
import rial from "../../../../assets/gif/rial.gif";
import {
  formatNumber,
  getTranslation,
  metarangUrlCitizen,
} from "../../../../services/Utility";

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

const PropertyId = styled.button`
  padding: 0;
  border: none;
  background: none;
  font-size: 16px;
  font-weight: 500;
  color: #ffc700;
  cursor: pointer;
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
    return (
      <a href={metarangUrlCitizen(value)} target="_blank" rel="noreferrer">
        {value}
      </a>
    );
  }

  return <h2>{type === "price" ? formatNumber(value) : value}</h2>;
};

const Bio = ({ item }) => {
  const navigate = useNavigate();
  const location = useLocation();

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
            icon: psc,
          },
          {
            key: "irr",
            title: getTranslation("44"),
            value: sellRequest.price_irr,
            type: "price",
            icon: rial,
          },
        ]
      : []),
  ];

  const openFeature = () =>
    navigate(`/feature/${item?.id}/info`, {
      state: { from: location.pathname },
    });

  return (
    <Container>
      <Header>
        <IconWrapper>
          <LuBuilding2 size={30} />
        </IconWrapper>

        <Identity>
          <h2>{getTranslation("1478")}</h2>
          <PropertyId type="button" onClick={openFeature}>
            {item?.feature_properties_id}
          </PropertyId>
        </Identity>
      </Header>

      <Rows>
        {rows.map((row) => (
          <Row key={row.key}>
            <Label>
              <h3>{row.title}</h3>
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
