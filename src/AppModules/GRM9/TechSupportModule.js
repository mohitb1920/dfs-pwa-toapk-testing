import React, { useEffect } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import SupportLandingPage from './SupportLandingPage'
import ReportIssue from './ReportIssue'
import { getCurrentLanguage, TENANT_ID } from '../../components/Utils';
import { useLocalizationStore } from '../../Hooks/Store';
import TrackGrievance from './TrackGrievance';
import SupportComplaintDetails from './SupportComplaintDetails';

function TechSupportModule() {
    const location = useLocation();
    const navigate = useNavigate();
    const stateCode = TENANT_ID;
    const moduleCode = "dfs-grm-tech-support";
    const language = getCurrentLanguage();
    const { isLoading } = useLocalizationStore({
      stateCode,
      moduleCode,
      language,
    });

    useEffect(() => {
      const access_token = localStorage.getItem("DfsWeb.access-token");
      let pathnames = location.pathname.split("/").filter((x) => x);
      if (access_token && !pathnames.includes("complaintdetails")) {
        navigate(`${window.contextPath}/home`);
      }
    }, []);
    
  return (
    <div>
      <Routes>
        <Route path={"/report-track-issue"} element={<SupportLandingPage isLoading={isLoading}/>} />
        <Route path={"/report-issue"} element={<ReportIssue isLoading={isLoading}/>} />
        <Route path={"/track-issue"} element={<TrackGrievance isLoading={isLoading}/>} />
        <Route path={"/complaintdetails/:complaintId"} element={<SupportComplaintDetails />} />
      </Routes>
    </div>
  )
}

export default TechSupportModule