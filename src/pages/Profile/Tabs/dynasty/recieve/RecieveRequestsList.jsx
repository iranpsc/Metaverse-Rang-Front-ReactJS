import RequestsList from "../../../../../components/RequestsList/RequestsList";

const RecieveRequestsList = ({ rows,setRows, member, status, setStatus, setMember, type, isLoading }) => {
  return (
    <RequestsList
      rows={rows}
      setRows={setRows}
      member={member}
      status={status}
      setStatus={setStatus}
      setMember={setMember}
      type={type}
      isLoading={isLoading}
    />
  );
};

export default RecieveRequestsList;