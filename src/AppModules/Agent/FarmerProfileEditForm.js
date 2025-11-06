import personalDetails from "./personalDetails.json";
import registrationDetails from "./registrationDetails.json";
import { useEffect, useRef, useState } from "react";
import useDistrictBlocks from "../../Hooks/useDistrictBlocks";
import useBlockPanchayats from "../../Hooks/useBlockPanchayats";
import usePanchayatVillages from "../../Hooks/usePanchayatVillages";
import useDistrict from "../../Hooks/useDistrict";
import {
  handleFarmerDetails,
  handleSelectedAddress,
  NumSyncOTPPopup,
} from "../Farmer/NumSyncOTPPopup";
import { useTranslation } from "react-i18next";
import { Container } from "@mui/material";
import { dispatchNotification } from "../../components/Utils";
import { useDispatch } from "react-redux";
import FarmerEditProfileFormComposer from "../../components/FarmerProfileEditFormComposer";
import { getFarmerData } from "../../services/FarmerDbtDetails";
import PropTypes from "prop-types";
import { logoutUser, validateDBTLinkStatus } from "../../services/loginService";
import { useNavigate } from "react-router-dom";

// This function is rendering formComposer and syncing with dbt and sending the fetched data from dbt, location apis to formcomposer
function FarmerProfileEditForm({
  isEditProfilePage = false,
  profileData = null,
  userName = "",
  DBT_ID = null,
  avatarUrl = null,
  mobileNumber = null,
  isMobile = false,
}) {
  const authToken = localStorage.getItem("DfsWeb.access-token");
  const dbtLinked = localStorage.getItem("DfsWeb.hasDBTlinked") === "true";
  const [registrationFormDetails, setRegistrationFormDetails] = useState();
  const [dataFromDBT, setDataFromDBT] = useState(dbtLinked);
  const [dbtId, setDbtId] = useState(DBT_ID);
  const [isOtpDialogOpen, setIsOtpDialogOpen] = useState(false);
  const [maskedMobileNumber, setMaskedMobileNumber] = useState("");
  const [errorMessageOTPValidation, setErrorMessageOTPValidation] =
    useState(null);
  const [farmerResponse, setFarmerResponse] = useState();
  const [cancelled, setCancelled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [formJson] = useState(
    isEditProfilePage || DBT_ID ? personalDetails : registrationDetails
  );
  const isDataFetched = useRef(false);
  const dispatch = useDispatch();
  const handleCloseOtpDialog = () => {
    setIsOtpDialogOpen(false);
  };
  const navigate = useNavigate();

  const { t } = useTranslation();

  const checkIfDBTLinked = async (dbtId) => {
    setLoading(true);
    const rawRes = await validateDBTLinkStatus({
      dbtId: dbtId,
      mobileNumber: mobileNumber,
    });
    const res = rawRes?.data;

    if (res?.isLinked) {
      handleDbtSync(dbtId);
    } else if (res?.dbtMobile) {
      setMaskedMobileNumber(res?.dbtMobile);
      setDbtId(dbtId);
      setIsOtpDialogOpen(true);
    } else if (res.errorMessage?.includes("No DBT User Found")) {
      dispatchNotification("error", ["INVALID_DBT_ID"], dispatch);
    } else {
      dispatchNotification(
        "error",
        ["selfRegistration.DBT_ERROR"],
        dispatch
      );
    }

    if (!res?.isLinked) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (DBT_ID && !isEditProfilePage) {
      setDbtId(DBT_ID);
      handleDbtSync(DBT_ID);
    }
  }, [DBT_ID]);

  const handleDbtSync = async (dbtId) => {
    setLoading(true);

    const setPincode = (data) => {
      if (data?.Individual?.address?.[0]) {
        data.Individual.address[0].pincode =
          profileData?.Individual?.address?.[0]?.pincode;
      }
    };

    try {
      const farmerData = await getFarmerData(dbtId);
      const farmerDataFromDBT = farmerData?.data;
      setPincode(farmerDataFromDBT);
      if (farmerDataFromDBT?.Individual?.address?.[0]?.villageLG != null) {
        setFarmerResponse(farmerDataFromDBT);
        const farmerDetails = handleFarmerDetails(farmerDataFromDBT);
        setRegistrationFormDetails(farmerDetails);
        const address = handleSelectedAddress(farmerDataFromDBT);
        setSelectedAddress(address);
        setDataFromDBT(true);
        setErrorMessageOTPValidation(null);
        dispatchNotification("success", ["FETCHED_DATA"], dispatch);
        isDataFetched.current = true;
      } else {
        dispatchNotification("error", ["notAvaliable"], dispatch);
      }
    } catch (error) {
      dispatchNotification(
        "error",
        ["selfRegistration.DBT_ERROR"],
        dispatch
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleForceLogout = () => {
    localStorage.removeItem("details");
    logoutUser(dispatch);
    dispatchNotification("error", ["selfRegistration.notEligible"], dispatch);
    navigate(`${window.contextPath}/`);
  };

  const [dropdownValues, setDropdownValues] = useState({
    district: [],
    block: [],
    panchayat: [],
    village: [],
  });

  const [selectedAddress, setSelectedAddress] = useState({
    district: "",
    block: "",
    panchayat: "",
    village: "",
  });

  const {
    data: districtData,
    isLoading: isDistrictLoading,
    isError: isDistrictError,
  } = useDistrict("br");

  const {
    data: blockData,
    isLoading: isBlockLoading,
    isError: isBlockError,
  } = useDistrictBlocks("br", selectedAddress.district, {
    enabled: !!selectedAddress.district,
  });

  const {
    data: panchayatData,
    isLoading: isPanchayatLoading,
    isError: isPanchayatError,
  } = useBlockPanchayats("br", selectedAddress.block, {
    enabled: !!selectedAddress.block,
  });

  const {
    data: villageData,
    isLoading: isVillageLoading,
    isError: isVillageError,
  } = usePanchayatVillages("br", selectedAddress.panchayat, {
    enabled: !!selectedAddress.panchayat,
  });

  // All useEffects also update the corresponding address value
  //setting district dropdown values
  useEffect(() => {
    if (!isDistrictLoading && !isDistrictError && districtData) {
      const formattedDistricts = districtData.map((district) => ({
        id: district.code,
        name: district.name,
      }));

      setDropdownValues((prevValues) => ({
        ...prevValues,
        district: formattedDistricts,
        block: [],
        panchayat: [],
        village: [],
      }));
    }
  }, [isDistrictLoading, isDistrictError, districtData]);

  //setting block dropdown values
  useEffect(() => {
    if (!isBlockLoading && !isBlockError && blockData && districtData) {
      const formattedBlocks = blockData.map((block) => ({
        id: block.code,
        name: block.name,
      }));

      if (selectedAddress?.district) {
        setDropdownValues((prevValues) => ({
          ...prevValues,
          block: formattedBlocks,
          panchayat: [],
          village: [],
        }));
      }
    }
  }, [isBlockLoading, isBlockError, blockData, districtData]);

  // setting panchayat dropdown values
  useEffect(() => {
    if (
      !isPanchayatLoading &&
      !isPanchayatError &&
      panchayatData &&
      blockData &&
      districtData
    ) {
      const formattedPanchayats = panchayatData.map((panchayat) => ({
        id: panchayat.code,
        name: panchayat.name,
      }));

      if (selectedAddress?.block) {
        setDropdownValues((prevValues) => ({
          ...prevValues,
          panchayat: formattedPanchayats,
          village: [],
        }));
      }
    }
  }, [
    isPanchayatLoading,
    isPanchayatError,
    panchayatData,
    blockData,
    districtData,
  ]);

  // setting village dropdown values
  useEffect(() => {
    if (
      !isVillageLoading &&
      !isVillageError &&
      villageData &&
      panchayatData &&
      blockData &&
      districtData
    ) {
      const formattedVillages = villageData.map((village) => ({
        id: village.code,
        name: village.name,
      }));

      if (
        (villageData == null || villageData.length === 0) &&
        isEditProfilePage
      ) {
        dispatchNotification("error", ["notEligible"], dispatch);
      }
      if (selectedAddress?.panchayat) {
        setDropdownValues((prevValues) => ({
          ...prevValues,
          village: formattedVillages,
        }));
      }
    }
  }, [
    isVillageLoading,
    isVillageError,
    villageData,
    panchayatData,
    blockData,
    districtData,
  ]);

  useEffect(() => {
    if (profileData) {
      const formDetails = handleFarmerDetails(profileData);
      setRegistrationFormDetails(formDetails);
      const address = handleSelectedAddress(profileData);
      setSelectedAddress(address);
    }
    setDbtId(DBT_ID);
    if (!DBT_ID) {
      setDataFromDBT(dbtLinked);
    }
    setCancelled(false);
  }, [profileData, DBT_ID, cancelled]);

  useEffect(() => {
    if (
      isDataFetched.current &&
      districtData &&
      blockData &&
      panchayatData &&
      villageData
    ) {
      const district =
        districtData.find(
          (district) => district.code === selectedAddress.district
        )?.name || "";
      const block =
        blockData.find((block) => block.code === selectedAddress.block)?.name ||
        "";
      const panchayat =
        panchayatData.find(
          (panchayat) => panchayat.code === selectedAddress.panchayat
        )?.name || "";
      const village =
        villageData.find((village) => village.code === selectedAddress.village)
          ?.name || "";
      setRegistrationFormDetails((prevDetails) => ({
        ...prevDetails,
        district: district,
        block: block,
        panchayat: panchayat,
        village: village,
      }));
      if (
        [district, block, panchayat, village].includes("") &&
        !isEditProfilePage
      ) {
        handleForceLogout();
      }
      isDataFetched.current = false;
    }
  }, [
    isDataFetched.current,
    districtData,
    blockData,
    panchayatData,
    villageData,
  ]);

  return (
    <Container variant="primary">
      <div style={{ width: "100%" }}>
        <FarmerEditProfileFormComposer
          formJson={formJson}
          dropdownValues={dropdownValues}
          setSelectedAddress={setSelectedAddress}
          handleDbtSync={checkIfDBTLinked}
          registrationFormDetails={registrationFormDetails}
          dataFromDBT={dataFromDBT}
          dbtId={dbtId}
          authToken={authToken}
          isOtpDialogOpen={isOtpDialogOpen}
          setOtpDialogOpen={setIsOtpDialogOpen}
          selectedAddress={selectedAddress}
          farmerResponse={farmerResponse}
          setFarmerResponse={setFarmerResponse}
          userName={userName}
          isEditProfilePage={isEditProfilePage}
          imageUrl={avatarUrl}
          setCancelled={setCancelled}
          profileData={profileData}
          dbtLoading={loading}
          isMobile={isMobile}
          mobileNumber={mobileNumber}
          showDBTfield={isEditProfilePage || !!DBT_ID}
        />
        {isOtpDialogOpen && (
          <NumSyncOTPPopup
            maskedMobileNumber={maskedMobileNumber}
            open={isOtpDialogOpen}
            otp={otp}
            setOtp={setOtp}
            onClose={handleCloseOtpDialog}
            dbtId={dbtId}
            setErrorMessageOTPValidation={setErrorMessageOTPValidation}
            t={t}
            errorMessageOTPValidation={errorMessageOTPValidation}
            profileData={profileData}
            authToken={authToken}
          />
        )}
      </div>
    </Container>
  );
}

export default FarmerProfileEditForm;

FarmerProfileEditForm.propTypes = {
  mobileNumber: PropTypes.string,
  isMobile: PropTypes.bool,
  isEditProfilePage: PropTypes.bool,
  profileData: PropTypes.object,
  userName: PropTypes.string,
  avatarUrl: PropTypes.string,
  DBT_ID: PropTypes.string,
};
