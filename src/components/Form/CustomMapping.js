import React, { forwardRef } from "react";
import { Box } from "@mui/material";
import AffectedLandDetail from "./CustomMapComponents/AffectedLandDetail";
import ApplicantDetailsHortiGroup from "./CustomMapComponents/ApplicantDetailsHortiGroup";
import AppliedComponentSchemeHortiKela from "./CustomMapComponents/AppliedComponentScreenHortiKela";
import AppliedComponentsRKVY from "./CustomMapComponents/AppliedComponentsRKVY";
import MemberDetailsIrrigationWell from "./CustomMapComponents/MemberDetailsIrrigationWell";
import EquipmentDetails from "./CustomMapComponents/EquipmentDetails";
import SeedForm from "./CustomMapComponents/SeedForm";
import DieselDetailsScreen from "./CustomMapComponents/DieselDetailsScreen";
import LandDetailsNIC from "./CustomMapComponents/LandDetailsNIC";
import LandDetailsCustom from "./CustomMapComponents/LandDetailsCustom";
import BeekeepingAppliedComponentScreen from "./CustomMapComponents/BeekeepingAppliedComponentScreen";
import InsecticideDetails from "./CustomMapComponents/InsecticideDetails";

import GrantDetails from "./CustomMapComponents/GrantDetails";
import AppliedComponentsLandDetails from "./CustomMapComponents/AppliedComponentsLandDetails";
import AppliedComponentSchemeHorti from "./CustomMapComponents/AppliedComponentScreenHorti";
import MakhanaComponentsAndLandDescription from "./CustomMapComponents/MakhanaComponentsAndLandDescription";
import AppliedComponentsTea from "./CustomMapComponents/AppliedComponentsTea";
import LandAndSubsidyDetailsDiesel from "./CustomMapComponents/LandAndSubsidyDetailsDiesel";
import RequiredDocumentsDiesel from "./CustomMapComponents/RequiredDocumentsDiesel";
import LandDetailsStatic from "./CustomMapComponents/LandDetailsStatic";
import LandDetailsCluster from "./CustomMapComponents/LandDetailsCluster";
import AppliedComponentSchemeHortiCluster from "./CustomMapComponents/AppliedComponentScreenHortiCluster";
import AppliedComponentsSabji from "./CustomMapComponents/AppliedComponentsSabji";
import AppliedComponentsSabji2 from "./CustomMapComponents/AppliedComponentsSabji2";
import HortiWithSubPartAndSupplier from "./CustomMapComponents/HortiWithSubPartAndSupplier";

