import styled from "styled-components";
import { useContext, useEffect, useState } from "react";
import PropertyCard from "./PropertyCard";
import property2 from "../../../../assets/images/properties/building.png";
import property3 from "../../../../assets/images/properties/house.png";
import property4 from "../../../../assets/images/properties/courthouse.png";
import useRequest from "../../../../hooks/useRequest.js";
import { getTranslation } from "../../../../services/Utility";
import { UserContext } from "../../../../services/reducers/UserContext";
import { WalletContext } from "../../../../services/reducers/WalletContext";
import { Skeleton } from "../../../../components/Skeletons/Skeleton.jsx";
import { COLOR_CONFIG } from "../../../../services/constants/colorConfig.js";

const PROPERTY_ITEMS = [
  {
    key: "satisfaction",
    source: "wallet",
    image: COLOR_CONFIG.satisfaction.gif,
    labelKey: COLOR_CONFIG.satisfaction.labelKey,
  },
  {
    key: "tejari_features_count",
    source: "assets",
    image: property2,
    labelKey: "475",
  },
  {
    key: "maskoni_features_count",
    source: "assets",
    image: property3,
    labelKey: "477",
  },
  {
    key: "amoozeshi_features_count",
    source: "assets",
    image: property4,
    labelKey: "476",
  },
];

const Container = styled.div`
  display: grid;
  min-width: 0;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-top: 20px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`;

const RealEstate = () => {
  const [assets, setAssets] = useState(null);
  const [loading, setLoading] = useState(true);
  const { Request } = useRequest();
  const [currentUser] = useContext(UserContext);
  const [wallet] = useContext(WalletContext);

  const userId = currentUser?.id;

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    let ignore = false;
    setLoading(true);

    Request(`users/${userId}/features/count`)
      .then((response) => {
        if (!ignore) setAssets(response.data.data);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [userId, Request]);

  const sources = { wallet, assets };

  return (
    <Container>
      {loading
        ? PROPERTY_ITEMS.map(({ key }) => (
            <Skeleton key={key} height="85px" radius="10px" />
          ))
        : PROPERTY_ITEMS.map(({ key, source, image, labelKey }) => (
            <PropertyCard
              key={key}
              image={image}
              label={getTranslation(labelKey)}
              value={sources[source]?.[key]}
            />
          ))}
    </Container>
  );
};

export default RealEstate;
