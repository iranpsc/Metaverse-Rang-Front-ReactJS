import ModalPosition from "../../components/Modal/ModalPosition";
import Tabs from "../../components/RouteTabs.jsx";
import { getTranslation } from "../../services/Utility";
export default function Search() {
  const tabs = [
    {
      path: "citizen",
      title: getTranslation("470"),
    },
    {
      path: "property",
      title: getTranslation("471"),
    },
  ];

  return (
    <ModalPosition title={"232"} position={"left"}>
      <Tabs items={tabs} />
    </ModalPosition>
  );
}
