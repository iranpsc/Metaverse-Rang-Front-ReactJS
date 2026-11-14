import GeneralDefault from "./Tabs/GeneralDefault";
import Sidebar from "../../../../components/Sidebar";
import styled from "styled-components";
const Wrapper = styled.div`
  display: flex;
  gap: 10px;
  width: 100%;
  overflow: hidden;
`;
const SIDEBAR_ITEMS = [
  { to: "", title: "358" },
  { to: "following", title: "359", disabled: true },
];
const PropertyConstruction = () => {
  return (
    <Wrapper>
      <Sidebar items={SIDEBAR_ITEMS} />
      <GeneralDefault />
    </Wrapper>
  );
};

export default PropertyConstruction;
