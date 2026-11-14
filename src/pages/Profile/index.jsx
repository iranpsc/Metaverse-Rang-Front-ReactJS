import Modal from "../../components/Modal";
import Tabs from "../../components/RouteTabs.jsx";
import { getTranslation } from "../../services/Utility";

export default function Profile() {
  const tabs = [
    { path: "total", title: getTranslation("62"),  },
    { path: "property", title: getTranslation("150"), },
    { path: "transactions", title: getTranslation("61"), },
    { path: "dynasty", title: getTranslation("158"), },
    { path: "suggestion", title: getTranslation("735"), },
  ];

  return (
    <Modal title={"56"}>
      <Tabs items={tabs} />
    </Modal>
  );
}
