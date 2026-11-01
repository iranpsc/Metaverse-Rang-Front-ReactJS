// کارت جزئیات ملک سلسله (کد ملک، مساحت، تراکم، افزایش سود، تعداد اعضا و آخرین بروزرسانی)؛ مناسب صفحه‌ی املاک سلسله (estate) برای نمایش اطلاعات ملک انتخاب‌شده

import styled from "styled-components";
import { useLocation, useNavigate } from "react-router";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { getTranslation } from "../../../../../services/Utility";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 350px;
  padding: 20px;
  border-radius: 5px;
  background-color: ${({ theme }) =>
    theme.colors.newColors.otherColors.inputBg};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  h3 {
    font-size: 20px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.newColors.shades.title};
  }

  span {
    font-size: 16px;
    font-weight: 600;
    text-transform: uppercase;
    cursor: pointer;
    color: ${({ theme }) => theme.colors.newColors.otherColors.orange};
  }
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  color: ${({ theme }) => theme.colors.newColors.shades.title};
`;

const Label = styled.h3`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 18px;
  font-weight: 500;
  white-space: nowrap;
`;

const Value = styled.span`
  font-size: 16px;
  font-weight: 500;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Details = ({ data }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

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
        <h3>{getTranslation(813)}</h3>
        <span
          onClick={() =>
            navigate(`/feature/${id}/info`, { state: { from: pathname } })
          }
        >
          {propertyId}
        </span>
      </Header>

      {rows.map(({ label, value, icon }) => (
        <Row key={label}>
          <Label>
            {getTranslation(label)}
            {icon && <AiOutlineExclamationCircle />}
          </Label>
          <Value>{value}</Value>
        </Row>
      ))}
    </Container>
  );
};

export default Details;
