import { getItem, removeItem } from "../../services/Utility/LocalStorage";
import FirstStep from "./FirstStep";
import SecondStep from "./SecondStep";
import ThirdStep from "./ThirdStep";
import { useEffect, useState } from "react";

const AccountSecurity = () => {
  const [step, setStep] = useState(1);
  const [time, setTime] = useState("");

  useEffect(() => {
    const storedSecurity = getItem("account_security");

    if (storedSecurity && storedSecurity.account_security > Date.now()) {
      setStep(3);
      setTime(storedSecurity.time);
    } else {
      removeItem("account_security");
      removeItem("security_end_time");
      setStep(1);
    }
  }, []);

  if (step === 1)
    return <FirstStep setStep={setStep} time={time} setTime={setTime} />;
  if (step === 2) return <SecondStep setStep={setStep} time={time} />;
  if (step === 3)
    return <ThirdStep setStep={setStep} time={time} setTime={setTime} />;
};

export default AccountSecurity;
