import HistoryItem from "./HistoryItem";
import styled from "styled-components";
import BaseContainer from "../../../../components/Common/Container";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import useRequest from "../../../../hooks/useRequest.js";
import { metarangUrlCitizen } from "../../../../services/Utility";
const StyledContainer = styled(BaseContainer)`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const HistoryTab = () => {
  const { Request, HTTP_METHOD } = useRequest();
  const [data, setData] = useState([]);
  const { id } = useParams();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await Request(
          `features/${id}/trade-history`,
          HTTP_METHOD.GET,
        );
        setData(res.data.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <StyledContainer>
      {data.map((item, index) => {
        const {
          id,
          participant_code,
          participant_label,
          type,
          price,
          date_time,
        } = item;

        return (
          <HistoryItem
            key={id ?? index}
            index={data.length - index}
            user={participant_code || participant_label}
            link={
              participant_code
                ? metarangUrlCitizen(participant_code)
                : undefined
            }
            owner={type === "genesis"}
            time={date_time.time}
            date={date_time.date}
            rial={price.price_irr}
            psc={price.price_psc}
            color={price.color}
            colorAmount={price.color_amount}
          />
        );
      })}
    </StyledContainer>
  );
};

export default HistoryTab;
