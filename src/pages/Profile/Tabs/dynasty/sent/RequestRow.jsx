import { LuEye } from "react-icons/lu";
import RequestDetails from "./RequestDetails";
import {
  convertToPersian,
  getTranslation,
  metarangUrlCitizen,
  ConvertJalali,
} from "../../../../../services/Utility";
import gift from "../../../../../assets/images/satisfy.png";
import pscGif from "../../../../../assets/gif/psc.gif";
import styled from "styled-components";
import { useState } from "react";
import useRequestDetails from "../../../../../hooks/useRequestDetails";
import { Skeleton } from "../../../../../components/Skeleton";

const TableRow = styled.tr`
  background-color: transparent;
`;

const TableCell = styled.td`
  padding: 15px 20px;
  border-bottom: 1px solid #454545;
  color: ${(props) => props.theme.colors.newColors.shades.title};
`;

const Image = styled.img`
  width: 26px;
  height: 26px;
  border-radius: 50%;
`;

const Code = styled.a`
  font-size: 16px;
  font-weight: 500;
  color: ${(props) => props.theme.colors.primary};
  text-transform: uppercase;
  cursor: pointer;
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

const Subject = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const View = styled.div`
  width: 40px;
  height: 40px;
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.inputBg};
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover {
    background-color: ${(props) => props.theme.colors.primary};
    transition: all 0.2s linear;
  }
  svg {
    color: ${(props) => props.theme.colors.newColors.shades.title};
  }
`;

const Status = styled.h3`
  color: ${(props) => props.theme.colors.newColors.shades.title};
  width: fit-content;
  font-size: 16px;
  border-radius: 0.25rem;
  font-weight: 400;
`;

const Div = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  h3 {
    color: ${(props) => props.theme.colors.newColors.shades.title};
    font-size: 16px;
    font-weight: 500;
  }
`;

// اسکلتون برای ردیف
const SkeletonRow = styled.tr`
  td {
    padding: 15px 20px;
    border-bottom: 1px solid #454545;
  }
`;

const RequestRow = ({
  code,
  date,
  time,
  status,
  member,
  gif,
  psc,
  id,
  type,
  isLoading, setRows,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const { data, loading, fetchRequestDetails } = useRequestDetails(type);
  const familyMap = {
    برادر: 128,
    پدر: 125,
    مادر: 126,
    همسر: 825,
    فرزند: 129,
  };
  const family = familyMap[member] ?? 127;
  // اگر در حال لودینگ هستیم، اسکلتون نشون بده
  if (isLoading) {
    return (
      <SkeletonRow>
        <td>
          <Skeleton width="100px" height="16px" radius="4px" />
        </td>
        <td>
          <Skeleton width="120px" height="16px" radius="4px" />
        </td>
        <td>
          <Skeleton width="80px" height="16px" radius="4px" />
        </td>
        <td>
          <Skeleton width="100px" height="16px" radius="4px" />
        </td>
        <td>
          <Subject>
            <Div>
              <Skeleton width="30px" height="16px" radius="4px" />
              <Skeleton width="26px" height="26px" radius="50%" />
            </Div>
            <Div>
              <Skeleton width="30px" height="16px" radius="4px" />
              <Skeleton width="26px" height="26px" radius="50%" />
            </Div>
          </Subject>
        </td>
        <td>
          <Skeleton width="40px" height="40px" radius="10px" />
        </td>
      </SkeletonRow>
    );
  }

  const handleClick = async () => {
    try {
      await fetchRequestDetails(id);
      setShowDetails(true);
    } catch (error) {
      console.error("Error fetching request details:", error);
    }
  };

  return (
    <>
      <TableRow>
        <TableCell>
          <div>
            <Code
              href={metarangUrlCitizen(code)}
              target="_blank"
              rel="noopener noreferrer"
            >
              {code}
            </Code>
          </div>
        </TableCell>
        <TableCell>
          <div>
            <Date>
              {ConvertJalali(date)} | {convertToPersian(time)}
            </Date>
          </div>
        </TableCell>
        <TableCell>
          <Status>{getTranslation(family)}</Status>
        </TableCell>
        <TableCell>
          <Title
            style={{
              color: `${status === "confirmed"
                  ? "#18C08F"
                  : status === "pending"
                    ? "#FFC700"
                    : "#FF0000"
                }`,
            }}
          >
            {status === "confirmed"
              ? getTranslation(854)
              : status === "pending"
                ? getTranslation(852)
                : getTranslation(853)}
          </Title>
        </TableCell>
        <TableCell>
          <Subject>
            <Div>
              <h3>{convertToPersian(gif)}</h3>
              <Image
                width={300}
                height={300}
                alt="doctor"
                loading="lazy"
                src={gift}
              />
            </Div>
            <Div>
              <h3>{convertToPersian(psc)}</h3>
              <Image
                width={300}
                height={300}
                alt="doctor"
                loading="lazy"
                src={pscGif}
              />
            </Div>
          </Subject>
        </TableCell>
        <TableCell>
          <View onClick={handleClick}>
            <LuEye size={20} />
          </View>
        </TableCell>
      </TableRow>
      {showDetails && !loading && (
        <RequestDetails
          status={status}
          date={date}
          time={time}
          code={code}
          setRows={setRows}
          gif={gif}
          psc={psc}
          data={data}
          setShowDetails={setShowDetails}
          type={type}
        />
      )}
      {showDetails && loading && (
        <tr>
          <td colSpan="6">
            <div style={{ padding: "20px", textAlign: "center" }}>
              <Skeleton width="100%" height="200px" radius="10px" />
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default RequestRow;
