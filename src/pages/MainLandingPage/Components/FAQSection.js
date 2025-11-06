import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Skeleton,
  Container,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import "../Styles/FAQSection.css";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/styles";
import SearchBar from "../../../components/SearchBar";
import CustomPagination from "../../../components/CustomPagination";
import { useContext } from "react";
import { ThemeContext } from "../../../theme";
import { useFileStoreData } from "../../../Hooks/useFileStoreData";
const FAQSection = ({
  t,
  language,
  isHomeScreen,
  variant = "h3",
  isMobile,
}) => {
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();
  const handleExpand = (index) => {
    setExpanded(expanded === index ? false : index);
  };

  const jsonUrl =
    "https://filestoragedfs.blob.core.windows.net/publicresources/json/AssistedMode/faqs.json";

  const { data, isLoading, error, revalidate, isSuccess } = useFileStoreData({
    url: jsonUrl,
    key: "faqs",
  });

  const itemsPerPage = 10;
  const [searchQuery, setSearchQuery] = useState("");
  const [pageCount, setPageCount] = useState(1);
  const [page, setPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);
  const [paginatedData, setPaginatedData] = useState([]);

  useEffect(() => {
    if (isSuccess) filterAndPaginateData();
  }, [searchQuery, isSuccess]);

  useEffect(() => {
    paginateData();
  }, [page]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  useEffect(() => {
    setPageCount(Math.ceil(filteredData.length / itemsPerPage));
    let k = itemsPerPage;
    if (k > filteredData.length) {
      k = filteredData.length;
    }
    setPaginatedData(filteredData.slice(0, k));
  }, [filteredData]);

  const filterAndPaginateData = () => {
    let filtered = data?.["faqs"]?.filter(
      (contact) =>
        contact.en.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.hi.question.includes(searchQuery.toLowerCase()) ||
        contact.en.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.hi.answer.includes(searchQuery.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const paginateData = () => {
    let k = itemsPerPage;
    if (k > filteredData.length) {
      k = filteredData.length;
    }
    const paginatedDataTemp = filteredData.slice(
      (page - 1) * itemsPerPage,
      (page - 1) * itemsPerPage + k
    );
    setPaginatedData(paginatedDataTemp);
  };

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };
  const { ourTheme } = useContext(ThemeContext);
  useEffect(() => {
    document.body.classList.toggle("light-theme", ourTheme === "light");
    document.body.classList.toggle("dark-theme", ourTheme === "dark");
  }, [ourTheme]);
  let component = (
    <Container sx={{ margin: "auto", mt: 0, mb: 8, px: 1 }}>
      {/* Header */}
      <Box className="faq-header">
        <Box className="faq-header-left">
          <Box className="faq-icon">
            <HelpOutlineIcon
              className="font-bold"
              color="inherit"
              sx={{ fontSize: isMobile ? "1.5rem" : "2.2rem" }}
            />
          </Box>
          <Typography variant={isMobile ? "h6" : variant} className="faq-title">
            {t("Frequently_Asked_Questions")}
          </Typography>
        </Box>

        {!isMobile && isHomeScreen && (
          <Box className="faqs-view-all-container">
            <Button
              variant="secondary"
              onClick={() => navigate(`${window.contextPath}/faq`)}
            >
              {t("View_all_daq")}
            </Button>
          </Box>
        )}
        {!isHomeScreen && (
          <Box
            className="search-bar-container flex justify-start sm:justify-center"
            sx={{
              width: { xs: "100%", sm: "auto", md: "30%" },
              mt: { xs: 2, md: 0 },
            }}
          >
            <SearchBar
              setSearchQuery={setSearchQuery}
              placeholder="SearchQuestion"
            />
          </Box>
        )}
      </Box>
      {isLoading &&
        [1, 2, 3, 4].map((index) => (
          <Box key={index} mb={2}>
            <Skeleton variant="rectangular" height={50} width="100%" />
            <Skeleton variant="text" width="100%" height={30} />
            <Divider />
          </Box>
        ))}

      {/* FAQ List */}
      {!isLoading &&
        (isHomeScreen ? paginatedData.slice(0, 4) : paginatedData)?.map(
          (faq, index) => (
            <Box key={index} mb={2}>
              <Accordion
                expanded={expanded === index}
                onChange={() => handleExpand(index)}
                className="custom-accordion-faq"
              >
                <AccordionSummary
                  expandIcon={
                    expanded === index ? (
                      <RemoveIcon
                        // backgroundColor={theme.palette.text.textGrey}

                        sx={{
                          backgroundColor: `${theme.palette.text.greyGreen}`,
                          color: "black",
                          margin: "12px 0px",
                          borderRadius: "7px",
                        }}
                      />
                    ) : (
                      <AddIcon
                        sx={{
                          margin: "12px 0px",
                          backgroundColor: `${theme.palette.text.greyGreen}`,
                          color: "black",
                          borderRadius: "7px",
                        }}
                      />
                    )
                  }
                  aria-controls={`panel${index}-content`}
                  id={`panel${index}-header`}
                  className="faq-accordion-summary"
                >
                  <Box className="faq-icon-question">
                    <Box className="QuestionAnsBox QuestionBox">{t("Q")}</Box>
                    {/* {language === "en" ? (
                      <DynamicSvgIcon
                        image={"QuestionEnglish"}
                        className="svgIcon"
                      />
                    ) : (
                      <DynamicSvgIcon
                        image={"QuestionHindi"}
                        className="svgIcon"
                      />
                    )} */}
                  </Box>
                  <Typography
                    className={`faq-question bold 
    ${expanded === index ? undefined : "ellipsis-text"}`}
                  >
                    {faq[language].question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails className="!px-0 sm:!px-4">
                  <Box className="faq-answer">
                    <Box className="faq-answer-icon">
                      <Box className="QuestionAnsBox AnswerBox">{t("A")}</Box>
                      {/* {language === "en" ? (
                        <DynamicSvgIcon
                          image={"AnswerEnglish"}
                          className="svgIcon"
                        />
                      ) : (
                        <DynamicSvgIcon
                          image={"AnswerHindi"}
                          className="svgIcon"
                        />
                      )} */}
                    </Box>
                    <Box>
                      <Typography variant="body2" ml={1} alignContent="center">
                        {faq[language].answer}
                      </Typography>
                    </Box>
                  </Box>
                </AccordionDetails>
              </Accordion>

              <Divider />
            </Box>
          )
        )}
      {isMobile && isHomeScreen && (
        <Box className="w-full flex justify-center">
          <Button
            variant="secondary"
            onClick={() => navigate(`${window.contextPath}/faq`)}
          >
            {t("View_all_daq")}
          </Button>
        </Box>
      )}
      {!isHomeScreen && (
        <Box className="pagination-container">
          <Typography>
            {t("schemes.paginationTitle", { count: itemsPerPage })}
          </Typography>
          <CustomPagination
            t={t}
            pageCount={pageCount}
            page={page}
            onChange={handleChangePage}
          />
        </Box>
      )}
    </Container>
  );

  if (isHomeScreen) {
    component = (
      <Box
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box className="faq-section inner-box-screen" id="DFSWEB_FAQs">
          {component}
        </Box>
      </Box>
    );
  }
  component = <Container variant="primary">{component}</Container>;
  return component;
};

export default FAQSection;
