import React from "react";
import { Box, Typography } from "@mui/material";
import "../Styles/PrivacyPolicyStyles.css";

const ContentDisplay = ({
  sections,
  sectionRefs,
  selectedSection,
  isMobile,
}) => {
  return (
    <Box width="100%">
      {sections.map(
        (section, index) =>
          selectedSection === section.id && (
            <Box
              id={`section-${index}`}
              key={section.id}
              ref={(el) => (sectionRefs.current[index] = el)}
              sx={{ marginBottom: 4 }}
            >
              <Typography
                variant={isMobile ? "h5" : "h3"}
                fontWeight="600"
                sx={{ marginBottom: 1 }}
              >
                {section.name}
              </Typography>
              <Box>
                {section.content.map((paragraph, i) => (
                  <Box className="pp_contentBox">
                    <Typography
                      variant="h6"
                      sx={{ marginBottom: 1, fontWeight: "600" }}
                    >
                      {paragraph.name}
                    </Typography>
                    {paragraph?.content?.map((p, i) => (
                      <Box>
                        <Typography key={i}>{p}</Typography>
                        <br />
                      </Box>
                    ))}
                    {paragraph.bulletPoints && (
                      <Box>
                        {paragraph.bulletPoints.data.map((bullet, i) => (
                          <Box>
                            {bullet.title && (
                              <Typography
                                variant={isMobile ? "subtitle2" : "h6"}
                                fontWeight="600"
                              >
                                {bullet.title}
                              </Typography>
                            )}
                            <Box display="flex">
                              {paragraph.bulletPoints?.showBullet == true && (
                                <Typography sx={{ mr: "4px" }}>•</Typography>
                              )}
                              <Typography>{bullet.description}</Typography>
                            </Box>
                            <br />
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
          )
      )}
    </Box>
  );
};

export default ContentDisplay;
