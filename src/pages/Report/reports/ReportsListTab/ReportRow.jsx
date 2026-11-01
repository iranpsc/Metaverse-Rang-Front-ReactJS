// ردیف یک گزارش در جدول گزارش‌ها (کد، عنوان، نوع، تاریخ و زمان)؛ مناسب GenericList با type="reports"؛ با کلیک روی آیکون چشم جزئیات گزارش از سرور گرفته و در ReportDetails نمایش داده می‌شود و در زمان دریافت، یک اسپینر کوچک داخل همان دکمه نشان داده می‌شود

import styled, { useTheme } from "styled-components";
import { useState } from "react";
import { LuEye } from "react-icons/lu";
import ConversationDetails from "../../../../components/ConversationDetails/ConversationDetails.jsx";
import LoadingSpinner from "../../../../components/Loading/LoadingSpinner.jsx";
import useRequest from "../../../../hooks/useRequest.js";
import {
  ConvertJalali,
  convertToPersian,
  getTranslation,
  truncateText,
} from "../../../../services/Utility";

const MAX_TITLE_LENGTH = 60;

// نوع گزارش (از بک‌اند) => کلید ترجمه
const SUBJECT_TRANSLATION_KEYS = {
  spellingError: "15",
  codingError: "16",
  FPSError: "17",
  disrespect: "18",
  displayError: "1385",
};

const Cell = styled.td`
  padding: 15px 20px;
  border-bottom: 1px solid #454545;
`;

const ActionCell = styled(Cell)`
  padding-right: 10px;
  text-align: center;
`;

const CellText = styled.h3`
  font-size: 16px;
  font-weight: 400;
  text-align: center;
  color: ${({ theme }) => theme.colors.newColors.shades.title};
`;

const ViewButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  background-color: ${({ theme }) =>
    theme.colors.newColors.otherColors.inputBg};

  svg {
    color: ${({ theme }) => theme.colors.newColors.shades.title};
  }

  &:hover {
    transition: all 0.2s linear;
    background-color: ${({ theme }) => theme.colors.primary};

    svg {
      color: ${({ theme }) => theme.colors.newColors.primaryText};
    }
  }

  &:disabled {
    cursor: default;
  }
`;

const ReportRow = ({ id, datetime, title, subject, url }) => {
  const theme = useTheme();
  const { Request } = useRequest();

  const [reportDetails, setReportDetails] = useState(null); // null = مدال بسته
  const [isLoading, setIsLoading] = useState(false);

  // عنوان و زیردامنه‌ی مدال از آدرس صفحه‌ای که گزارش از آن ثبت شده ساخته می‌شود
  const [date, time] = datetime.split(" ");
  const subjectKey = SUBJECT_TRANSLATION_KEYS[subject];
  const translatedSubject = subjectKey ? getTranslation(subjectKey) : subject;

  const fetchReportDetails = async () => {
    setIsLoading(true);

    try {
      const response = await Request(`reports/${id}`);
      setReportDetails(response.data.data);
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
          <CellText>#{convertToPersian(id)}</CellText>
        </Cell>
        <Cell>
          <CellText>{truncateText(title, MAX_TITLE_LENGTH)}</CellText>
        </Cell>
        <Cell>
          <CellText>{translatedSubject}</CellText>
        </Cell>
        <Cell>
          <CellText>
            {ConvertJalali(date)} | {convertToPersian(time)}
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

      {reportDetails && (
  <ConversationDetails
    type="reports"
    data={{ id, datetime, title, url, ...reportDetails }}
    setShowDetails={() => setReportDetails(null)}
  />
)}
    </>
  );
};

export default ReportRow;