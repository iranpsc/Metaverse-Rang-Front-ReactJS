import { useEffect, useState } from "react";
import styled from "styled-components";
import FilterIcon from "../../assets/svg/filter.svg?react";
import LocationIcon from "../../assets/svg/location.svg?react";
import useRequest from "../../services/Hooks/useRequest";
import { useMapData } from "../../services/reducers/mapContext";
const Btn = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 30px;
    border-radius: 0 5px 5px 0;
  &.active {
    border: ${(props) => `${props.border} 3px solid`};
  }
`;

const IconFilter = styled(FilterIcon)`
  width: 16px;
  cursor: pointer;
  cursor: "not-allowed";
  width: 14px;
  height: 16px;
`;
const IconLocation = styled(LocationIcon)`
  width: 14px;
  height: 16px;
  fill: ${(props) => (props.$active ? props.theme.colors.primary : "#868B90")};

  fill-opacity: ${(props) => (props.$active ? "1" : "0.5")};
  cursor: pointer;
`;
const TitleFlag = styled.p`
  color: #868b90;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 180%;
  text-transform: capitalize;
  white-space: nowrap;
  @media (min-width: 1024px) {
    font-size: 14px;
  }
`;
const ContainerIcon = styled.div`
  display: flex;
  align-items: center;
  gap: 13px;
`;

const BtnFlagMap = () => {
  const { flags, setFlags, setPolygons } = useMapData();
  const [activeMapIds, setActiveMapIds] = useState([]);
  const { Request } = useRequest();

  useEffect(() => {
    async function fetchMap() {
      const response = await Request("maps");
      setFlags(response.data.data);
    }

    fetchMap();
  }, []);

  const handleClick = async (flagId) => {
    const isActive = activeMapIds.includes(flagId);

    if (!isActive && activeMapIds.length >= 2) return;

    if (isActive) {
      setActiveMapIds((prev) => prev.filter((id) => id !== flagId));

      setPolygons((prev) => prev.filter((polygon) => polygon.id !== flagId));

      return;
    }

    setActiveMapIds((prev) => [...prev, flagId]);

    const response = await Request(`maps/${flagId}/border`);

    const rawCoordinates = response?.data?.data?.border_coordinates;
    const parsedCoordinates =
      typeof rawCoordinates === "string"
        ? JSON.parse(rawCoordinates)
        : rawCoordinates;

    setPolygons((prev) => [
      ...prev,
      {
        id: flagId,
        coordinates: parsedCoordinates || [],
      },
    ]);
  };

  return (
    <>
      {flags.map((flag) => {
        const isActive = activeMapIds.includes(flag.id);

        return (
          <Btn key={flag.id} className={isActive ? "active" : ""}>
            <ContainerIcon>
              <IconFilter />
              <IconLocation
                $active={isActive}
                onClick={() => handleClick(flag.id)}
              />
            </ContainerIcon>

            <TitleFlag>{flag.name}</TitleFlag>
          </Btn>
        );
      })}
    </>
  );
};

export default BtnFlagMap;