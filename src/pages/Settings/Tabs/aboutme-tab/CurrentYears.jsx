import styled from "styled-components";
import { useState, useEffect, useMemo } from "react";
import moment from "moment-jalaali";
import { useLanguage } from "../../../../services/reducers/LanguageContext";
import {
  convertToPersian,
  getTranslation,
} from "../../../../services/Utility";

const Container = styled.div`
  position: relative;
  background-color: ${(props) => props.theme.colors.newColors.shades.bg2};
  border-radius: 8px;
  padding-top: 30px;
`;

const Label = styled.h2`
  color: ${(props) => props.theme.colors.newColors.shades.title};
  display: block;
  margin-bottom: 10px;
  font-weight: 500;
  font-size: 16px;
  margin-top: 20px;
`;
const DropdownButton = styled.div`
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.inputBg};
  color: ${(props) => props.theme.colors.newColors.shades.title};
  border: 1px solid ${(props) => props.theme.colors.newColors.shades[80]};
  padding: 10px;
  width: 150px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 4px;
`;

const Arrow = styled.span`
  border: solid ${(props) => props.theme.colors.newColors.shades.title};
  border-width: 0 2px 2px 0;
  padding: 3px;
  transform: rotate(45deg);
  margin-left: 10px;
  transition: transform 0.2s ease;
`;

const DropdownMenu = styled.div`
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.inputBg};
  position: absolute;
  top: 90px;
  width: 150px;
  border-radius: 4px;
  overflow: hidden;
  z-index: 10;
`;

const DropdownItem = styled.div`
  padding: 10px;
  color: ${(props) => props.theme.colors.newColors.shades.title};
  cursor: pointer;

  &:hover {
    color: white;
    background-color: ${(props) => props.theme.colors.shades[80]};
  }
`;

const Div = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Content = styled.div`
  color: ${(props) => props.theme.colors.newColors.shades.title};
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.inputBg};
  padding: 15px;
  border-radius: 5px;
  margin-top: 20px;
`;

const Text = styled.p`
  margin: 0;
  line-height: 1.6;
`;

const CurrentYears = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isPersian = useLanguage();

  // سال جاری
  const currentYear = useMemo(() => {
    const now = moment();
    return isPersian ? parseInt(moment(now).format("jYYYY")) : now.year();
  }, [isPersian]);

  const [selectedYear, setSelectedYear] = useState(currentYear);

  useEffect(() => {
    setSelectedYear(currentYear);
  }, [currentYear]);

  const years = useMemo(() => {
    const startYear = isPersian ? 1401 : 2022;
    return Array.from(
      { length: currentYear - startYear + 1 },
      (_, i) => startYear + i,
    ).reverse();
  }, [currentYear, isPersian]);

  const handleSelectYear = (year) => {
    setSelectedYear(year);
    setIsOpen(false);
  };

  return (
    <Container>
      <Div>
        <Label>{getTranslation("802")}</Label>
        <div>
          <DropdownButton onClick={() => setIsOpen(!isOpen)}>
            <span>{convertToPersian(selectedYear)}</span>
            <Arrow
              style={{
                transform: isOpen ? "rotate(-135deg)" : "rotate(45deg)",
              }}
            />
          </DropdownButton>

          {isOpen && (
            <DropdownMenu>
              {years.map((y) => (
                <DropdownItem key={y} onClick={() => handleSelectYear(y)}>
                  {getTranslation("803")} {convertToPersian(y)}
                </DropdownItem>
              ))}
            </DropdownMenu>
          )}
        </div>
      </Div>

      <Content>
        <Label>{getTranslation("804")}</Label>
        <Text>
          لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ... سال 1403
        </Text>
      </Content>
    </Container>
  );
};

export default CurrentYears;
