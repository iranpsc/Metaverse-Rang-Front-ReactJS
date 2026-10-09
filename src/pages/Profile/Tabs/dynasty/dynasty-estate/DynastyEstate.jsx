import Convert from "./Convert";
import Owner from "./Owner";
import Container from "../../../../../components/Common/Container";
const DynastyEstate = ({ data, setData }) => {
  return (
    <Container>
      <Owner data={data} />
      <Convert data={data} setData={setData} />
    </Container>
  );
};

export default DynastyEstate;
