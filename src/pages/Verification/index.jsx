import Tabs from "../../components/RouteTabs.jsx";
import Modal from "../../components/Modal";
import { getTranslation } from "../../services/Utility";
import { useContext } from "react";
import { UserContext } from "../../services/reducers/UserContext.jsx";
export default function Verification() {
  const [user] = useContext(UserContext);
  const tabs = [
    {
      path: "identity",
      title: getTranslation("867"),
    },
    ...(user?.verified_kyc
      ? [
          {
            path: "bank",
            title: getTranslation("868"),
          },
        ]
      : ""),
  ];

  return (
    <Modal title={"867"}>
      <Tabs items={tabs} />
    </Modal>
  );
}
