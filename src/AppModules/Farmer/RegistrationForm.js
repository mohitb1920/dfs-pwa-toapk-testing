import PropTypes from "prop-types";
import FarmerProfileEditForm from "../Agent/FarmerProfileEditForm";
import { Navigate } from "react-router-dom";

function RegistrationForm({ isMobile }) {
  const details = JSON.parse(localStorage.getItem("details"));
  const farmerId = localStorage.getItem("DfsWeb.farmerId");

  if (farmerId && farmerId !== "undefined") {
    return(
      <Navigate to={`${window.contextPath}/home`} replace />
    )
  }

  return (
    <FarmerProfileEditForm
      DBT_ID={details?.dbtId}
      mobileNumber={details?.mobile}
      isMobile={isMobile}
    />
  );
}

export default RegistrationForm;

RegistrationForm.propTypes = {
  isMobile: PropTypes.bool,
};
