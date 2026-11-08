// ردیف یک تراکنش در جدول تراکنش‌ها (کد، تاریخ، وضعیت، نوع، دارایی، مقدار) با دکمه‌ی مشاهده/چاپ رسید؛ مناسب GenericList با type="transactions" و شارژ خودکار کیف پول بعد از بازگشت از پرداخت

import styled from "styled-components";
import { useEffect, useRef, useState } from "react";
import { LuEye } from "react-icons/lu";
import PrintModal from "./PrintModal";
import {
  ConvertJalali,
  convertToPersian,
  getTranslation,
} from "../../../../services/Utility";
import useWalletUpdate from "../../../../hooks/useWalletUpdate.js";

// کلید status بک‌اند => ترجمه و رنگ (هر مقدار ناشناخته مثل -138 ناموفق حساب می‌شود)
const STATUSES = {
  0: { label: "741", color: "#18c090", bg: "#18c09017" },
  1: { label: "743", color: "#ffc800", bg: "#ffc80017" },
};
const FAILED_STATUS = { label: "742", color: "#ff0000", bg: "#ff000017" };

const TYPE_TITLES = { order: "739", trade: "740" };
const ASSET_TITLES = {
  blue: "753",
  red: "754",
  yellow: "755",
  irr: "756",
  psc: "757",
};

const getStatus = (status) => STATUSES[status] ?? FAILED_STATUS;

const TableRow = styled.tr`
  background-color: transparent;
`;

const TableCell = styled.td`
  position: relative;
  padding: 18px;
  border-bottom: 1px solid #bababa;
  color: ${({ theme }) => theme.colors.newColors.shades.title};
`;

const Code = styled.h2`
  font-size: 16px;
  font-weight: 500;
  text-align: center;
`;

const Text = styled.h3`
  font-size: 16px;
  font-weight: 400;
  text-align: ${({ $center }) => ($center ? "center" : "start")};
`;

const Subject = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const AssetImage = styled.img`
  width: 26px;
  height: 26px;
  border-radius: 50%;
`;

const Status = styled.h3`
  width: fit-content;
  padding: 2px 18px;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ $color }) => $color};
  background-color: ${({ $bg }) => $bg};
`;

const Print = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  cursor: pointer;
  transform: translate(-50%, -50%);
  background-color: ${({ theme }) => theme.colors.newColors.otherColors.iconBg};

  svg {
    color: ${({ theme }) => theme.colors.newColors.otherColors.iconText};
  }

  &:hover {
    transition: all 0.2s linear;
    background-color: ${({ theme }) => theme.colors.primary};

    svg {
      color: ${({ theme }) => theme.colors.newColors.primaryText};
    }
  }
`;

const TransactionRow = ({
  id,
  date,
  time,
  status,
  asset,
  type,
  amount,
  assetGif,
  paymentReturned,
}) => {
  const updateWallet = useWalletUpdate();
  const [openPrint, setOpenPrint] = useState(false);
  const handledRef = useRef(false);

  const { label, color, bg } = getStatus(status);

  // بعد از بازگشت از درگاه: مودال رسید باز می‌شود و در صورت موفق بودن، کیف پول فقط یک بار شارژ می‌شود
  useEffect(() => {
    if (!paymentReturned || handledRef.current) return;
    handledRef.current = true;

    setOpenPrint(true);

    const processedKey = `wallet_credited_${id}`;

    if (String(status) === "0" && !sessionStorage.getItem(processedKey)) {
      // اول علامت بزن، بعد اضافه کن
      sessionStorage.setItem(processedKey, "1");

      const walletKey = asset === "rial" ? "irr" : asset;
      updateWallet(walletKey, Number(amount), "+");
    }

    sessionStorage.removeItem("payment_returned");
  }, [paymentReturned, id, status, asset, amount, updateWallet]);

  const typeTitle = TYPE_TITLES[type]
    ? getTranslation(TYPE_TITLES[type])
    : type;
  const assetTitle = ASSET_TITLES[asset]
    ? getTranslation(ASSET_TITLES[asset])
    : asset;

  return (
    <TableRow className="odd:bg-slate-50 hover:bg-black/10 py-5 duration-200">
      <TableCell>
        <Code>{id}</Code>
      </TableCell>

      <TableCell>
        <Text $center>
          {ConvertJalali(date)} | {convertToPersian(time)}
        </Text>
      </TableCell>

      <TableCell>
        <Status $color={color} $bg={bg}>
          {getTranslation(label)}
        </Status>
      </TableCell>

      <TableCell>
        <Text>{typeTitle}</Text>
      </TableCell>

      <TableCell>
        <Subject>
          <AssetImage src={assetGif} alt="" loading="lazy" />
          <Text>{assetTitle}</Text>
        </Subject>
      </TableCell>

      <TableCell>
        <Text $center>{convertToPersian(amount)}</Text>
      </TableCell>

      <TableCell>
        <Print onClick={() => setOpenPrint(true)}>
          <LuEye size={20} />
        </Print>
      </TableCell>

      {openPrint && (
        <PrintModal
          code={id}
          date={date}
          time={time}
          status={status}
          title={type}
          subject={status}
          count={amount}
          gif={assetGif}
          setOpenPrint={setOpenPrint}
        />
      )}
    </TableRow>
  );
};

export default TransactionRow;
