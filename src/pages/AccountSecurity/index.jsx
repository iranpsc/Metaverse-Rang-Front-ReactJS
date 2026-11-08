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
      reportFrom="/confirmation"
    >
      <AccountSecurity />
    </ModalXs>
  );
};

export default AccountSecurityModal;
