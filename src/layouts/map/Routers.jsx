import { lazy, Suspense, useContext } from "react";
import { Outlet, Route, Routes, Navigate } from "react-router";

import PrivateRoute from "../../routes/PrivateRoute";
import RouteSkeleton from "../../components/Skeletons/RouteSkeleton";
import MainLayout from "../MainLayout";
//import { ProfileInfoProvider } from './services/reducers/profileInfoContext.jsx';
import { UserContext } from "../../services/reducers/UserContext";

const Search = lazy(() => import("../../pages/Search"));
const Report = lazy(() => import("../../pages/Report"));
const Sanad = lazy(() => import("../../pages/Documents"));
const Settings = lazy(() => import("../../pages/Settings"));
const Notifications = lazy(() => import("../../pages/Notifications"));
const Store = lazy(() => import("../../pages/Store"));
const Profile = lazy(() => import("../../pages/Profile"));
const Verification = lazy(() => import("../../pages/Verification"));
const Feature = lazy(() => import("../../pages/Feature"));
const ConditionalPage = lazy(
  () => import("../../pages/Feature/ConditionalPage"),
);
const Commercial = lazy(() => import("../../components/Lottie/Commercial"));
const Residential = lazy(() => import("../../components/Lottie/Residential"));
const Educational = lazy(() => import("../../components/Lottie/Educational"));
const SignupLottie = lazy(() => import("../../components/Lottie/SignupLottie"));
const HourMeterProfit = lazy(() => import("../../pages/HourMeterProfit"));
const AccountSecurityModal = lazy(() => import("../../pages/AccountSecurity"));
const WriteVodTab = lazy(
  () => import("../../pages/Documents/Tabs/writeWodTab/WriteVodTab"),
);
const VodListTab = lazy(
  () => import("../../pages/Documents/Tabs/DocsList/VodListTab"),
);
const TicketsList = lazy(
  () => import("../../pages/Documents/Tabs/DocsList/TicketsList"),
);
const NotesListTab = lazy(
  () => import("../../pages/Documents/Tabs/notes/NotesListTab"),
);
const Challenge = lazy(() => import("../../pages/Challenges/Challenge"));
const DynastyTab = lazy(
  () => import("../../pages/Profile/Tabs/dynasty/DynastyTab"),
);
const PropertyTab = lazy(
  () => import("../../pages/Profile/Tabs/property-tab/PropertyTab"),
);
const TotalTab = lazy(
  () => import("../../pages/Profile/Tabs/total-tab/TotalTab"),
);
const SuggestionTab = lazy(
  () => import("../../pages/Profile/Tabs/suggestion-tab/SuggestionTab"),
);
const TransactionsTab = lazy(
  () => import("../../pages/Profile/Tabs/transactions-tab/TransactionsTab"),
);
const FollowList = lazy(
  () => import("../../pages/Profile/Tabs/property-tab/FollowList"),
);
const Houses = lazy(
  () => import("../../pages/Profile/Tabs/property-tab/houses/Houses"),
);
const DynastyEstablishEstate = lazy(
  () => import("../../pages/Profile/Tabs/dynasty/DynastyEstablishEstate"),
);
const DynastyMembers = lazy(
  () =>
    import("../../pages/Profile/Tabs/dynasty/dynasty-members/DynastyMembers"),
);
const RecievedListTab = lazy(
  () => import("../../pages/Profile/Tabs/dynasty/recieve/RecievedListTab"),
);
const SentListTab = lazy(
  () => import("../../pages/Profile/Tabs/dynasty/sent/SentListTab"),
);

const AccountTab = lazy(
  () => import("../../pages/Settings/Tabs/account-tab/AccountTab"),
);
const PublicTab = lazy(
  () => import("../../pages/Settings/Tabs/public-tab/PublicTab"),
);
const SecurityTab = lazy(
  () => import("../../pages/Settings/Tabs/security-tab/SecurityTab"),
);
const AboutMeTab = lazy(
  () => import("../../pages/Settings/Tabs/aboutme-tab/AboutMeTab"),
);
const CitizenTab = lazy(
  () => import("../../pages/Search/Tabs/citizen-tab/CitizenTab"),
);
const ProfitView = lazy(
  () => import("../../pages/HourMeterProfit/components/ProfitView"),
);
const BankTab = lazy(
  () => import("../../pages/Verification/Tabs/bank-tab/BankTab"),
);
const IdentityTab = lazy(
  () => import("../../pages/Verification/Tabs/identity-tab/IdentityTab"),
);
const ToolTab = lazy(() => import("../../pages/Store/shop/tool-tab/ToolTab"));
const CurrencyTab = lazy(
  () => import("../../pages/Store/shop/currency-tab/CurrencyTab"),
);
const ToolsContent = lazy(
  () => import("../../pages/Store/shop/tool-tab/ToolsContent"),
);
const CurrenciesContent = lazy(
  () => import("../../pages/Store/shop/currency-tab/CurrenciesContent"),
);
const ErrorReportTab = lazy(
  () => import("../../pages/Report/reports/ErrorReportTab/ErrorReportTab"),
);
const ReportsListTab = lazy(
  () => import("../../pages/Report/reports/ReportsListTab/ReportsListTab"),
);
const WalletSetupTab = lazy(
  () => import("../../pages/MetaWallet/WalletSetupTab"),
);
const SearchPropertyTab = lazy(
  () => import("../../pages/Search/Tabs/property-tab/SearchPropertyTab"),
);
const SuggestionList = lazy(
  () => import("../../pages/Profile/Tabs/suggestion-tab/SuggestionList"),
);
export default function Routers() {
  const [user] = useContext(UserContext);
  return (
    <Suspense fallback={<RouteSkeleton />}>
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

            <Route path="write" element={<WriteVodTab />} />

            <Route path="list" element={<VodListTab />}>
              <Route index element={<Navigate to="received" replace />} />
              <Route
                path="received"
                element={<TicketsList type="received" />}
              />
              <Route path="sent" element={<TicketsList type="sent" />} />
            </Route>

            <Route path="notes" element={<NotesListTab />} />
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
        <Route path="following" element={<FollowList key="following" type="following" />} />
<Route path="followers" element={<FollowList key="followers" type="followers" />} />
            </Route>

            <Route path="dynasty" element={<DynastyTab />}>
              <Route index element={<Navigate to="establish" replace />} />

              <Route path=":tab" element={<DynastyEstablishEstate />} />

              <Route path="members" element={<DynastyMembers />} />
              <Route path="send" element={<SentListTab />} />
              <Route path="recieved" element={<RecievedListTab />} />
            </Route>
            <Route path="suggestion" element={<SuggestionTab />}>
              <Route index element={<Navigate to="recieved" replace />} />
              <Route
                path="recieved"
                element={<SuggestionList type="recieved" />}
              />
              <Route path="sent" element={<SuggestionList type="sent" />} />
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
            <Route path="send" element={<ErrorReportTab />} />
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
    </Suspense>
  );
}
