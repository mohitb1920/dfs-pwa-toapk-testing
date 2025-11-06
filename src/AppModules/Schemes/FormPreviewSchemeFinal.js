import React, { useEffect } from "react";
import { Typography, Paper, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import SchemeTrackComponent from "../../components/SchemeTrackComponent";
import { useTranslation } from "react-i18next";

const FullWidthTable = styled("table")({
  width: "100%",
  tableLayout: "fixed",
});

const FullWidthTableCell = styled("td")({
  width: "auto",
  wordBreak: "break-word",
  borderBottom: "1px solid #e0e0e0",
});

const FullWidthContainer = styled(Box)({
  width: "100%",
  maxWidth: "100%",
  display: "flex",
  flexDirection: "column", // Stack Paper components vertically
  gap: "40px",
});

const FullWidthTableContainer = styled("div")({
  width: "100%",
});

const getWidthClass = (isArray) => {
  return isArray ? "w-full" : "w-full md:w-1/2 xl:w-1/3";
};

const getTranslatedTitle = (key, formTitles, t, i18nLanguage) => {
  const formField = formTitles[key];
  if (formField && formField[i18nLanguage]) {
    return t(formField[i18nLanguage]);
  }

  return `${t("schemes." + key)}`;
  // return key
  //   .replace(/([A-Z])/g, " $1")
  //   .replace(/^./, (str) => str.toUpperCase());
};
const FormPreview = ({
  formData,
  applicationData,
  handleDownload,
  schemeData,
}) => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);
  const { t, i18n } = useTranslation();
  const formTitles = extractFormTitles(schemeData);

  const renderValue = (value) => {
    if (Array.isArray(value)) {
      return renderArrayAsTable(value);
    } else if (typeof value === "object" && value !== null) {
      if (
        ("id" in value && value.id !== undefined && value.id !== null) ||
        ("index" in value &&
          (typeof value.index === "number" || value.index === "0"))
      ) {
        return (
          <Typography
            sx={{
              color: "#1C211E",
              fontSize: "20px",
              fontWeight: 700,
            }}
          >
            {value.value}
          </Typography>
        );
      }
      return renderObject(value);
    } else if (typeof value === "boolean") {
      return (
        <Typography
          sx={{ color: "#1C211E", fontSize: "20px", fontWeight: 700 }}
        >
          {value ? t("schemes.yes") : t("schemes.no")}
        </Typography>
      );
    } else if (value !== null && value !== undefined && value !== "") {
      return (
        <Typography
          sx={{
            color: "#1C211E",
            fontSize: "20px",
            fontWeight: 700,
            wordBreak: "break-all",
          }}
        >
          {String(value)}
        </Typography>
      );
    }
    return null;
  };

  const renderObject = (obj) => {
    const validEntries = Object.entries(obj).filter(
      ([, value]) =>
        value !== null &&
        value !== undefined &&
        value !== "" &&
        typeof value !== "boolean"
    );
    if (validEntries.length === 0) return null; // Don't render empty objects
    if (
      ("id" in obj && obj.id !== undefined && obj.id !== null) ||
      ("index" in obj && (typeof obj.index === "number" || obj.index === "0"))
    ) {
      return (
        <Typography
          sx={{ color: "#1C211E", fontSize: "20px", fontWeight: 700 }}
        >
          {obj.value}
        </Typography>
      );
    }
    return (
      <div className="flex flex-wrap -mx-2">
        {validEntries.map(([key, value]) => {
          const widthClass = getWidthClass(Array.isArray(value));
          const translatedTitle = getTranslatedTitle(
            key,
            formTitles,
            t,
            i18n.language
          );
          return (
            <div key={key} className={`${widthClass} px-2 mb-4`}>
              <div className="h-full">
                <Typography sx={{ color: "#5C6460", fontSize: "20px" }}>
                  {translatedTitle}
                </Typography>
                {renderValue(value)}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderArrayAsTable = (array) => {
    if (array.length === 0) return null;

    const filteredArray = array.map((obj) => {
      const hasFileProperty = Object.values(obj).some(
        (value) => value instanceof File
      );

      if (hasFileProperty) {
        const { name, type } = obj;
        return { name, type };
      }

      return obj;
    });

    let headers = Array.from(
      new Set(
        filteredArray.flatMap((item) =>
          Object.keys(item).filter(
            (key) =>
              item[key] !== null &&
              item[key] !== undefined &&
              item[key] !== "" &&
              key !== "fileStoreId"
          )
        )
      )
    );

    if (headers.length === 0) return null; // Skip if no valid headers

    return (
      <FullWidthTableContainer>
        <FullWidthTable>
          <thead>
            <tr>
              {headers.map((header) => {
                const translatedHeader = getTranslatedTitle(
                  header,
                  formTitles,
                  t,
                  i18n.language
                );
                return (
                  <FullWidthTableCell key={header}>
                    <Typography sx={{ color: "#5C6460", fontSize: "20px" }}>
                      {translatedHeader}
                    </Typography>
                  </FullWidthTableCell>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {filteredArray.map((item, index) => {
              const validRow = headers.some(
                (header) => item[header] !== null && item[header] !== ""
              );
              if (!validRow) return null; // Skip rendering empty rows

              return (
                <tr key={index}>
                  {headers.map((header) => (
                    <FullWidthTableCell key={`${index}-${header}`}>
                      {item[header] !== null &&
                      item[header] !== undefined &&
                      item[header] !== ""
                        ? typeof item[header] === "object"
                          ? renderObject(item[header])
                          : renderValue(item[header])
                        : null}
                    </FullWidthTableCell>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </FullWidthTable>
      </FullWidthTableContainer>
    );
  };

  const renderSection = (title, content) => {
    if (
      content === null ||
      content === undefined ||
      (Array.isArray(content) && content.length === 0)
    ) {
      return null; // Don't render section if content is empty
    }
    const translatedTitle = getTranslatedTitle(
      title,
      formTitles,
      t,
      i18n.language
    );
    return (
      <Paper elevation={1} sx={{ p: 2, width: "100%", borderRadius: "12px" }}>
        {content ? ( // Render section title only if content exists
          <>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ color: "#006633", fontWeight: "500" }}
            >
              {translatedTitle}
            </Typography>
            {Array.isArray(content) ? (
              renderArrayAsTable(content)
            ) : typeof content === "object" && content !== null ? (
              <div className="flex flex-wrap -mx-2">
                {Object.entries(content).map(([key, value]) => {
                  const widthClass = getWidthClass(Array.isArray(value));
                  const titleTranslate = getTranslatedTitle(
                    key,
                    formTitles,
                    t,
                    i18n.language
                  );
                  return (
                    value && (
                      <div key={key} className={`${widthClass} px-2 mb-4`}>
                        <div className="h-full">
                          <Typography
                            sx={{ color: "#5C6460", fontSize: "20px" }}
                          >
                            {titleTranslate}
                          </Typography>
                          {renderValue(value)}
                        </div>
                      </div>
                    )
                  );
                })}
              </div>
            ) : (
              renderValue(content)
            )}
          </>
        ) : null}
      </Paper>
    );
  };
  return (
    <FullWidthContainer>
      <SchemeTrackComponent
        schemeApplicationId={applicationData?.dfsSchemeApplicationId}
        applicationStatus={applicationData?.status}
        applicationNumber={applicationData?.dfsSchemeApplicationId}
        applicationDate={applicationData?.time}
        handleDownloadClick={handleDownload}
        t={t}
      />
      {Object.entries(formData).map(([key, value]) =>
        renderSection(key, value)
      )}
    </FullWidthContainer>
  );
};

export default FormPreview;
const extractFormTitles = (jsonData) => {
  const result = {};

  const processObject = (obj, parentKey = "") => {
    for (const [key, value] of Object.entries(obj)) {
      const currentKey = key;

      if (typeof value === "object" && value !== null) {
        // Handle file type with text
        if (
          value.type === "file" &&
          value.text &&
          typeof value.text === "object"
        ) {
          result[currentKey] = {
            en_IN: value.text.en || "",
            hi_IN: value.text.hi || "",
            type: value.type,
            fileType: value.fileType || [],
          };
        }
        // Handle objects with title-en/title-hi or just title
        else if (
          "title-en" in value ||
          "title-hi" in value ||
          "title" in value
        ) {
          result[currentKey] = {
            en_IN: value["title-en"] || value.title || "",
            hi_IN: value["title-hi"] || value.title || "",
            type: value.type || "",
          };

          // If this object has properties, process them too
          if (value.properties) {
            for (const [propKey, propValue] of Object.entries(
              value.properties
            )) {
              const propCurrentKey = `${propKey}`;

              if (typeof propValue === "object" && propValue !== null) {
                if (propValue.type === "file" && propValue.text) {
                  result[propCurrentKey] = {
                    en_IN: propValue.text.en || "",
                    hi_IN: propValue.text.hi || "",
                    type: propValue.type,
                    fileType: propValue.fileType || [],
                  };
                } else if (
                  "title-en" in propValue ||
                  "title-hi" in propValue ||
                  "title" in propValue
                ) {
                  result[propCurrentKey] = {
                    en_IN: propValue["title-en"] || propValue.title || "",
                    hi_IN: propValue["title-hi"] || propValue.title || "",
                    type: propValue.type || "",
                  };
                }
              }
            }
          }
        }
        // Recursively process arrays
        else if (Array.isArray(value)) {
          value.forEach((item, index) => {
            if (typeof item === "object" && item !== null) {
              processObject(item, `${currentKey}[${index}]`);
            }
          });
        }
        // Recursively process other objects
        else {
          processObject(value, currentKey);
        }
      }
    }
  };

  processObject(jsonData);
  return result;
};
