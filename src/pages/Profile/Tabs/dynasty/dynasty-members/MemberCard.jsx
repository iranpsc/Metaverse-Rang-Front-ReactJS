import { useState, useEffect } from "react";
import { IoRadioButtonOnOutline } from "react-icons/io5";
import defulte from "../../../../../assets/images/defulte-profile.png";
import styled from "styled-components";
import Dropdown from "../../../../../components/Common/Dropdown";
import {
  convertToPersian,
  getTranslation,
} from "../../../../../services/Utility";
import { metarangUrlCitizen } from "../../../../../services/Utility";
const Container = styled.div`
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.menuBg};
  border-radius: 5px;
  padding: 20px;
 color: ${(props) => props.theme.colors.newColors.shades.title};

  display: grid;
  grid-template-columns: 3fr 1fr 1fr;
  gap: 20px;
  align-items: center;
  margin: 20px 0;
`;
const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  svg {
    color: ${(props) => props.theme.colors.primary};
  }
`;
const Center = styled.div`
  h4 {
    
    font-size: 14px;
    font-weight: 600;
  }
  h3 {
    
    margin-top: 4px;
    font-size: 16px;
    font-weight: 400;
  }
`;
const Left = styled.div`
  h4 {
    
    font-size: 14px;
    font-weight: 600;
  }
  h3 {
    
    margin-top: 4px;
    font-size: 16px;
    font-weight: 400;
  }
`;
const Profile = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  &:hover img {
    box-shadow: 0px 10px 25px -5px #0066ff40;
    border: 2px solid ${(props) => props.theme.colors.primary};
  }
  h3 {
    

    font-size: 18px;
    font-weight: 500;
    white-space: nowrap;
  }
  a {
    text-decoration: none;
    ${(props) => props.theme.colors.primary};

    font-size: 16px;
    font-weight: 500;
    white-space: nowrap;
  }
  & img {
    border-radius: 100%;
    border: 2px solid transparent;
    transition: all 0.2s linear;
  }
`;

const MemberCard = ({ selectedCitizen, memberType, setSelectedRelation }) => {
  const [selected, setSelected] = useState(null);

  const relationTypes = {
    parent: [
      { value: "father", label: 125 }, // پدر
      { value: "mother", label: 126 }, // مادر
    ],
    siblings: [
      { value: "sister", label: 127 }, // برادر
      { value: "brother", label: 128 }, // خواهر
    ],
    spouse: [
      { value: "spouse", label: 825 }, // همسر
    ],
    children: [
      { value: "son", label: 129 }, // پسر
    ],
  };

  // تبدیل به فرمت مورد نیاز Dropdown: { value, label }
  const options = (relationTypes[memberType] ?? []).map((relation) => ({
    value: relation.value,
    label: getTranslation(relation.label),
  }));
  useEffect(() => {
    if (options.length === 1) {
      setSelected(options[0].value);
      setSelectedRelation(options[0].value);
    } else {
      setSelected(null);
      setSelectedRelation(null);
    }
  }, [memberType]);
  const handleRelationChange = (value) => {
    setSelected(value);
    setSelectedRelation(value);
  };
  return (
    <Container>
      <Right>
        <IoRadioButtonOnOutline size={24} />
        <Profile>
          <img src={selectedCitizen?.image || defulte} width={80} height={80} />
          <div>
            <h3>{selectedCitizen?.name}</h3>
            <a
              href={metarangUrlCitizen(selectedCitizen?.code)}
              target="_blank"
              rel="noopener noreferrer"
            >
              {selectedCitizen?.code}
            </a>
          </div>
        </Profile>
      </Right>
      <Center>
        <h4>{getTranslation(834)}</h4> {/* نسبت */}
        {options.length > 1 ? (<Dropdown
          options={options}
          selected={selected}
          onSelect={handleRelationChange}
          placeholder={getTranslation(1000)}
          size="small"

        />) : (<h4>{options[0].label}</h4>)}

      </Center>
      <Left>
        <h4>{getTranslation(1400)}</h4> {/* سن */}
        <h3>{convertToPersian(selectedCitizen?.age)} {getTranslation(803)}</h3>
      </Left>
    </Container>
  );
};

export default MemberCard;