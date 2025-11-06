import * as React from "react";
import ProtectedRoute from "./components/ProtectedRouteComponent";
import MandiPricePage from "./pages/MandiPrice/MandiPricePage";
import { Navigate, Route, Routes } from "react-router-dom";
import CarousalManagement from "./pages/Announcements/CarousalManagement";
import PgrRouter from "./AppModules/PGR/PgrRouter";
import EditProfile from "./pages/LoginSignupOtp/EditProfile";
import ResetPassword from "./pages/LoginSignupOtp/ResetPassword";
import MandiPriceDetailsPage from "./pages/MandiPrice/MandiPriceDetailsPage";
import SchemePage from "./AppModules/Schemes/SchemePage";
import SchemeInfo from "./AppModules/Schemes/SchemeInfo";
import MainLandingPage from "./pages/MainLandingPage/MainLandingPage";
import SchemePageForm from "./AppModules/Schemes/SchemePageForm";
import TechSupportModule from "./AppModules/GRM9/TechSupportModule";
import FarmerRegistrationForm from "./AppModules/Agent/FarmerRegistrationForm";
import AgentHistory from "./AppModules/Agent/AgentHistory";
import CreateComplaint from "./AppModules/Agent/GRM/CreateComplaint";
import GrmCreateForm from "./AppModules/Agent/GRM/GrmCreateForm";
import TrackService from "./AppModules/Agent/GRM/TrackService";
import ComplaintDetails from "./AppModules/PGR/ComplaintDetails";
import FAQPage from "./pages/DescriptionPages/FAQPage";
import KeyContactsPage from "./pages/DescriptionPages/KeyContactsPage";
import AboutPage from "./pages/DescriptionPages/AboutPage";
import AssetsPage from "./pages/Assets/AssetsPage";
import AssetsDetailPage from "./pages/Assets/AssetsDetailPage";
import WeatherPage from "./pages/WeatherPage/WeatherPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicy/PrivacyPolicyPage";
import ScreenReaderPage from "./pages/ScreenReader/ScreenReaderPage";
import SiteMap from "./pages/SiteMap/SiteMap";
import { pgrRoles } from "./components/Utils";
import HelpAndSupportPage from "./pages/HelpAndSupport/HelpAndSupportPage";
import HelpDetailsPage from "./pages/HelpAndSupport/HelpDetailsPage";
import DataCleanupModule from "./AppModules/DataCleanup/DataCleanupModule";
import Homepage from "./pages/Homepage";
import FarmerPassbookOtpPage from "./AppModules/Agent/FarmerPassbookOtpPage";
import FarmerPassbook from "./pages/FarmerPassbook";
import DSSModule from "./AppModules/DSS/DSSModule";
import SoilHealthOtpPage from "./pages/SoilHealth/SoilHealthOtpPage";
import SoilHealthPage from "./pages/SoilHealth/SoilHealthPage";
import SoilHealthDetailsPage from "./pages/SoilHealth/SoilHealthDetailsPage";
import ApplicationDetails from "./AppModules/Schemes/ApplicationDetails";
import RegistrationForm from "./AppModules/Farmer/RegistrationForm";
import PropTypes from "prop-types";

