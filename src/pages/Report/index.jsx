import Modal from "../../components/Modal";
import Tabs from "../../components/RouteTabs.jsx";
import { getTranslation } from "../../services/Utility";

export default function Report() {
  const tabs = [
    {
      path: "send",
      title: getTranslation("1386"),
    },
    {
      path: "list",

      title: getTranslation("22"),
    },
  ];

  return (
    <Modal type="modal-section-xl" title={23}>
      <Tabs items={tabs} />
    </Modal>
  );
}
