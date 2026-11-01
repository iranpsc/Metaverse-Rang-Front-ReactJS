// مدال نمایش و چاپ رسید یک تراکنش (وضعیت، دارایی، کد، تاریخ، ساعت و مقدار)؛ مناسب باز شدن از ردیف جدول تراکنش‌ها یا بعد از بازگشت از درگاه پرداخت

import styled, { createGlobalStyle } from "styled-components";
import { createPortal } from "react-dom";
import { AiFillCloseCircle } from "react-icons/ai";
import { BsCheckCircleFill } from "react-icons/bs";
import { IoReloadCircleSharp } from "react-icons/io5";
import ModalXs from "../../../../components/Modal/ModalXs";
import Button from "../../../../components/Button";
import {
  ConvertJalali,
  convertToPersian,
  getTranslation,
} from "../../../../services/Utility";

// status بک‌اند => رنگ، آیکون و ترجمه‌ها (هر مقدار دیگر مثل -138 و -1 ناموفق حساب می‌شود)
const STATUSES = {
  0: {
    color: "#00966d",
    Icon: BsCheckCircleFill,
    heading: "744",
    description: "745",
  },
  1: {
    color: "#FFC700",
    Icon: IoReloadCircleSharp,
    heading: "759",
    description: "760",
  },
};
const FAILED_STATUS = {
  color: "#C30000",
  Icon: AiFillCloseCircle,
  heading: "761",
  description: "762",
};

// هنگام چاپ فقط خود رسید (#print-header) در وسط صفحه دیده می‌شود
const PrintStyles = createGlobalStyle`
  @media print {
    body * {
      visibility: hidden !important;
    }

    #print-header,
    #print-header * {
      visibility: visible !important;
    }

    #print-header {
      position: fixed !important;
      top: 50% !important;
      left: 50% !important;
      transform: translate(-50%, -50%) !important;
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      margin: 0 !important;
      padding: 32px !important;
      border-radius: 0 !important;
      background: none !important;
      box-shadow: none !important;
    }

    .print-hide,
    .print-hide * {
      display: none !important;
    }
  }
`;

const Receipt = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const StatusIcon = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  color: ${({ $color }) => $color};

  &::before {
    content: "";
    position: absolute;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: white;
  }

  svg {
    z-index: 1;
  }

  @media (max-width: 1000px) {
    margin-bottom: 4px;

    &::before {
      width: 34px;
      height: 34px;
    }

    svg {
      width: 56px;
      height: 56px;
    }
  }
`;

const StatusTitle = styled.p`
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: ${({ $color }) => $color};

  @media (max-width: 1000px) {
    font-size: 18px;
  }
`;

const StatusText = styled.span`
  font-size: 16px;
  font-weight: 400;
  text-align: center;
  color: ${({ theme }) => theme.colors.newColors.shades.title};

  @media (max-width: 1000px) {
    font-size: 13px;
  }
`;

const Info = styled.div`
  width: 100%;
  margin-top: 20px;
  padding: 0 20px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 0;

  &:not(:last-child) {
    border-bottom: 1px solid #454545;
  }

  @media (max-width: 480px) {
    gap: 8px;
    padding: 5px 0;
  }
`;

const Label = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.newColors.shades.title};

  @media (max-width: 1000px) {
    font-size: 13px;
  }
`;

const Value = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 400;
  text-align: left;
  word-break: break-word;
  color: ${({ theme }) => theme.colors.newColors.shades.title};

  @media (max-width: 1000px) {
    font-size: 13px;
  }
`;

const AssetValue = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const PrintAction = styled.div`
  margin: 8px 0;
`;

const PrintModal = ({
  code,
  date,
  time,
  status,
  title,
  count,
  gif,
  setOpenPrint,
}) => {
  const close = () => setOpenPrint(false);
  const { color, Icon, heading, description } =
    STATUSES[status] ?? FAILED_STATUS;

  const rows = [
    {
      label: "750",
      value: (
        <AssetValue>
          <img loading="lazy" width={26} height={26} src={gif} alt="" />
          <Value>
            {getTranslation("353")} {convertToPersian(count)}
          </Value>
        </AssetValue>
      ),
    },
    { label: "747", value: <Value>{code}</Value> },
    { label: "748", value: <Value>{ConvertJalali(date)}</Value> },
    { label: "749", value: <Value>{convertToPersian(time)}</Value> },
    { label: "750", value: <Value>{title}</Value> },
    { label: "751", value: <Value>{convertToPersian(count)}</Value> },
  ];

  // پورتال لازم است چون این مدال داخل <tr> رندر می‌شود و div داخل tr معتبر نیست
  return createPortal(
    <ModalXs global onlyExit handleExitClick={close} onClose={close} hideTitle compact>
      <PrintStyles />

      <Receipt id="print-header">
        <StatusIcon $color={color}>
          <Icon size={80} />
        </StatusIcon>

        <StatusTitle $color={color}>{getTranslation(heading)}</StatusTitle>
        <StatusText>{getTranslation(description)}</StatusText>

        <Info>
          {rows.map(({ label, value }, index) => (
            <Row key={index}>
              <Label>{getTranslation(label)}</Label>
              {value}
            </Row>
          ))}

          <PrintAction className="print-hide">
            <Button full label={getTranslation("67")} onClick={window.print} />
          </PrintAction>
        </Info>
      </Receipt>
    </ModalXs>,
    document.body,
  );
};

export default PrintModal;
