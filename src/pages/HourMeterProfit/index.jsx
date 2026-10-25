
import ModalPosition from "../../components/Modal/ModalPosition";
import Tabs from "../../components/RouteTabs.jsx";
import { getTranslation } from "../../services/Utility";

const HourMeterProfit = () => {
  const tabs = [
    {
      path: "profit",
      title: getTranslation("27"),

    },
  ];
  return (
    <ModalPosition title={"26"} position={"right"}>
      <Tabs items={tabs} />
    </ModalPosition>
  );
};

export default HourMeterProfit;
