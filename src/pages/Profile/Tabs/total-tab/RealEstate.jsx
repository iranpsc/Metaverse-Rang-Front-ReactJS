// RealEstate.js
import PropertyCard from "./PropertyCard";
import property1 from "../../../../assets/gif/satisfaction.gif";
import property2 from "../../../../assets/images/building.png";
import property3 from "../../../../assets/images/house.png";
import property4 from "../../../../assets/images/courthouse.png";
import styled from "styled-components";
import useRequest from "../../../../services/Hooks/useRequest";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../services/reducers/UserContext";
import { getTranslation } from "../../../../services/Utility";
import { useParams } from "react-router";
import { Skeleton } from "../../../../components/Skeleton";
import { WalletContext } from "../../../../services/reducers/WalletContext";
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
  const [user] = useContext(UserContext);
    const [wallet] = useContext(WalletContext);

  const { id } = useParams();
  useEffect(() => {
    const requestId = id || user?.id;
    if (requestId) {
      setLoading(true);
      Request(`users/${requestId}/features/count`)
        .then((response) => {
          setAssets(response.data.data);
        })
        .catch((error) => {
          console.error("Error loading real estate:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id, user?.id]);

  const properties = [
    {
      id: 1,
      image: property1,
      label: getTranslation("52"),
      value: wallet?.satisfaction,
    },
    {
      id: 2,
      image: property2,
      label: getTranslation("475"),
      value: assets?.tejari_features_count,
    },
    {
      id: 3,
      image: property3,
      label: getTranslation("477"),
      value: assets?.maskoni_features_count,
    },
    {
      id: 4,
      image: property4,
      label: getTranslation("476"),
      value: assets?.amoozeshi_features_count,
    },
  ];

  if (loading) {
    return (
      <Container>
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} height="85px" radius="10px" />
        ))}
      </Container>
    );
  }

  return (
    <Container>
      {properties.map((property) => (
        <PropertyCard key={property.id} {...property} />
      ))}
    </Container>
  );
};

export default RealEstate;