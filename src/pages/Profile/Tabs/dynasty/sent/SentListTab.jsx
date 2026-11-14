import DynastyRequests from '../components/DynastyRequests';

const SentListTab = () => {
  return (
    <DynastyRequests
      title={113}
      requestType="sent"
      userField="to_user"
    />
  );
};

export default SentListTab;