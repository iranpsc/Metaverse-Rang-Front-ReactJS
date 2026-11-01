// دکمه‌های عملیات یک ملک روی نقشه (خرید یا فروش، پیشنهاد قیمت و رفتن به موقعیت ملک)؛ دکمه‌ی خرید فقط برای زمین سیستم یا زمینی که درخواست فروش دارد نمایش داده می‌شود و دکمه‌ی فروش همیشه برای مالک است

import { useContext } from "react";
import {
  HiOutlineCurrencyDollar,
  HiOutlineLocationMarker,
} from "react-icons/hi";
import { LuShoppingCart } from "react-icons/lu";
import { useMap } from "react-map-gl/maplibre";
import { useLocation, useNavigate } from "react-router";
import styled from "styled-components";
import Button from "../../../../components/Button";
import { UserContext } from "../../../../services/reducers/UserContext";
import { getTranslation } from "../../../../services/Utility";
import { calculatePolygonCentroid } from "../../../../services/Utility/calculatePolygonCentroid";
import { flyToMapPosition } from "../../../../services/Utility/flyToMapPosition";

const MAP_ZOOM = 17;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  margin-top: 15px;
`;

const Buttons = ({ item, system }) => {
  const [user] = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const mapRef = useMap();

  const isOwner =
    Boolean(user?.code) &&
    user.code.toUpperCase() === item?.owner_code?.toUpperCase();

  // مالک همیشه دکمه‌ی فروش دارد؛ دیگران فقط وقتی زمین مال سیستم است یا درخواست فروش دارد دکمه‌ی خرید می‌بینند
  const showMain = isOwner || system || Boolean(item?.latest_sell_request);

  const goTo = (path) =>
    navigate(`/feature/${item?.id}/${path}`, {
      state: { from: location.pathname },
    });

  const flyToFeature = () => {
    const center = calculatePolygonCentroid(item?.coordinates);

    flyToMapPosition({
      latitude: center.y,
      longitude: center.x,
      mapRef,
      zoom: MAP_ZOOM,
    });
  };

  const actions = [
    showMain && {
      key: "main",
      label: getTranslation(isOwner ? "519" : "353"),
      icon: <LuShoppingCart />,
      onClick: () => goTo(isOwner ? "sell/PriceDefine" : "buy/price"),
    },
    !system &&
      !isOwner && {
        key: "suggest",
        label: getTranslation("472"),
        icon: <HiOutlineCurrencyDollar />,
        onClick: () => goTo("buy/suggest"),
      },
    {
      key: "locate",
      label: getTranslation("473"),
      icon: <HiOutlineLocationMarker />,
      onClick: flyToFeature,
    },
  ].filter(Boolean);

  return (
    <Container>
      {actions.map(({ key, label, icon, onClick }) => (
        <Button
          key={key}
          fill
          grow
          pill
          icon={icon}
          label={label}
          onClick={onClick}
        />
      ))}
    </Container>
  );
};

export default Buttons;
