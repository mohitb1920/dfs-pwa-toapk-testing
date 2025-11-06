import { Route, Routes } from "react-router-dom";
import ComplaintsInbox from "./ComplaintsInbox";
import ComplaintDetails from "./ComplaintDetails";
import { useLocalizationStore } from "../../Hooks/Store";
import { TENANT_ID, getCurrentLanguage } from "../../components/Utils";

function PgrRouter() {
  const stateCode = TENANT_ID;
  const moduleCode = "GRM";
  const language = getCurrentLanguage();
  const {isLoading, data} = useLocalizationStore({stateCode,  moduleCode, language});
  return (
    <div>
      <Routes>
        <Route path={"/inbox"} element={<ComplaintsInbox localizationLoading={isLoading}/>} />
        <Route path={"/complaintdetails/:complaintId"} element={<ComplaintDetails />} />
        {/* <Route path={`${path}/:draftId`} component={DraftUpdate} /> */}
      </Routes>
    </div>
  );
}

export default PgrRouter;
