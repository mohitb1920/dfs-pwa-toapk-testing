import React, { useState, useEffect } from "react";
import { Box, Button } from "@mui/material";
import CustomButton from "./Button/CustomButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const CustomPagination = ({ page, pageCount, onChange, t }) => {
  const getPageNumbers = (currentPage, totalPages) => {
    if (totalPages <= 3 || !totalPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage === 1 || currentPage === 2) {
      return [1, 2, 3];
    }
    if (currentPage === totalPages || currentPage === totalPages - 1) {
      return [totalPages - 2, totalPages - 1, totalPages];
    }
    return [currentPage - 1, currentPage, currentPage + 1];
  };

  const [visiblePages, setVisiblePages] = useState(() =>
    getPageNumbers(page, pageCount)
  );
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    const newVisiblePages = getPageNumbers(page, pageCount);
    if (JSON.stringify(newVisiblePages) !== JSON.stringify(visiblePages)) {
      setTransitioning(true);
      setTimeout(() => {
        setVisiblePages(newVisiblePages);
        setTransitioning(false);
      }, 300);
    }
  }, [page, pageCount]);

  const handlePrevious = () => {
    if (page > 1) {
      onChange(page - 1);
    }
  };

  const handleNext = () => {
    if (page < pageCount) {
      onChange(page + 1);
    }
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="center" gap={"8px"}>
      <Button
        variant="textButtonBlack"
        onClick={handlePrevious}
        disabled={page === 1}
        startIcon={<ArrowBackIcon />}
        // sx={{ color: "#070B0D" }}
      >
        {t("schemes.previous")}
      </Button>
      <Box
        className={`pagination-numbers ${transitioning ? "transitioning" : ""}`}
      >
        {/* {visiblePages.map((pageNum) => (
          <CustomButton
            key={pageNum}
            customClass={`pagination-number-button${
              pageNum === page ? "-active" : ""
            }`}
            onClick={() => onChange(pageNum)}
            variant={pageNum === page ? "contained" : "outlined"}
          >
            {pageNum}
          </CustomButton>
        ))} */}
        {visiblePages.map((pageNum) => (
          <Button
            key={pageNum}
            className={`pagination-number-button${
              pageNum === page ? "-active" : ""
            }`}
            onClick={() => onChange(pageNum)}
            variant={pageNum === page ? "primary" : "secondary"}
          >
            {pageNum}
          </Button>
        ))}
      </Box>
      <Button
        variant="textButtonBlack"
        onClick={handleNext}
        disabled={page === pageCount}
        endIcon={<ArrowForwardIcon />}
      >
        {t("schemes.next")}
      </Button>
    </Box>
  );
};

export default CustomPagination;
