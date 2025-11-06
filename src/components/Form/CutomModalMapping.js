import { Box } from "@mui/material";
import MemberDetails from "./CustomMapModalComponents/MemberDetails";
import DBTGroupDetails from "./CustomMapModalComponents/DBTGroupDetails";
import GrantAmountfamily from "./CustomMapModalComponents/GrantAmountfamily";
import { forwardRef } from "react";

const CustomModalMapping = forwardRef(
  (
    {
      scheme,
      schemeName,
      schemeId,
      index,
      language,
      methods,
      disableAll,
      rawErrors,
    },
    ref
  ) => {
    if (
      (schemeId === "SCHEME013" &&
        schemeName === "familyDetails.memberDetails") ||
      (schemeId === "SCHEME008" && schemeName === "familyDetails.memberDetails")
    )
      return (
        <MemberDetails
          scheme={scheme}
          schemeId={schemeId}
          schemeName={schemeName}
          language={language}
          methods={methods}
          disableAll={disableAll}
          index={index}
        />
      );
    else if (
      schemeId === "SCHEME013" &&
      schemeName === "farmerType&LandDetails.groupDetails"
    )
      return (
        <GrantAmountfamily
          scheme={scheme}
          schemeId={schemeId}
          schemeName={schemeName}
          language={language}
          index={index}
          ref={ref}
          methods={methods}
          disable={disableAll}
          rawErrors={rawErrors}
        />
      );
    else if (
      schemeId === "SCHEME054" &&
      schemeName === "memberDetails.groupDetails"
    )
      return (
        <DBTGroupDetails
          scheme={scheme}
          schemeId={schemeId}
          schemeName={schemeName}
          language={language}
          ref={ref}
          methods={methods}
          disableAll={disableAll}
          index={index}
        />
      );

    return <Box>To good to be true</Box>;
  }
);

export default CustomModalMapping;