const CustomMapping = ({
  scheme,
  schemeName,
  schemeId,
  language,
  methods,
  disableAll,
  rawErrors,
}) => {
  if (schemeName === "affectedLandDetail") {
    return (
      <AffectedLandDetail
        scheme={scheme}
        schemeId={schemeId}
        schemeName={schemeName}
        language={language}
        methods={methods}
        disableAll={disableAll}
      />
    );
  } else if (
    ([
      "SCHEME030",
      "SCHEME031",
      "SCHEME032",
      "SCHEME033",
      "SCHEME036",
      "SCHEME045",
      "SCHEME046",
      "SCHEME048",
      "SCHEME049",
      "SCHEME050",
      "SCHEME051",
      "SCHEME052",
      "SCHEME056",
      "SCHEME057",
      "SCHEME058",
      "SCHEME059",
      "SCHEME060",
      "SCHEME062",
      "SCHEME063",
    ].includes(schemeId) &&
      schemeName === "applicantDetails") ||
    (["SCHEME012"].includes(schemeId) && schemeName === "groupDetailsComponent")
  ) {
    return (
      <ApplicantDetailsHortiGroup
        scheme={scheme}
        schemeId={schemeId}
        schemeName={schemeName}
        language={language}
        methods={methods}
        disableAll={disableAll}
      />
    );
  } else if (
    schemeName === "appliedComponentScreenHorti" &&
    (schemeId === "SCHEME031" || schemeId === "SCHEME033")
  ) {
    return (
      <AppliedComponentSchemeHortiKela
        scheme={scheme}
        schemeName={schemeName}
        schemeId={schemeId}
        language={language}
        methods={methods}
        disableAll={disableAll}
        rawErrors={rawErrors}
      />
    );
  } else if (schemeName === "appliedComponentScreenHorti" && ["SCHEME060","SCHEME062"].includes(schemeId)) {
    return (
      <HortiWithSubPartAndSupplier 
        scheme={scheme}
        schemeName={schemeName}
        schemeId={schemeId}
        language={language}
        methods={methods}
        disableAll={disableAll}
        rawErrors={rawErrors}
      />
    );
  } else if (
    schemeName === "appliedComponentScreenHorti" &&
    (schemeId === "SCHEME051" || schemeId === "SCHEME056")
  ) {
    return (
      <AppliedComponentSchemeHortiCluster
        scheme={scheme}
        schemeName={schemeName}
        schemeId={schemeId}
        language={language}
        methods={methods}
        disableAll={disableAll}
        rawErrors={rawErrors}
      />
    );
  } else if (schemeName === "componentsMushroomHut") {
    return (
      <AppliedComponentsRKVY
        scheme={scheme}
        schemeId={schemeId}
        schemeName={schemeName}
        language={language}
        methods={methods}
        disableAll={disableAll}
      />
    );
  } else if (schemeName === "memberDetails" && schemeId === "SCHEME053") {
    return (
      <MemberDetailsIrrigationWell
        scheme={scheme}
        schemeId={schemeId}
        schemeName={schemeName}
        language={language}
        methods={methods}
        disableAll={disableAll}
      />
    );
  } else if (
    (schemeName === "componentsAndLandDescription" && schemeId === "SCHEME014") ||
    (schemeName === "appliedComponentScreenHorti" && schemeId === "SCHEME064")
  )
    return (
      <MakhanaComponentsAndLandDescription
        scheme={scheme}
        schemeName={schemeName}
        schemeId={schemeId}
        language={language}
        methods={methods}
        disableAll={disableAll}
        rawErrors={rawErrors}
      />
    );
  else if (schemeName === "appliedComponentsTea" && schemeId === "SCHEME016")
    return (
      <AppliedComponentsTea
        scheme={scheme}
        schemeName={schemeName}
        schemeId={schemeId}
        language={language}
        methods={methods}
        disableAll={disableAll}
        rawErrors={rawErrors}
      />
    );
  else if (schemeName === "appliedComponentsSabji" && schemeId === "SCHEME026")
    return (
      <AppliedComponentsSabji
        scheme={scheme}
        schemeName={schemeName}
        schemeId={schemeId}
        language={language}
        methods={methods}
        disableAll={disableAll}
        rawErrors={rawErrors}
      />
    );
  else if (schemeName === "appliedComponentsSabji2" && schemeId === "SCHEME026")
    return (
      <AppliedComponentsSabji2
        scheme={scheme}
        schemeName={schemeName}
        schemeId={schemeId}
        language={language}
        methods={methods}
        disableAll={disableAll}
        rawErrors={rawErrors}
      />
    );
  else if (
    ["SCHEME008"].includes(schemeId) &&
    schemeName === "requiredDocuments"
  )
    return (
      <RequiredDocumentsDiesel
        scheme={scheme}
        schemeName={schemeName}
        schemeId={schemeId}
        language={language}
        methods={methods}
        disableAll={disableAll}
        rawErrors={rawErrors}
      />
    );

  switch (scheme.type) {
    case "equipmentDetails":
      return (
        <EquipmentDetails
          scheme={scheme}
          schemeName={schemeName}
          schemeId={schemeId}
          language={language}
          methods={methods}
          disableAll={disableAll}
        />
      );
    case "seedForm":
      return (
        <SeedForm
          scheme={scheme}
          schemeName={schemeName}
          language={language}
          methods={methods}
          disableAll={disableAll}
        />
      );
    case "desiselDetailsScreen":
      return (
        <DieselDetailsScreen
          scheme={scheme}
          schemeName={schemeName}
          schemeId={schemeId}
          language={language}
          methods={methods}
          disableAll={disableAll}
        />
      );
    case "locationDetails":
      if (["SCHEME015"].includes(schemeId))
        return (
          <LandDetailsNIC
            scheme={scheme}
            schemeName={schemeName}
            schemeId={schemeId}
            language={language}
            methods={methods}
            disableAll={disableAll}
          />
        );
      else if (["SCHEME051", "SCHEME056"].includes(schemeId)) {
        return (
          <LandDetailsCluster
            scheme={scheme}
            schemeName={schemeName}
            language={language}
            methods={methods}
            disableAll={disableAll}
            schemeId={schemeId}
          />
        );
      } else if (
        [].includes(schemeId)
      ) {
        return (
          <LandDetailsStatic
            scheme={scheme}
            schemeName={schemeName}
            language={language}
            methods={methods}
            disableAll={disableAll}
            schemeId={schemeId}
          />
        );
      }
      return (
        <LandDetailsCustom
          scheme={scheme}
          schemeName={schemeName}
          language={language}
          methods={methods}
          disableAll={disableAll}
          schemeId={schemeId}
        />
      );
    case "beekeepingAppliedComponetScreen":
      return (
        <BeekeepingAppliedComponentScreen
          scheme={scheme}
          schemeId={schemeId}
          schemeName={schemeName}
          language={language}
          methods={methods}
          disableAll={disableAll}
        />
      );
    case "insecticideDetails":
      return (
        <InsecticideDetails
          scheme={scheme}
          schemeName={schemeName}
          language={language}
          methods={methods}
          disableAll={disableAll}
        />
      );
    case "grantDetailsScreen":
      return (
        <GrantDetails
          scheme={scheme}
          schemeName={schemeName}
          schemeId={schemeId}
          language={language}
          methods={methods}
          disableAll={disableAll}
        />
      );

    case "appliedComponentScreenHorti":
      return (
        <AppliedComponentSchemeHorti
          scheme={scheme}
          schemeName={schemeName}
          schemeId={schemeId}
          language={language}
          methods={methods}
          disableAll={disableAll}
          rawErrors={rawErrors}
        />
      );

    default:
      switch (schemeName) {
        case "componentsMushroomHut":
          return (
            <AppliedComponentsRKVY
              scheme={scheme}
              schemeId={schemeId}
              schemeName={schemeName}
              language={language}
              methods={methods}
              disableAll={disableAll}
            />
          );
        case "appliedComponentsLandDetails":
          return (
            <AppliedComponentsLandDetails
              scheme={scheme}
              schemeId={schemeId}
              schemeName={schemeName}
              language={language}
              methods={methods}
              disableAll={disableAll}
            />
          );
        case "landAndSubsidyDetails2":
          return (
            <LandAndSubsidyDetailsDiesel
              scheme={scheme}
              schemeId={schemeId}
              schemeName={schemeName}
              language={language}
              methods={methods}
              disableAll={disableAll}
            />
          );
        default:
          return <Box>Not Available scheme</Box>;
      }
  }
};

export default CustomMapping;