export const ApplicationRoutes = ({ isMobile, initData }) => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path={`${window.contextPath}`}
        element={<MainLandingPage isMobile={isMobile} />}
      />
      <Route
        path={`${window.contextPath}/change-password`}
        element={<ResetPassword />}
      />
      <Route
        path={`${window.contextPath}/technical-support/*`}
        element={<TechSupportModule />}
      />
      <Route
        path={`${window.contextPath}/weatherdata`}
        element={<WeatherPage isMobile={isMobile} />}
      />
      <Route
        path={`${window.contextPath}/key-contacts`}
        element={<KeyContactsPage isMobile={isMobile} />}
      />
      <Route
        path={`${window.contextPath}/screenreaderaccess`}
        element={<ScreenReaderPage isMobile={isMobile} />}
      />
      <Route
        path={`${window.contextPath}/faq`}
        element={<FAQPage isMobile={isMobile} />}
      />
      <Route
        path={`${window.contextPath}/about-section`}
        element={<AboutPage isMobile={isMobile} />}
      />
      <Route
        path={`${window.contextPath}/privacypolicy`}
        element={<PrivacyPolicyPage isMobile={isMobile} />}
      />
      <Route path={`${window.contextPath}/sitemap`} element={<SiteMap />} />

      {/* Routes Public before login & Protected for Agent and KCC after login */}
      <Route
        element={
          <ProtectedRoute
            publicAccess={true}
            access_roles={["ASSISTEDMODE_AGENT", "KCC", "CITIZEN"]}
          />
        }
      >
        <Route path={`${window.contextPath}/assets-section`}>
          <Route index element={<AssetsPage isMobile={isMobile} />} />
          <Route path={`assets-details`}>
            <Route index element={<AssetsDetailPage isMobile={isMobile} />} />
          </Route>
        </Route>
        <Route path={`${window.contextPath}/mandi`}>
          <Route index element={<MandiPricePage isMobile={isMobile} />} />
          <Route
            path="price-details"
            element={<MandiPriceDetailsPage isMobile={isMobile} />}
          />
        </Route>
        <Route path={`${window.contextPath}/help`}>
          <Route index element={<HelpAndSupportPage isMobile={isMobile} />} />
          <Route path={`help-details`}>
            <Route index element={<HelpDetailsPage isMobile={isMobile} />} />
          </Route>
        </Route>
      </Route>

      {/* Routes Public before login & Protected for Agent after login */}
      <Route
        element={
          <ProtectedRoute
            publicAccess={true}
            access_roles={["ASSISTEDMODE_AGENT", "CITIZEN"]}
          />
        }
      >
        <Route path={`${window.contextPath}/schemes`}>
          <Route index element={<SchemePage isMobile={isMobile} />} />
          <Route path={`details`}>
            <Route index element={<SchemeInfo />} />
            <Route
              element={
                <ProtectedRoute
                  access_roles={["ASSISTEDMODE_AGENT", "CITIZEN"]}
                />
              }
            >
              <Route path={`apply`} element={<SchemePageForm />} />
            </Route>
          </Route>
          <Route element={<ProtectedRoute access_roles={["CITIZEN"]}/>}>
              <Route path='application-details' element={<ApplicationDetails/>}/>
          </Route>
        </Route>
      </Route>

      {/* Common Protected Routes for Employee & Agent*/}
      <Route
        element={
          <ProtectedRoute
            access_roles={[
              "ASSISTEDMODE_AGENT",
              "EMPLOYEE",
              "KCC",
              "STADMIN",
              "CITIZEN",
            ]}
          />
        }
      >
        <Route
          path={`${window.contextPath}/edit-profile`}
          element={<EditProfile isMobile={isMobile} />}
        />
        <Route path={`${window.contextPath}/home`} element={<Homepage />} />
      </Route>

      {/*Agent User Protected Routes */}
      <Route element={<ProtectedRoute access_roles={["ASSISTEDMODE_AGENT"]} />}>
        <Route
          path={`${window.contextPath}/registration`}
          element={<FarmerRegistrationForm />}
        />
        <Route path={`${window.contextPath}/grm-create`}>
          <Route index element={<CreateComplaint isMobile={isMobile} />} />
          <Route
            path="grm-application"
            element={<GrmCreateForm isMobile={isMobile} />}
          />
        </Route>
        <Route path={`${window.contextPath}/track`}>
          <Route index element={<TrackService isMobile={isMobile} />} />
          <Route
            path="complaintdetails/:complaintId"
            element={<ComplaintDetails />}
          />
        </Route>
        <Route
          path={`${window.contextPath}/history`}
          element={<AgentHistory isMobile={isMobile} />}
        />
        <Route path={`${window.contextPath}/agent-access`}>
          <Route
            index
            element={<FarmerPassbookOtpPage isMobile={isMobile} />}
          />
          <Route
            path={`farmer-passbook`}
            element={<FarmerPassbook isMobile={isMobile} />}
          />
        </Route>
        <Route>
          <Route
            path={`${window.contextPath}/farmer-details`}
            index
            element={<SoilHealthOtpPage isMobile={isMobile} />}
          />
          <Route path={`${window.contextPath}/Soil_health`}>
            <Route index element={<SoilHealthPage isMobile={isMobile} />} />
            <Route
              path={`soil-health-details`}
              element={<SoilHealthDetailsPage isMobile={isMobile} />}
            />
          </Route>
        </Route>
      </Route>

      {/* Announcement Admin Routes */}
      <Route element={<ProtectedRoute access_roles={["ANNOUNCEMENT_ADMIN"]} />}>
        <Route
          path={`${window.contextPath}/carousel-management`}
          element={<CarousalManagement />}
        />
      </Route>
      {/* GRM Employee Routes */}
      <Route element={<ProtectedRoute access_roles={pgrRoles} />}>
        <Route path={`${window.contextPath}/grm/*`} element={<PgrRouter />} />
      </Route>

      {/* Dashboard Admin Routes */}
      <Route element={<ProtectedRoute access_roles={["STADMIN"]} />}>
        <Route
          path={`${window.contextPath}/dashboards/*`}
          element={<DSSModule initData={initData} />}
        />
      </Route>

      {/* Data Review Admin Routes */}
      <Route element={<ProtectedRoute access_roles={["DATA_REVIEW_ADMIN"]} />}>
        <Route path={`${window.contextPath}/data-cleanup`}>
          <Route index element={<DataCleanupModule />} />
          <Route
            path="assets-details"
            element={<AssetsDetailPage isMobile={isMobile} />}
          />
        </Route>
      </Route>

      {/* Citizen Routes */}
      <Route element={<ProtectedRoute access_roles={["CITIZEN"]} />}>
        <Route
          path={`${window.contextPath}/farmer-registration`}
          element={<RegistrationForm isMobile={isMobile} />}
        />
      </Route>

      <Route
        path="*"
        element={<Navigate replace to={`${window?.contextPath}/home`} />}
      />
    </Routes>
  );
};

ApplicationRoutes.propTypes = {
  isMobile: PropTypes.bool,
  initData: PropTypes.object,
};
