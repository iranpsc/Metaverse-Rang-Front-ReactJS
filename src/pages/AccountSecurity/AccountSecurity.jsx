import { useState } from "react";
import { getItem, removeItem } from "../../services/Utility/LocalStorage";
import FirstStep from "./FirstStep";
import SecondStep from "./SecondStep";
import ThirdStep from "./ThirdStep";

const STEPS = {
  1: FirstStep,
  2: SecondStep,
  3: ThirdStep,
};

const getInitialState = () => {
  const stored = getItem("account_security");
  const endTime = Number(stored?.account_security);

  removeItem("security_end_time");

  if (Number.isFinite(endTime) && endTime > Date.now()) {
    return { step: 3, time: stored.time ?? "" };
  }

  removeItem("account_security");

  return { step: 1, time: "" };
};

const AccountSecurity = () => {
  const [initial] = useState(getInitialState);
  const [step, setStep] = useState(initial.step);
  const [time, setTime] = useState(initial.time);

  const Step = STEPS[step] ?? FirstStep;

  return <Step setStep={setStep} time={time} setTime={setTime} />;
};

export default AccountSecurity;
