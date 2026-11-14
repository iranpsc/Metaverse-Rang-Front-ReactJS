import { useState } from "react";
import { LuEye } from "react-icons/lu";
import styled from "styled-components";
import {
  getTranslation,
  convertToPersian,
  ConvertJalali,
} from "../../../../services/Utility/index.jsx";
import useRequest from "../../../../hooks/useRequest.js";
import { options } from "../writeWodTab/SelectInputs.jsx";
import ConversationDetails from "../../../../components/ConversationDetails/ConversationDetails.jsx";
const TableCell = styled.td`
  text-align: center;
  padding: 15px 20px;
  border-bottom: 1px solid #454545;
  color: ${(props) => props.theme.colors.newColors.shades[90]};
  &:nth-of-type(5) {
    padding-right: 10px;
  }
`;

const Text = styled.h3`
  font-size: 16px;
  font-weight: 400;
  color: ${(props) => props.theme.colors.newColors.shades.title};
`;

const StatusText = styled.h3`
  font-size: 16px;
  font-weight: 400;
  text-align: start;
  color: ${(props) => props.$color};
`;

const View = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  background-color: white;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  &:hover {
    background-color: ${(props) => props.theme.colors.primary};
  }
  svg {
    color: ${(props) => props.theme.colors.newColors.shades[20]};
  }
`;

const STATUS_TEXT_KEYS = {
  0: "1373",
  1: "1343",
  2: "1346",
  3: "1344",
  4: "1346",
  5: "1345",
};

const STATUS_COLORS = {
  0: "#18C08F",
  1: "#18C08F",
  3: "#A0A0AB",
  4: "#FFC700",
};
const DEFAULT_STATUS_COLOR = "#C30000";

// این کامپوننت برای نمایش یک ردیف تیکت در جدول (کد، عنوان، فرستنده، وضعیت، تاریخ و دکمه مشاهده جزئیات) استفاده میشه
const VodRow = ({
  id,
  code,
  date,
  time,
  title,
  status,
  sender,
  reciever,
  variant,
  department,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [ticket, setTicket] = useState(null);
  const { Request } = useRequest();
  const person = variant === "sent" ? reciever : sender;
  const departmentOption = options.find(
    (option) => option.value === department,
  );

  const onClickHandler = async () => {
    try {
      const response = await Request(`tickets/${id}`);
      setTicket(response.data.data);
      setShowDetails(true);
    } catch (error) {
      console.error("Error fetching ticket details:", error);
    }
  };
  return (
    <>
      <tr>
        <TableCell>
          <Text>#{code}</Text>
        </TableCell>
        <TableCell>
          <Text>{title}</Text>
        </TableCell>
        <TableCell>
          <Text>
            {person?.name ||
              (variant === "sent" && department
                ? departmentOption
                  ? getTranslation(departmentOption.label)
                  : department
                : "")}
          </Text>
        </TableCell>
        <TableCell>
          <StatusText $color={STATUS_COLORS[status] ?? DEFAULT_STATUS_COLOR}>
            {STATUS_TEXT_KEYS[status]
              ? getTranslation(STATUS_TEXT_KEYS[status])
              : ""}
          </StatusText>
        </TableCell>
        <TableCell>
          <Text>
            {ConvertJalali(date)} | {convertToPersian(time)}
          </Text>
        </TableCell>
        <TableCell style={{ position: "relative" }}>
          <View onClick={onClickHandler}>
            <LuEye size={20} />
          </View>
        </TableCell>
      </tr>
      {showDetails && (
        <ConversationDetails
          type="tickets"
          data={ticket}
          setData={setTicket}
          setShowDetails={setShowDetails}
        />
      )}
    </>
  );
};

export default VodRow;
