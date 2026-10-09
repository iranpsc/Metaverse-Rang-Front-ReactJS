import { Outlet, Route, Routes, Navigate } from "react-router";

import Search from "../../pages/Search";
import PrivateRoute from "../../routes/PrivateRoute";
import Report from "../../pages/Report";
import Sanad from "../../pages/Documents";
import Settings from "../../pages/Settings";
import Notifications from "../../pages/Notifications";
import Store from "../../pages/Store";
import Profile from "../../pages/Profile";
import Verification from "../../pages/Verification";
import Feature from "../../pages/Feature";
import ConditionalPage from "../../pages/Feature/ConditionalPage";
import Commercial from "../../components/Lottie/Commercial";
import Residential from "../../components/Lottie/Residential";
import Educational from "../../components/Lottie/Educational";
import SignupLottie from "../../components/Lottie/SignupLottie";
import HourMeterProfit from "../../pages/HourMeterProfit";
import WalletSetupTab from "../../pages/MetaWallet/WalletSetupTab";
import AccountSecurityModal from "../../pages/AccountSecurity";
//import { ProfileInfoProvider } from './services/reducers/profileInfoContext.jsx';
import WriteVodTab from "../../pages/Documents/Tabs/WriteVodTab";
import VodListTab from "../../pages/Documents/Tabs/VodListTab";
import ReceivedList from "../../pages/Documents/Tabs/receive/ReceivedList";
import SentList from "../../pages/Documents/Tabs/sent/SentList";
import NotesListTab from "../../pages/Documents/Tabs/notes/NotesListTab";
import Challenge from "../../pages/Challenges/Challenge";
import DynastyTab from "../../pages/Profile/Tabs/dynasty/DynastyTab";
import PropertyTab from "../../pages/Profile/Tabs/property-tab/PropertyTab";
import TotalTab from "../../pages/Profile/Tabs/total-tab/TotalTab";
import SuggestionTab from "../../pages/Profile/Tabs/suggestion-tab/SuggestionTab";
import TransactionsTab from "../../pages/Profile/Tabs/transactions-tab/TransactionsTab";
import Followers from "../../pages/Profile/Tabs/property-tab/Followers";
import Following from "../../pages/Profile/Tabs/property-tab/Following";
import Houses from "../../pages/Profile/Tabs/property-tab/Houses";
import DynastyEstablishEstate from "../../pages/Profile/Tabs/dynasty/DynastyEstablishEstate";
import DynastyMembers from "../../pages/Profile/Tabs/dynasty/dynasty-members/DynastyMembers";
import RecievedList from "../../pages/Profile/Tabs/dynasty/recieve/RecievedList";
import SendRequest from "../../pages/Profile/Tabs/dynasty/sent/SendRequest";
import RecievedSuggestion from "../../pages/Profile/Tabs/suggestion-tab/recieved/RecievedSuggestion";
import SentSuggestion from "../../pages/Profile/Tabs/suggestion-tab/sent/SentSuggestion";
import AccountTab from "../../pages/Settings/Tabs/account-tab/AccountTab";
import PublicTab from "../../pages/Settings/Tabs/public-tab/PublicTab";
import SecurityTab from "../../pages/Settings/Tabs/security-tab/SecurityTab";
import AboutMeTab from "../../pages/Settings/Tabs/aboutme-tab/AboutMeTab";
import CitizenTab from "../../pages/Search/Tabs/citizen-tab/CitizenTab";
import SearchPropertyTab from "../../pages/Search/Tabs/property-tab/SearchPropertyTab";
import ProfitView from "../../pages/HourMeterProfit/components/ProfitView";
import BankTab from "../../pages/Verification/Tabs/bank-tab/BankTab";
import IdentityTab from "../../pages/Verification/Tabs/identity-tab/IdentityTab";
import ToolTab from "../../pages/Store/shop/tool-tab/ToolTab";
import CurrencyTab from "../../pages/Store/shop/currency-tab/CurrencyTab";
import ToolsContent from "../../pages/Store/shop/tool-tab/ToolsContent";
import CurrenciesContent from "../../pages/Store/shop/currency-tab/CurrenciesContent";
import ErrorReportTab from "../../pages/Report/reports/ErrorReportTab/ErrorReportTab";
import ReportsListTab from "../../pages/Report/reports/ReportsListTab/ReportsListTab";
import { ReportStateProvider } from "../../pages/Report/reports/GlobalReportStateProvider";
import { GlobalVodStateProvider } from "../../pages/Documents/Tabs/GlobalVodStateProvider";
import { GlobalNoteStateProvider } from "../../pages/Documents/Tabs/GlobalNoteStateProvider";
import MainLayout from "../MainLayout";
import { useContext } from "react";
import { UserContext } from "../../services/reducers/UserContext";
import ControlPanel from "./3dModelMap/ControlPanel";
export default function Routers() {
  const [user] = useContext(UserContext);
  return (
    <Routes>
      <Route path="" element={<MainLayout />}>
        <Route
          path="documents"
          element={
            <PrivateRoute>
              <Sanad />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="write" replace />} />

          <Route
            path="write"
            element={
              <GlobalVodStateProvider>
                <WriteVodTab />
              </GlobalVodStateProvider>
            }
          />

          <Route path="list" element={<VodListTab />}>
            <Route index element={<Navigate to="received" replace />} />
            <Route path="received" element={<ReceivedList />} />
            <Route path="sent" element={<SentList />} />
          </Route>

          <Route
            path="notes"
            element={
              <GlobalNoteStateProvider>
                <NotesListTab />
              </GlobalNoteStateProvider>
            }
          />
        </Route>

        <Route
          path="payment/verify"
          element={<Navigate to="/profile/transactions" replace />}
        />
        <Route
          path="profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="total" replace />} />
          <Route path="total" element={<TotalTab />} />
          <Route path="transactions" element={<TransactionsTab />} />
          <Route path="property" element={<PropertyTab />}>
            <Route index element={<Navigate to="houses" replace />} />
            <Route path="houses" element={<Houses />} />
            <Route path="following" element={<Following />} />
            <Route path="followers" element={<Followers />} />
          </Route>

          <Route path="dynasty" element={<DynastyTab />}>
            <Route index element={<Navigate to="establish" replace />} />

            <Route path=":tab" element={<DynastyEstablishEstate />} />

            <Route path="members" element={<DynastyMembers />} />
            <Route path="send" element={<SendRequest />} />
            <Route path="recieved" element={<RecievedList />} />
          </Route>
          <Route path="suggestion" element={<SuggestionTab />}>
            <Route index element={<Navigate to="recieved" replace />} />
            <Route path="recieved" element={<RecievedSuggestion />} />
            <Route path="sent" element={<SentSuggestion />} />
          </Route>
        </Route>
        <Route
          path="settings"
          element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="public" replace />} />
          <Route path="public" element={<PublicTab />} />
          <Route path="account" element={<AccountTab />} />
          <Route path="security" element={<SecurityTab />} />
          <Route path="about" element={<AboutMeTab />} />
        </Route>
        {!user?.wallet_login && (
          <Route
            path="confirmation"
            element={
              <PrivateRoute>
                <AccountSecurityModal />
              </PrivateRoute>
            }
          />
        )}

        <Route
          path="connectWallet"
          element={
            <PrivateRoute>
              <WalletSetupTab />
            </PrivateRoute>
          }
        />
        <Route
          path="challenges"
          element={
            <PrivateRoute>
              <Challenge />
            </PrivateRoute>
          }
        />
        <Route
          path="search"
          element={
            <PrivateRoute>
              <Search />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="citizen" replace />} />
          <Route path="citizen" element={<CitizenTab />} />
          <Route path="property" element={<SearchPropertyTab />} />
        </Route>
        <Route
          path="profit"
          element={
            <PrivateRoute>
              <HourMeterProfit />
            </PrivateRoute>
          }
        >
          <Route index element={<ProfitView />} />
        </Route>
        <Route
          path="verification"
          element={
            <PrivateRoute>
              <Verification />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="identity" replace />} />
          <Route path="identity" element={<IdentityTab />} />
          <Route path="bank" element={<BankTab />} />
        </Route>
        <Route
          path="store"
          element={
            <PrivateRoute>
              <Store />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="tools/600" replace />} />
          <Route path="tools" element={<ToolTab />}>
            <Route index element={<Navigate to="600" replace />} />
            <Route path="600" element={<ToolsContent />} />
            <Route path="1000" element={<ToolsContent />} />
            <Route path="2000" element={<ToolsContent />} />
            <Route path="5000" element={<ToolsContent />} />
            <Route path="10000" element={<ToolsContent />} />
            <Route path="50000" element={<ToolsContent />} />
          </Route>
          <Route path="currency" element={<CurrencyTab />}>
            <Route index element={<Navigate to="packet-1" replace />} />
            <Route path="packet-1" element={<CurrenciesContent />} />
            <Route path="packet-2" element={<CurrenciesContent />} />
            <Route path="packet-3" element={<CurrenciesContent />} />
            <Route path="packet-4" element={<CurrenciesContent />} />
            <Route path="packet-5" element={<CurrenciesContent />} />
            <Route path="packet-6" element={<CurrenciesContent />} />
          </Route>
        </Route>
        <Route
          path="report"
          element={
            <PrivateRoute>
              <Report />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="send" replace />} />
          <Route
            path="send"
            element={
              <ReportStateProvider>
                <ErrorReportTab />
              </ReportStateProvider>
            }
          />
          <Route path="list" element={<ReportsListTab />} />
        </Route>

        <Route
          path="notifications"
          element={
            <PrivateRoute>
              <Notifications />
            </PrivateRoute>
          }
        />


        <Route
          path="ControlPanel"
          element={
            <PrivateRoute>
              <ControlPanel />
            </PrivateRoute>
          }
        />
        <Route
          path="verification"
          element={
            <PrivateRoute>
              <Verification />
            </PrivateRoute>
          }
        />
        <Route path="feature/:id/*" element={<Feature />}>
          <Route index element={<Navigate to="info" replace />} />
          <Route path=":tab/*" element={<ConditionalPage />} />
        </Route>

        <Route path="successful" element={<Outlet />}>
          <Route path="commercial" element={<Commercial />} />

          <Route path="residential" element={<Residential />} />

          <Route path="educational" element={<Educational />} />

          <Route path="signup" element={<SignupLottie />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
