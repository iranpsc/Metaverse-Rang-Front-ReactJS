import Tabs from "../../components/RouteTabs.jsx";
import Modal from "../../components/Modal";
import { getTranslation } from "../../services/Utility";

export default function Verification() {
  const tabs = [
    {
      path: "identity",
      title: getTranslation("867"),
    },
    {
      path: "bank",
      title: getTranslation("868"),
    },
  ];

  return (
    <Modal type="modal-section-md" title={"867"}>
      <Tabs items={tabs} />
    </Modal>
  );
}
