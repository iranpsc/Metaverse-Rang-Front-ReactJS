
import {
  HiOutlineCurrencyDollar,
  HiOutlineLocationMarker,
} from "react-icons/hi";
import { LuShoppingCart } from "react-icons/lu";
import { useMap } from "react-map-gl/maplibre";
import { useNavigate } from "react-router";
import styled from "styled-components";
import { useContext } from "react";
import { getTranslation } from "../../../../services/Utility";
import { flyToMapPosition } from "../../../../services/Utility/flyToMapPosition";
import { calculatePolygonCentroid } from "../../../../services/Utility/calculatePolygonCentroid";
import { UserContext } from "../../../../services/reducers/UserContext";
const IconWrapper = styled.div`
  border-radius: 60px;
  background-color: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.newColors.primaryText};
  display: flex;
  flex-grow: 1;
  justify-content: center;
  padding: 8px 12px 3px 15px;
  gap: 5px;
  cursor: pointer;
  svg {
    font-size: 23px;
    padding-top: 5px;
  }
  h2 {
    white-space: nowrap;
    font-size: 16px;
    font-weight: 700;
  }
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 15px;
  gap: 15px;
`;

const Buttons = ({ item, system }) => {
  const [user] = useContext(UserContext);
  const Navigate = useNavigate();
  const center = calculatePolygonCentroid(item?.coordinates);
  const mapRef = useMap();
  const isOwner =
    user.code?.toUpperCase() === item.owner_code?.toUpperCase();
  const items = [
    {
      id: 1,
      label: !isOwner ? getTranslation("353") : getTranslation("519"),
      icon: <LuShoppingCart />,
      onClick: () => !isOwner ? Navigate(`/feature/${item?.id}/buy/price`, {
        state: {
          from: location.pathname,
        }
      }) : Navigate(`/feature/${item?.id}/sell/PriceDefine`, {
        state: {
          from: location.pathname,
        }
      })

    },
    {
      id: 3,
      label: getTranslation("473"),
      icon: <HiOutlineLocationMarker />,
      onClick: () => {
        flyToMapPosition({
          latitude: center.y,
          longitude: center.x,
          mapRef: mapRef,
          zoom: 17,
        });
      },
    },
  ];

  if (!system && !isOwner) {
    items.splice(1, 0, {
      id: 2,
      label: getTranslation("472"),
      icon: <HiOutlineCurrencyDollar />,
      onClick: () => {
        Navigate(`/feature/${item?.id}/buy/suggest`, {
          state: {
            from: location.pathname,
          }
        },);
      },
    });
  }

  return (
    <Container>
      {items.map((item) => (
        <IconWrapper key={item.id} onClick={item.onClick}>
          <span>{item.icon}</span>
          <h2>{item.label}</h2>
        </IconWrapper>
      ))}
    </Container>
  );
};

export default Buttons;
