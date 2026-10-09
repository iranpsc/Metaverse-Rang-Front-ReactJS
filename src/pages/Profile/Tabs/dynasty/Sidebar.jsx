import { useEffect, useMemo, useState, useContext } from "react";
import { getTranslation } from "../../../../services/Utility";
import { Container, Label } from "../../../../components/sidbar";
import { NavLink, useLocation } from "react-router";
import { UserContext } from "../../../../services/reducers/UserContext";
const Sidebar = (data) => {
  const { pathname } = useLocation();
  const [user] = useContext(UserContext);
  const lastSegment = useMemo(() => {
    const segments = pathname.split("/");
    return segments[segments.length - 1];
  }, [pathname]);
  const userHasDynasty = data?.data?.["user-has-dynasty"];
  const [dynastyStatus, setDynastyStatus] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("dynastyStatus");
    if (stored) {
      setDynastyStatus(stored);
    }

    const handler = (event) => {
      setDynastyStatus(event.detail);
    };

    window.addEventListener("dynastyStatusUpdated", handler);

    return () => {
      window.removeEventListener("dynastyStatusUpdated", handler);
    };
  }, []);

  if (!dynastyStatus) return null;

  const labelText =
    dynastyStatus === "has"
      ? getTranslation(819)
      : getTranslation(807);

  return (
    <Container>
      <NavLink to="establish" replace end>
        {({ isActive }) => (
          <Label menu={isActive || lastSegment === "estate"}>
            {labelText}
            {""}
          </Label>
        )}
      </NavLink>
      {userHasDynasty && (<NavLink to="members" replace end>
        {({ isActive }) => (
          <Label menu={isActive}>{getTranslation(112)}</Label>
        )}
      </NavLink>)}

      {userHasDynasty && (<NavLink to="send" replace end>
        {({ isActive }) => (
          <Label menu={isActive}>{getTranslation(113)}</Label>
        )}
      </NavLink>)}

      {(user.verified_kyc || userHasDynasty) && (<NavLink to="recieved" replace end>
        {({ isActive }) => (
          <Label menu={isActive}>{getTranslation(114)}</Label>
        )}
      </NavLink>)
      }

    </Container>
  );
};

export default Sidebar;
