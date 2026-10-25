import styled from "styled-components";
import { getTranslation } from "../services/Utility";
import { NavLink } from "react-router";
import { Label } from "./Sidebar";
const Wrapper = styled.div`
  max-width: 171px !important;
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.bgContainer};
  border-radius: 5px;
  color: #dedee9;
  height: 500px;
  margin-top: 20px;
`;

const SidebarOptions = ({ seller, hasPrice }) => {
  return (
    <Wrapper>
      {seller || hasPrice ? (
        <NavLink
          to={seller ? "../sell/lowest" : "../buy/price"}
          replace
          end
        >
          {({ isActive }) => (
            <Label menu={isActive}>
              {seller ? getTranslation("517") : getTranslation("524")}
            </Label>
          )}
        </NavLink>
      ) : null}

      <NavLink
        to={seller ? "../sell/PriceDefine" : "../buy/suggest"}
        replace
        end
      >
        {({ isActive }) => (
          <Label menu={isActive}>
            {seller ? getTranslation("519") : getTranslation("525")}
          </Label>
        )}
      </NavLink>
    </Wrapper>
  );
};
export default SidebarOptions;
