import styled, { keyframes } from "styled-components";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../services/reducers/UserContext";
import { useLanguage } from "../../../../hooks/useLanguageContext.js";
import {
  formatNumber,
  convertToPersian,
  getTranslation,
  levelIds,
} from "../../../../services/Utility";
import { Skeleton } from "../../../../components/Skeleton";
import useRequest from "../../../../hooks/useRequest.js";
import ToolTip from "../../../../components/Tooltip/Tooltip.jsx";

const Container = styled.div`
  position: relative;
  border-radius: 10px;
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.inputBg};

  padding: 10px 20px 10px 15px;
  margin-top: 20px;

  display: grid;
  /* نوار لول بقیه‌ی فضا رو می‌گیره، نگین‌ها به اندازه‌ی خودشون تا حداکثر ۵۰٪ */
  grid-template-columns: minmax(0, 1fr) fit-content(50%);
  align-items: center;
`;

const Percent = styled.div`
  min-width: 0;
  ${(props) => (props.IsPersian ? "border-left" : "border-right")}: 1px solid
    ${(props) => props.theme.colors.newColors.otherColors.inputBorder};

  ${(props) => (props.IsPersian ? "padding-left" : "padding-right")}: 25px;
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  justify-content: space-between;

  h2 {
    color: ${(props) => props.theme.colors.newColors.shades.title};
    font-weight: 600;
    font-size: 16px;
  }

  h3 {
    color: ${(props) => props.theme.colors.newColors.shades.title};
    font-weight: 500;
    font-size: 16px;
  }
`;

const ProgressContainer = styled.div`
  height: 8px;
  background-color: ${(props) => props.theme.colors.newColors.shades.bg2};
  border-radius: 28px;
  overflow: hidden;
`;

const ProgressBar = styled.div`
  background-color: ${(props) => props.theme.colors.primary};
  border-radius: 8px;
  width: ${(props) => `${Math.min(Math.max(props.percentage || 0, 0), 100)}%`};
  transition: width 0.5s ease;
  height: 100%;
`;

const LevelCount = styled.div`
  position: relative;
  width: 100%;
  min-width: 100px;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: flex-start;
`;

const popIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(6px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const LevelItemWrapper = styled.div`
  position: relative;
  flex: 0 1 55px;
  min-width: 0;
  aspect-ratio: 1 / 1;

  display: flex;
  align-items: center;
  justify-content: center;

  animation: ${popIn} 0.35s ease both;
  animation-delay: ${(props) => `${props.$index * 0.05}s`};

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    cursor: pointer;
    transition:
      transform 0.2s ease,
      filter 0.2s ease;
  }

  &:hover img {
    transform: scale(1.15);
  }
`;

const LevelItem = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  height: 100%;
`;

const Level = () => {
  const [user] = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [levelData, setLevelData] = useState(null);
  const IsPersian = useLanguage();
  const { Request } = useRequest();

  useEffect(() => {
    const requestId = user?.id;

    if (!requestId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    Request(`users/${requestId}/levels`)
      .then((res) => {
        setLevelData(res.data.data);
      })
      .catch((error) => {
        console.error("Error loading level:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Container>
        <Percent IsPersian={IsPersian}>
          <Title>
            <Skeleton width="120px" height="20px" radius="4px" />
            <Skeleton width="50px" height="20px" radius="4px" />
          </Title>

          <ProgressContainer>
            <Skeleton width="70%" height="8px" radius="8px" />
          </ProgressContainer>
        </Percent>

        <LevelCount>
          <Skeleton width="44px" height="44px" radius="50%" />
          <Skeleton width="44px" height="44px" radius="50%" />
          <Skeleton width="44px" height="44px" radius="50%" />
        </LevelCount>
      </Container>
    );
  }

  if (!levelData) {
    return null;
  }

  const {
    latest_level,
    previous_levels = [],
    score_percentage_to_next_level,
  } = levelData;

  const levels = [
    ...(latest_level ? [latest_level] : []),
    ...[...previous_levels].reverse(),
  ];

  return (
    <Container>
      <Percent IsPersian={IsPersian}>
        <Title>
          <h2>{getTranslation(levelIds[latest_level?.name])}</h2>
          <h3>
            {convertToPersian(formatNumber(score_percentage_to_next_level))}%
          </h3>
        </Title>

        <ProgressContainer>
          <ProgressBar percentage={score_percentage_to_next_level} />
        </ProgressContainer>
      </Percent>

      <LevelCount>
        {levels.map((level, index) => (
          <LevelItemWrapper key={level.id} $index={index}>
            <ToolTip
              width={"auto"}
              content={getTranslation(levelIds[level.name] ?? 382)}
              lang={IsPersian ? "fa" : "en"}
              place={"top"}
              Chidren={
                <LevelItem>
                  <img src={level.image} alt={level.name} />
                </LevelItem>
              }
            />
          </LevelItemWrapper>
        ))}
      </LevelCount>
    </Container>
  );
};

export default Level;
