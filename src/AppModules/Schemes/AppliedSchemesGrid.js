import { useTheme } from '@mui/styles';
import React from 'react'
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { getCurrentLanguage } from '../../components/Utils';
import { Box } from '@mui/material';
import AppliedSchemeCard from '../../components/AppliedSchemeCard';

const AppliedSchemesGrid = ({data, isMobile, schemeData}) => {

    const languagef = getCurrentLanguage();
    const language = languagef === "hi_IN" ? "hi" : "en";
    const navigate = useNavigate();
    const { t } = useTranslation();
    const theme = useTheme();

    function handleClick(row) {
      const correspondingScheme = schemeData[row.mdmsId];
      const schemeId = correspondingScheme.id;
      const active = correspondingScheme.isApplyEnabled;

      let path = "application-details";
      navigate(path, {
        state: {
          mainId: correspondingScheme.mainId,
          schemeId,
          level: correspondingScheme.schemeLevel,
          applicationId: row?.dfsSchemeApplicationId,
          active,
          remark: row.remark,
          applicationDetails: row,
        },
      });
    }

    if (!data || data.length === 0) {
      return (
        <Box
          bgcolor={theme.palette.background.tertiaryGreen}
          className="no-schemes"
        >
          {t("schemes.noSchemes")}
        </Box>
      );
    }

    return (
      <Box className="applied-scheme-grid">
        {data?.map((scheme, index) => (
            <AppliedSchemeCard
              scheme={scheme}
              language={language}
              onClick={handleClick}
              isMobile={isMobile}
              schemeData={schemeData[scheme.mdmsId]}
              key={index}
            />
        ))}
      </Box>
    );
}

export default AppliedSchemesGrid