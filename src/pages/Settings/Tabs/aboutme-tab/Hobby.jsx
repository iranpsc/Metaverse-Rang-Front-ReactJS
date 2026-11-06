import styled from "styled-components";
import brush from "../../../../assets/images/settings/brush.png";
import bubble from "../../../../assets/images/settings/bubble.png";
import clock from "../../../../assets/images/settings/clock.png";
import coffee from "../../../../assets/images/settings/coffee.png";
import cpu from "../../../../assets/images/settings/cpu.png";
import dollar from "../../../../assets/images/settings/dollar-circle.png";
import ghost from "../../../../assets/images/settings/ghost.png";
import lang from "../../../../assets/images/settings/language-square.png";
import layer from "../../../../assets/images/settings/layer.png";
import music from "../../../../assets/images/settings/musicnote.png";
import note from "../../../../assets/images/settings/note-2.png";
import pet from "../../../../assets/images/settings/pet.png";
import tree from "../../../../assets/images/settings/tree.png";
import weight from "../../../../assets/images/settings/weight.png";
import { useTheme } from "../../../../hooks/useTheme.js";
import { convertToPersian } from "../../../../services/Utility/index";
import { getTranslation } from "../../../../services/Utility";
import TitleBody from "../../../../components/TitleBody.jsx";
const MAX_HOBBIES = 5;

const HOBBIES = [
  { key: "music", translationId: "785", icon: music },
  { key: "sport_health", translationId: "786", icon: weight },
  { key: "art", translationId: "1590", icon: brush },
  { key: "language_culture", translationId: "787", icon: lang },
  { key: "philosophy", translationId: "99", icon: note },
  { key: "animals_nature", translationId: "788", icon: pet },
  { key: "aliens", translationId: "789", icon: ghost },
  { key: "food_cooking", translationId: "791", icon: coffee },
  { key: "travel_leature", translationId: "792", icon: tree },
  { key: "manufacturing", translationId: "793", icon: layer },
  { key: "science_technology", translationId: "794", icon: cpu },
  { key: "space_time", translationId: "795", icon: clock },
  { key: "history", translationId: "107", icon: bubble },
  { key: "politics_economy", translationId: "796", icon: dollar },
];

const Wrapper = styled.div`
  margin-top: 40px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
`;

const SIZES = {
  default: { base: "14px", tablet: "12px", desktop: "16px" },
};

const getSize = (key) => SIZES.default[key];

const Counter = styled.h4`
  font-weight: 400;
  margin: 0;
  font-size: ${getSize("base")};
  color: ${({ $limitReached }) => ($limitReached ? "red" : "#a0a0ab")};

  @media (min-width: 500px) and (max-width: 999px) {
    font-size: ${getSize("tablet")};
  }

  @media (min-width: 1280px) {
    font-size: ${getSize("desktop")};
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin-bottom: 20px;

  @media (min-width: 944px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (min-width: 1202px) {
    grid-template-columns: repeat(4, 1fr);
  }
  @media (min-width: 1452px) {
    grid-template-columns: repeat(5, 1fr);
  }
`;

const HobbyIcon = styled.img`
  width: 24px;
  height: 24px;
  filter: ${({ $themeMode }) =>
    $themeMode === "light"
      ? "grayscale(100%) brightness(0.3)"
      : "grayscale(0%) brightness(1.2)"};
`;

const HobbyItem = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;

  div {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  input[type="checkbox"] {
    position: relative;
    width: 20px;
    height: 20px;
    appearance: none;
    border: 2px solid #dedee9;
    border-radius: 3px;
    cursor: pointer;
    outline: none;
    transition: background-color 0.3s ease;

    &:checked {
      background-color: ${({ theme }) => theme.colors.primary};
      border-color: transparent;

      &::after {
        content: "✓";
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-weight: 600;
        color: white;
      }
    }
  }
`;

const Hobby = ({ value = {}, onChange }) => {
  const { theme } = useTheme();

  const selectedCount = Object.values(value).filter(Boolean).length;
  const remaining = MAX_HOBBIES - selectedCount;
  const limitReached = remaining <= 0;

  const toggleHobby = (key) => onChange({ ...value, [key]: !value[key] });

  return (
    <Wrapper>
      <Header>
        <TitleBody title={getTranslation("784")} />
        <Counter $limitReached={limitReached}>
          <TitleBody
            gray
            small
            title={`${convertToPersian(remaining)} ${getTranslation("790")}`}
          />
        </Counter>
      </Header>

      <Grid>
        {HOBBIES.map(({ key, translationId, icon }) => {
          const checked = value[key] === true;

          return (
            <HobbyItem key={key}>
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggleHobby(key)}
                disabled={!checked && limitReached}
              />
              <div>
                <HobbyIcon src={icon} alt="" $themeMode={theme} />
                <TitleBody title={getTranslation(translationId)} />
              </div>
            </HobbyItem>
          );
        })}
      </Grid>
    </Wrapper>
  );
};

export default Hobby;
