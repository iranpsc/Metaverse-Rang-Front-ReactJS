import ModalXs from "../../components/Modal/ModalXs";
import AccountSecurity from "./AccountSecurity";

const AccountSecurityModal = ({ onClose, onReportClick, onHelpClick }) => {
  return (
    <ModalXs
      title={"31"}
      global
      onClose={onClose}
      onReportClick={onReportClick}
      onHelpClick={onHelpClick}
    >
      <AccountSecurity />
    </ModalXs>
  );
};

export default AccountSecurityModal;
