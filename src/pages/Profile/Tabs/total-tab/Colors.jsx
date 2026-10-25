import ColorCard from "./ColorCard";
import gif1 from "../../../../assets/gif/limit-of-influence.gif";
import gif2 from "../../../../assets/gif/yellow-color.gif";
import gif3 from "../../../../assets/gif/red-color.gif";
import gif4 from "../../../../assets/gif/blue-color.gif";
import gif5 from "../../../../assets/gif/rial.gif";
import gif6 from "../../../../assets/gif/psc.gif";
import styled from "styled-components";
import { useContext, useEffect, useState } from "react";
import useRequest from "../../../../hooks/useRequest.js";
import { getTranslation } from "../../../../services/Utility";
import { useParams } from "react-router";
import { UserContext } from "../../../../services/reducers/UserContext";
import { Skeleton } from "../../../../components/Skeleton"; // مسیرش رو با پروژه خودت تنظیم کن

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const Colors = () => {
  const [walletData, setWalletData] = useState({
    effect: 0,
    yellow: 0,
    red: 0,
    blue: 0,
    irr: 0,
    psc: 0,
  });

  const [loading, setLoading] = useState(true);

  const { Request } = useRequest();
  const { id } = useParams();
  const [userId] = useContext(UserContext);

  useEffect(() => {
    const requestId = id || userId.id;

    setLoading(true);

    Request(`users/${requestId}/wallet`)
      .then((response) => {
        setWalletData(response.data.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, userId.id]);

  const colors = [
    {
      id: 1,
      gif: gif1,
      label: getTranslation("723"),
      value: walletData?.effect,
    },
    {
      id: 2,
      gif: gif2,
      label: getTranslation("51"),
      value: walletData?.yellow,
    },
    {
      id: 3,
      gif: gif3,
      label: getTranslation("50"),
      value: walletData?.red,
    },
    {
      id: 4,
      gif: gif4,
      label: getTranslation("49"),
      value: walletData?.blue,
    },
    {
      id: 5,
      gif: gif5,
      label: getTranslation("48"),
      value: walletData?.irr,
    },
    {
      id: 6,
      gif: gif6,
      label: getTranslation("47"),
      value: walletData?.psc,
    },
  ];

  if (loading) {
    return (
      <Container>
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} height="150px" />
        ))}
      </Container>
    );
  }

  return (
    <Container>
      {colors.map((color) => (
        <ColorCard key={color.id} {...color} />
      ))}
    </Container>
  );
};

export default Colors; 