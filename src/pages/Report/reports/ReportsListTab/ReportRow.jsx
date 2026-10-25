// کامپوننت یک ردیف از جدول گزارش‌ها برای نمایش کد، عنوان، نوع، تاریخ و زمان هر گزارش.
// مناسب لیست گزارش‌های کاربر است؛ با کلیک روی آیکون چشم جزئیات گزارش از سرور گرفته و در ReportDetails نمایش داده می‌شود،
// و در زمان دریافت، به‌جای لودینگ سراسری، یک اسپینر کوچک داخل همان دکمه نشان داده می‌شود.
import { useState } from "react";
import styled, { useTheme } from "styled-components";
import { LuEye } from "react-icons/lu";

import ReportDetails from "./ReportDetails.jsx";
import LoadingSpinner from "../../../../components/Loading/LoadingSpinner.jsx";
import useRequest from "../../../../hooks/useRequest.js";
import {
  convertToPersian,
  getTranslation,
} from "../../../../services/Utility/index";

const MAX_TITLE_LENGTH = 60;

const MEMBER_TRANSLATION_KEYS = {
  spellingError: "15",
  codingError: "16",
  FPSError: "17",
  disrespect: "18",
  displayError: "1385",
};

const truncate = (text, max = MAX_TITLE_LENGTH) =>
  text.length > max ? `${text.substring(0, max)}...` : text;

const Cell = styled.td`
  padding: 15px 20px;
  border-bottom: 1px solid #454545;
  color: #ffffff;
  justify-content: center;

  &:nth-of-type(5) {
    padding-right: 10px;
  }
`;

const ActionCell = styled(Cell)`
  position: relative;
`;

const CellText = styled.h3`
  font-size: 16px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.newColors.shades.title};
`;

const ViewButton = styled.button`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: none;
  border-radius: 10px;
  background-color: ${({ theme }) =>
    theme.colors.newColors.otherColors.inputBg};
  cursor: pointer;

  svg {
    color: ${({ theme }) => theme.colors.newColors.shades.title};
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    transition: all 0.2s linear;

    svg {
      color: ${({ theme }) => theme.colors.newColors.primaryText};
    }
  }

  &:disabled {
    cursor: default;
  }
`;

const ReportRow = ({
  id,
  code,
  datetime,
  title,
  member,
  domain,
  subdomain,
}) => {
  const theme = useTheme();
  const { Request } = useRequest();
  const [reportDetails, setReportDetails] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [date, time] = datetime.split(" ");
  const translationKey = MEMBER_TRANSLATION_KEYS[member];
  const translatedMember = translationKey
    ? getTranslation(translationKey)
    : member;

  const fetchReportDetails = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      const response = await Request(`reports/${id}`, "GET");
      setReportDetails(response.data.data);
      setShowDetails(true);
    } catch (error) {
      console.error("Error fetching report details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <tr>
        <Cell>
          <CellText>#{convertToPersian(code)}</CellText>
        </Cell>
        <Cell>
          <CellText>{truncate(title)}</CellText>
        </Cell>
        <Cell>
          <CellText>{translatedMember}</CellText>
        </Cell>
        <Cell>
          <CellText>
            {date} | {time}
          </CellText>
        </Cell>
        <ActionCell>
          <ViewButton
            type="button"
            onClick={fetchReportDetails}
            disabled={isLoading}
          >
            {isLoading ? (
              <LoadingSpinner
                size="small"
                text=""
                color={theme.colors.newColors.shades.title}
                backgroundColor="transparent"
              />
            ) : (
              <LuEye size={20} />
            )}
          </ViewButton>
        </ActionCell>
      </tr>

      {showDetails && (
        <ReportDetails
          reportDetails={reportDetails}
          date={date}
          time={time}
          member={translatedMember}
          code={code}
          setShowDetails={setShowDetails}
          domain={domain}
          subdomain={subdomain}
        />
      )}
    </>
  );
};

export default ReportRow;
