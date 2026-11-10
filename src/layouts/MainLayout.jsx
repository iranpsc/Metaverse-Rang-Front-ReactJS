import { lazy, Suspense, useContext, useEffect } from "react";
import Menu from "./menu";
import StatusBar from "./statusBar";
import { useLocation, useNavigate } from "react-router";
import { MenuContextProvider } from "../services/reducers/MenuContext";
import styled from "styled-components";
import { Outlet } from "react-router";
import { UserContext } from "../services/reducers/UserContext";
import { getItem } from "../services/Utility/LocalStorage";
import RouteSkeleton from "../components/Skeletons/RouteSkeleton";
import spiner from "../assets/gif/loader.svg";
import TitleBody from "../components/TitleBody";
const MapTreeD = lazy(() => import("./map"));
const MapProvider = lazy(() =>
  import("react-map-gl/maplibre").then(({ MapProvider }) => ({
    default: MapProvider,
  })),
);

const MapFallback = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1 1 0;
  overflow-x: hidden;
  align-items: center;
  justify-content: center;
  height: 100%;
  box-sizing: border-box;
`;

const Container = styled.section`
  display: flex;
  overflow-y: hidden;
  width: 100%;
  height: var(--app-height);
  flex-direction: row;
  gap: 5px;
  background-color: ${(props) => props.theme.colors.newColors.shades.bg2};
  padding: 5px;
  @media (min-width: 768px) {
    gap: 10px;
    padding: 10px;
  }

  transition: all 0.3s ease 0s;
`;
const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const usertoken = getItem("user");
  const [user] = useContext(UserContext);
  useEffect(() => {
    if (!user || !usertoken) return;
    // هنوز اطلاعات user کامل نشده
    if (user.has_wallet === undefined) return;

    // کیف پول دارد
    if (user.has_wallet === true) return;

    // فقط وقتی URL نقشه به مقدار اولیه رسید
    const isMapUrl = new URLSearchParams(location.search).has("map");

    if (!isMapUrl) return;

    const currentSession = `${usertoken.token}-${usertoken.expire}`;
    const shownSession = localStorage.getItem("walletModalShown");

    if (shownSession === currentSession) return;

    localStorage.setItem("walletModalShown", currentSession);

    navigate("/connectWallet", {
      replace: true,
    });
  }, [user, usertoken, location.search, navigate]);
  return (
    <Container>
      <MenuContextProvider>
        <Menu />
      </MenuContextProvider>
      <Suspense
        fallback={
          <MapFallback role="status">
            <img src={spiner} width={100} height={100} alt="" />
            <TitleBody big color="#FFC700" title={"در حال بارگذاری نقشه"} />
          </MapFallback>
        }
      >
        <MapProvider>
          <Suspense
            fallback={
              <MapFallback role="status">
                <img src={spiner} width={100} height={100} alt="" />{" "}
                <TitleBody big color="#FFC700" title={"در حال بارگذاری نقشه"} />
              </MapFallback>
            }
          >
            <MapTreeD />
          </Suspense>
          <Suspense fallback={<RouteSkeleton />}>
            <Outlet />
          </Suspense>
        </MapProvider>
      </Suspense>
      <StatusBar />
    </Container>
  );
};

export default MainLayout;
