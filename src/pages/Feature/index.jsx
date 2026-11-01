import Modal from "../../components/Modal";
import FeatureProvider from "./Context/FeatureProvider";
import { useParams, Outlet } from "react-router";

export default function Feature() {
  const { id } = useParams();
  return (
    <FeatureProvider id={id}>
      <Modal title={"345"}>
        <Outlet />
      </Modal>
    </FeatureProvider>
  );
}
