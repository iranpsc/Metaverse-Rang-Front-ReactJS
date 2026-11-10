import { FaPlus } from "react-icons/fa";
import defulte from "../../../../../assets/images/avatars/defulte-profile.png";

import TreeMember from "./TreeMember";
import styled from "styled-components";
import TitleHeader from "../../../../../components/TitleHeader";
import TitleBody from "../../../../../components/TitleBody";
import { getTranslation } from "../../../../../services/Utility";

const Container = styled.div`
  width: max-content;
  min-width: 100%;
  box-sizing: border-box;

  padding: 12px;
  overflow: visible;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;

  @media (min-width: 768px) {
    padding: 20px 25px;
    gap: 30px;
  }
`;

const Head = styled.div`
    z-index: 1000;

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
  gap: 20px;
  width: fit-content;

  position: relative;
  padding: 14px 0;

  @media (min-width: 768px) {
    gap: 60px;
    padding: 20px 0;
  }
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
  gap: 20px;
  width: fit-content;

  position: relative;
  padding-top: 14px;

  @media (min-width: 768px) {
    gap: 60px;
    padding-top: 20px;
  }
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
  gap: 6px;
  z-index: 1;
  background-color: ${({ theme }) => theme.colors.newColors.otherColors.menuBg};
  border: 2px dashed #454545;
  border-radius: 10px;
  cursor: pointer;
  height: 150px;
  width: 115px;
  padding: 8px;
  box-sizing: border-box;
  svg {
    font-size: 24px;
    color: ${({ theme }) => theme.colors.newColors.shades.title};
  }

  @media (min-width: 768px) {
    gap: 10px;
    height: 205px;
    width: 145px;

    svg {
      font-size: 32px;
    }
  }
`;

const FamilyTree = ({ members, setMode, ownerImg }) => {
  const handleAddMember = (type) => {
    setMode({ mode: 2, type });
  };

  return (
    <Container>
      <TitleHeader right title={getTranslation(112)} />
      <Head>
        <img src={ownerImg || defulte} width={88} height={88} alt="" />
      </Head>
      <Family>
        <Sibling>
          {members.siblings.length < 4 && (
            <Add onClick={() => handleAddMember("siblings")}>
              <FaPlus size={32} />
              <TitleBody title={getTranslation(826)} size="small" />
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
              <TitleBody title={getTranslation(1396)} size="small" />
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
              <TitleBody title={getTranslation(827)} size="small" />
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
              <TitleBody title={getTranslation(1397)} size="small" />
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
