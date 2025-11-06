import personalDetails from "./personalDetails.json";
import registrationDetails from "./registrationDetails.json";
import { useEffect, useState } from "react";
import useDistrictBlocks from "../../Hooks/useDistrictBlocks";
import useBlockPanchayats from "../../Hooks/useBlockPanchayats";
import usePanchayatVillages from "../../Hooks/usePanchayatVillages";
import useDistrict from "../../Hooks/useDistrict";
import { DBTSyncOTPPopup } from "./DBTSyncOTPPopup";
import FarmerRegistrationFormComposer from "../../components/FarmerRegistrationFormComposer";
import { useTranslation } from "react-i18next";
import { SchemeService } from "../../services/Schemes";
import { Container } from "@mui/material";
import { dispatchNotification } from "../../components/Utils";
import { useDispatch } from "react-redux";

function FarmerRegistrationForm() {
  const authToken = localStorage.getItem("DfsWeb.access-token");
  const [registrationFormDetails, setRegistrationFormDetails] = useState();
  const [dataFromDBT, setDataFromDBT] = useState(false);
  const [dbtId, setDbtId] = useState(null);
  const [isOtpDialogOpen, setOtpDialogOpen] = useState(false);
  const [maskedMobileNumber, setMaskedMobileNumber] = useState("");
  const [errorMessageDBTSync, setErrorMessageDBTSync] = useState();
  const [errorMessageOTPValidation, setErrorMessageOTPValidation] =
    useState(null);
  const [OTPResentMessage, setOTPResentMessage] = useState(null);
  const [farmerResponse, setFarmerResponse] = useState();
  const [otp, setOtp] = useState("");
  const [formJson,setFormJson] = useState(registrationDetails);
  const dispatch = useDispatch();
  const handleCloseOtpDialog = () => {
    setOtpDialogOpen(false);
  };

  const { t } = useTranslation();

  const handleDbtSync = async (dbtId) => {
    setErrorMessageOTPValidation(null);
    try {
      const requestData = {
        otp: {
          mobileNumber: null,
          dbtId: dbtId,
          ticketId: null,
          categoryType: "DBT_PROFILE_GET",
          tenantId: "br",
          userType: "CITIZEN",
        },
      };
      const response = await SchemeService.otpFarmerSchemeGet(requestData);

      if (response?.ResponseInfo?.status === "successful") {
        setFormJson(personalDetails);
        setDbtId(dbtId);
        setOtpDialogOpen(true);
        setMaskedMobileNumber(response?.message);
        setErrorMessageDBTSync("");
      } else if (response?.Errors?.length > 0) {
        const errorCode = response?.Errors?.[0]?.code;
        let errorMessage = "farmerRegistration.UNEXPECTED_ERROR";
        if (errorCode === "INVALID_DBT_ID") {
          errorMessage = "farmerRegistration.INVALID_DBT_ID";
        }

        setErrorMessageDBTSync(errorMessage);
      } else {
        setErrorMessageDBTSync("farmerRegistration.UNEXPECTED_ERROR");
      }
    } catch (error) {
      console.error(error);
      setErrorMessageDBTSync("farmerRegistration.UNEXPECTED_ERROR");
    }
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

      setSelectedAddress((prevAddress) => ({
        ...prevAddress,
        block: "",
        panchayat: "",
        village: "",
      }));
    }
  }, [isDistrictLoading, isDistrictError, districtData]);

  useEffect(() => {
    if (!isBlockLoading && !isBlockError && blockData) {
      const formattedBlocks = blockData.map((block) => ({
        id: block.code,
        name: block.name,
      }));

      setDropdownValues((prevValues) => ({
        ...prevValues,
        block: formattedBlocks,
        panchayat: [],
        village: [],
      }));

      setSelectedAddress((prevAddress) => ({
        ...prevAddress,
        panchayat: "",
        village: "",
      }));
    }
  }, [isBlockLoading, isBlockError, blockData]);

  useEffect(() => {
    if (!isPanchayatLoading && !isPanchayatError && panchayatData) {
      const formattedPanchayats = panchayatData.map((panchayat) => ({
        id: panchayat.code,
        name: panchayat.name,
      }));

      setDropdownValues((prevValues) => ({
        ...prevValues,
        panchayat: formattedPanchayats,
        village: [],
      }));

      setSelectedAddress((prevAddress) => ({
        ...prevAddress,
        village: "",
      }));
    }
  }, [isPanchayatLoading, isPanchayatError, panchayatData]);

  useEffect(() => {
    if (!isVillageLoading && !isVillageError && villageData && dataFromDBT) {
      const formattedVillages = villageData.map((village) => ({
        id: village.code,
        name: village.name,
      }));
      if (villageData == null || villageData.length == 0) {
        dispatchNotification("error", ["notEligible"], dispatch);
      }
      setDropdownValues((prevValues) => ({
        ...prevValues,
        village: formattedVillages,
      }));
    }
  }, [isVillageLoading, isVillageError, villageData]);

  return (
    <Container variant="primary">
      <div style={{ width: "100%" }}>
        <FarmerRegistrationFormComposer
          formJson={formJson}
          dropdownValues={dropdownValues}
          setSelectedAddress={setSelectedAddress}
          language="en"
          handleDbtSync={handleDbtSync}
          registrationFormDetails={registrationFormDetails}
          dataFromDBT={dataFromDBT}
          dbtId={dbtId}
          authToken={authToken}
          isOtpDialogOpen={isOtpDialogOpen}
          setOtpDialogOpen={setOtpDialogOpen}
          selectedAddress={selectedAddress}
          errorMessageDBTSync={errorMessageDBTSync}
          errorMessageOTPValidation={errorMessageOTPValidation}
          setErrorMessageOTPValidation={setErrorMessageOTPValidation}
          OTPResentMessage={OTPResentMessage}
          setOTPResentMessage={setOTPResentMessage}
          farmerResponse={farmerResponse}
          setFarmerResponse={setFarmerResponse}
          otp={otp}
          setOtp={setOtp}
        />
        <DBTSyncOTPPopup
          {...{
            registrationFormDetails,
            setRegistrationFormDetails,
            dbtId,
            setDataFromDBT,
            maskedMobileNumber,
            authToken,
            setSelectedAddress,
            errorMessageOTPValidation,
            setErrorMessageOTPValidation,
            OTPResentMessage,
            setOTPResentMessage,
            farmerResponse,
            setFarmerResponse,
            otp,
            setOtp,
            t,
          }}
          open={isOtpDialogOpen}
          onClose={handleCloseOtpDialog}
        />
      </div>
    </Container>
  );
}

export default FarmerRegistrationForm;
