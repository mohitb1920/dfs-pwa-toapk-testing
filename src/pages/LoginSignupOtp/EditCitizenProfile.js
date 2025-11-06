import { useEffect, useState } from "react";
import { getFarmerprofile } from "../../services/CitizenServices";
import FarmerEditProfileForm from "../../AppModules/Agent/FarmerProfileEditForm";
import { fileUrl } from "../../components/Utils";
import PropTypes from "prop-types";

function EditCitizenProfile({ isMobile }) {
  const auth_token = localStorage.getItem("DfsWeb.access-token");
  const userInfo = JSON.parse(localStorage.getItem("DfsWeb.user-info"));
  const userUuid = userInfo?.uuid;
  const name = userInfo?.name;

  const [profile, setProfile] = useState(null);

  const individualDetails = profile?.Individual;
  const picId = individualDetails?.photo;
  const avatarUrl = picId ? fileUrl(picId) : null;
  const dbtRelatedInfo = individualDetails?.identifiers?.find(
    (obj) => obj.identifierType === "DBTID"
  );
  const DBT_ID = dbtRelatedInfo ? dbtRelatedInfo.identifierId : null;
  const mobileNumber = userInfo?.mobileNumber;

  useEffect(() => {
    const fetchProfile = async () => {
      const profile = await getFarmerprofile(auth_token, userUuid);
      setProfile(profile?.data); // assuming you have a setProfile state
    };

    fetchProfile();
  }, []);

  return (
    <FarmerEditProfileForm
      isEditProfilePage={true}
      profileData={profile}
      userName={name}
      DBT_ID={DBT_ID}
      avatarUrl={avatarUrl}
      mobileNumber={mobileNumber}
      isMobile={isMobile}
    />
  );
}

export default EditCitizenProfile;

EditCitizenProfile.propTypes = {
  isMobile: PropTypes.bool,
};
