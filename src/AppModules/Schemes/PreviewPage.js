import React from "react";
import FormComposer from "../../components/Form/FormComposer";
import { Box } from "@mui/material";

function PreviewPage({ data, dataNames, language = "en", schemeId }) {
  return (
    <div>
      {data.map((e, index) => {
        return (
          <Box key={index}>
            <div>{data.e}</div>
            <FormComposer
              scheme={e}
              schemeName={dataNames[index]}
              schemeId={schemeId}
              language={language}
              disableAll={true}
            />
          </Box>
        );
      })}
    </div>
  );
}

export default PreviewPage;
