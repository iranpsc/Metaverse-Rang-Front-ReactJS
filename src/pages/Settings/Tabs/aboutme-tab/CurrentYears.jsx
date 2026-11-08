import { useMemo, useState } from "react";
import styled from "styled-components";
import moment from "moment-jalaali";
import Dropdown from "../../../../components/Common/Dropdown.jsx";
import TitleBody from "../../../../components/TitleBody.jsx";
import { useLanguage } from "../../../../services/reducers/LanguageContext.jsx";
import { convertToPersian, getTranslation } from "../../../../services/Utility";
const START_YEAR = { persian: 1401, gregorian: 2022 };

const Container = styled.div`
  position: relative;
  padding-top: 30px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.newColors.shades.bg2};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const DropdownWrapper = styled.div`
  width: 150px;
`;

const Content = styled.div`
  margin-top: 20px;
  padding: 15px;
  border-radius: 5px;
  color: ${({ theme }) => theme.colors.newColors.shades.title};
  background-color: ${({ theme }) =>
    theme.colors.newColors.otherColors.inputBg};
`;

const CurrentYears = () => {
  const isPersian = useLanguage();
  const [pickedYear, setPickedYear] = useState(null);

  const { currentYear, options } = useMemo(() => {
    const now = moment();
    const current = isPersian ? now.jYear() : now.year();
    const start = isPersian ? START_YEAR.persian : START_YEAR.gregorian;

    const yearOptions = Array.from({ length: current - start + 1 }, (_, i) => {
      const year = current - i;
      return {
        id: year,
        value: String(year),
        label: `${getTranslation("803")} ${convertToPersian(year)}`,
      };
    });

    return { currentYear: current, options: yearOptions };
  }, [isPersian]);

  // اگر انتخاب کاربر در لیست فعلی نبود (مثلاً بعد از تغییر زبان)، سال جاری نمایش داده می‌شود
  const selectedYear = options.some(({ id }) => id === pickedYear)
    ? pickedYear
    : currentYear;

  return (
    <Container>
      <Header>
        <TitleBody title={getTranslation("802")} />
        <DropdownWrapper>
          <Dropdown
            options={options}
            selected={String(selectedYear)}
            placeholder={convertToPersian(selectedYear)}
            onSelect={(year) => setPickedYear(Number(year))}
          />
        </DropdownWrapper>
      </Header>

      <Content>
        <TitleBody title={getTranslation("804")} />
        <TitleBody
          title={
            "  لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ... سال 1403"
          }
        />
      </Content>
    </Container>
  );
};

export default CurrentYears;
