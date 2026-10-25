import { useState } from "react";
import { LuEye } from "react-icons/lu";
import VodDetails from "./VodDetails.jsx";
import styled from "styled-components";
import { getTranslation,convertToPersian,ConvertJalali } from "../../../../services/Utility/index.jsx";
import useRequest from "../../../../hooks/useRequest.js";

const TableRow = styled.tr`
  background-color: ${(props) =>
    props.status === "confirmed" ? "#ffc70021" : "transparent"};
`;

const TableCell = styled.td`
  text-align: center;
  padding: 15px 20px;
  border-bottom: 1px solid #454545;
  color: ${(props) => props.theme.colors.newColors.shades[90]};
  &:nth-of-type(5) {
    padding-right: 10px;
  }
`;

const Code = styled.h3`
  font-size: 16px;
  font-weight: 400;
  color: ${(props) => props.theme.colors.newColors.shades.title};
`;

const Date = styled.h3`
  font-size: 16px;
  font-weight: 400;
  color: ${(props) => props.theme.colors.newColors.shades.title};
`;

const Title = styled.h3`
  font-size: 16px;
  font-weight: 400;
`;

const View = styled.div`
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

const Status = styled.h3`
  color: ${(props) => props.theme.colors.newColors.shades.title};
  width: fit-content;
  font-size: 16px;
  border-radius: 0.25rem;
  font-weight: 400;
`;

const VodRow = ({ id, code, date, time, title, status, sender }) => {
  const [showDetails, setShowDetails] = useState(false);
  const { Request } = useRequest();
  const [ticket, setTicket] = useState(null);
  const onClickHandler = async (id) => {
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
      <TableRow status={status}>
        <TableCell>
          <Code>#{code}</Code>
        </TableCell>
        <TableCell>
          <Date>{title}</Date>
        </TableCell>
        <TableCell>
          <Status>{sender.name}</Status>
        </TableCell>
        <TableCell>
          <Title
            style={{
              textAlign: "start",
              color: `${status === 1
                ? "#18C08F"
                : status === 4
                  ? "#FFC700"
                  : status === 3
                    ? "#A0A0AB"
                    : status === 0
                      ? "#18C08F"
                      : "#C30000"
                }`,
            }}
          >
            {(() => {
              switch (status) {
                case 0:
                  return getTranslation("1373");
                case 1:
                  return getTranslation("1343");
                case 2:
                  return getTranslation("1346");
                case 3:
                  return getTranslation("1344");
                case 4:
                  return getTranslation("1346");
                case 5:
                  return getTranslation("1345");
                default:
                  return "";
              }
            })()}
          </Title>
        </TableCell>
        <TableCell>
          <Date>
            {ConvertJalali(date)} | {convertToPersian(time)}
          </Date>
        </TableCell>
        <TableCell
          style={{
            position: "relative",
            textAlign: "center",
            verticalAlign: "middle",
          }}
        >
          <View
            onClick={() => onClickHandler(id)}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              cursor: "pointer",
            }}
          >
            <LuEye size={20} />
          </View>
        </TableCell>
      </TableRow>
      {showDetails && (
        <VodDetails
          data={ticket}
          setData={setTicket}
          setShowDetails={setShowDetails}
        />
      )}
    </>
  );
};

export default VodRow;
