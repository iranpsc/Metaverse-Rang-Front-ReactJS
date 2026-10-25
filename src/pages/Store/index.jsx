import Tabs from "../../components/RouteTabs.jsx";
import ShopInfo from "./shop/ShopInfo";
import Modal from "../../components/Modal/index";
import { getTranslation } from "../../services/Utility";

export default function Store() {
  const tabs = [
    {
      path: "tools",
      title: getTranslation("109"),
    },
    {
      path: "currency",
      title: getTranslation("110"),
    },
  ];

  return (
    <Modal title={"30"}>
      <Tabs items={tabs} />
      <ShopInfo />
    </Modal>
  );
}
