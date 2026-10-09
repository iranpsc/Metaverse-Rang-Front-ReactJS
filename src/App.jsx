import { useLayoutEffect } from "react";
import { BrowserRouter } from "react-router";
import { Toaster } from "react-hot-toast";

import "./App.css";
import "./i18n/i18n.js";

import { connectSocket } from "./services/socket";
import { getItem } from "./services/Utility/LocalStorage";
import UserProvider from "./services/reducers/UserContext.jsx";
import WalletProvider from "./services/reducers/WalletContext";
import FollowProvider from "./services/reducers/FollowContext";
import { MapContextProvider } from "./services/reducers/mapContext";
import { ThemeProviderContext } from "./services/reducers/ThemeContext";
import { MapProvider } from "react-map-gl/maplibre";
import { SelectedEnvironmentProvider } from "./services/reducers/SelectedEnvironmentContext.jsx";
import { AlertProvider } from "./services/reducers/AlertContext.jsx";
import Routers from "./layouts/map/Routers.jsx";
import { LanguageProvider } from "./services/reducers/LanguageContext.jsx";
import { LoaderProvider } from "./services/reducers/LoaderProvider.jsx";
import RotateDevice from "./components/RotateDevice";
import { useAppHeight } from "./hooks/useAppHeight.js";
import { ScrollDirectionProvider } from "./services/reducers/ScrollDirectionContext.jsx";
import { MapLandsProvider } from "./services/reducers/MapLandsContext.jsx";

function App() {
  useAppHeight();

  useLayoutEffect(() => {
    // قبل از لاگین توکن نیست => اتصال public؛ بعد از لاگین => authenticated
    const token = getItem("user")?.token;
    connectSocket(token || "");

    // هماهنگ شدن بین تب‌ها (این رویداد فقط در تب‌های دیگر فایر می‌شود).
    // در همین تب، useAuth بعد از لاگین/لاگ‌اوت connectSocket صدا می‌زند.
    const onStorage = (event) => {
      if (event.key !== "user") return;

      const nextToken = getItem("user")?.token;
      connectSocket(nextToken || "");
    };

    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("storage", onStorage);
      // عمداً disconnect نمی‌کنیم تا با StrictMode سوکت قطع و وصل نشود.
    };
  }, []);

  return (
    <LanguageProvider>
      <BrowserRouter>
        <ScrollDirectionProvider>
          <LoaderProvider>
            <MapLandsProvider>
              <MapProvider>
                <ThemeProviderContext>
                  <UserProvider>
                    <WalletProvider>
                      <FollowProvider>
                        <SelectedEnvironmentProvider>
                          <MapContextProvider>
                            <AlertProvider>
                              <RotateDevice />

                              <Routers />

                              <Toaster
                                containerStyle={{
                                  zIndex: 100000,
                                  marginBottom: 48,
                                }}
                                position="bottom-right"
                              />
                            </AlertProvider>
                          </MapContextProvider>
                        </SelectedEnvironmentProvider>
                      </FollowProvider>
                    </WalletProvider>
                  </UserProvider>
                </ThemeProviderContext>
              </MapProvider>
            </MapLandsProvider>
          </LoaderProvider>
        </ScrollDirectionProvider>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
