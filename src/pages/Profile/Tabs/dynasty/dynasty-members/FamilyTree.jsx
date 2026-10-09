import { FaPlus } from "react-icons/fa";
import defulte from "../../../../../assets/images/defulte-profile.png";

import TreeMember from "./TreeMember";
import styled from "styled-components";
import Title from "../../../../../components/Title";
import { getTranslation } from "../../../../../services/Utility";

const Container = styled.div`
  padding: 20px 25px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
`;

const Head = styled.div`
  & img {
    border-radius: 100%;
    border: 2px solid transparent;
    cursor: pointer;
    transition: all 0.2s linear;
  }
  &:hover img {
    box-shadow: 0px 10px 25px -5px ${({ theme }) => theme.colors.primary};
    border: 2px solid ${({ theme }) => theme.colors.primary};
  }
`;

const Family = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 60px;
  width: fit-content;

  position: relative;
  padding: 20px 0;
  &::before {
    content: "";
    position: absolute;
    top: -40px;
    left: 50%;
    width: 2px;
    height: 40px;
    background-color: ${({ theme }) => theme.colors.newColors.shades.title};
    transform: translateX(-50%);
  }

  &::after {
    content: "";
    position: absolute;
    top: -2px;
    left: 0;
    right: 0;
    height: 2px;
    background-color: ${({ theme }) => theme.colors.newColors.shades.title};
  }
`;

const Sibling = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Parent = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Children = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 60px;
  width: fit-content;

  position: relative;
  padding-top: 20px;
  &::before {
    content: "";
    position: absolute;
    top: -280px;
    left: 50%;
    width: 2px;
    height: 280px;
    z-index: 0;
    background-color: ${({ theme }) => theme.colors.newColors.shades.title};
    transform: translateX(-50%);
  }

  &::after {
    content: "";
    position: absolute;
    top: -2px;
    left: 0;
    right: 0;
    height: 2px;
    background-color: ${({ theme }) => theme.colors.newColors.shades.title};
  }
`;

const Childs = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Spouse = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Add = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  z-index: 1;
  background-color: ${({ theme }) => theme.colors.newColors.otherColors.menuBg};
  border: 2px dashed #454545;
  border-radius: 10px;
  cursor: pointer;
  height: 205px;
  width: 145px;
  span {
    font-size: 14px;
    color: ${({ theme }) => theme.colors.newColors.shades.title};
    font-weight: 400;
  }
  svg {
    color: ${({ theme }) => theme.colors.newColors.shades.title};
  }
`;

const FamilyTree = ({ members, setMode, ownerImg }) => {
  const handleAddMember = (type) => {
    setMode({ mode: 2, type });
  };

  return (
    <Container>
      <Title right title={getTranslation(112)} />
      <Head>
        <img src={ownerImg || defulte} width={110} height={110} />
      </Head>
      <Family>
        <Sibling>
          {members.siblings.length < 4 && (
            <Add onClick={() => handleAddMember("siblings")}>
              <FaPlus size={32} />
              <span>{getTranslation(826)}</span>
            </Add>
          )}
          {members.siblings.map((sibling, i) => (
            <TreeMember
              key={i}
              item={sibling}
              hasAfter={i < members.siblings.length - 1}
            />
          ))}
        </Sibling>
        <Parent>
          {members.parent.length < 2 && (
            <Add onClick={() => handleAddMember("parent")}>
              <FaPlus size={32} />
              <span>{getTranslation(1396)}</span>
            </Add>
          )}
          {members.parent.map((item, i) => (
            <TreeMember
              key={i}
              item={item}
              hasAfter={i < members.parent.length - 1}
            />
          ))}
        </Parent>
      </Family>
      <Children>
        <Childs>
          {members.children.length < 4 && (
            <Add onClick={() => handleAddMember("children")}>
              <FaPlus size={32} />
              <span>{getTranslation(827)}</span>
            </Add>
          )}
          {members.children.map((child, i) => (
            <TreeMember
              key={i}
              item={child}
              hasAfter={i < members.children.length - 1}
            />
          ))}
        </Childs>
        <Spouse>
          {members.spouse.length < 1 && (
            <Add onClick={() => handleAddMember("spouse")}>
              <FaPlus size={32} />
              <span>{getTranslation(1397)}</span>
            </Add>
          )}
          {members.spouse.map((item, i) => (
            <TreeMember
              key={i}
              item={item}
              hasAfter={i < members.spouse.length - 1}
            />
          ))}
        </Spouse>
      </Children>
    </Container>
  );
};

export default FamilyTree;
