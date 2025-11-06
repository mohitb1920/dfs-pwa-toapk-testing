import React from "react";
import { getUserRoles } from "../components/Utils";
import AgentHomePage from "./AgentHomePage/AgentHomePage";
import LandingPage from "./LandingPage";

function Homepage() {
  const userRoles = getUserRoles();
  const mainLandingPageAccess = userRoles.some((role) =>
    ["KCC", "ASSISTEDMODE_AGENT", "CITIZEN"].includes(role)
  );
  return mainLandingPageAccess ? <AgentHomePage /> : <LandingPage />;
}

export default Homepage;
