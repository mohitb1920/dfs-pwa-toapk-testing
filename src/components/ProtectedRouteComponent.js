import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { getUserRoles } from "./Utils";

const ProtectedRoute = ({ access_roles, publicAccess = false }) => {
  const location = useLocation();
  const userInfo = localStorage.getItem("DfsWeb.user-info");
  const userDetails = JSON.parse(localStorage.getItem("details"));
  const userRoles = getUserRoles();
  const access_token = localStorage.getItem("DfsWeb.access-token");
  const farmerId = localStorage.getItem("DfsWeb.farmerId");
  const isOnFarmerRegistrationPage =
    location.pathname === `${window.contextPath}/farmer-registration`;

  if (publicAccess && (!userInfo || !access_token)) {
    return <Outlet />;
  }
  if (!userInfo || !access_token) {
    return (
      <Navigate
        to={`${window.contextPath}/`}
        state={{ from: location }}
        replace
      />
    );
  }
  if (
    access_token &&
    userRoles.includes("CITIZEN") &&
    (farmerId === "undefined" || !farmerId) &&
    !isOnFarmerRegistrationPage
  ) {
    const mobile = JSON.parse(userInfo)?.mobileNumber;
    if (!userDetails || userDetails?.mobile !== mobile) localStorage.setItem("details", JSON.stringify({mobile: mobile}));
    return (
      <Navigate
        to={`${window.contextPath}/farmer-registration`}
        state={{ from: location }}
        replace
      />
    );
  } else if (
    access_roles &&
    !access_roles.some((role) => userRoles.includes(role))
  ) {
    return (
      <Navigate
        to={`${window.contextPath}/home`}
        state={{ from: location }}
        replace
      />
    );
  } else if (access_roles?.some((role) => userRoles.includes(role))) {
    return <Outlet />;
  }
};

ProtectedRoute.propTypes = {
  access_roles: PropTypes.array,
  publicAccess: PropTypes.bool,
};

export default ProtectedRoute;
