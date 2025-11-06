import { Box, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import HelpSectionList from "./HelpSectionList";
import { useTranslation } from "react-i18next";

function HelpDataCard({
  district,
  block,
  panchayat,
  districtCode,
  content,
  dbtRelatedServiceData,
  dao,
  dho,
  ade,
  adc,
  ma,
  oci,
  si,
  sao,
  si1,
  si2,
  si3,
  ac,
  ks,
  bac,
  adpp,
  ethanol,
  fpo,
  fp,
}) {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(
    i18n.language === "en_IN" ? "en" : "hi"
  );
  useEffect(() => {
    setLanguage(i18n.language === "en_IN" ? "en" : "hi");
  }, [i18n.language]);
  return (
    <Box>
      {bac != null && <HelpSectionList officials={bac} />}
      {content != null && <HelpSectionList officials={content} />}
      {dbtRelatedServiceData != null && (
        <HelpSectionList officials={dbtRelatedServiceData} />
      )}
      {dao != null && <HelpSectionList title={"dao"} officials={dao} />}
      {dho != null && <HelpSectionList title={"dho"} officials={dho} />}
      {ade != null && <HelpSectionList title={"ade"} officials={ade} />}
      {adc != null && <HelpSectionList title={"adc"} officials={adc} />}
      {fp != null && <HelpSectionList officials={fp} capacityUnit={true} />}
      {ethanol != null && <HelpSectionList officials={ethanol} />}
      {ma != null && <HelpSectionList officials={ma} />}
      {adpp != null && <HelpSectionList officials={adpp} />}
      {sao != null && <HelpSectionList officials={sao} />}
      {oci != null && <HelpSectionList title={"oci"} officials={oci} />}
      {si != null && <HelpSectionList title={"si"} officials={si} />}
      {si1 != null && <HelpSectionList title={"si1"} officials={si1} />}
      {si2 != null && <HelpSectionList title={"si2"} officials={si2} />}
      {si3 != null && <HelpSectionList title={"si3"} officials={si3} />}
      {ac != null && <HelpSectionList officials={ac} />}
      {ks != null && <HelpSectionList officials={ks} />}
      {fpo != null && <HelpSectionList officials={fpo} />}
    </Box>
  );
}

export default HelpDataCard;
