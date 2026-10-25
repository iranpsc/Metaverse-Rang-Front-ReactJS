import brush from "../../../../assets/images/settings/brush.png";
import bubble from "../../../../assets/images/settings/bubble.png";
import clock from "../../../../assets/images/settings/clock.png";
import coffee from "../../../../assets/images/settings/coffee.png";
import { convertToPersian } from "../../../../services/Utility/index";
import cpu from "../../../../assets/images/settings/cpu.png";
import dollar from "../../../../assets/images/settings/dollar-circle.png";
import ghost from "../../../../assets/images/settings/ghost.png";
import lang from "../../../../assets/images/settings/language-square.png";
import layer from "../../../../assets/images/settings/layer.png";
import music from "../../../../assets/images/settings/musicnote.png";
import note from "../../../../assets/images/settings/note-2.png";
import pet from "../../../../assets/images/settings/pet.png";
import styled from "styled-components";
import tree from "../../../../assets/images/settings/tree.png";
import { useGlobalState } from "../../../../hooks/useAboutMeGlobalState";
import weight from "../../../../assets/images/settings/weight.png";
import { getTranslation } from "../../../../services/Utility";
import { useEffect, useState } from "react";
import { useTheme } from "../../../../hooks/useTheme.js";
const Container = styled.div`
  margin-top: 40px;
`;

const Label = styled.label`
  color: ${(props) => props.theme.colors.newColors.shades.title};
  display: block;
  font-weight: 600;
`;
const HobbyIcon = styled.img`
  width: 24px;
  height: 24px;
   filter: ${(props) =>
    props.themeMode === "light"
      ? "grayscale(100%) brightness(0.3)"
      : "grayscale(0%) brightness(1.2)"}; 
`;

const CheckboxContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-bottom: 20px;
  @media (min-width: 944px) {
    grid-template-columns: 1fr 1fr 1fr;
  }

  @media (min-width: 1202px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
  @media (min-width: 1452px) {
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  }
`;

const Div = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;

  h4 {
    color: ${(props) => (props.limitReached ? "red" : "#a0a0ab")};
    font-weight: 400;
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  color: #ffffff;
  gap: 8px;

  span {
    color: ${(props) => props.theme.colors.newColors.shades.title};
    font-weight: 400;
    white-space: nowrap;
  }

  input[type="checkbox"] {
    width: 20px;
    height: 20px;
    appearance: none;
    border: 2px solid #dedee9;
    border-radius: 3px;
    cursor: pointer;
    outline: none;
    position: relative;
    transition: background-color 0.3s ease;

    &:checked {
      background-color: ${(props) => props.theme.colors.primary};
      border: 2px solid transparent;

      &::after {
        content: "✓";
        font-weight: 600;
        color: white;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }

  div {
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const Hobby = () => {
    const { theme } = useTheme(); 

  const { state, dispatch } = useGlobalState();
  const maxHobbies = 5;
  const selectedHobbiesCount = Object.keys(state.hobbies || {}).filter(
    (key) => state.hobbies[key] === true
  ).length;
  const remainingHobbies = maxHobbies - selectedHobbiesCount;
  const limitReached = selectedHobbiesCount >= maxHobbies;
  const localizedRemainingHobbies = convertToPersian(remainingHobbies);
  const [hobbyValue, setHobbyValue] = useState(state.hobbies || {});
  useEffect(() => {
    if (state.hobbies) {
      setHobbyValue(state.hobbies);
    }
  }, [state.hobbies]);

  const handleHobbyChange = (hobbyKey) => {
    const updatedHobbies = { ...hobbyValue };
    updatedHobbies[hobbyKey] = updatedHobbies[hobbyKey] === true ? false : true;
    setHobbyValue(updatedHobbies);
    dispatch({ type: "SET_HOBBIES", payload: updatedHobbies });
  };

  const hobbies = [
    { id: 1, key: "music", translationId: "785", icon: music },
    { id: 2, key: "sport_health", translationId: "786", icon: weight },
    { id: 3, key: "art", translationId: "1590", icon: brush },
    {
      id: 4,
      key: "language_culture",
      translationId: "787",
      icon: lang,
    },
    { id: 5, key: "philosophy", translationId: "99", icon: note },
    { id: 6, key: "animals_nature", translationId: "788", icon: pet },
    { id: 7, key: "aliens", translationId: "789", icon: ghost },
    { id: 8, key: "food_cooking", translationId: "791", icon: coffee },
    {
      id: 9,
      key: "travel_leature",
      translationId: "792",
      icon: tree,
    },
    {
      id: 10,
      key: "manufacturing",
      translationId: "793",
      icon: layer,
    },
    {
      id: 11,
      key: "science_technology",
      translationId: "794",
      icon: cpu,
    },
    { id: 12, key: "space_time", translationId: "795", icon: clock },
    { id: 13, key: "history", translationId: "107", icon: bubble },
    {
      id: 14,
      key: "politics_economy",
      translationId: "796",
      icon: dollar,
    },
  ];

  return (
    <Container>
      <Div limitReached={limitReached}>
        <Label>{getTranslation("784")}</Label>
        <h4>{`${localizedRemainingHobbies} ${getTranslation(
          "790"
        )}`}</h4>
      </Div>
      <CheckboxContainer>
        {hobbies.map((hobby) => (
          <CheckboxLabel key={hobby.id}>
            <input
              type="checkbox"
              checked={hobbyValue[hobby.key] === true}
              onChange={() => handleHobbyChange(hobby.key)}
              disabled={hobbyValue[hobby.key] === false && limitReached}
            />
            <div>
              <HobbyIcon src={hobby.icon} alt={hobby.name}   themeMode={theme}
/>
              <span>{getTranslation(hobby.translationId)}</span>
            </div>
          </CheckboxLabel>
        ))}
      </CheckboxContainer>
    </Container>
  );
};

export default Hobby;
