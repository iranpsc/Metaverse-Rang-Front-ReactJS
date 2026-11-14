// کارت جزئیات ملک سلسله (کد ملک، مساحت، تراکم، افزایش سود، تعداد اعضا و آخرین بروزرسانی)؛ مناسب صفحه‌ی املاک سلسله (estate) برای نمایش اطلاعات ملک انتخاب‌شده

import styled from "styled-components";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { getTranslation } from "../../../../../services/Utility";
import TitleBody from "../../../../../components/TitleBody";
import LandText from "../../../../../components/LandText";
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  border-radius: 5px;
  background-color: ${({ theme }) =>
    theme.colors.newColors.otherColors.inputBg};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  color: ${({ theme }) => theme.colors.newColors.shades.title};
  div {
    display: flex;
    align-items: center;
    gap: 2px;
  }
`;

const Details = ({ data }) => {
  const feature = data?.["dynasty-feature"];
  if (!feature) return null;

  const {
    id,
    properties_id: propertyId,
    area,
    density,
    "feature-profit-increase": profitIncrease,
    "family-members-count": membersCount,
    "last-updated": lastUpdated,
  } = feature;

  // icon: نمایش آیکون اطلاعات کنار عنوان
  const rows = [
    { label: 373, value: area },
    { label: 117, value: density },
    { label: 814, value: `${profitIncrease}٪`, icon: true },
    { label: 815, value: membersCount },
    { label: 1368, value: lastUpdated, icon: true },
  ];

  return (
    <Container>
      <Header>
        <TitleBody weight title={getTranslation(813)} />
        <LandText label={propertyId} to={`/feature/${id}/info} `} />
      </Header>

      {rows.map(({ label, value, icon }) => (
        <Row key={label}>
          <div>
            <TitleBody noWrap title={getTranslation(label)} />
            {icon && <AiOutlineExclamationCircle />}
          </div>
          <TitleBody align="end" title={value} />
        </Row>
      ))}
    </Container>
  );
};

export default Details;
