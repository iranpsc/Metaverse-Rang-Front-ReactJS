import { useContext } from "react";
import styled from "styled-components";
import { BsCardChecklist } from "react-icons/bs";
import { GrLocation } from "react-icons/gr";
import { HiOutlineBuildingOffice, HiOutlineUser } from "react-icons/hi2";
import { LuPackageOpen } from "react-icons/lu";
import { MdOutlineHome, MdOutlinePlaylistAddCheckCircle } from "react-icons/md";
import { RiCloseCircleLine } from "react-icons/ri";
import { RxLayout } from "react-icons/rx";

import { FeatureContext } from "../../Context/FeatureProvider";
import { Album } from "../index";
import Container from "../../../../components/Common/Container";
import TitleValue from "../../../../components/TitleValue";
import { COMBINE_FEATURE } from "../../../../services/constants/FeatureType";
import { getTranslation } from "../../../../services/Utility";

/* ---------- Helpers ---------- */

// ترتیب بخش‌های آدرس معکوس می‌شود تا برای نمایش فارسی درست خوانده شود
const reverseAddress = (address) =>
  address
    ? address
        .split(",")
        .map((part) => part.trim())
        .reverse()
        .join(", ")
    : "";

const getOwner = (owner) => (owner === "rgb" ? "سیستم" : owner);

const getRows = ({ id, owner, rgb, area, density, address } = {}) => [
  {
    key: "main",
    items: [
      {
        id: 1,
        title: getTranslation("1478"),
        value: id,
        icon: <MdOutlineHome />,
      },
      {
        id: 2,
        full: true,
        title: getTranslation("346"),
        value: getOwner(owner),
        icon: <HiOutlineUser />,
      },
      {
        id: 3,
        full: true,

        title: getTranslation("65"),
        value: COMBINE_FEATURE[rgb],
        icon: <BsCardChecklist />,
      },
    ],
  },
  {
    key: "details",
    long: true,
    nowrapOnDesktop: true,
    items: [
      {
        id: 4,
        title: getTranslation("347"),
        value: area,
        icon: <RxLayout />,
      },
      {
        id: 5,
        title: getTranslation("348"),
        value: density,
        icon: <HiOutlineBuildingOffice />,
      },
      {
        id: 6,
        title: getTranslation("349"),
        value: area != null && density != null ? (area * density) / 100 : "",
        icon: <RiCloseCircleLine />,
      },
      {
        id: 7,
        title: getTranslation("350"),
        value: 10,
        icon: <LuPackageOpen />,
      },
      {
        id: 8,
        title: getTranslation("351"),
        value: "آزاد",
        icon: <MdOutlinePlaylistAddCheckCircle />,
      },
    ],
  },
  {
    key: "address",
    items: [
      {
        id: 9,
        title: getTranslation("59"),
        full: true,

        value: reverseAddress(address),
        icon: <GrLocation />,
        wrap: true,
      },
    ],
  },
];

/* ---------- Styles ---------- */

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Cover = styled.img`
  width: 100%;
  max-height: 240px;
  border-radius: 10px;
  object-fit: cover;
`;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;

/* ---------- Component ---------- */

const InfoTab = () => {
  const [feature, setFeature] = useContext(FeatureContext);
  const properties = feature?.properties;
  return (
    <Container>
      <Content>
        {properties?.image && (
          <Cover src={properties.image} alt={String(properties.id ?? "")} />
        )}

        {getRows(properties).map(({ key, items, long, nowrapOnDesktop }) => (
          <Row key={key} $nowrap={nowrapOnDesktop}>
            {items.map(({ id, ...item }) => (
              <TitleValue key={id} long={long} {...item} />
            ))}
          </Row>
        ))}
      </Content>

      <Album feature={feature} setFeature={setFeature} isLoading={!feature} />
    </Container>
  );
};

export default InfoTab;
