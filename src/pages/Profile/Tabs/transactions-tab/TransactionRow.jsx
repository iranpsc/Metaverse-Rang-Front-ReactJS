import { LuEye } from "react-icons/lu";
import PrintModal from "./PrintModal";
import { WalletContext, WalletContextTypes } from "../../../../services/reducers/WalletContext";
import styled from "styled-components";
import { useState, useEffect, useContext,useRef } from "react";
import {
  convertToPersian,
  getTranslation, ConvertJalali
} from "../../../../services/Utility";
import { updateWalletValue } from "../../../../services/Utility/walletUtils";
const TableRow = styled.tr`
  background-color: transparent;
`;

const TableCell = styled.td`
  padding: 18px;
  border-bottom: 1px solid #BABABA;
  color: ${(props) => props.theme.colors.newColors.shades.title};
`;

const Image = styled.img`
  width: 26px;
  height: 26px;
  border-radius: 50%;
`;

const Code = styled.h2`
  font-size: 16px;
  font-weight: 500;
  text-align: center;
`;

const Date = styled.h3`
  font-size: 16px;
  font-weight: 400;
  text-align: center;
`;

const Title = styled.h3`
  font-size: 16px;
  font-weight: 400;
  text-align: start;
`;

const Subject = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const Print = styled.div`
  width: 40px;
  height: 40px;
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.iconBg};
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
    color: ${(props) => props.theme.colors.newColors.otherColors.iconText};
  }
  svg:hover {
    color: ${(props) => props.theme.colors.newColors.primaryText};
  }
`;

const Status = styled.h3`
  color: ${(props) =>
    props.status == "0"
      ? "#18c090"
      : props.status == "1"
        ? "#ffc800"
        : "#ff0000"};
  padding: 2px 18px;
  background-color: ${(props) =>
    props.status == "0"
      ? "#18c09017"
      : props.status == "1"
        ? "#ffc80017"
        : "#ff000017"};
  width: fit-content;
  font-size: 0.875rem;
  border-radius: 0.25rem;
  font-weight: 600;
`;

const TransactionRow = ({
  id,
  date,
  time,
  status,
  asset,
  type,
  amount,
  assetGif, paymentReturned
}) => {

  const [Wallet, dispatch] = useContext(WalletContext);
  const [openPrint, setOpenPrint] = useState(false);
    const handledRef = useRef(false);

 useEffect(() => {
    if (!paymentReturned) return;

    if (handledRef.current) return;
    handledRef.current = true;

    setOpenPrint(true);

    const processedKey = `wallet_credited_${id}`;
    const alreadyCredited = sessionStorage.getItem(processedKey);

    if (status == 0 && !alreadyCredited) {
      sessionStorage.setItem(processedKey, "1"); // اول علامت بزن، بعد اضافه کن

      const updatedWallet = updateWalletValue(Wallet, { asset, value: amount });
      dispatch({
        type: WalletContextTypes.ADD_WALLET,
        payload: updatedWallet,
      });
    }

    sessionStorage.removeItem("payment_returned");
  }, [paymentReturned]);

  const getAssetTitle = (assetType) => {
    switch (assetType) {
      case "red":
        return getTranslation("754");
      case "blue":
        return getTranslation("753");
      case "yellow":
        return getTranslation("755");
      default:
        return assetType;
    }
  };

  return (
    <TableRow className="odd:bg-slate-50 hover:bg-black/10 py-5 duration-200">
      <TableCell>
        <div>
          <Code>{id}</Code>
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
        <Status status={status}>
          {status == "0"
            ? getTranslation("741")
            : status == "-138"
              ? getTranslation("742")
              : status == "1"
                ? getTranslation("743")
                : getTranslation("742")}
        </Status>
      </TableCell>
      <TableCell>
        <Title>
          {type == "order"
            ? getTranslation("739")
            : type == "trade"
              ? getTranslation("740")
              : type}
        </Title>
      </TableCell>
      <TableCell>
        <Subject>
          <Image
            width={300}
            height={300}
            alt="doctor"
            loading="lazy"
            src={assetGif}
          />
          <Title>{getAssetTitle(asset)}</Title>
        </Subject>
      </TableCell>
      <TableCell>
        <div>
          <Title style={{ textAlign: "center" }}>
            {convertToPersian(amount)}
          </Title>
        </div>
      </TableCell>
      <TableCell
        style={{
          position: "relative",
        }}
      >
        <Print
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
          onClick={() => setOpenPrint(true)}
        >
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
