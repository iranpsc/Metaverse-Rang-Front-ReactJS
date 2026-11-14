// ردیف یک درخواست سلسله (کد شهروند، تاریخ، نسبت، وضعیت، پاداش رضایت و PSC) با دکمه‌ی مشاهده‌ی جزئیات؛ مناسب GenericList با type="requests" در تب‌های درخواست‌های ارسالی و دریافتی

import styled from "styled-components";
import { useState } from "react";
import { LuEye } from "react-icons/lu";
import { Skeleton } from "../../../../../components/Skeletons/Skeleton.jsx";
import useRequest from "../../../../../hooks/useRequest.js";
import RequestDetails from "./RequestDetails/RequestDetails";
import satisfyIcon from "../../../../../assets/images/rewards/satisfy.png";
import { COLOR_CONFIG } from "../../../../../services/constants/colorConfig";
import {
  ConvertJalali,
  convertToPersian,
  getTranslation,
  formatNumber,
} from "../../../../../services/Utility";
import UserCode from "../../../../../components/UserCode.jsx";
// relationship (فارسی از بک‌اند) => کلید ترجمه؛ مقدار ناشناخته مثل خواهر حساب می‌شود
const FAMILY_LABELS = {
  برادر: 128,
  خواهر: 127,
  پدر: 125,
  مادر: 126,
  همسر: 825,
  فرزند: 129,
};
const DEFAULT_FAMILY_LABEL = 127;

// وضعیت => رنگ و ترجمه (هر مقدار دیگر ناموفق است)
const STATUSES = {
  confirmed: { color: "#18C08F", label: 854 },
  pending: { color: "#FFC700", label: 852 },
};
const FAILED_STATUS = { color: "#FF0000", label: 853 };

const TableCell = styled.td`
  padding: 15px 20px;
  border-bottom: 1px solid #454545;
  color: ${({ theme }) => theme.colors.newColors.shades.title};
`;

const Text = styled.h3`
  width: fit-content;
  font-size: 16px;
  font-weight: 400;
  color: ${({ $color, theme }) =>
    $color ?? theme.colors.newColors.shades.title};
`;

const Rewards = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Reward = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  h3 {
    font-size: 16px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.newColors.shades.title};
  }

  img {
    width: 26px;
    height: 26px;
    border-radius: 50%;
  }
`;

const View = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
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
  }
`;

const DetailsLoading = styled.div`
  padding: 20px;
  text-align: center;
`;

const RewardItem = ({ value, icon }) => (
  <Reward>
    <h3>{convertToPersian(formatNumber(value))}</h3>
    <img src={icon} alt="" loading="lazy" />
  </Reward>
);

const RequestRow = ({
  id,
  code,
  date,
  time,
  status,
  member,
  gif,
  psc,
  type,
  setRows,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { Request } = useRequest();
  const { color, label } = STATUSES[status] ?? FAILED_STATUS;
  const familyLabel = FAMILY_LABELS[member] ?? DEFAULT_FAMILY_LABEL;

  const handleView = async () => {
    setLoading(true);
    try {
      const endpoint =
        type === "sent"
          ? `dynasty/requests/sent/${id}`
          : `dynasty/requests/recieved/${id}`;
      const response = await Request(endpoint);
      setData(response.data.data);
      setShowDetails(true);
    } catch (error) {
      console.error("Error fetching request details:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <tr>
        <TableCell>
          <UserCode code={code} />
        </TableCell>

        <TableCell>
          <Text>
            {ConvertJalali(date)} | {convertToPersian(time)}
          </Text>
        </TableCell>

        <TableCell>
          <Text>{getTranslation(familyLabel)}</Text>
        </TableCell>

        <TableCell>
          <Text $color={color}>{getTranslation(label)}</Text>
        </TableCell>

        <TableCell>
          <Rewards>
            <RewardItem value={gif} icon={satisfyIcon} />
            <RewardItem value={psc} icon={COLOR_CONFIG.psc.gif} />
          </Rewards>
        </TableCell>

        <TableCell>
          <View onClick={handleView}>
            <LuEye size={20} />
          </View>
        </TableCell>
      </tr>

      {showDetails &&
        (loading ? (
          <tr>
            <td colSpan={6}>
              <DetailsLoading>
                <Skeleton width="100%" height="200px" radius="10px" />
              </DetailsLoading>
            </td>
          </tr>
        ) : (
          <RequestDetails
            status={status}
            date={date}
            time={time}
            code={code}
            setRows={setRows}
            gif={+gif}
            psc={psc}
            data={data}
            setShowDetails={setShowDetails}
            type={type}
          />
        ))}
    </>
  );
};

export default RequestRow;
